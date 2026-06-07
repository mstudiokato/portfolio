"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Poziomy slider galerii projektu ze strzałkami (5+ zdjęć). Server-component
 * renderuje kafle zdjęć i przekazuje je jako children; tu dokładamy tylko
 * interaktywność: przewijanie o jedno zdjęcie przyciskami ‹ ›. Każdy kafelek
 * musi mieć atrybut data-gallery-item (do wyliczenia kolejnej pozycji).
 */
export function GallerySlider({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Strzałka przewija dokładnie do następnego/poprzedniego kafla.
  function scrollOne(dir: number) {
    const el = scrollRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-gallery-item]"),
    );
    const cur = el.scrollLeft;
    const target =
      dir > 0
        ? items.find((it) => it.offsetLeft > cur + 1)
        : [...items].reverse().find((it) => it.offsetLeft < cur - 1);
    el.scrollTo({
      left: target ? target.offsetLeft : dir > 0 ? el.scrollWidth : 0,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  const NAV =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy/70 text-ink text-xl backdrop-blur transition-colors hover:bg-navy sm:flex";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollOne(-1)}
        aria-label="Przewiń w lewo"
        className={`${NAV} left-1`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollOne(1)}
        aria-label="Przewiń w prawo"
        className={`${NAV} right-1`}
      >
        ›
      </button>

      <div
        ref={scrollRef}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {children}
      </div>
    </div>
  );
}
