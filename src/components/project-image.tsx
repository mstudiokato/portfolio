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
  /** "3/2" = kadr cover · "original" = proporcje pliku · "strip" = jednolita
   *  wysokość + naturalna szerokość (do poziomych galerii ze scrollem). */
  ratio?: "3/2" | "original" | "strip";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Jednolita wysokość zdjęć w galeriach (spójnie: slider / masonry / grid). */
const STRIP_H = "h-56 lg:h-72";

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
            STRIP_H,
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

  // Strip: stała wysokość, szerokość z proporcji pliku (w-auto) → bez przycięcia,
  // szersze zdjęcia po prostu zajmują więcej miejsca i scrollują się w rzędzie.
  if (ratio === "strip") {
    return (
      <Image
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        sizes={sizes}
        priority={priority}
        className={cn("rounded-card w-auto object-cover", STRIP_H, className)}
      />
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
