"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Główna nawigacja (N1, N2). Aktywny link dostaje limonkowe podkreślenie
 * (border-bottom 2px), na desktopie podkreślenie pojawia się też na hover.
 * Aktywność: trasa /projekty wg usePathname; linki sekcji (#…) przez scroll-spy
 * (IntersectionObserver) na stronie głównej. Sekcje O MNIE / KLIENCI / PROCES
 * nie istnieją — nie ma ich w menu.
 */

type NavItem = { label: string; href: string; sectionId?: string };

const NAV: NavItem[] = [
  { label: "Projekty", href: "/projekty" },
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

    // Wąskie pasmo w środku ekranu — sekcja je przecinająca jest „aktywna".
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
    <nav aria-label="Główna nawigacja" className="hidden lg:block">
      <ul className="text-caption text-ink flex items-center gap-7 tracking-wide uppercase">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                // Jednolity styl: off-white, medium. Aktywny = tylko limonkowe
                // podkreślenie (tekst koloru NIE zmienia); hover dokłada podkreślenie.
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
  );
}
