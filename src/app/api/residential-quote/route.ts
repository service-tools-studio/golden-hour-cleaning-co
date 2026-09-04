import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isSubmitTimingValid,
} from "@/lib/commercial-quote-guard";
import {
  buildCleaningLeadEmailBody,
  buildCleaningLeadEmailSubject,
  validateCleaningLeadForm,
  type CleaningLeadMode,
  type CleaningLeadPayload,
} from "@/lib/cleaningLead";
import {
  createGmailTransporter,
  formatSmtpError,
  getGmailCredentials,
} from "@/lib/gmail-smtp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function modeFromLeadPath(
  leadPath: CleaningLeadPayload["leadPath"] | undefined,
): CleaningLeadMode {
  return leadPath === "Book Online" ? "booking" : "quote";
}

export async function POST(request: Request) {
  const creds = getGmailCredentials();

  if (!creds) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let data: CleaningLeadPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isSubmitTimingValid(data.formLoadedAt)) {
    return NextResponse.json({ ok: true });
  }

  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp).allowed) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait a while and try again, or call us at (503) 893-4795.",
      },
      { status: 429 },
    );
  }

  const leadPath =
    data.leadPath === "Book Online" ? "Book Online" : "Personalized Quote";
  const mode = modeFromLeadPath(leadPath);

  const normalized: CleaningLeadPayload = {
    firstName: data.firstName?.trim() ?? "",
    lastName: data.lastName?.trim() ?? "",
    mobilePhone: data.mobilePhone?.trim() ?? "",
    email: data.email?.trim() ?? "",
    address: data.address?.trim() ?? "",
    contactPreference: data.contactPreference?.trim() ?? "",
    cleaningType: data.cleaningType?.trim() ?? "",
    homeSize: data.homeSize,
    bedrooms: data.bedrooms?.trim() ?? "",
    bathrooms: data.bathrooms?.trim() ?? "",
    condition: data.condition?.trim() ?? "",
    timing: data.timing?.trim() ?? "",
    specificDate: data.specificDate?.trim() ?? "",
    notes: data.notes?.trim() ?? "",
    leadPath,
    attribution: data.attribution,
  };

  const errors = validateCleaningLeadForm(normalized, mode);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  try {
    const transporter = createGmailTransporter();
    await transporter.verify();

    await transporter.sendMail({
      from: `"Golden Hour Website" <${creds.user}>`,
      to: creds.to,
      replyTo: normalized.email,
      subject: buildCleaningLeadEmailSubject(normalized),
      text: buildCleaningLeadEmailBody(normalized),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Failed to send residential quote email:",
      formatSmtpError(error),
    );
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 },
    );
  }
}
