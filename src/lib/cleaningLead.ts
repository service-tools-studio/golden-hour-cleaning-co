/**
 * Shared cleaning lead form constants, types, and validation.
 * Used by CleaningLeadForm (client) and /api/residential-quote (server).
 */

export const CLEANING_TYPES = [
  "Deep Cleaning",
  "Move-in/out Cleaning",
  "Recurring Cleaning",
  "Post-Construction Cleaning",
  "Other / Not sure",
] as const;

export const BEDROOM_OPTIONS = [
  "Studio",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6+",
] as const;

export const BATHROOM_OPTIONS = [
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "4.5",
  "5+",
] as const;

export const CONDITION_OPTIONS = [
  "Light — regularly maintained, mostly needs detailing",
  "Moderate — some noticeable buildup or areas needing extra attention",
  "Heavy — significant buildup or hasn't been thoroughly cleaned recently",
  "Not sure",
] as const;

export const TIMING_OPTIONS = [
  "As soon as possible",
  "Within the next week",
  "Within the next 2 weeks",
  "I'm flexible",
  "Specific date",
] as const;

export const CONTACT_OPTIONS = ["Text", "Phone call", "Email"] as const;

export type CleaningLeadMode = "quote" | "booking";

export type CleaningLeadFormState = {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  address: string;
  contactPreference: string;
  cleaningType: string;
  homeSize: string;
  bedrooms: string;
  bathrooms: string;
  condition: string;
  timing: string;
  specificDate: string;
  notes: string;
};

export const EMPTY_CLEANING_LEAD_FORM: CleaningLeadFormState = {
  firstName: "",
  lastName: "",
  mobilePhone: "",
  email: "",
  address: "",
  contactPreference: "",
  cleaningType: "",
  homeSize: "",
  bedrooms: "",
  bathrooms: "",
  condition: "",
  timing: "",
  specificDate: "",
  notes: "",
};

export function fullNameFromLead(
  data: Pick<CleaningLeadFormState, "firstName" | "lastName">,
): string {
  return [data.firstName, data.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export type CleaningLeadAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_path?: string;
};

export type CleaningLeadPayload = CleaningLeadFormState & {
  leadPath: "Personalized Quote" | "Book Online";
  formLoadedAt?: number;
  attribution?: CleaningLeadAttribution;
};

export type FieldErrors = Partial<Record<keyof CleaningLeadFormState, string>>;

const SET = {
  contact: new Set<string>(CONTACT_OPTIONS),
  cleaning: new Set<string>(CLEANING_TYPES),
  bedrooms: new Set<string>(BEDROOM_OPTIONS),
  bathrooms: new Set<string>(BATHROOM_OPTIONS),
  condition: new Set<string>(CONDITION_OPTIONS),
  timing: new Set<string>(TIMING_OPTIONS),
};

function parseHomeSize(raw: string): number {
  return Number(String(raw ?? "").trim().replace(/,/g, ""));
}

export function validateCleaningLeadForm(
  form: CleaningLeadFormState,
  mode: CleaningLeadMode,
): FieldErrors {
  const errors: FieldErrors = {};
  const homeSize = parseHomeSize(form.homeSize);

  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!form.mobilePhone.trim()) errors.mobilePhone = "Enter your mobile phone.";
  if (!form.email.trim()) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (mode === "quote") {
    if (!form.contactPreference || !SET.contact.has(form.contactPreference)) {
      errors.contactPreference = "Choose how you'd like us to contact you.";
    }
  }

  if (mode === "booking") {
    if (!form.address.trim()) errors.address = "Enter the service address.";
  }

  if (!form.cleaningType || !SET.cleaning.has(form.cleaningType)) {
    errors.cleaningType = "Select a cleaning type.";
  }
  if (!Number.isFinite(homeSize) || homeSize <= 0) {
    errors.homeSize = "Enter an approximate home size.";
  }
  if (!form.bedrooms || !SET.bedrooms.has(form.bedrooms)) {
    errors.bedrooms = "Select bedrooms.";
  }
  if (!form.bathrooms || !SET.bathrooms.has(form.bathrooms)) {
    errors.bathrooms = "Select bathrooms.";
  }
  if (!form.condition || !SET.condition.has(form.condition)) {
    errors.condition = "Select the current condition.";
  }

  if (mode === "quote") {
    if (!form.timing || !SET.timing.has(form.timing)) {
      errors.timing = "Select a timeframe.";
    } else if (form.timing === "Specific date" && !form.specificDate.trim()) {
      errors.specificDate = "Enter the date you're hoping for.";
    }
  }

  return errors;
}

export function firstErrorField(
  errors: FieldErrors,
  mode: CleaningLeadMode,
): keyof CleaningLeadFormState | null {
  const order: (keyof CleaningLeadFormState)[] =
    mode === "quote"
      ? [
          "firstName",
          "lastName",
          "mobilePhone",
          "email",
          "contactPreference",
          "cleaningType",
          "homeSize",
          "bedrooms",
          "bathrooms",
          "condition",
          "timing",
          "specificDate",
          "notes",
        ]
      : [
          "firstName",
          "lastName",
          "mobilePhone",
          "email",
          "address",
          "cleaningType",
          "homeSize",
          "bedrooms",
          "bathrooms",
          "condition",
        ];

  for (const key of order) {
    if (errors[key]) return key;
  }
  return null;
}

/** Step-through flow used on /book-online. */
export const BOOKING_FORM_STEPS = [
  {
    id: "name",
    title: "Your name",
    fields: ["firstName", "lastName"],
  },
  {
    id: "contact",
    title: "Contact details",
    fields: ["mobilePhone", "email"],
  },
  {
    id: "address",
    title: "Service address",
    fields: ["address"],
  },
  {
    id: "service",
    title: "Cleaning type",
    fields: ["cleaningType"],
  },
  {
    id: "home",
    title: "About your home",
    fields: ["homeSize", "bedrooms", "bathrooms"],
  },
  {
    id: "condition",
    title: "Home condition",
    fields: ["condition"],
  },
] as const;

/** Step-through flow used on /request-a-quote. */
export const QUOTE_FORM_STEPS = [
  {
    id: "name",
    title: "Your name",
    fields: ["firstName", "lastName"],
  },
  {
    id: "contact",
    title: "Contact details",
    fields: ["mobilePhone", "email"],
  },
  {
    id: "preference",
    title: "Contact preference",
    fields: ["contactPreference"],
  },
  {
    id: "service",
    title: "Cleaning type",
    fields: ["cleaningType"],
  },
  {
    id: "home",
    title: "About your home",
    fields: ["homeSize", "bedrooms", "bathrooms"],
  },
  {
    id: "condition",
    title: "Home condition",
    fields: ["condition"],
  },
  {
    id: "timing",
    title: "Preferred timing",
    fields: ["timing", "specificDate"],
  },
  {
    id: "notes",
    title: "Anything else?",
    fields: ["notes"],
  },
] as const;

export function getLeadFormSteps(mode: CleaningLeadMode) {
  return mode === "quote" ? QUOTE_FORM_STEPS : BOOKING_FORM_STEPS;
}

export function validateCleaningLeadStep(
  form: CleaningLeadFormState,
  mode: CleaningLeadMode,
  stepIndex: number,
): FieldErrors {
  const steps = getLeadFormSteps(mode);
  const step = steps[stepIndex];
  if (!step) return {};
  const all = validateCleaningLeadForm(form, mode);
  const errors: FieldErrors = {};
  for (const key of step.fields) {
    if (all[key as keyof CleaningLeadFormState]) {
      errors[key as keyof CleaningLeadFormState] =
        all[key as keyof CleaningLeadFormState];
    }
  }
  return errors;
}

export function firstStepErrorField(
  errors: FieldErrors,
  mode: CleaningLeadMode,
  stepIndex: number,
): keyof CleaningLeadFormState | null {
  const steps = getLeadFormSteps(mode);
  const step = steps[stepIndex];
  if (!step) return null;
  for (const key of step.fields) {
    const field = key as keyof CleaningLeadFormState;
    if (errors[field]) return field;
  }
  return null;
}

/** @deprecated Prefer validateCleaningLeadStep */
export function validateCleaningLeadBookingStep(
  form: CleaningLeadFormState,
  stepIndex: number,
): FieldErrors {
  return validateCleaningLeadStep(form, "booking", stepIndex);
}

/** @deprecated Prefer firstStepErrorField */
export function firstBookingStepErrorField(
  errors: FieldErrors,
  stepIndex: number,
): keyof CleaningLeadFormState | null {
  return firstStepErrorField(errors, "booking", stepIndex);
}

export function fieldDomId(key: keyof CleaningLeadFormState): string {
  return `cl-${key}`;
}

export function formatHomeSizeLabel(raw: string | number): string {
  const n = typeof raw === "number" ? raw : parseHomeSize(String(raw));
  if (!Number.isFinite(n) || n <= 0) return String(raw ?? "");
  return Math.round(n).toLocaleString("en-US");
}

export function buildCleaningLeadEmailSubject(
  data: Pick<
    CleaningLeadPayload,
    "leadPath" | "firstName" | "lastName" | "cleaningType" | "homeSize"
  >,
): string {
  const size = formatHomeSizeLabel(data.homeSize);
  const name = fullNameFromLead(data) || data.firstName;
  if (data.leadPath === "Book Online") {
    return `New Online Booking Lead — ${name} — ${data.cleaningType} — ${size} sq ft`;
  }
  return `New Personalized Estimate — ${name} — ${data.cleaningType} — ${size} sq ft`;
}

function attributionLines(attrs?: CleaningLeadAttribution): string[] {
  if (!attrs) return [];
  const rows: [string, string | undefined][] = [
    ["Lead path", undefined], // filled by caller
    ["Source", attrs.utm_source],
    ["Medium", attrs.utm_medium],
    ["Campaign", attrs.utm_campaign],
    ["Term", attrs.utm_term],
    ["Content", attrs.utm_content],
    ["Landing page", attrs.landing_path],
    ["GCLID", attrs.gclid],
    ["GBRAID", attrs.gbraid],
    ["WBRAID", attrs.wbraid],
  ];
  return rows
    .filter(([, value]) => Boolean(value?.trim()))
    .map(([label, value]) => `${label}: ${value!.trim()}`);
}

export function buildCleaningLeadEmailBody(data: CleaningLeadPayload): string {
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

  const lines = [
    header,
    "",
    "CONTACT",
    `Name: ${fullNameFromLead(data)}`,
    `Phone: ${data.mobilePhone}`,
    `Email: ${data.email}`,
  ];

  if (isQuote && data.contactPreference) {
    lines.push(`Preferred contact: ${data.contactPreference}`);
  }

  if (!isQuote && data.address?.trim()) {
    lines.push(`Address: ${data.address.trim()}`);
  }

  lines.push(
    "",
    "CLEANING DETAILS",
    `Service: ${data.cleaningType}`,
    `Home size: ${formatHomeSizeLabel(data.homeSize)} sq ft`,
    `Bedrooms: ${data.bedrooms}`,
    `Bathrooms: ${data.bathrooms}`,
    `Condition: ${data.condition}`,
  );

  if (isQuote && timingLine) {
    lines.push(timingLine);
  }

  if (isQuote) {
    lines.push("", "CUSTOMER NOTES", data.notes?.trim() || "(none)");
  }

  const attrBody = attributionLines(data.attribution);
  lines.push("", "ATTRIBUTION", `Lead path: ${data.leadPath}`);
  if (attrBody.length) {
    lines.push(...attrBody);
  }

  return lines.join("\n");
}
