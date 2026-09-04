"use client";

import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { CONTACT } from "@/constants.js";
import { BTN_PRIMARY } from "@/helpers/typography.js";
import { syncFixedToVisualViewport } from "@/helpers/syncFixedToVisualViewport";

/**
 * Viewport-fixed mobile CTA.
 * Must be a direct child of <body> (see layout.tsx). Synced to the visual
 * viewport so iOS Chrome doesn't hide it under the browser toolbar on load.
 */
export default function MobileStickyCallBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => syncFixedToVisualViewport(ref.current, "bottom"), []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[100003] border-t border-amber-200 bg-amber-50/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm xl:hidden"
      style={{ position: "fixed", left: 0, right: 0, bottom: 0 }}
    >
      <a
        href={`tel:${CONTACT.phone}`}
        className={`${BTN_PRIMARY} w-full gap-2`}
        aria-label="Call us"
        data-call-source="header_nav_mobile_call_now"
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        Call Us
      </a>
    </div>
  );
}
