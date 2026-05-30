import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type CommercialQuotePayload = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  spaceType: string;
  sqftRange: string;
  frequency: string;
  startTiming: string;
  notes?: string;
  referral?: string;
  website?: string;
};

function buildEmailBody(data: CommercialQuotePayload) {
  return [
    "Commercial Quote Request",
    "",
    `Business: ${data.businessName}`,
    `Contact: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Address: ${data.address}`,
    "",
    `Space type: ${data.spaceType}`,
    `Approx. size: ${data.sqftRange} sq ft`,
    `Frequency: ${data.frequency}`,
    `Start timing: ${data.startTiming}`,
    "",
    `Referral: ${data.referral?.trim() || "(not provided)"}`,
    "",
    "Notes:",
    data.notes?.trim() || "(none)",
  ].join("\n");
}

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const recipient =
    process.env.COMMERCIAL_QUOTE_TO ?? "golden.hour.cleaning.company@gmail.com";

  if (!gmailUser || !gmailAppPassword) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let data: CommercialQuotePayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const businessName = data.businessName?.trim();
  const contactName = data.contactName?.trim();
  const email = data.email?.trim();
  const phone = data.phone?.trim();
  const address = data.address?.trim();

  if (!businessName || !contactName || !email || !phone || !address) {
    return NextResponse.json(
      {
        error:
          "Business name, contact name, email, phone, and address are required.",
      },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Golden Hour Website" <${gmailUser}>`,
      to: recipient,
      replyTo: email,
      subject: `Commercial Quote — ${businessName}`,
      text: buildEmailBody({
        ...data,
        businessName,
        contactName,
        email,
        phone,
        address,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send commercial quote email:", error);
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 500 }
    );
  }
}
