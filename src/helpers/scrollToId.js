"use client";

export function scrollToId(id, extraOffset = 0) {
  // Guard for SSR / prerender
  if ((typeof window === "undefined") || typeof document === "undefined") return;

  const target = document.querySelector(id);
  const header = document.querySelector('header');
  if (!target) return;

  const headerH = header?.offsetHeight ?? 0;
  const y = target.getBoundingClientRect().top + window.scrollY - headerH - extraOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}
