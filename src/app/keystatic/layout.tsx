import KeystaticApp from "./keystatic";

/**
 * Panel Keystatic (github mode) działa na produkcji — michal-stezaly.vercel.app
 * /keystatic — po zalogowaniu przez GitHub OAuth (KEYSTATIC_GITHUB_CLIENT_ID /
 * KEYSTATIC_GITHUB_CLIENT_SECRET ustawione na Vercel). Brak blokady domeny/
 * środowiska — renderujemy panel zawsze. Konfiguracja: keystatic.config.ts.
 *
 * Dodatkowo: pływający przycisk do wizualnego edytora hero (/admin/hero-editor),
 * żeby był łatwo dostępny z panelu (Keystatic 0.5 nie pozwala dodać dowolnego
 * linku do nawigacji bocznej, więc kotwiczymy go jako stały element u dołu).
 */
export default function KeystaticLayout() {
  return (
    <>
      <KeystaticApp />
      <a
        href="/admin/hero-editor"
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          zIndex: 1000,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1rem",
          borderRadius: "9999px",
          background: "#111827",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        🎚️ Wizualny edytor hero
      </a>
    </>
  );
}
