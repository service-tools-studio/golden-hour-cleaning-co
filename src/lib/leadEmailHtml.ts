import type { CleaningLeadPayload } from "@/lib/cleaningLead";
import {
  buildCleaningLeadAttributionLines,
  formatHomeSizeLabel,
  fullNameFromLead,
} from "@/lib/cleaningLead";
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

function parseUsPhoneTelHref(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1)
      : digits.length === 10
        ? digits
        : null;
  if (!national) return null;
  return `tel:+1${national}`;
}

export function googleMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}

export function appleMapsSearchUrl(address: string): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(address.trim())}`;
}

export function formatPhoneForEmailHtml(phone: string): string {
  const display = escapeHtml(phone.trim());
  const tel = parseUsPhoneTelHref(phone);
  if (!tel) {
    return display;
  }
  return `<a href="${escapeAttr(tel)}" style="${LINK_STYLE}">${display}</a>`;
}

/** Plain address line (not linked) so Mail/Safari data detectors offer Copy / Open in Maps on long-press. */
const ADDRESS_PLAIN_STYLE = [
  "display:block",
  "margin:4px 0 10px",
  "font-family:system-ui,-apple-system,sans-serif",
  "font-size:16px",
  "line-height:1.5",
  "color:#1c1917",
].join(";");

export function formatAddressForEmailHtml(address: string): string {
  const trimmed = address.trim();
  const display = escapeHtml(trimmed);
  const google = googleMapsSearchUrl(trimmed);
  const apple = appleMapsSearchUrl(trimmed);
  return [
    `<span style="${ADDRESS_PLAIN_STYLE}">${display}</span>`,
    `<a href="${escapeAttr(google)}" style="${LINK_STYLE}">Open in Google Maps</a>`,
    ' <span style="color:#78716c;">·</span> ',
    `<a href="${escapeAttr(apple)}" style="${LINK_STYLE}">Apple Maps</a>`,
  ].join("");
}

function paragraph(label: string, valueHtml: string): string {
  return `<p style="margin:0 0 10px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.45;color:#1c1917;"><strong>${escapeHtml(label)}:</strong> ${valueHtml}</p>`;
}

function sectionTitle(title: string): string {
  return `<p style="margin:20px 0 8px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.06em;color:#44403c;">${escapeHtml(title)}</p>`;
}

function mainTitle(title: string): string {
  return `<p style="margin:0 0 16px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;font-weight:700;color:#1c1917;">${escapeHtml(title)}</p>`;
}

/** HTML companion to `buildCleaningLeadEmailBody` — clickable phone, email, address, Calendly. */
export function buildCleaningLeadEmailHtml(
  data: CleaningLeadPayload,
  options?: { calendlyUrl?: string },
): string {
  const isQuote = data.leadPath === "Personalized Quote";
  const header =
    data.leadPath === "Book Online"
      ? "NEW ONLINE BOOKING LEAD"
      : "NEW PERSONALIZED ESTIMATE REQUEST";

  const timingLine =
    data.timing === "Specific date"
      ? `Desired timeframe: Specific date — ${data.specificDate?.trim() || "(not provided)"}`
      : data.timing
        ? `Desired timeframe: ${data.timing}`
        : null;

  const blocks: string[] = [
    `<div style="max-width:560px;padding:8px 0;">`,
    mainTitle(header),
    sectionTitle("CONTACT"),
    paragraph("Name", escapeHtml(fullNameFromLead(data))),
    paragraph("Phone", formatPhoneForEmailHtml(data.mobilePhone)),
    paragraph(
      "Email",
      `<a href="mailto:${escapeAttr(data.email.trim())}" style="${LINK_STYLE}">${escapeHtml(data.email.trim())}</a>`,
    ),
  ];

  if (isQuote && data.contactPreference) {
    blocks.push(
      paragraph("Preferred contact", escapeHtml(data.contactPreference)),
    );
  }

  if (data.address?.trim()) {
    blocks.push(
      paragraph("Address", formatAddressForEmailHtml(data.address)),
    );
  }

  blocks.push(
    sectionTitle("CLEANING DETAILS"),
    paragraph("Service", escapeHtml(data.cleaningType)),
    paragraph(
      "Home size",
      `${escapeHtml(formatHomeSizeLabel(data.homeSize))} sq ft`,
    ),
    paragraph("Bedrooms", escapeHtml(data.bedrooms)),
    paragraph("Bathrooms", escapeHtml(data.bathrooms)),
    paragraph("Condition", escapeHtml(data.condition)),
  );

  if (isQuote && timingLine) {
    blocks.push(paragraph("Timing", escapeHtml(timingLine)));
  }

  if (isQuote) {
    blocks.push(sectionTitle("CUSTOMER NOTES"));
    blocks.push(
      `<p style="margin:0 0 10px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;color:#1c1917;white-space:pre-wrap;">${escapeHtml(data.notes?.trim() || "(none)")}</p>`,
    );
  }

  if (options?.calendlyUrl) {
    blocks.push(sectionTitle("SCHEDULING"));
    blocks.push(
      paragraph(
        "Calendly link",
        `<a href="${escapeAttr(options.calendlyUrl)}" style="${LINK_STYLE}">Open scheduling link</a>`,
      ),
    );
  }

  blocks.push(sectionTitle("ATTRIBUTION"));
  blocks.push(paragraph("Lead path", escapeHtml(data.leadPath)));

  const attrBody = buildCleaningLeadAttributionLines(data.attribution);
  for (const line of attrBody) {
    const colon = line.indexOf(": ");
    if (colon === -1) {
      blocks.push(
        `<p style="margin:0 0 6px;font-family:system-ui,sans-serif;font-size:13px;color:#57534e;">${escapeHtml(line)}</p>`,
      );
    } else {
      const label = line.slice(0, colon);
      const value = line.slice(colon + 2);
      blocks.push(paragraph(label, escapeHtml(value)));
    }
  }

  blocks.push("</div>");
  return blocks.join("\n");
}
