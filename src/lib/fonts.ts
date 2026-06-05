import localFont from "next/font/local";

/**
 * Self-hostowane fonty z Fontshare (ITF Free Font License — darmowe komercyjnie,
 * bez atrybucji, bez zależności zewnętrznej). Pliki zmienne (Variable) trzymane
 * w src/fonts. Masterprompt sek. 6.02 [ZABLOKOWANE].
 *
 * Display: Clash Display · Body/UI: Switzer.
 * ZAKAZ: Geist, Inter/Poppins/Montserrat jako fonty wiodące.
 */

// UWAGA: nazwy zmiennych CSS muszą różnić się od tokenów Tailwind
// (--font-display / --font-sans), inaczej powstaje referencja okrężna.
// Tutaj wystawiamy --font-clash / --font-switzer, a globals.css mapuje je
// na --font-display / --font-sans w @theme.

export const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  display: "swap",
  weight: "200 700",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const switzer = localFont({
  src: "../fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap",
  weight: "100 900",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});
