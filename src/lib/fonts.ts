import localFont from "next/font/local";

/**
 * Self-hostowane fonty z Fontshare (ITF Free Font License — darmowe komercyjnie,
 * bez atrybucji, bez zależności zewnętrznej). Pliki zmienne (Variable) trzymane
 * w src/fonts. Masterprompt sek. 6.02 [ZABLOKOWANE].
 *
 * Display: Clash Display · Body/UI: Switzer.
 * ZAKAZ: Geist, Inter/Poppins/Montserrat jako fonty wiodące.
 */

export const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 700",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const switzer = localFont({
  src: "../fonts/Switzer-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});
