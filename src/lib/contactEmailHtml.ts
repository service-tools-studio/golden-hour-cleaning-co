import type { ContactTopic } from "@/lib/contactPage";
import { formatPhoneForEmailHtml } from "@/lib/leadEmailHtml";

const LINK_STYLE =
  "color:#b45309;text-decoration:underline;text-underline-offset:2px;";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

function paragraph(label: string, valueHtml: string): string {
  return `<p style="margin:0 0 10px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.45;color:#1c1917;"><strong>${escapeHtml(label)}:</strong> ${valueHtml}</p>`;
}

export function buildContactEmailHtml(data: {
  topicLabel: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const phoneHtml = data.phone.trim()
    ? formatPhoneForEmailHtml(data.phone)
    : "(not provided)";
  const emailHtml = `<a href="mailto:${escapeAttr(data.email.trim())}" style="${LINK_STYLE}">${escapeHtml(data.email.trim())}</a>`;

  return [
    `<div style="max-width:560px;padding:8px 0;">`,
    `<p style="margin:0 0 16px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;font-weight:700;color:#1c1917;">Website contact form</p>`,
    paragraph("Topic", escapeHtml(data.topicLabel)),
    paragraph("Name", escapeHtml(data.name)),
    paragraph("Email", emailHtml),
    paragraph("Phone", phoneHtml),
  `<p style="margin:16px 0 6px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;font-weight:700;color:#44403c;">Message</p>`,
    `<p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;color:#1c1917;white-space:pre-wrap;">${escapeHtml(data.message)}</p>`,
    `</div>`,
  ].join("\n");
}