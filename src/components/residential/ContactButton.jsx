"use client";

import { useState, useRef, useEffect } from 'react';

const SCROLL_CLOSE_DELAY_MS = 300; // ignore scroll right after open to avoid glitchy close on mobile

export default function ContactButton({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({ top: 0, left: 0 });
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const firstActionRef = useRef(null);
  const openedAtRef = useRef(0);

  const updatePopoverPosition = () => {
    if (!triggerRef.current || !open) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopoverStyle({
      top: rect.bottom + 8,
      left: Math.max(8, rect.right - 220),
    });
  };

  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
      updatePopoverPosition();
      const onScrollOrResize = () => updatePopoverPosition();
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
      return () => {
        window.removeEventListener('scroll', onScrollOrResize, true);
        window.removeEventListener('resize', onScrollOrResize);
      };
    }
  }, [open]);

  // Close on outside click / Esc; close on scroll only after a short delay so opening doesn't immediately close on mobile
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onScroll = () => {
      if (Date.now() - openedAtRef.current < SCROLL_CLOSE_DELAY_MS) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick, { passive: true });
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => {
      firstActionRef.current?.focus();
    });
    return () => cancelAnimationFrame(t);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full sm:w-auto sm:flex-1"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open ? 'true' : 'false'}
        aria-controls="contact-popover"
        onClick={() => {
          if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPopoverStyle({ top: rect.bottom + 8, left: Math.max(8, rect.right - 220) });
          }
          setOpen((v) => !v);
        }}
        className={`w-full inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 whitespace-nowrap ${compact ? "px-3 py-2 text-xs font-medium" : "px-5 py-3 text-sm font-medium"}`}
      >
        Call / Text / Email Us Now!
      </button>

      {/* Popover: fixed so it never affects layout of buttons */}
      {open && (
        <div
          id="contact-popover"
          role="dialog"
          aria-label="Contact options"
          aria-modal="false"
          className="fixed w-[220px] rounded-xl border border-amber-200 bg-white/95 backdrop-blur p-2 shadow-xl"
          style={{ zIndex: 100003, top: popoverStyle.top, left: popoverStyle.left }}
        >
          {/* Arrow pointing up toward the button */}
          <div
            aria-hidden
            className="absolute -top-2 right-6 h-0 w-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid rgba(255,255,255,0.95)',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.08))',
            }}
          />

          <div className="flex flex-col gap-2">
            <a
              ref={firstActionRef}
              href="tel:+15038934795"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              📞 Call
            </a>
            <a
              href="sms:+15038934795"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              💬 Text
            </a>
            <a
              href="mailto:golden.hour.cleaning.company@gmail.com"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              ✉️ Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
