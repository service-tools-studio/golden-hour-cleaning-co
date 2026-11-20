/**
 * High-confidence cold-outreach phrases — SEO, web/AI, audits, B2B prospecting, etc.
 * False positive on real customer mail is worse than a missed pitch; keep patterns specific.
 */
const SOLICITOR_PITCH_PATTERNS: RegExp[] = [
  // SEO / links
  /\bguest\s+posts?\b/i,
  /\bbacklinks?\b/i,
  /\blink\s+building\b/i,
  /\bseo\s+services?\b/i,
  /\bimprove\s+your\s+(google\s+)?rank/i,
  /\bfirst\s+page\s+of\s+google\b/i,
  /\bgoogle\s+ranking\b/i,
  /\bincrease\s+(your\s+)?(website\s+)?traffic\b/i,
  /\bdigital\s+marketing\s+agency\b/i,
  /\bweb\s+design\s+(agency|company|services)\b/i,
  /\bfree\s+seo\s+audit\b/i,
  /\blink\s+insertion\b/i,
  /\bdomain\s+authority\b/i,
  /\bpage\s+authority\b/i,
  /\bwe\s+can\s+help\s+you\s+rank\b/i,
  /\boutsourced?\s+(seo|marketing)\b/i,
  /\bpay(ing)?\s+per\s+click\b/i,
  /\bshort\s+audit\s+of\s+your\s+ads\b/i,
  /\baudit\s+of\s+your\s+(website|ads|business\s+email)\b/i,
  /\bwritten\s+audit\b/i,

  // Web dev / AI outreach (common local-business templates)
  /\b(ai|artificial intelligence)\s+chat\b/i,
  /\bchat\s+assistant\b/i,
  /\bfast\s+websites?\s+for\s+local\s+businesses\b/i,
  /\bbuild\s+fast\s+websites?\b/i,
  /\bno\s+live\s+chat\b/i,
  /\b24\/7\s+ai\s+response\b/i,
  /\bai\s+response\s+system\b/i,
  /\bspeed\s+to\s+lead\b/i,
  /\bunder\s+60\s+seconds\b/i,
  /\bmissed\s+calls?\s+and\s+website\s+inquiries\b/i,

  // B2B / consulting prospecting
  /\bprospect\s+research\b/i,
  /\bb2b\s+outreach\b/i,
  /\bsoftware\s+consulting\b/i,
  /\bstrengthen\s+your\s+online\s+presence\b/i,
  /\blead[- ]generat/i,
  /\bwebsite\s+review\b/i,
  /\bcustomer\s+journey\b/i,
  /\bcommercial[- ]growth\b/i,

  // Security / paid audit pitches
  /\bsecurity\s+audit\b/i,
  /\bflat\s+\$\d+/i,
  /\bcybershield\b/i,

  // Typical CTAs / opt-out lines from blast tools
  /\bno\s+commitment\s+needed\b/i,
  /\bquick\s+10[- ]minute\s+call\b/i,
  /\bwould\s+a\s+15[- ]minute\s+conversation\b/i,
  /\bworth\s+15\s+minutes\b/i,
  /\breply\s+["']yes["']\s+and\s+i'?ll\s+send\b/i,
  /\breply\s+["']no["']\s+and\s+i'?ll\s+leave\s+you\s+alone\b/i,

  // Niche templates seen in the wild
  /\bwalkthrough\s+brief\b/i,
];

export function textLooksLikeSolicitorPitch(text: string): boolean {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return false;
  return SOLICITOR_PITCH_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** Scans visible user fields only — not reply-to email (avoid odd domain false positives). */
export function contactSubmissionLooksLikePitch(parts: {
  name: string;
  message: string;
}): boolean {
  return textLooksLikeSolicitorPitch(`${parts.name}\n${parts.message}`);
}