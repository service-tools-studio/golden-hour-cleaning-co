"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

function buildInlineUrl(rawUrl) {
  const u = new URL(rawUrl);
  u.searchParams.set("embed_type", "Inline");

  if (typeof window !== "undefined") {
    u.searchParams.set("embed_domain", window.location.hostname);
  }

  return u.toString();
}

export default function CalendlyBooking({ url, isOpen, setOpen }) {
  const hostRef = useRef(null);

  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | fallback

  const embedUrl = useMemo(() => {
    if (!url) return null;
    try {
      return buildInlineUrl(url);
    } catch {
      return null;
    }
  }, [url]);

  useEffect(() => {
    if (!isOpen || !scriptReady || !embedUrl || !hostRef.current) return;

    setStatus("loading");
    hostRef.current.innerHTML = "";

    // Init Calendly after the modal has painted and has size
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          window.Calendly?.initInlineWidget?.({
            url: embedUrl,
            parentElement: hostRef.current,
          });
        } catch (e) {
          console.error("Calendly initInlineWidget failed", e);
        }
      });
    });

    // Poll for iframe injection (Calendly is async and may not set src immediately)
    let tries = 0;
    const maxTries = 14; // ~3.5s at 250ms
    const interval = setInterval(() => {
      tries += 1;

      const host = hostRef.current;
      const iframe = host?.querySelector("iframe");
      const ok = iframe && iframe.getBoundingClientRect().height > 200;

      if (ok) {
        setStatus("loaded");
        clearInterval(interval);
        return;
      }

      if (tries >= maxTries) {
        setStatus("fallback");
        clearInterval(interval);

        // Only open a new tab AFTER we are confident it's not embedding
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, scriptReady, embedUrl, url]);

  if (!isOpen || !embedUrl) return null;

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="fixed inset-0 z-[9999] bg-black/50 p-4">
        <div className="relative mx-auto h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <div className="text-sm font-medium text-stone-900">
              Choose your appointment time
            </div>

            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-800"
              >
                Open in new tab →
              </a>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative h-[calc(85vh-49px)]">
            <div ref={hostRef} className="h-full w-full" />

            {/* Lightweight loading hint (does NOT cover the calendar) */}
            {status === "loading" && (
              <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs text-stone-700 shadow-sm backdrop-blur">
                Loading calendar…
              </div>
            )}

            {/* Fallback hint (does NOT cover the calendar) */}
            {status === "fallback" && (
              <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs text-stone-700 shadow-sm backdrop-blur">
                If the calendar doesn’t load here, we opened booking in a new tab.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
