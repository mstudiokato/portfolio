"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { GalleryItem, GalleryImage } from "@/lib/content";
import {
  GALLERY_CATEGORIES,
  type GalleryCategorySlug,
} from "@/lib/gallery-categories";
import { Tag } from "@/components/ui/tag";
import { Lightbox } from "@/components/lightbox";

/**
 * „Pozostałe prace" na /projekty: poziome filtry kategorii (chipy design-systemu,
 * active = lime fill; domyślnie LOGO) + bloki galerii. Filtrowanie po stronie
 * klienta (płynne, bez przeładowania). Jeden blok = wpis kolekcji Galerie:
 * nagłówek (KLIENT + nazwa | Data realizacji + rok) → poziomy, przewijalny rząd
 * zdjęć (stała wysokość, oryginalne proporcje, scroll-snap) → opis. Kliknięcie
 * zdjęcia otwiera Lightbox (zakres nawigacji = zdjęcia danego bloku).
 */

// Kolejność chipów filtrów (P3) — LOGO pierwszy i domyślnie aktywny.
const FILTER_ORDER: GalleryCategorySlug[] = [
  "logo",
  "social-media",
  "plakaty",
  "branding",
  "pozostale",
];
const labelOf = (slug: GalleryCategorySlug) =>
  GALLERY_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

// Placeholderowe proporcje (gdy brak realnego pliku) — różne kadry przy stałej wysokości.
const PLACEHOLDER_RATIOS = ["4 / 5", "1 / 1", "3 / 4", "4 / 3"];

function GalleryImg({ image, index }: { image: GalleryImage; index: number }) {
  if (image.exists) {
    // Stała wysokość, szerokość auto → oryginalne proporcje, bez kadrowania.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="h-[200px] w-auto lg:h-[280px]"
      />
    );
  }
  return (
    <div
      style={{
        aspectRatio: PLACEHOLDER_RATIOS[index % PLACEHOLDER_RATIOS.length],
      }}
      className="bg-section flex h-[200px] items-center justify-center p-3 text-center lg:h-[280px]"
    >
      <span className="text-caption text-muted">{image.alt || "zdjęcie"}</span>
    </div>
  );
}

function GalleryBlock({ item }: { item: GalleryItem }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // > 4 zdjęcia → poziomy scroll; ≤ 4 → statyczny rząd (G1).
  const scrollable = item.images.length > 4;

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
    <article className="py-7 first:pt-0">
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

      {/* Rząd zdjęć — poziomy scroll (>4) lub statyczny rząd (≤4) (P5/G1). */}
      <div className="relative mt-6">
        {scrollable ? (
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
          className={
            scrollable
              ? "no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto"
              : "flex flex-wrap gap-3"
          }
        >
          {item.images.map((img, i) => (
            <button
              key={img.src || i}
              type="button"
              data-gallery-item
              onClick={() => setOpenIndex(i)}
              aria-label={`Powiększ: ${img.alt || item.title}`}
              className="border-border rounded-card block shrink-0 snap-start overflow-hidden border transition-opacity hover:opacity-90"
            >
              <GalleryImg image={img} index={i} />
            </button>
          ))}
        </div>
      </div>

      {/* Opis (P4) — secondary, lekko mniejszy font niż body. */}
      {item.description ? (
        <p className="text-muted text-caption mt-5 max-w-2xl">
          {item.description}
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
  const [active, setActive] = useState<GalleryCategorySlug>("logo");
  const reduce = useReducedMotion();

  const filtered = items.filter((i) => i.category === active);

  return (
    <div>
      {/* Filtry — chipy design-systemu (pill, active = lime fill). Bez „Wszystkie". */}
      <nav aria-label="Filtruj pozostałe prace po kategorii">
        <ul className="flex flex-wrap gap-2">
          {FILTER_ORDER.map((slug) => (
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

      {/* Bloki — płynne przejście przy zmianie filtra, bez przeładowania. */}
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
                  <GalleryBlock key={item.slug} item={item} />
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
