"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Liczby statystyk („Fakty i liczby") pojawiają się prostym fade-up
 * (opacity 0→1, y 10px→0) przy wejściu w viewport — BEZ nabijania wartości.
 *
 * FALLBACK-FIRST: wartość docelowa (np. „1000+", „14", „30+") jest w DOM od
 * razu — SSR, crawlerzy, podglądy linków i tryb bez JS widzą finalną liczbę;
 * animowana jest tylko warstwa wizualna (opacity/transform).
 *
 * prefers-reduced-motion → wartość od razu, bez animacji.
 *
 * display:inline-block — transform (y) nie działa na zwykłym inline <span>.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
    >
      {value}
    </motion.span>
  );
}
