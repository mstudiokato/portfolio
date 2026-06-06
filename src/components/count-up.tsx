"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Licznik count-up dla statystyk (sek. 8.6). Parsuje wartość typu „1000+"
 * na liczbę (1000) + sufiks („+") i animuje od 0 do celu ease-out (~1,1 s).
 * Start dopiero gdy element wchodzi w viewport (IntersectionObserver), jednorazowo.
 * prefers-reduced-motion → od razu wartość docelowa, bez animacji.
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
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!hasNumber) return;
    // prefers-reduced-motion → bez animacji, od razu cel.
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
