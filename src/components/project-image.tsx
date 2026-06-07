import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Obraz projektu z next/image. Gdy plik istnieje w /public — renderuje
 * zoptymalizowany Image (ratio "3/2" = kadr cover; "original" = proporcje pliku
 * odczytane przez image-size). Gdy pliku brak — placeholder-box (build nie pada,
 * podgląd layoutu działa bez realnych grafik).
 */

function readDims(src: string): { width: number; height: number } | null {
  try {
    const fp = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    if (!fs.existsSync(fp)) return null;
    const { width, height } = imageSize(fs.readFileSync(fp));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

type Props = {
  src: string;
  alt: string;
  /** "3/2" = kadr cover · "original" = proporcje pliku · "strip" = stała
   *  wysokość + naturalna szerokość (slider) · "fixed" = stała wysokość +
   *  pełna szerokość komórki (grid), object-cover. */
  ratio?: "3/2" | "original" | "strip" | "fixed";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Jednolita, STAŁA wysokość galerii na całej stronie: 280px mobile / 420px desktop. */
const GALLERY_H = "h-[280px] lg:h-[420px]";

export function ProjectImage({
  src,
  alt,
  ratio = "3/2",
  sizes = "100vw",
  priority = false,
  className,
}: Props) {
  const dims = src ? readDims(src) : null;

  // Brak pliku → placeholder-box (proporcja/wymiar zależny od trybu).
  if (!dims) {
    if (ratio === "strip") {
      return (
        <div
          className={cn(
            "bg-section rounded-card flex w-72 shrink-0 items-center justify-center p-3 text-center",
            GALLERY_H,
            className,
          )}
        >
          <span className="text-caption text-muted">{alt}</span>
        </div>
      );
    }
    if (ratio === "fixed") {
      return (
        <div
          className={cn(
            "bg-section rounded-card flex w-full items-center justify-center p-3 text-center",
            GALLERY_H,
            className,
          )}
        >
          <span className="text-caption text-muted">{alt}</span>
        </div>
      );
    }
    return (
      <div
        className={cn(
          "bg-section rounded-card flex items-center justify-center p-3 text-center",
          ratio === "original" ? "aspect-[3/4]" : "aspect-[3/2]",
          className,
        )}
      >
        <span className="text-caption text-muted">{alt}</span>
      </div>
    );
  }

  // Strip: STAŁA wysokość, szerokość z proporcji pliku (w-auto), object-cover —
  // do slidera (poziomy scroll). Wszystkie kafle tej samej wysokości.
  if (ratio === "strip") {
    return (
      <Image
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        sizes={sizes}
        priority={priority}
        className={cn("rounded-card w-auto object-cover", GALLERY_H, className)}
      />
    );
  }

  // Fixed: STAŁA wysokość + pełna szerokość komórki, object-cover (kadruje) —
  // do gridów 1–3 kolumn. Spójna wysokość z trybem strip.
  if (ratio === "fixed") {
    return (
      <div
        className={cn(
          "rounded-card relative w-full overflow-hidden",
          GALLERY_H,
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  if (ratio === "original") {
    return (
      <Image
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        sizes={sizes}
        priority={priority}
        className={cn("rounded-card h-auto w-full", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-card relative aspect-[3/2] overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
