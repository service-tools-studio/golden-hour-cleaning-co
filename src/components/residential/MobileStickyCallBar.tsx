"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT } from "@/constants.js";
import {
  subscribeLeadWizardInView,
  type LeadWizardMode,
} from "@/helpers/leadWizardVisibility";
import { BTN_PRIMARY } from "@/helpers/typography.js";
import { syncFixedToVisualViewport } from "@/helpers/syncFixedToVisualViewport";

const PPC_DEEP_CLEAN_PATH = "/portland-deep-cleaning";
/** In-page Call buttons that should suppress the sticky bar while visible. */
const PAGE_CALL_SELECTOR = [
  '[data-call-source="ppc_deep_clean_hero_call"]',
  '[data-call-source="ppc_deep_clean_faq_call"]',
].join(", ");

function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight)
  );
}

/**
 * Viewport-fixed mobile CTA.
 * Must be a direct child of <body> (see layout.tsx). Synced to the visual
 * viewport so iOS Chrome doesn't hide it under the browser toolbar on load.
 *
 * Hidden while a quote/booking wizard is in view, and on the PPC deep-clean
 * page while any primary in-page Call CTA is visible.
 */
export default function MobileStickyCallBar() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const isPpcDeepClean = pathname === PPC_DEEP_CLEAN_PATH;
  const [pageCallInView, setPageCallInView] = useState(isPpcDeepClean);
  const [wizardInView, setWizardInView] = useState<LeadWizardMode | null>(null);

  const visible =
    !wizardInView && (!isPpcDeepClean || !pageCallInView);

  useEffect(() => subscribeLeadWizardInView(setWizardInView), [pathname]);

  useEffect(() => {
    if (!isPpcDeepClean) {
      setPageCallInView(false);
      return;
    }

    // Assume in-view until we can observe — layout mounts before page CTAs.
    setPageCallInView(true);

    const intersecting = new Set<Element>();
    const watched = new Set<Element>();

    const emit = () => {
      setPageCallInView(intersecting.size > 0);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        emit();
      },
      { threshold: 0, rootMargin: "0px" },
    );

    const sync = () => {
      document.querySelectorAll(PAGE_CALL_SELECTOR).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
        if (isElementInViewport(el)) intersecting.add(el);
        else intersecting.delete(el);
      });
      emit();
    };

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      intersecting.clear();
      watched.clear();
    };
  }, [isPpcDeepClean, pathname]);

  useLayoutEffect(() => {
    document.body.dataset.mobileCallBar = visible ? "1" : "0";
    return () => {
      document.body.dataset.mobileCallBar = "1";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    return syncFixedToVisualViewport(ref.current, "bottom");
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[100003] border-t border-amber-200 bg-amber-50/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm xl:hidden"
      style={{ position: "fixed", left: 0, right: 0, bottom: 0 }}
    >
      <a
        href={`tel:${CONTACT.phone}`}
        className={`${BTN_PRIMARY} w-full gap-2`}
        aria-label="Call us at (503) 893-4795"
        data-call-source="header_nav_mobile_call_now"
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        <span className="md:hidden">Call Us</span>
        <span className="hidden md:inline">Call (503) 893-4795</span>
      </a>
    </div>
  );
}
