import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Zapis ustawień hero (zdjęcie + kadr X/Y/zoom) do src/content/settings/site.json.
 * DOSTĘPNE TYLKO W DEVELOPMENT — w produkcji zwraca 404 (na hoście serverless
 * zapis do repo nie ma sensu; tam wartości ustawia się w panelu Keystatic).
 * Używane przez wizualny edytor /admin/hero-editor.
 *
 * Body: multipart/form-data
 *   - positionX, positionY, scale : liczby (string)
 *   - image (opcjonalnie)         : plik — zapisywany do /public, ustawia hero.image
 */

const PUBLIC_DIR = "public";
const SITE_JSON = "src/content/settings/site.json";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Bezpieczna nazwa pliku: tylko [a-z0-9._-], reszta → "-". Chroni przed wyjściem
// poza /public (path traversal) i znakami problematycznymi w URL.
function safeFileName(name: string): string {
  const base = path.basename(name).toLowerCase();
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "hero.jpg";
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = path.join(process.cwd(), SITE_JSON);
  const json = JSON.parse(await fs.readFile(file, "utf8")) as {
    hero?: Record<string, unknown>;
  };
  json.hero = json.hero ?? {};

  // Kadr: X/Y bez clampowania (dozwolone poza 0–100, gradient pokrywa brak),
  // zoom trzymany w sensownym zakresie 100–200%.
  const positionX = Number(form.get("positionX"));
  const positionY = Number(form.get("positionY"));
  const scale = Number(form.get("scale"));
  if (Number.isFinite(positionX)) json.hero.positionX = Math.round(positionX);
  if (Number.isFinite(positionY)) json.hero.positionY = Math.round(positionY);
  if (Number.isFinite(scale)) json.hero.scale = clamp(Math.round(scale), 100, 200);

  // Opcjonalny upload zdjęcia → zapis do /public, ustawienie hero.image.
  const image = form.get("image");
  let savedImage: string | undefined;
  if (image && typeof image !== "string" && image.size > 0) {
    const fileName = safeFileName(image.name);
    const bytes = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(path.join(process.cwd(), PUBLIC_DIR, fileName), bytes);
    savedImage = `/${fileName}`;
    json.hero.image = savedImage;
  }

  await fs.writeFile(file, JSON.stringify(json, null, 2) + "\n", "utf8");

  return NextResponse.json({ ok: true, hero: json.hero, savedImage });
}
