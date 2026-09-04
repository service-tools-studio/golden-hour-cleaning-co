"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatUtmContent } from "@/helpers/parseUtmContent.mjs";
import InternalBreadcrumbs from "@/components/internal/InternalBreadcrumbs";
import InternalFooter from "@/components/internal/InternalFooter";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

const EXAMPLE =
  "https://calendly.com/golden-hour-cleaning-company/residential-cleaning?utm_source=book_online&utm_medium=website&utm_campaign=online_booking&utm_content=lead%3Dbook_online%7Etype%3DDeep%20Cleaning%7Ebed%3D3%7Eba%3D2%7Esf%3D1800%7Econd%3DModerate%7Elp%3Dbook-online&gclid=EXAMPLE123";

export default function CalendarDetailsClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    return formatUtmContent(trimmed);
  }, [input]);

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-amber-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <InternalBreadcrumbs currentPage="Calendar details" />
        <h1 className={`mt-3 text-3xl md:text-4xl ${HEADING_UPPER}`}>
          Calendar details
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Paste a Calendly URL (or any URL with UTM / click IDs), a{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">
            utm_content
          </code>{" "}
          value, or a raw{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">
            type=deep~bed=3~...
          </code>{" "}
          payload. All{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">utm_*</code>,{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">gclid</code>,{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">gbraid</code>,
          and{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">wbraid</code>{" "}
          params are decoded, plus nested quote/booking details inside{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">
            utm_content
          </code>
          .
        </p>

        <label
          htmlFor="utm-input"
          className={`mt-8 block text-sm font-semibold text-stone-800 ${HEADING_UPPER}`}
        >
          Input
        </label>
        <textarea
          id="utm-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={EXAMPLE}
          className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-stone-800 shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInput(EXAMPLE)}
            className={`${BTN_UPPER} rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-50`}
          >
            Load example
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setCopied(false);
            }}
            className={`${BTN_UPPER} rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-50`}
          >
            Clear
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className={`text-lg font-semibold ${HEADING_UPPER}`}>Output</h2>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className={`${BTN_UPPER} inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </>
            )}
          </button>
        </div>

        <pre className="mt-3 min-h-[14rem] whitespace-pre-wrap rounded-2xl border border-amber-200 bg-white px-4 py-4 font-mono text-sm leading-relaxed text-stone-800 shadow-sm">
          {output || "Parsed details will appear here."}
        </pre>
      </div>
      </main>
      <InternalFooter />
    </>
  );
}
