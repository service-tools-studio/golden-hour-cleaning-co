"use client";

import { useMemo, useState } from "react";

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  spaceType: string;
  sqftRange: string;
  frequency: string;
  startTiming: string;
  notes: string;
  referral: string;
};

const initialState: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  spaceType: "Office",
  sqftRange: "1,000–3,000",
  frequency: "Weekly",
  startTiming: "Within 2 weeks",
  notes: "",
  referral: "",
};

function encode(s: string) {
  return encodeURIComponent(s);
}

export default function CommercialLeadForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const canSubmit = useMemo(() => {
    return (
      form.businessName.trim().length > 0 &&
      form.contactName.trim().length > 0 &&
      form.email.trim().length > 0
    );
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildEmailBody() {
    return [
      `Commercial Quote Request`,
      ``,
      `Business: ${form.businessName}`,
      `Contact: ${form.contactName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "(not provided)"}`,
      ``,
      `Space type: ${form.spaceType}`,
      `Approx. size: ${form.sqftRange} sq ft`,
      `Frequency: ${form.frequency}`,
      `Start timing: ${form.startTiming}`,
      ``,
      `Referral: ${form.referral || "(not provided)"}`,
      ``,
      `Notes:`,
      form.notes || "(none)",
    ].join("\n");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = `Commercial Quote — ${form.businessName}`;
    const body = buildEmailBody();

    const to = "golden.hour.cleaning.company@gmail.com";

    const mailto = `mailto:${encode(to)}?subject=${encode(subject)}&body=${encode(
      body
    )}`;

    window.location.href = mailto;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-stone-900">
            Request a commercial quote
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Share a few details so we can confirm fit and respond with next steps.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 sm:block">
          2–3 min
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Business name *">
          <input
            value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="Example Co."
            required
          />
        </Field>

        <Field label="Contact name *">
          <input
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="First + last"
            required
          />
        </Field>

        <Field label="Email *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="you@company.com"
            required
          />
        </Field>

        <Field label="Phone (optional)">
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="(503) 555-1234"
          />
        </Field>

        <Field label="Type of space">
          <select
            value={form.spaceType}
            onChange={(e) => update("spaceType", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
          >
            <option>Office</option>
            <option>Wellness studio</option>
            <option>Retail</option>
            <option>Property / common areas</option>
            <option>Other</option>
          </select>
        </Field>

        <Field label="Approx. square footage">
          <select
            value={form.sqftRange}
            onChange={(e) => update("sqftRange", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
          >
            <option>Under 1,000</option>
            <option>1,000–3,000</option>
            <option>3,000–7,500</option>
            <option>7,500–15,000</option>
            <option>15,000+</option>
          </select>
        </Field>

        <Field label="Desired frequency">
          <select
            value={form.frequency}
            onChange={(e) => update("frequency", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
          >
            <option>Weekly</option>
            <option>2× per week</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
            <option>Unsure</option>
          </select>
        </Field>

        <Field label="When are you hoping to start?">
          <select
            value={form.startTiming}
            onChange={(e) => update("startTiming", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
          >
            <option>Within 2 weeks</option>
            <option>2–4 weeks</option>
            <option>1–2 months</option>
            <option>Just gathering options</option>
          </select>
        </Field>

        <Field label="How did you hear about us? (optional)" className="sm:col-span-2">
          <input
            value={form.referral}
            onChange={(e) => update("referral", e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="Referral, Google, Instagram, etc."
          />
        </Field>

        <Field label="Anything we should know about your space?" className="sm:col-span-2">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="min-h-[120px] w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-stone-300 focus:ring-2"
            placeholder="Access instructions, restrooms count, kitchen, priorities, sensitivities, etc."
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-stone-500">
          We’ll get back to you within hours, not days.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit request
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-2 text-xs font-semibold text-stone-700">{label}</div>
      {children}
    </label>
  );
}
