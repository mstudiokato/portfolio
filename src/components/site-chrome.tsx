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
          className="font-display text-h4 order-first font-semibold tracking-tight lg:order-none"
        >
          <span className="text-ink">Michał </span>
          <span className="text-lime">Stężały</span>
        </Link>

        <MainNav />

        {/* Mobile: CTA przed hamburgerem (hamburger w MainNav zostaje skrajnie
            po prawej). order-[-1] stawia ten blok przed hamburgerem; reset na lg. */}
        <div className="order-[-1] flex items-center gap-5 lg:order-none">
          {/* LinkedIn widoczny tylko na lg+ — na mobile jest w hamburger menu. */}
          <a
            href="https://www.linkedin.com/in/michal-stezaly/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn — Michał Stężały"
            className="text-ink hover:text-lime hidden transition-colors lg:block"
          >
            <LinkedinIcon size={22} />
          </a>
          <Button
            href="/#kontakt"
            variant="primary"
            size="sm"
            className="py-1 whitespace-nowrap md:py-2"
          >
            Kontakt ↗
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
          CV do pobrania ↗
        </a>
      </Container>
    </footer>
  );
}
