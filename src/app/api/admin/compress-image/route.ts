import { NextResponse } from "next/server";
import sharp from "sharp";

/**
 * Kompresja obrazów dla panelu — przyjmuje plik (multipart/form-data, pole
 * „file"), zmniejsza wymiary do maxWidth, konwertuje do WebP i zwraca
 * skompresowany plik do pobrania. Keystatic 0.5 nie kompresuje uploadów
 * natywnie, więc workflow jest: tu skompresuj → pobierz WebP → wgraj w panelu
 * (Case Studies / Pozostałe projekty). Obsługiwane przez stronę /admin/compress.
 *
 * Endpoint sam nic nie zapisuje na dysku (czysta transformacja bajtów) — limit
 * rozmiaru i typu chroni przed nadużyciem.
 *
 * Body (multipart/form-data):
 *   - file     : plik obrazu (wymagany)
 *   - quality  : jakość WebP 40–95 (opcjonalnie, domyślnie 80)
 *   - maxWidth : maks. szerokość px 200–6000 (opcjonalnie, domyślnie 2400)
 */

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function clamp(n: number, min: number, max: number, fallback: number): number {
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

export async function POST(request: Request) {
  // Narzędzie panelu — niedostępne publicznie na produkcji (jak save-hero).
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Brak pliku (pole file)." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Plik nie jest obrazem." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Plik za duży (limit 25 MB)." },
      { status: 413 },
    );
  }

  const quality = clamp(Number(form.get("quality")), 40, 95, 80);
  const maxWidth = clamp(Number(form.get("maxWidth")), 200, 6000, 2400);

  const input = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  try {
    output = await sharp(input)
      .rotate() // respektuj orientację EXIF
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Nie udało się przetworzyć obrazu." },
      { status: 422 },
    );
  }

  // Nazwa wyjściowa: oryginalna baza + .webp.
  const base =
    (file.name || "obraz")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9._-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "obraz";

  // Buffer → Uint8Array dla Web Response (zgodne z BodyInit).
  return new NextResponse(new Uint8Array(output), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": `attachment; filename="${base}.webp"`,
      "Cache-Control": "no-store",
    },
  });
}
