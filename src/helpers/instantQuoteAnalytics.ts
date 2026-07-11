"use client";

type InstantQuoteLocation =
  | "header_desktop"
  | "header_mobile_sticky"
  | "service_card"
  | "landing_hero"
  | "landing_final_cta"
  | "landing_trust_section"
  | "blog_cta";

type TrackInstantQuoteClickInput = {
  buttonLocation: InstantQuoteLocation;
  buttonLabel: string;
  destination: string;
  serviceLevel?: "standard" | "deep" | "move_out";
};

export function trackInstantQuoteClick({
  buttonLocation,
  buttonLabel,
  destination,
  serviceLevel,
}: TrackInstantQuoteClickInput) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "instant_quote_click", {
    event_category: "engagement",
    page_path: window.location.pathname,
    button_location: buttonLocation,
    button_label: buttonLabel,
    destination,
    service_level: serviceLevel,
  });
}
