import nodemailer from "nodemailer";
import type Transporter from "nodemailer/lib/mailer";

export function getGmailCredentials() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const to =
    process.env.COMMERCIAL_QUOTE_TO?.trim() ??
    "golden.hour.cleaning.company@gmail.com";

  if (!user || !pass) {
    return null;
  }

  return { user, pass, to };
}

export function createGmailTransporter(): Transporter {
  const creds = getGmailCredentials();
  if (!creds) {
    throw new Error("Gmail credentials are not configured.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: creds.user,
      pass: creds.pass,
    },
  });
}

export function formatSmtpError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
