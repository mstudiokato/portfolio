import Link from "next/link";

/** Minimalny nagłówek/stopka (Etap 1). Pełny design system — Etap 2. */

export function SiteHeader() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-ink text-lg font-semibold tracking-tight"
        >
          Michał Stężały
        </Link>
        <nav aria-label="Główna nawigacja">
          <ul className="text-muted flex items-center gap-6 text-sm">
            <li>
              <Link href="/projekty" className="hover:text-ink">
                Projekty
              </Link>
            </li>
            <li>
              <Link href="/#kontakt" className="hover:text-ink">
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border mt-24 border-t">
      <div className="text-muted mx-auto max-w-6xl px-5 py-8 text-sm">
        © {year} Michał Stężały · Senior Graphic Designer for Sport &amp;
        Business
      </div>
    </footer>
  );
}
