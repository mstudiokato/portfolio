"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Licznik count-up dla statystyk (sek. 8.6). Parsuje wartość typu „1000+"
 * na liczbę (1000) + sufiks („+").
 *
 * FALLBACK-FIRST: wartość początkowa stanu = CEL (target), więc HTML z SSR i
 * pierwszy render po hydratacji pokazują wartość docelową (np. „14", „1000+",
 * „30") — NIGDY „0". Dotyczy to też sytuacji bez JS, wolnego JS, crawlerów i
 * podglądów linków (które czytają surowy HTML).
 *
 * Animacja count-up (od 0 do celu, ease-out ~1,1 s) nakładana jest TYLKO gdy:
 *  - JS jest aktywny (efekt w ogóle się uruchamia),
 *  - użytkownik nie ma prefers-reduced-motion,
 *  - sekcja wchodzi w viewport (IntersectionObserver), jednorazowo.
 * prefers-reduced-motion → wartość docelowa od razu, bez animacji.
 * Wartości bez części liczbowej renderowane są dosłownie (bez animacji).
 */
export function CountUp({
  value,
  duration = 1100,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  // „1000+" → number 1000, suffix „+". Brak liczby → render dosłowny.
  const match = value.match(/^(\d[\d\s.,]*)(.*)$/);
  const target = match ? parseInt(match[1].replace(/\D/g, ""), 10) : NaN;
  const suffix = match ? match[2] : "";
  const hasNumber = !Number.isNaN(target);

  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  // Start od CELU (nie 0) — SSR/no-JS pokazuje wartość docelową, bez migotania.
  const [display, setDisplay] = useState(hasNumber ? target : 0);

  useEffect(() => {
    if (!hasNumber) return;
    // prefers-reduced-motion → bez animacji; zostaje wartość docelowa (initial).
    if (reduce) {
      setDisplay(target);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        // Animacja dopiero gdy sekcja jest w viewport: liczymy od 0 do celu.
        // Pierwsza klatka (t≈0) ustawia ~0, więc count-up startuje od zera mimo
        // że initial = cel (poza viewportem wartość docelowa zostaje widoczna).
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out (cubic)
          setDisplay(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNumber, reduce, target, duration]);

  if (!hasNumber) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
