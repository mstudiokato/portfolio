/**
 * Lata doświadczenia liczone DYNAMICZNIE od roku startu działalności = 2012
 * [ZABLOKOWANE, masterprompt sek. 8.6]. Liczba aktualizuje się sama co roku —
 * NIGDY nie hardkodujemy „14".
 */

export const CAREER_START_YEAR = 2012;

export function yearsOfExperience(now: Date = new Date()): number {
  return now.getFullYear() - CAREER_START_YEAR;
}
