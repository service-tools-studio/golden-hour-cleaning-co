"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  formatPhoneInput,
  phoneInputPlaceholderForMarket,
} from "@/helpers/contactHelpers.js";
import { useActiveMarket } from "@/helpers/useActiveMarket";
import {
  CONTACT_TOPICS,
  isContactTopic,
  type ContactTopic,
} from "@/lib/contactPage";
import { HONEYPOT_FIELD } from "@/lib/formHoneypot";
import { BTN_PRIMARY, QUOTE_FIELD_LABEL } from "@/helpers/typography.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none ring-amber-300 focus:ring-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base";

const inputErrorClass =
  "mt-2 w-full rounded-xl border border-red-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none ring-red-300 focus:ring-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base";

type FormState = {
  name: string;
  email: string;
  phone: string;
  topic: ContactTopic;
  message: string;
  [HONEYPOT_FIELD]: string;
};

const initialTopic = (raw: string | null): ContactTopic =>
  isContactTopic(raw) ? raw : "general";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const activeMarket = useActiveMarket();
  const phonePlaceholder = phoneInputPlaceholderForMarket(activeMarket.id);
  const formLoadedAtRef = useRef(Date.now());
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    email: "",
    phone: "",
    topic: initialTopic(searchParams.get("topic")),
    message: "",
    [HONEYPOT_FIELD]: "",
  }));
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.message.trim().length > 0
    );
  }, [form, isSubmitting]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSubmitError(null);
    setSubmitSuccess(false);
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = "Enter your name.";
    if (!form.email.trim()) errors.email = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) errors.message = "Enter a message.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          topic: form.topic,
          message: form.message.trim(),
          [HONEYPOT_FIELD]: form[HONEYPOT_FIELD],
          formLoadedAt: formLoadedAtRef.current,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitSuccess(true);
      setForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        message: "",
        [HONEYPOT_FIELD]: "",
      }));
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="contact-ghc-hp">Leave blank</label>
        <input
          id="contact-ghc-hp"
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="nope"
          inputMode="none"
          value={form[HONEYPOT_FIELD]}
          onChange={(e) => update(HONEYPOT_FIELD, e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="contact-name" className={QUOTE_FIELD_LABEL}>
            Your name *
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={fieldErrors.name ? inputErrorClass : inputClass}
            aria-invalid={Boolean(fieldErrors.name)}
            required
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={QUOTE_FIELD_LABEL}>
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldErrors.email ? inputErrorClass : inputClass}
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className={QUOTE_FIELD_LABEL}>
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", formatPhoneInput(e.target.value))}
            placeholder={phonePlaceholder}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className={QUOTE_FIELD_LABEL}>
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            value={form.topic}
            onChange={(e) =>
              update("topic", initialTopic(e.target.value))
            }
            className={inputClass}
          >
            {CONTACT_TOPICS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={QUOTE_FIELD_LABEL}>
            Message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={fieldErrors.message ? inputErrorClass : inputClass}
            aria-invalid={Boolean(fieldErrors.message)}
            required
          />
          {fieldErrors.message ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
          ) : null}
        </div>
      </div>

      {submitError ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}
      {submitSuccess ? (
        <p className="mt-4 text-sm font-semibold text-stone-800" role="status">
          Thanks — we received your message and will get back to you soon.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`${BTN_PRIMARY} mt-6 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}