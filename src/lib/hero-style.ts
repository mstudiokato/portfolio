/**
 * Współdzielony styl hero — używany przez prawdziwą sekcję (hero.tsx) ORAZ przez
 * wizualny edytor (/admin/hero-editor), żeby podgląd był 1:1 z efektem na stronie.
 */

// Overlay: pełne krycie navy aż za lewą krawędź zdjęcia (translate przesuwa je
// w prawo, krawędź wypada ~20% szer. sekcji), potem płynne wygaszanie → prawa
// strona prześwituje. Dzięki temu krawędzi zdjęcia nie widać.
export const HERO_OVERLAY =
  "linear-gradient(to right, rgba(11,18,32,1) 0%, rgba(11,18,32,1) 28%, rgba(11,18,32,0.5) 42%, rgba(11,18,32,0) 55%)";

/**
 * Transform kadru zdjęcia hero. Zoom daje nadmiar w obu osiach, translate przesuwa
 * X i Y. 50% = środek. Identyczny wzór po stronie renderu i podglądu w edytorze.
 */
export function heroTransform(
  posX: number,
  posY: number,
  scale: number,
): string {
  return `translate(${50 - posX}%, ${50 - posY}%) scale(${scale / 100})`;
}
