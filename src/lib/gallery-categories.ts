/**
 * Kategorie GALERII („Pozostałe prace" na /projekty) — osobne od kategorii
 * projektów case-study (lib/categories.ts). Moduł czysty (bez fs) — importowany
 * zarówno przez loader serwerowy (content.ts), jak i przez keystatic.config.ts.
 * Kolejność tablicy = kolejność accordionu na /projekty.
 */

export const GALLERY_CATEGORIES = [
  { slug: "social-media", label: "Social Media" },
  { slug: "logo", label: "Logo" },
  { slug: "plakaty", label: "Plakaty" },
  { slug: "branding", label: "Branding" },
  { slug: "pozostale", label: "Pozostałe projekty" },
] as const;

export type GalleryCategorySlug = (typeof GALLERY_CATEGORIES)[number]["slug"];

export const GALLERY_CATEGORY_SLUGS = GALLERY_CATEGORIES.map(
  (c) => c.slug,
) as GalleryCategorySlug[];

export function isGalleryCategorySlug(
  value: unknown,
): value is GalleryCategorySlug {
  return (
    typeof value === "string" &&
    GALLERY_CATEGORY_SLUGS.includes(value as GalleryCategorySlug)
  );
}

/** Domyślnie rozwinięta kategoria w accordionie. */
export const DEFAULT_OPEN_GALLERY: GalleryCategorySlug = "social-media";
