import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/site-content";

const NAV = [
  { label: "Projekty", href: "/projekty" },
  { label: "Specjalizacje", href: "/#specjalizacje" },
  { label: "Klienci", href: "/#klienci" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function SiteHeader() {
  return (
    <header className="border-border border-b">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          href="/"
          className="font-display text-h4 text-ink font-semibold tracking-tight"
        >
          Michał Stężały
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="text-caption text-muted flex items-center gap-7 tracking-wide uppercase">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Button href="/#kontakt" variant="primary" size="sm">
            Porozmawiajmy ↗
          </Button>
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border border-t">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-muted">
          © {year} Michał Stężały · Senior Graphic Designer for Sport &amp;
          Business
        </p>
        <a
          href={CONTACT.cvHref}
          className="text-caption text-muted hover:text-ink w-fit underline-offset-4 transition-colors hover:underline"
        >
          CV (PDF)
        </a>
      </Container>
    </footer>
  );
}
