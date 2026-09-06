export type LeadWizardMode = "quote" | "booking";

const SELECTOR = "[data-lead-wizard]";

/**
 * Observes CleaningLeadForm roots (`data-lead-wizard="quote|booking"`).
 * Calls back with the most visible wizard mode, or null if none are in view.
 */
export function subscribeLeadWizardInView(
  onChange: (mode: LeadWizardMode | null) => void,
): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const ratios = new Map<Element, { mode: LeadWizardMode; ratio: number }>();

  const emit = () => {
    let best: { mode: LeadWizardMode; ratio: number } | null = null;
    for (const value of ratios.values()) {
      if (value.ratio <= 0) continue;
      if (!best || value.ratio > best.ratio) best = value;
    }
    onChange(best?.mode ?? null);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const raw = entry.target.getAttribute("data-lead-wizard");
        if (raw !== "quote" && raw !== "booking") continue;
        ratios.set(entry.target, {
          mode: raw,
          ratio: entry.isIntersecting ? Math.max(entry.intersectionRatio, 0.01) : 0,
        });
      }
      emit();
    },
    { threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75, 1] },
  );

  const watched = new Set<Element>();

  const syncTargets = () => {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (watched.has(el)) return;
      watched.add(el);
      observer.observe(el);
    });
  };

  syncTargets();
  emit();

  const mutation = new MutationObserver(() => syncTargets());
  mutation.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    mutation.disconnect();
    ratios.clear();
    watched.clear();
  };
}
