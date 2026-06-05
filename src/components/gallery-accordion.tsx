"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { GalleryItem, GalleryImage } from "@/lib/content";
import {
  type GalleryCategorySlug,
  DEFAULT_OPEN_GALLERY,
} from "@/lib/gallery-categories";

/**
 * Accordion „Pozostałe prace" na /projekty. Każda kategoria = klikalny nagłówek
 * (nazwa + liczba wpisów + strzałka) i rozwijana siatka mini-projektów.
 * Rozwijanie: CSS grid-rows 0fr↔1fr (płynne, bez magicznego max-height, bez CLS
 * — zmiana następuje po interakcji użytkownika). Domyślnie otwarta: Social Media.
 */

export type GalleryGroup = {
  slug: GalleryCategorySlug;
  label: string;
  items: GalleryItem[];
};

/** Placeholderowe proporcje (gdy brak realnego pliku) — pokazują, że kadry NIE są 3:2. */
const PLACEHOLDER_ASPECTS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
];

function GalleryImg({ image, index }: { image: GalleryImage; index: number }) {
  if (image.exists) {
    // Realne grafiki: oryginalne proporcje (w-full h-auto), bez kadrowania do 3:2.
    // next/image wymaga znanych wymiarów/fill (kadrowanie) — tu świadomie <img>,
    // bo zdjęcia mają różne proporcje, a są lazy i poniżej zwiniętego accordionu.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="border-border rounded-card h-auto w-full border"
      />
    );
  }
  // Placeholder — box w zmiennej proporcji z altem (build-safe, brak broken-image).
  return (
    <div
      className={cn(
        "bg-section border-border rounded-card flex items-center justify-center border p-2 text-center",
        PLACEHOLDER_ASPECTS[index % PLACEHOLDER_ASPECTS.length],
      )}
    >
      <span className="text-caption text-muted">{image.alt || "zdjęcie"}</span>
    </div>
  );
}

function MiniProject({ item }: { item: GalleryItem }) {
  return (
    <article className="flex flex-col gap-4">
      <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {item.images.map((img, i) => (
          <GalleryImg key={img.src || i} image={img} index={i} />
        ))}
      </div>
      <div>
        <h4 className="font-display text-h4 text-ink font-semibold">
          {item.title}
        </h4>
        {item.description ? (
          <p className="text-muted text-body mt-1 max-w-2xl">
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "text-muted shrink-0 transition-transform duration-300",
        open && "text-lime rotate-180",
      )}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function GalleryAccordion({ groups }: { groups: GalleryGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    [DEFAULT_OPEN_GALLERY]: true,
  });

  function toggle(slug: string) {
    setOpen((s) => ({ ...s, [slug]: !s[slug] }));
  }

  return (
    <div className="border-border border-t">
      {groups.map((group) => {
        const isOpen = Boolean(open[group.slug]);
        const panelId = `galeria-${group.slug}`;
        return (
          <div key={group.slug} className="border-border border-b">
            <h3>
              <button
                type="button"
                onClick={() => toggle(group.slug)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="font-display text-h4 text-ink flex items-baseline gap-3">
                  {group.label}
                  <span className="text-muted text-body font-normal">
                    {group.items.length}
                  </span>
                </span>
                <Chevron open={isOpen} />
              </button>
            </h3>

            <div
              id={panelId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                {group.items.length > 0 ? (
                  <div className="flex flex-col gap-12 pb-10">
                    {group.items.map((item) => (
                      <MiniProject key={item.slug} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-body pb-10">
                    Wkrótce — wpisy w przygotowaniu.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
