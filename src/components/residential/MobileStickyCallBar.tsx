import { Phone } from "lucide-react";
import { CONTACT } from "@/constants.js";
import { BTN_PRIMARY } from "@/helpers/typography.js";

/** Viewport-fixed mobile CTA — must live outside sticky/transformed headers. */
export default function MobileStickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[100003] border-t border-amber-200 bg-amber-50/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm xl:hidden">
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
