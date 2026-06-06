import KeystaticApp from "./keystatic";

/**
 * Panel Keystatic (github mode) działa na produkcji — michal-stezaly.vercel.app
 * /keystatic — po zalogowaniu przez GitHub OAuth (KEYSTATIC_GITHUB_CLIENT_ID /
 * KEYSTATIC_GITHUB_CLIENT_SECRET ustawione na Vercel). Brak blokady domeny/
 * środowiska — renderujemy panel zawsze. Konfiguracja: keystatic.config.ts.
 */
export default function KeystaticLayout() {
  return <KeystaticApp />;
}
