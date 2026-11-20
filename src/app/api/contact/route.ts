import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isSubmitTimingValid,
} from "@/lib/commercial-quote-guard";
import {
  CONTACT_TOPICS,
  isContactTopic,
  type ContactTopic,
} from "@/lib/contactPage";
import { HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/formHoneypot";
import { buildContactEmailHtml } from "@/lib/contactEmailHtml";
import {
  createGmailTransporter,
  formatSmtpError,
  getGmailCredentials,
} from "@/lib/gmail-smtp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  formLoadedAt?: number;
  [key: string]: unknown;
};

function topicLabel(topic: ContactTopic): string {
  return CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;
}

function buildEmailBody(data: {
  name: string;
  email: string;
  phone: string;
  topic: ContactTopic;
  message: string;
}) {
  return [
    "Website contact form",
    "",
    `Topic: ${topicLabel(data.topic)}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "(not provided)"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (isHoneypotTripped(data[HONEYPOT_FIELD])) {
    return NextResponse.json({ ok: true });
  }

  const creds = getGmailCredentials();

  if (!creds) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  if (!isSubmitTimingValid(data.formLoadedAt)) {
    return NextResponse.json({ ok: true });
  }

  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp).allowed) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait a while and try again, or call us.",
      },
      { status: 429 },
    );
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const message = data.message?.trim() ?? "";
  const topic: ContactTopic = isContactTopic(data.topic) ? data.topic : "general";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const transporter = createGmailTransporter();
    await transporter.verify();

    const topicName = topicLabel(topic);
    await transporter.sendMail({
      from: `"Golden Hour Website" <${creds.user}>`,
      to: creds.to,
      replyTo: email,
      subject: `Contact — ${topicName} — ${name}`,
      text: buildEmailBody({ name, email, phone, topic, message }),
      html: buildContactEmailHtml({
        topicLabel: topicName,
        name,
        email,
        phone,
        message,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact email:", formatSmtpError(error));
    return NextResponse.json(
      { error: "Failed to send your message. Please try again." },
      { status: 500 },
    );
  }
}