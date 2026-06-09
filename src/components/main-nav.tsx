"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { LinkedinIcon } from "@/components/linkedin-icon";

/**
 * Główna nawigacja (N1, N2). Aktywny link dostaje limonkowe podkreślenie
 * (border-bottom 2px), na desktopie podkreślenie pojawia się też na hover.
 *
 * Na mobile (< lg): hamburgera + bottom sheet z linkami i LinkedIn.
 * Na lg+: klasyczna pozioma nawigacja; hamburger i sheet ukryte.
 *
 * WAŻNE: bottom sheet i backdrop renderowane przez createPortal do document.body
 * — omija stacking context tworzony przez backdrop-filter: blur() na <header>,
 * który łamie position:fixed u dzieci (fixed byłoby relative do headera,
 * nie do viewportu).
 */

type NavItem = { label: string; href: string; sectionId?: string };

const NAV: NavItem[] = [
  { label: "Portfolio", href: "/projekty" },
  { label: "Co projektuję", href: "/#specjalizacje", sectionId: "specjalizacje" },
  {
    label: "Rekomendacje",
    href: "/#opinie-klientow",
    sectionId: "opinie-klientow",
  },
  { label: "Kontakt", href: "/#kontakt", sectionId: "kontakt" },
];

export function MainNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Portal wymaga document.body — dostępne tylko po montażu (nie na serwerze).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Zamknij menu klawiszem Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Zablokuj scroll body gdy menu otwarte
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!onHome) {
      setActiveSection(null);
      return;
    }
    const ids = NAV.map((n) => n.sectionId).filter(Boolean) as string[];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  function isActive(item: NavItem): boolean {
    if (!item.sectionId) return pathname.startsWith("/projekty");
    return onHome && activeSection === item.sectionId;
  }

  return (
    <>
      {/* ── Desktop nav (lg+) ─────────────────────────────────────────── */}
      <nav aria-label="Główna nawigacja" className="hidden lg:block">
        <ul className="text-caption text-ink flex items-center gap-7 tracking-wide uppercase">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "hover:border-lime inline-block border-b-2 border-transparent pb-1 font-medium transition-colors",
                    active && "border-lime",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Hamburger button (mobile < lg) ────────────────────────────── */}
      <button
        className="text-ink hover:text-lime p-1 transition-colors lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Otwórz menu nawigacji"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Menu size={24} />
      </button>

      {/* ── Mobile bottom sheet — portal do body (fix: backdrop-filter
          na <header> łamie position:fixed u dzieci) ─────────────────── */}
      {open && mounted &&
        createPortal(
          <>
            {/* Backdrop — klik zamyka */}
            <div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu nawigacji"
              className="bg-navy border-border fixed right-0 bottom-0 left-0 z-[70] rounded-t-2xl border-t px-6 pt-6 pb-10"
            >
              {/* Nagłówek sheetu */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-muted text-caption uppercase tracking-wide">
                  Menu
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-ink hover:text-lime p-1 transition-colors"
                  aria-label="Zamknij menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Linki nawigacyjne */}
              <nav aria-label="Menu mobilne">
                <ul className="flex flex-col">
                  {NAV.map((item) => {
                    const active = isActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "font-display block py-3 text-2xl font-semibold tracking-tight transition-colors",
                            active
                              ? "text-lime"
                              : "text-ink hover:text-lime",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* LinkedIn na dole sheetu */}
              <div className="border-border mt-8 border-t pt-6">
                <a
                  href="https://www.linkedin.com/in/michal-stezaly/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn — Michał Stężały"
                  className="text-ink hover:text-lime flex items-center gap-3 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LinkedinIcon size={20} />
                  <span className="text-caption font-medium uppercase tracking-wide">
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
