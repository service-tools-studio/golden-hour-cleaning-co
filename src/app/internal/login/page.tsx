"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

function InternalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/internal/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(data?.error || "Incorrect password.");
        setSubmitting(false);
        return;
      }

      const nextParam = searchParams.get("next");
      const dest =
        nextParam && nextParam.startsWith("/internal")
          ? nextParam
          : "/internal";
      router.replace(dest);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-6 text-stone-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#dcbb52]">
          Internal
        </p>
        <h1 className={`mt-3 text-2xl ${HEADING_UPPER}`}>Enter password</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Team tools only. After unlocking, this browser stays signed in for 30
          days.
        </p>
        <label htmlFor="internal-password" className="sr-only">
          Password
        </label>
        <input
          id="internal-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(null);
          }}
          className="mt-5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Password"
          disabled={submitting}
        />
        {error ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className={`${BTN_UPPER} mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-md disabled:opacity-60`}
        >
          {submitting ? "Unlocking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

export default function InternalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-amber-50 text-stone-600">
          Loading…
        </div>
      }
    >
      <InternalLoginForm />
    </Suspense>
  );
}
