"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Lightbox pełnoekranowy (sek. 6.06 „motion that whispers"). Otwiera zdjęcie
 * w oryginalnych proporcjach (max 90vw/90vh, wycentrowane) na ciemnym tle.
 * Zamknięcie: tło / przycisk X / Escape. Nawigacja: strzałki ← → (klawiatura,
 * przyciski) + swipe na mobile. Framer Motion: scale + opacity; respektuje
 * prefers-reduced-motion. Montowany przez <AnimatePresence> w rodzicu.
 */

export type LightboxImage = { src: string; alt: string; exists: boolean };

export function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const reduce = useReducedMotion();
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (dir: number) => setCurrent((c) => (c + dir + count) % count),
    [count],
  );

  // Klawiatura (Escape / strzałki) + blokada scrolla tła na czas otwarcia.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null || count < 2) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  }

  const img = images[current];
  const dur = reduce ? 0 : 0.2;
  const imgInitial = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 };
  const imgAnimate = reduce ? { opacity: 1 } : { opacity: 1, scale: 1 };

  const NAV_BTN =
    "absolute top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-ink text-2xl backdrop-blur transition-colors hover:bg-white/20";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
    >
      {/* Zamknij (X) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Zamknij podgląd"
        className="text-ink absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur transition-colors hover:bg-white/20"
      >
        ✕
      </button>

      {/* Poprzednie */}
      {count > 1 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label="Poprzednie zdjęcie"
          className={`${NAV_BTN} left-3 sm:left-5`}
        >
          ‹
        </button>
      ) : null}

      {/* Zdjęcie (oryginalne proporcje) lub placeholder */}
      <motion.div
        key={current}
        initial={imgInitial}
        animate={imgAnimate}
        transition={{ duration: dur }}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center"
      >
        {img.exists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.src}
            alt={img.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        ) : (
          <div className="bg-section flex aspect-[3/4] w-[min(85vw,520px)] max-w-[90vw] items-center justify-center rounded-card p-6 text-center">
            <span className="text-body text-muted">{img.alt || "zdjęcie"}</span>
          </div>
        )}
      </motion.div>

      {/* Następne */}
      {count > 1 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label="Następne zdjęcie"
          className={`${NAV_BTN} right-3 sm:right-5`}
        >
          ›
        </button>
      ) : null}

      {/* Licznik */}
      {count > 1 ? (
        <span className="text-caption text-ink/80 absolute bottom-5 left-1/2 -translate-x-1/2 tabular-nums">
          {current + 1} / {count}
        </span>
      ) : null}
    </motion.div>
  );
}
