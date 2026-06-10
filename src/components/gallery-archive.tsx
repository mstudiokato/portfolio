"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { GalleryItem, GalleryImage } from "@/lib/content";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_SLUGS,
  type GalleryCategorySlug,
} from "@/lib/gallery-categories";
import { Tag } from "@/components/ui/tag";
import { Lightbox } from "@/components/lightbox";
import { textColorHex } from "@/lib/text-color";
import { replaceWidows } from "@/lib/text";

/**
 * „Pozostałe prace" na /projekty: poziome filtry kategorii (chipy design-systemu,
 * active = lime fill; domyślnie LOGO) + bloki galerii. Filtrowanie po stronie
 * klienta (płynne, bez przeładowania). Jeden blok = wpis kolekcji Galerie:
 * nagłówek (KLIENT + nazwa | Data realizacji + rok) → poziomy, przewijalny rząd
 * zdjęć (stała wysokość, oryginalne proporcje, scroll-snap) → opis. Kliknięcie
 * zdjęcia otwiera Lightbox (zakres nawigacji = zdjęcia danego bloku).
 */

// Kanoniczna kolejność chipów filtrów = kolejność wspólnej listy kategorii
// (GALLERY_CATEGORIES === CATEGORIES). Na stronie pokazujemy tylko te, w których
// faktycznie są prace (patrz GalleryArchive) — bez pustych chipów.
const FILTER_ORDER: GalleryCategorySlug[] = GALLERY_CATEGORY_SLUGS;
const labelOf = (slug: GalleryCategorySlug) =>
  GALLERY_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

// STAŁA wysokość galerii na całej stronie: 280px mobile / 420px desktop.
const GALLERY_H = "h-[280px] lg:h-[420px]";

// Strip: stała wysokość, naturalna szerokość — do slidera (poziomy scroll).
function GalleryImg({ image }: { image: GalleryImage }) {
  if (image.exists) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className={cn(GALLERY_H, "w-auto object-cover")}
      />
    );
  }
  return (
    <div
      className={cn(
        GALLERY_H,
        "bg-section flex w-72 items-center justify-center p-3 text-center",
      )}
    >
      <span className="text-caption text-muted">{image.alt || "zdjęcie"}</span>
    </div>
  );
}

// Grid: stała wysokość + pełna szerokość komórki, object-cover (kadruje).
function GalleryImgGrid({ image }: { image: GalleryImage }) {
  if (image.exists) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className={cn(GALLERY_H, "w-full object-cover")}
      />
    );
  }
  return (
    <div
      className={cn(
        GALLERY_H,
        "bg-section flex w-full items-center justify-center p-3 text-center",
      )}
    >
      <span className="text-caption text-muted">{image.alt || "zdjęcie"}</span>
    </div>
  );
}

// Liczba kolumn → klasa Tailwind (statyczna, by JIT jej nie zgubił). 1–3 kolumny.
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function GalleryBlock({ item }: { item: GalleryItem }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Logika układu (spójna z galerią na podstronach projektów), STAŁA wysokość:
  //  - 1 → pełna szerokość, 2–3 → grid-cols-{n}; 4+ → slider ze strzałkami.
  const count = item.images.length;
  const useSlider = count >= 4;
  const gridClass = GRID_COLS[count] ?? "grid-cols-3";
  // Strzałki tylko w trybie slidera.
  const showNav = useSlider;

  // Strzałka przewija dokładnie o jedno zdjęcie (do następnej/poprzedniej kafli).
  function scrollOne(dir: number) {
    const el = scrollRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-gallery-item]"),
    );
    const cur = el.scrollLeft;
    const target =
      dir > 0
        ? items.find((it) => it.offsetLeft > cur + 1)
        : [...items].reverse().find((it) => it.offsetLeft < cur - 1);
    el.scrollTo({
      left: target ? target.offsetLeft : dir > 0 ? el.scrollWidth : 0,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  const NAV =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy/70 text-ink text-xl backdrop-blur transition-colors hover:bg-navy sm:flex";

  return (
    <article>
      {/* Nagłówek bloku (P4): KLIENT + nazwa po lewej, data po prawej. */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-lime text-navy text-label rounded-button px-2 py-1 uppercase">
            Klient
          </span>
          <h3 className="font-display text-h4 text-ink font-semibold">
            {item.title}
          </h3>
        </div>
        {/* D1 — „Data realizacji" limonkowy label + rok w tej samej linii i wielkości. */}
        {item.year ? (
          <div className="flex shrink-0 items-baseline gap-2">
            <span className="text-label text-lime uppercase">
              Data realizacji
            </span>
            <span className="text-label text-ink font-semibold">
              {item.year}
            </span>
          </div>
        ) : null}
      </div>

      {useSlider ? (
        /* SLIDER — jednolita wysokość, poziomy scroll, scroll-snap, strzałki.
           Dla 3 poziomych lub 5+ zdjęć. */
        <div className="relative mt-6">
          {showNav ? (
            <>
              <button
                type="button"
                onClick={() => scrollOne(-1)}
                aria-label="Przewiń w lewo"
                className={`${NAV} left-1`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollOne(1)}
                aria-label="Przewiń w prawo"
                className={`${NAV} right-1`}
              >
                ›
              </button>
            </>
          ) : null}

          <div
            ref={scrollRef}
            className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto"
          >
            {item.images.map((img, i) => (
              <button
                key={img.src || i}
                type="button"
                data-gallery-item
                onClick={() => setOpenIndex(i)}
                aria-label={`Powiększ: ${img.alt || item.title}`}
                className="block shrink-0 snap-start overflow-hidden rounded-none transition-opacity hover:opacity-90"
              >
                <GalleryImg image={img} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* GRID — naturalne proporcje, bez slidera. 1/2/3 kolumny (4 → 2/4). */
        <div className={cn("mt-6 grid gap-3", gridClass)}>
          {item.images.map((img, i) => (
            <button
              key={img.src || i}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Powiększ: ${img.alt || item.title}`}
              className="block overflow-hidden rounded-none transition-opacity hover:opacity-90"
            >
              <GalleryImgGrid image={img} />
            </button>
          ))}
        </div>
      )}

      {/* Opis pod galerią — czytelny rozmiar (text-base), kolor z panelu
          (domyślnie biały #F5F7FA). Ukrywany, gdy odznaczono „Pokaż opis…". */}
      {item.description && item.showDescription ? (
        <p
          // Szerszy kontener (max-w-4xl) + mniejszy font na mobile (text-sm),
          // by pojedyncze zdanie mieściło się w jednej linii tam gdzie to możliwe.
          className="mt-5 max-w-4xl text-base lg:text-[1.125rem]"
          style={{ color: textColorHex(item.descriptionColor) }}
        >
          {replaceWidows(item.description)}
        </p>
      ) : null}

      <AnimatePresence>
        {openIndex !== null ? (
          <Lightbox
            images={item.images}
            startIndex={openIndex}
            onClose={() => setOpenIndex(null)}
          />
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export function GalleryArchive({ items }: { items: GalleryItem[] }) {
  // Pokazujemy tylko kategorie, w których są prace (kanoniczna kolejność).
  const presentCategories = FILTER_ORDER.filter((slug) =>
    items.some((i) => i.category === slug),
  );
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Aktywny filtr trzymany w URL (?kategoria=<slug>) zamiast lokalnego stanu —
  // odświeżenie strony i linki bezpośrednie (/projekty?kategoria=plakaty)
  // zachowują wybór. Brak/niepoprawny param → pierwsza dostępna kategoria.
  const defaultCategory: GalleryCategorySlug =
    presentCategories[0] ?? "social-media";
  const param = searchParams.get("kategoria");
  const active: GalleryCategorySlug =
    param && (presentCategories as readonly string[]).includes(param)
      ? (param as GalleryCategorySlug)
      : defaultCategory;

  // Klik filtra → zapis do URL (shallow, bez przeładowania; bez skoku scrolla).
  const setActive = (slug: GalleryCategorySlug) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("kategoria", slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = items.filter((i) => i.category === active);

  // ── Scroll-reveal per-item ─────────────────────────────────────────────
  // whileInView na KAŻDYM kaflu osobno — każdy triggeruje animację gdy sam
  // wchodzi w viewport. Poprzednia wersja (whileInView na kontenerze +
  // staggerChildren) odpalała animację raz przy wejściu kontenera → tylko
  // pierwsze kafle były widoczne w tym momencie, reszta bez animacji.
  // Stagger usunięty — przy per-item podejściu efekt naturalnego cascade
  // wynika ze scroll velocity, bez potrzeby sztucznego opóźnienia.
  const revealInitial = { opacity: reduce ? 1 : 0, y: reduce ? 0 : 30 };
  const revealAnimate = { opacity: 1, y: 0 };
  const revealTransition = {
    duration: reduce ? 0 : 0.45,
    ease: "easeOut" as const,
  };

  return (
    <div>
      {/* Filtry — chipy design-systemu (pill, active = lime fill). Bez „Wszystkie". */}
      <nav aria-label="Filtruj pozostałe prace po kategorii">
        <ul className="flex flex-wrap gap-2">
          {presentCategories.map((slug) => (
            <li key={slug}>
              <Tag
                onClick={() => setActive(slug)}
                active={active === slug}
                aria-pressed={active === slug}
                className="uppercase"
              >
                {labelOf(slug)}
              </Tag>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bloki — płynne przejście przy zmianie filtra + scroll-reveal fade-up. */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            {filtered.length > 0 ? (
              <div className="divide-border divide-y">
                {filtered.map((item) => (
                  <motion.div
                    key={item.slug}
                    className="py-8 md:py-12 first:pt-0"
                    initial={revealInitial}
                    whileInView={revealAnimate}
                    transition={revealTransition}
                    viewport={{ once: false, margin: "-80px", amount: 0.2 }}
                  >
                    <GalleryBlock item={item} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-body py-10">
                Brak prac w tej kategorii.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
