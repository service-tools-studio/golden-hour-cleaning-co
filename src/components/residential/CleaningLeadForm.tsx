"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertTriangle } from "lucide-react";
import { formatPhoneInput } from "@/helpers/contactHelpers.js";
import { buildBookingCalendlyUrl } from "@/helpers/bookingCalendlyUrl";
import { getPpcAttribution } from "@/helpers/ppcAttribution";
import { trackCalendlyClick } from "@/helpers/calendlyAnalytics";
import {
  BTN_PRIMARY,
  HEADING_UPPER,
  QUOTE_FIELD_LABEL,
} from "@/helpers/typography.js";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  CLEANING_TYPES,
  CONDITION_OPTIONS,
  CONTACT_OPTIONS,
  EMPTY_CLEANING_LEAD_FORM,
  TIMING_OPTIONS,
  fieldDomId,
  firstErrorField,
  validateCleaningLeadForm,
  type CleaningLeadFormState,
  type CleaningLeadMode,
  type FieldErrors,
} from "@/lib/cleaningLead";

const inputClass =
  "mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-amber-300 focus:ring-2";

const inputErrorClass =
  "mt-2 w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-base text-stone-900 outline-none ring-red-300 focus:ring-2";

const selectClass =
  "mt-2 w-full appearance-none rounded-2xl border border-stone-200 bg-white bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat px-4 py-3 text-base text-stone-900 outline-none ring-amber-300 focus:ring-2";

const selectErrorClass =
  "mt-2 w-full appearance-none rounded-2xl border border-red-300 bg-white bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat px-4 py-3 text-base text-stone-900 outline-none ring-red-300 focus:ring-2";

const selectStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

type Props = {
  mode: CleaningLeadMode;
  /** Called after a successful quote submit (before scroll). */
  onSuccess?: () => void;
};

export default function CleaningLeadForm({ mode, onSuccess }: Props) {
  const isQuote = mode === "quote";
  const [form, setForm] = useState<CleaningLeadFormState>(EMPTY_CLEANING_LEAD_FORM);
  const [submittedSnapshot, setSubmittedSnapshot] =
    useState<CleaningLeadFormState | null>(null);
  const formLoadedAtRef = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const statusId = useId();

  useEffect(() => {
    getPpcAttribution();
  }, []);

  useEffect(() => {
    if (!isQuote || !submitSuccess) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isQuote, submitSuccess]);

  const canAttemptSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  function update<K extends keyof CleaningLeadFormState>(
    key: K,
    value: CleaningLeadFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitError(null);
    if (!isQuote) setSubmitSuccess(false);
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function focusField(key: keyof CleaningLeadFormState) {
    const el = document.getElementById(fieldDomId(key));
    if (el instanceof HTMLElement) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  async function submitLead(snapshot: CleaningLeadFormState) {
    const attribution = getPpcAttribution();
    const response = await fetch("/api/residential-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...snapshot,
        leadPath: isQuote ? "Personalized Quote" : "Book Online",
        formLoadedAt: formLoadedAtRef.current,
        attribution: {
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_term: attribution.utm_term,
          utm_content: attribution.utm_content,
          gclid: attribution.gclid,
          gbraid: attribution.gbraid,
          wbraid: attribution.wbraid,
          landing_path: attribution.landing_path,
        },
      }),
    });

    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error ?? "Failed to send your request.");
    }
    return attribution;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canAttemptSubmit) return;

    const errors = validateCleaningLeadForm(form, mode);
    setFieldErrors(errors);
    const firstInvalid = firstErrorField(errors, mode);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const snapshot = { ...form };

    try {
      const attribution = await submitLead(snapshot);

      if (isQuote) {
        setSubmittedSnapshot(snapshot);
        setSubmitSuccess(true);
        setForm(EMPTY_CLEANING_LEAD_FORM);
        formLoadedAtRef.current = Date.now();
        setIsSubmitting(false);
        onSuccess?.();
        return;
      }

      const calendlyUrl = buildBookingCalendlyUrl({
        form: snapshot,
        leadPath: "Book Online",
        attribution,
      });

      trackCalendlyClick({
        source: "book_online_form",
        url: calendlyUrl,
        attribution,
      });

      window.location.assign(calendlyUrl);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send your request. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  function openCalendlyFromQuoteSuccess() {
    if (!submittedSnapshot) return;
    const attribution = getPpcAttribution();
    const calendlyUrl = buildBookingCalendlyUrl({
      form: submittedSnapshot,
      leadPath: "Personalized Quote",
      attribution,
    });
    trackCalendlyClick({
      source: "request_a_quote_post_submit",
      url: calendlyUrl,
      attribution,
    });
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
  }

  if (isQuote && submitSuccess) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div aria-live="polite">
          <h2 className={`text-xl font-bold text-stone-900 ${HEADING_UPPER}`}>
            Thanks! We&apos;ll put together your personalized estimate.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-stone-700">
            We&apos;ve received the details about your home and a member of our
            team will be in touch within 1–2 business hours.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5">
          <h3 className={`text-base font-bold text-stone-900 ${HEADING_UPPER}`}>
            Want to reserve a cleaning time now?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            You don&apos;t have to wait for your estimate to reserve a spot.
            We&apos;ll still confirm your final price with you before cleaning
            begins.
          </p>
          <button
            type="button"
            onClick={openCalendlyFromQuoteSuccess}
            className={`${BTN_PRIMARY} mt-4 w-full sm:w-auto`}
          >
            See Available Times →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <section>
        <h2 className={`text-lg font-bold text-stone-900 ${HEADING_UPPER}`}>
          Contact information
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="First name *"
            htmlFor={fieldDomId("firstName")}
            error={fieldErrors.firstName}
          >
            <input
              id={fieldDomId("firstName")}
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={fieldErrors.firstName ? inputErrorClass : inputClass}
              aria-invalid={Boolean(fieldErrors.firstName)}
              required
            />
          </Field>

          <Field
            label="Last name *"
            htmlFor={fieldDomId("lastName")}
            error={fieldErrors.lastName}
          >
            <input
              id={fieldDomId("lastName")}
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={fieldErrors.lastName ? inputErrorClass : inputClass}
              aria-invalid={Boolean(fieldErrors.lastName)}
              required
            />
          </Field>

          <Field
            label="Mobile phone *"
            htmlFor={fieldDomId("mobilePhone")}
            error={fieldErrors.mobilePhone}
          >
            <input
              id={fieldDomId("mobilePhone")}
              name="mobilePhone"
              type="tel"
              autoComplete="tel"
              value={form.mobilePhone}
              onChange={(e) =>
                update("mobilePhone", formatPhoneInput(e.target.value))
              }
              className={fieldErrors.mobilePhone ? inputErrorClass : inputClass}
              placeholder="(503) 555-1234"
              aria-invalid={Boolean(fieldErrors.mobilePhone)}
              required
            />
          </Field>

          <Field
            label="Email *"
            htmlFor={fieldDomId("email")}
            error={fieldErrors.email}
          >
            <input
              id={fieldDomId("email")}
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={fieldErrors.email ? inputErrorClass : inputClass}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
          </Field>
        </div>

        {!isQuote ? (
          <div className="mt-4">
            <Field
              label="Service address *"
              htmlFor={fieldDomId("address")}
              error={fieldErrors.address}
            >
              <input
                id={fieldDomId("address")}
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={fieldErrors.address ? inputErrorClass : inputClass}
                placeholder="Street, city, ZIP"
                aria-invalid={Boolean(fieldErrors.address)}
                required
              />
            </Field>
          </div>
        ) : null}

        {isQuote ? (
          <fieldset className="mt-5">
            <legend className={QUOTE_FIELD_LABEL}>
              How would you prefer we contact you? *
            </legend>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
              {CONTACT_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-800"
                >
                  <input
                    id={
                      option === CONTACT_OPTIONS[0]
                        ? fieldDomId("contactPreference")
                        : undefined
                    }
                    type="radio"
                    name="contactPreference"
                    value={option}
                    checked={form.contactPreference === option}
                    onChange={() => update("contactPreference", option)}
                    className="h-4 w-4 border-stone-300 text-amber-500 focus:ring-amber-300"
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
            {fieldErrors.contactPreference ? (
              <p className="mt-2 text-sm font-medium text-red-600">
                {fieldErrors.contactPreference}
              </p>
            ) : null}
          </fieldset>
        ) : null}
      </section>

      <section className="mt-10 border-t border-stone-100 pt-10">
        <h2 className={`text-lg font-bold text-stone-900 ${HEADING_UPPER}`}>
          {isQuote ? "Tell us about your cleaning" : "About your home"}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="What type of cleaning do you need? *"
            htmlFor={fieldDomId("cleaningType")}
            className="sm:col-span-2"
            error={fieldErrors.cleaningType}
          >
            <select
              id={fieldDomId("cleaningType")}
              name="cleaningType"
              value={form.cleaningType}
              onChange={(e) => update("cleaningType", e.target.value)}
              className={
                fieldErrors.cleaningType ? selectErrorClass : selectClass
              }
              style={selectStyle}
              aria-describedby={
                form.cleaningType === "Recurring Cleaning"
                  ? "cl-recurring-note"
                  : undefined
              }
              aria-invalid={Boolean(fieldErrors.cleaningType)}
              required
            >
              <option value="" disabled>
                Select a cleaning type
              </option>
              {CLEANING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {form.cleaningType === "Recurring Cleaning" ? (
              <div
                id="cl-recurring-note"
                role="note"
                className="mt-3 flex gap-3 rounded-xl border border-amber-300 bg-amber-200 px-4 py-3"
              >
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-800"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-amber-950">
                  Note: Standard / recurring clean rates apply to homes that have
                  had a professional cleaning within the past 2–4 weeks. If
                  it&apos;s been longer, we usually recommend starting with a Deep
                  Clean.
                </p>
              </div>
            ) : null}
          </Field>

          <Field
            label="Approximate home size *"
            htmlFor={fieldDomId("homeSize")}
            error={fieldErrors.homeSize}
          >
            <input
              id={fieldDomId("homeSize")}
              name="homeSize"
              type="number"
              min={1}
              inputMode="numeric"
              value={form.homeSize}
              onChange={(e) => update("homeSize", e.target.value)}
              className={fieldErrors.homeSize ? inputErrorClass : inputClass}
              placeholder="e.g. 1800"
              aria-invalid={Boolean(fieldErrors.homeSize)}
              required
            />
          </Field>

          <Field
            label="Bedrooms *"
            htmlFor={fieldDomId("bedrooms")}
            error={fieldErrors.bedrooms}
          >
            <select
              id={fieldDomId("bedrooms")}
              name="bedrooms"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className={fieldErrors.bedrooms ? selectErrorClass : selectClass}
              style={selectStyle}
              aria-invalid={Boolean(fieldErrors.bedrooms)}
              required
            >
              <option value="" disabled>
                Select bedrooms
              </option>
              {BEDROOM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Bathrooms *"
            htmlFor={fieldDomId("bathrooms")}
            error={fieldErrors.bathrooms}
          >
            <select
              id={fieldDomId("bathrooms")}
              name="bathrooms"
              value={form.bathrooms}
              onChange={(e) => update("bathrooms", e.target.value)}
              className={fieldErrors.bathrooms ? selectErrorClass : selectClass}
              style={selectStyle}
              aria-invalid={Boolean(fieldErrors.bathrooms)}
              required
            >
              <option value="" disabled>
                Select bathrooms
              </option>
              {BATHROOM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset className="mt-5">
          <legend className={QUOTE_FIELD_LABEL}>
            How would you describe the current condition? *
          </legend>
          <div className="mt-3 space-y-2">
            {CONDITION_OPTIONS.map((option, index) => (
              <label
                key={option}
                className="flex min-h-11 cursor-pointer items-start gap-2 text-sm text-stone-800"
              >
                <input
                  id={index === 0 ? fieldDomId("condition") : undefined}
                  type="radio"
                  name="condition"
                  value={option}
                  checked={form.condition === option}
                  onChange={() => update("condition", option)}
                  className="mt-0.5 h-4 w-4 shrink-0 border-stone-300 text-amber-500 focus:ring-amber-300"
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {fieldErrors.condition ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              {fieldErrors.condition}
            </p>
          ) : null}
        </fieldset>

        {isQuote ? (
          <>
            <fieldset className="mt-5">
              <legend className={QUOTE_FIELD_LABEL}>
                When are you hoping to have the cleaning done? *
              </legend>
              <div className="mt-3 space-y-2">
                {TIMING_OPTIONS.map((option, index) => (
                  <label
                    key={option}
                    className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-800"
                  >
                    <input
                      id={index === 0 ? fieldDomId("timing") : undefined}
                      type="radio"
                      name="timing"
                      value={option}
                      checked={form.timing === option}
                      onChange={() => update("timing", option)}
                      className="h-4 w-4 border-stone-300 text-amber-500 focus:ring-amber-300"
                      required
                    />
                    {option}
                    {option === "Specific date" ? ":" : null}
                  </label>
                ))}
                {form.timing === "Specific date" ? (
                  <input
                    id={fieldDomId("specificDate")}
                    name="specificDate"
                    type="date"
                    value={form.specificDate}
                    onChange={(e) => update("specificDate", e.target.value)}
                    className={`${fieldErrors.specificDate ? inputErrorClass : inputClass} ml-6 max-w-xs`}
                    aria-invalid={Boolean(fieldErrors.specificDate)}
                    required
                  />
                ) : null}
              </div>
              {fieldErrors.timing ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {fieldErrors.timing}
                </p>
              ) : null}
              {fieldErrors.specificDate ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {fieldErrors.specificDate}
                </p>
              ) : null}
            </fieldset>

            <Field
              label="Anything you'd like us to know? (optional)"
              htmlFor={fieldDomId("notes")}
              className="mt-5"
            >
              <textarea
                id={fieldDomId("notes")}
                name="notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={5}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="Tell us about any areas that need extra attention, pets, special requests, or anything else that may help us estimate your cleaning."
              />
            </Field>
          </>
        ) : null}
      </section>

      <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2" aria-live="polite" id={statusId}>
          {isQuote ? (
            <p className="text-xs leading-relaxed text-stone-500">
              We&apos;ll review your details and get back to you within 1-2
              business hours.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-stone-500">
              Next you&apos;ll choose an available cleaning time. We&apos;ll
              confirm your final price before cleaning begins.
            </p>
          )}
          {submitError ? (
            <p className="text-sm font-medium text-red-600">{submitError}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!canAttemptSubmit}
          aria-describedby={statusId}
          className={`${BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isSubmitting
            ? isQuote
              ? "Sending…"
              : "Loading available times…"
            : isQuote
              ? "Submit quote request"
              : "See Available Times →"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  className = "",
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={QUOTE_FIELD_LABEL}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
