/**
 * Pomocniki typografii tekstu polskiego.
 *
 * replaceWidows — zapobiega „sierotom/wdowom": pojedynczym spójnikom i
 * przyimkom (i, a, w, z, o, u, że, bo, do, na, po, ze, czy) zostawionym na
 * końcu wiersza. Po takim słowie wstawiamy twardą spację (U+00A0, non-breaking
 * space), więc słowo „przykleja się" do następnego wyrazu i nie wisi samotnie.
 *
 * Używamy znaku U+00A0 (a nie encji „&nbsp;"), bo tekst trafia do JSX jako
 * zwykły string — encja zostałaby zescapowana i wyświetlona dosłownie.
 *
 * Przetwarzaj tekst TUŻ przed renderowaniem (akapity opisów, lead-in, cytaty).
 */

/** Krótkie polskie spójniki/przyimki, które nie powinny kończyć wiersza. */
const WIDOW_WORDS = [
  "i",
  "a",
  "w",
  "z",
  "o",
  "u",
  "że",
  "bo",
  "do",
  "na",
  "po",
  "ze",
  "czy",
];

// Negatywny lookbehind (?<![\p{L}\p{N}]) → słowo nie jest częścią większego
// wyrazu (np. „o" w „kto"). Po dopasowaniu zamieniamy następującą spację(-e) na
// pojedynczą twardą spację. Lookbehind (zamiast konsumowania granicy) poprawnie
// obsługuje też sąsiadujące spójniki (np. „a w domu").
const WIDOW_RE = new RegExp(
  `(?<![\\p{L}\\p{N}])(${WIDOW_WORDS.join("|")})\\s+`,
  "giu",
);

/** Twarda spacja (non-breaking space, U+00A0). */
const NBSP = String.fromCharCode(0xa0);

export function replaceWidows(text: string | null | undefined): string {
  if (!text) return text ?? "";
  return text.replace(WIDOW_RE, (_match, word: string) => word + NBSP);
}
