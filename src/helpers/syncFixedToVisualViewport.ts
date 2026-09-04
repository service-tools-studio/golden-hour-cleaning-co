"use client";

/**
 * Keep position:fixed UI aligned to the *visual* viewport on iOS Chrome.
 * Without this, fixed top/bottom chrome sits under the browser URL/toolbar
 * until the user interacts and the UI collapses.
 */
export function syncFixedToVisualViewport(
  el: HTMLElement | null,
  edge: "top" | "bottom",
) {
  if (!el || typeof window === "undefined") return () => {};

  const vv = window.visualViewport;
  if (!vv) return () => {};

  const apply = () => {
    if (edge === "top") {
      el.style.top = `${vv.offsetTop}px`;
      el.style.bottom = "auto";
      el.style.transform = "";
      return;
    }

    // Distance from layout viewport bottom to visual viewport bottom.
    const bottomInset = Math.max(
      0,
      window.innerHeight - vv.height - vv.offsetTop,
    );
    el.style.bottom = `${bottomInset}px`;
    el.style.top = "auto";
    el.style.transform = "";
  };

  apply();
  vv.addEventListener("resize", apply);
  vv.addEventListener("scroll", apply);
  window.addEventListener("resize", apply);

  return () => {
    vv.removeEventListener("resize", apply);
    vv.removeEventListener("scroll", apply);
    window.removeEventListener("resize", apply);
  };
}
