"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { ImageRef } from "@/lib/content";
import { Lightbox, type LightboxImage } from "@/components/lightbox";
import { GallerySlider } from "@/components/gallery-slider";

const GALLERY_H = "h-[280px] lg:h-[420px]";

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function toLight(images: ImageRef[]): LightboxImage[] {
  return images.map((img) => ({ src: img.src, alt: img.alt, exists: true }));
}

export function ProjectGalleryClient({ images }: { images: ImageRef[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const count = images.length;
  if (count === 0) return null;

  return (
    <>
      {count >= 4 ? (
        // Slider: stała wysokość, naturalna szerokość, poziomy scroll.
        <GallerySlider>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              data-gallery-item
              onClick={() => setOpenIndex(i)}
              aria-label={`Powiększ: ${img.alt}`}
              className="block shrink-0 snap-start overflow-hidden rounded-card transition-opacity hover:opacity-90"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={cn(GALLERY_H, "w-auto object-cover")}
              />
            </button>
          ))}
        </GallerySlider>
      ) : (
        // Grid 1–3 kolumn: naturalne proporcje (bez kadrowania), klikalne.
        <div className={cn("grid gap-3", GRID_COLS[count])}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Powiększ: ${img.alt}`}
              className="block overflow-hidden rounded-card transition-opacity hover:opacity-90"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-auto w-full"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null ? (
          <Lightbox
            images={toLight(images)}
            startIndex={openIndex}
            onClose={() => setOpenIndex(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
