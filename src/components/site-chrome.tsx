import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { CONTACT } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="border-border bg-navy/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          href="/"
          className="font-display text-h4 font-semibold tracking-tight"
        >
          <span className="text-ink">Michał </span>
          <span className="text-lime">Stężały</span>
        </Link>

        <MainNav />

        <div className="flex items-center gap-5">
          <Button href="/#kontakt" variant="primary" size="sm">
            Porozmawiajmy ↗
          </Button>
          <a
            href="https://www.linkedin.com/in/michal-stezaly/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn — Michał Stężały"
            className="text-ink hover:text-lime transition-colors"
          >
            <LinkedinIcon size={22} />
          </a>
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
          CV do pobrania ↗
        </a>
      </Container>
    </footer>
  );
}
