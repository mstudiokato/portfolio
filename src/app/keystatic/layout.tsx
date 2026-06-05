import Link from "next/link";
import KeystaticApp from "./keystatic";

/**
 * Na produkcji na subdomenie *.netlify.app OAuth GitHub jest niestabilny, więc
 * zamiast niedziałającego logowania pokazujemy czytelny komunikat. Panel
 * „odblokuje się" sam, gdy w Etapie 10 ustawimy NEXT_PUBLIC_URL na domenę
 * docelową (wtedy canonical nie jest już subdomeną netlify.app). Konfiguracja
 * github mode zostaje — patrz keystatic.config.ts.
 */
const canonical =
  process.env.NEXT_PUBLIC_URL || "https://michal-stezaly.netlify.app";
const showUnavailableNotice =
  process.env.NODE_ENV === "production" && canonical.includes(".netlify.app");

export default function KeystaticLayout() {
  if (showUnavailableNotice) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="border-border bg-surface rounded-card w-full max-w-md border p-8 text-center">
          <p className="text-label text-lime uppercase">Panel CMS</p>
          <h1 className="font-display text-ink text-h3 mt-4 font-semibold">
            Panel chwilowo niedostępny tutaj
          </h1>
          <p className="text-muted mt-4">
            Panel dostępny lokalnie (<code>npm run dev</code> →{" "}
            <code>localhost:3000/keystatic</code>) lub po przepięciu domeny w
            Etapie 10.
          </p>
          <Link
            href="/"
            className="text-caption text-lime mt-6 inline-block hover:underline"
          >
            ← Wróć na stronę
          </Link>
        </div>
      </main>
    );
  }

  return <KeystaticApp />;
}
