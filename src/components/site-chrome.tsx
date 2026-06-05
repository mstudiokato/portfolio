import Link from "next/link";
import { Container } from "@/components/ui/layout";

/** Minimalny nagłówek/stopka. Pełna nawigacja/mobile menu — później. */

export function SiteHeader() {
  return (
    <header className="border-border border-b">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-display text-h4 text-ink font-semibold tracking-tight"
        >
          Michał Stężały
        </Link>
        <nav aria-label="Główna nawigacja">
          <ul className="text-caption text-muted flex items-center gap-6">
            <li>
              <Link
                href="/projekty"
                className="hover:text-ink transition-colors"
              >
                Projekty
              </Link>
            </li>
            <li>
              <Link
                href="/#kontakt"
                className="hover:text-ink transition-colors"
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border mt-section border-t">
      <Container className="text-caption text-muted py-8">
        © {year} Michał Stężały · Senior Graphic Designer for Sport &amp;
        Business
      </Container>
    </footer>
  );
}
