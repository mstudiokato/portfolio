import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Zapis kadru hero (X/Y/zoom) do src/content/settings/site.json.
 * DOSTĘPNE TYLKO W DEVELOPMENT — w produkcji zwraca 404 (na hoście serverless
 * zapis do repo i tak nie miałby sensu). Używane przez HeroCropTool (dev).
 */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { positionX, positionY, scale } = (body ?? {}) as {
    positionX?: number;
    positionY?: number;
    scale?: number;
  };

  const file = path.join(process.cwd(), "src/content/settings/site.json");
  const json = JSON.parse(await fs.readFile(file, "utf8")) as {
    hero?: Record<string, unknown>;
  };
  json.hero = json.hero ?? {};

  // X/Y bez clampowania (FIX 1 — dozwolone poza 0–100, gradient pokrywa brak).
  if (Number.isFinite(positionX)) json.hero.positionX = Math.round(Number(positionX));
  if (Number.isFinite(positionY)) json.hero.positionY = Math.round(Number(positionY));
  // Scale trzymamy w sensownym zakresie 100–200%.
  if (Number.isFinite(scale)) json.hero.scale = clamp(Number(scale), 100, 200);

  await fs.writeFile(file, JSON.stringify(json, null, 2) + "\n", "utf8");

  return NextResponse.json({ ok: true, hero: json.hero });
}
