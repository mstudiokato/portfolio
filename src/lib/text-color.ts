/**
 * Kolory tekstu wybierane w panelu Keystatic (pola „Kolor tekstu"). Trzy opcje:
 * biały (domyślny), limonkowy (akcent), szary (drugoplanowy). Zwracamy HEX i
 * stosujemy przez inline style — inline style wygrywa z klasami Tailwinda, więc
 * nadpisanie koloru działa niezależnie od domyślnej klasy elementu (np. text-ink).
 */

export type TextColor = "white" | "lime" | "grey";

const HEX: Record<TextColor, string> = {
  white: "#F5F7FA",
  lime: "#D4FF00",
  grey: "#8B96AB",
};

/** HEX dla wartości z panelu; nieznana/pusta → fallback (domyślnie biały). */
export function textColorHex(
  value: string | undefined | null,
  fallback: TextColor = "white",
): string {
  return HEX[(value as TextColor)] ?? HEX[fallback];
}
