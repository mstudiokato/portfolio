"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { GalleryItem, GalleryImage } from "@/lib/content";
import {
  GALLERY_CATEGORIES,
  type GalleryCategorySlug,
} from "@/lib/gallery-categories";
import { Tag } from "@/components/ui/tag";
import { Lightbox } from "@/components/lightbox";

/**
 * „Pozostałe prace" na /projekty: poziome filtry kategorii (chipy design-systemu,
 * active = lime fill) + bloki galerii. Filtrowanie po stronie klienta (płynne,
 * bez przeładowania). Jeden blok = jeden wpis kolekcji Galerie: nagłówek
 * (klient + rok) → masonry zdjęć w oryginalnych proporcjach → opis → separator.
 * Kliknięcie zdjęcia otwiera Lightbox (zakres nawigacji = zdjęcia danego bloku).
 */

type Filter = GalleryCategorySlug | "all";

/** Placeholderowe proporcje (gdy brak realnego pliku) — pokazują różne kadry. */
const PLACEHOLDER_ASPECTS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

function GalleryImg({ image, index }: { image: GalleryImage; index: number }) {
  if (image.exists) {
    // Oryginalne proporcje, bez kadrowania (w-full h-auto), lazy.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="h-auto w-full"
      />
    );
  }
  return (
    <div
      className={cn(
        "bg-section flex items-center justify-center p-2 text-center",
        PLACEHOLDER_ASPECTS[index % PLACEHOLDER_ASPECTS.length],
      )}
    >
      <span className="text-caption text-muted">{image.alt || "zdjęcie"}</span>
    </div>
  );
}

function GalleryBlock({ item }: { item: GalleryItem }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <article className="py-10 first:pt-0">
      {/* Nagłówek: klient (bold) + rok po prawej. */}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-h4 text-ink font-semibold">
          {item.title}
        </h3>
        {item.year ? (
          <span className="text-caption text-muted shrink-0">{item.year}</span>
        ) : null}
      </div>

      {/* Masonry: 4 kolumny desktop / 2 mobile, naturalne proporcje, bez kadru. */}
      <div className="mt-5 columns-2 gap-3 lg:columns-4">
        {item.images.map((img, i) => (
          <button
            key={img.src || i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Powiększ: ${img.alt || item.title}`}
            className="border-border rounded-card mb-3 block w-full break-inside-avoid overflow-hidden border transition-opacity hover:opacity-90"
          >
            <GalleryImg image={img} index={i} />
          </button>
        ))}
      </div>

      {/* Opis. */}
      {item.description ? (
        <p className="text-muted text-body mt-5 max-w-2xl">
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
  const [active, setActive] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {/* Filtry — chipy design-systemu (pill, active = lime fill). */}
      <nav aria-label="Filtruj pozostałe prace po kategorii">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Tag
              onClick={() => setActive("all")}
              active={active === "all"}
              aria-pressed={active === "all"}
              className="uppercase"
            >
              Wszystkie
            </Tag>
          </li>
          {GALLERY_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Tag
                onClick={() => setActive(c.slug)}
                active={active === c.slug}
                aria-pressed={active === c.slug}
                className="uppercase"
              >
                {c.label}
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
