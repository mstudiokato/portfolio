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
 *
 * Prymityw fade-up dla statystyk: używany dla liczby ORAZ jednostki („LAT")
 * i prefixu („PONAD"). `delay` pozwala na stagger między blokami (0/0.15/0.3 s)
 * i wspólne wejście liczby z jej jednostką/prefixem (ten sam delay).
 */
export function CountUp({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut", delay: reduce ? 0 : delay }}
    >
      {value}
    </motion.span>
  );
}
