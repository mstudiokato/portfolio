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
  ratio?: "3/2" | "original";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function ProjectImage({
  src,
  alt,
  ratio = "3/2",
  sizes = "100vw",
  priority = false,
  className,
}: Props) {
  const dims = src ? readDims(src) : null;

  // Brak pliku → placeholder-box (proporcja zależna od trybu).
  if (!dims) {
    return (
      <div
        className={cn(
          "bg-section border-border rounded-card flex items-center justify-center border p-3 text-center",
          ratio === "original" ? "aspect-[3/4]" : "aspect-[3/2]",
          className,
        )}
      >
        <span className="text-caption text-muted">{alt}</span>
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
        className={cn(
          "rounded-card border-border h-auto w-full border",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-card border-border relative aspect-[3/2] overflow-hidden border",
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
