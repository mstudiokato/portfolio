import KeystaticApp from "./keystatic";
import { KeystaticFab } from "@/components/admin/keystatic-fab";

/**
 * Panel Keystatic (github mode) działa na produkcji — michal-stezaly.vercel.app
 * /keystatic — po zalogowaniu przez GitHub OAuth (KEYSTATIC_GITHUB_CLIENT_ID /
 * KEYSTATIC_GITHUB_CLIENT_SECRET ustawione na Vercel). Brak blokady domeny/
 * środowiska — renderujemy panel zawsze. Konfiguracja: keystatic.config.ts.
 *
 * Dodatkowo: pływające menu narzędzi właściciela (speed dial) u dołu — wizualny
 * edytor hero, kreator briefu i generator podglądu. Keystatic 0.5 nie pozwala
 * dodać własnych linków do nawigacji bocznej, więc kotwiczymy je jako stały
 * element. Implementacja: components/admin/keystatic-fab.tsx.
 */
export default function KeystaticLayout() {
  return (
    <>
      <KeystaticApp />
      <KeystaticFab />
    </>
  );
}
