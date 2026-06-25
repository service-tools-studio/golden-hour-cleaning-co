"use client";

export function scrollToId(id, extraOffset = 0, { focus = false } = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const target = document.querySelector(id);
  const header = document.querySelector("header");
  if (!target || !(target instanceof HTMLElement)) return;

  const headerH = header?.offsetHeight ?? 0;
  const y =
    target.getBoundingClientRect().top + window.scrollY - headerH - extraOffset;

  window.scrollTo({ top: y, behavior: "smooth" });

  if (!focus) return;

  let didFocus = false;
  const moveFocus = () => {
    if (didFocus) return;
    didFocus = true;
    target.focus({ preventScroll: true });
  };

  window.addEventListener("scrollend", moveFocus, { once: true });
  window.setTimeout(moveFocus, 700);
}
