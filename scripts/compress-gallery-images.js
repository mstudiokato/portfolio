/**
 * Kompresja obrazów w public/galerie/
 * - .jpg/.jpeg > 300 KB → jakość 82, progressive, max 2400px
 * - .png > 300 KB bez alpha → konwersja na .jpg jakość 94, max 2400px; usuwa stary .png
 * - .png > 300 KB z alpha → kompresja jako .png (bez konwersji)
 * Aktualizuje referencje .png→.jpg w src/content/ (MDX frontmatter / YAML).
 */

import { readFileSync, writeFileSync, unlinkSync, statSync, readdirSync } from "node:fs";
import { join, extname, dirname, relative, basename } from "node:path";
import sharp from "sharp";
import { createRequire } from "node:module";

const __dirname = new URL(".", import.meta.url).pathname;
const ROOT = join(__dirname, "..");
const GALLERY_DIR = join(ROOT, "public", "galerie");
const CONTENT_DIR = join(ROOT, "src", "content");
const SIZE_THRESHOLD = 300 * 1024; // 300 KB
const MAX_WIDTH = 2400;

// ── Helpers ─────────────────────────────────────────────────────────────────

function humanSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function walk(dir, result = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, result);
    else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) result.push(full);
  }
  return result;
}

// ── Zbierz pliki ─────────────────────────────────────────────────────────────

const allImages = walk(GALLERY_DIR);
const toProcess = allImages.filter((f) => statSync(f).size > SIZE_THRESHOLD);

console.log(`\n📂 Galeria: ${allImages.length} plików obrazów, ${toProcess.length} > 300 KB\n`);

// ── Kompresja ────────────────────────────────────────────────────────────────

const report = [];    // { file, oldSize, newSize, action }
const renames = [];   // { oldPath, newPath } — do aktualizacji MDX

for (const filePath of toProcess) {
  const ext = extname(filePath).toLowerCase();
  const oldSize = statSync(filePath).size;
  const img = sharp(filePath);
  const meta = await img.metadata();

  // Resize jeśli szerszy niż MAX_WIDTH
  const needsResize = meta.width && meta.width > MAX_WIDTH;
  const pipeline = needsResize
    ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : img;

  let action, outPath;

  if (ext === ".png") {
    const hasAlpha = meta.channels === 4 || meta.hasAlpha;
    if (hasAlpha) {
      // Alpha → zostaw jako PNG (tylko kompresja)
      action = "png→png (alpha)";
      outPath = filePath;
      await pipeline
        .png({ compressionLevel: 9, palette: false })
        .toBuffer()
        .then((buf) => writeFileSync(outPath, buf));
    } else {
      // Brak alpha → konwertuj na .jpg
      action = "png→jpg";
      outPath = filePath.replace(/\.png$/i, ".jpg");
      await pipeline
        .jpeg({ quality: 94, progressive: true })
        .toFile(outPath);
      unlinkSync(filePath);
      renames.push({
        oldPath: filePath,
        newPath: outPath,
      });
    }
  } else {
    // .jpg/.jpeg
    action = "jpg→jpg";
    outPath = filePath;
    await pipeline
      .jpeg({ quality: 82, progressive: true })
      .toBuffer()
      .then((buf) => writeFileSync(outPath, buf));
  }

  const newSize = statSync(outPath).size;
  const saved = oldSize - newSize;
  const pct = ((saved / oldSize) * 100).toFixed(1);
  const rel = relative(GALLERY_DIR, filePath);

  report.push({ rel, oldSize, newSize, saved, pct, action });
  console.log(`  ${action.padEnd(16)} ${humanSize(oldSize).padStart(8)} → ${humanSize(newSize).padStart(8)}  (−${pct}%)  ${rel}`);
}

// ── Aktualizacja referencji MDX/YAML ─────────────────────────────────────────

if (renames.length > 0) {
  console.log(`\n🔗 Aktualizacja referencji .png→.jpg w src/content/ (${renames.length} pliku/-ów)...\n`);

  // Zbierz wszystkie pliki tekstowe w content
  function walkContent(dir, result = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walkContent(full, result);
      else if (/\.(mdx?|yaml|yml|json)$/i.test(entry.name)) result.push(full);
    }
    return result;
  }

  const contentFiles = walkContent(CONTENT_DIR);
  let updatedFiles = 0;

  for (const rename of renames) {
    // Ścieżka publiczna (z /public prefix → /galerie/...)
    const oldPublic = "/" + relative(join(ROOT, "public"), rename.oldPath).replace(/\\/g, "/");
    const newPublic = "/" + relative(join(ROOT, "public"), rename.newPath).replace(/\\/g, "/");

    for (const cf of contentFiles) {
      let src = readFileSync(cf, "utf8");
      if (src.includes(oldPublic)) {
        src = src.replaceAll(oldPublic, newPublic);
        writeFileSync(cf, src);
        updatedFiles++;
        console.log(`  ✏️  ${relative(ROOT, cf)}: ${basename(rename.oldPath)} → ${basename(rename.newPath)}`);
      }
    }
  }

  if (updatedFiles === 0) console.log("  ℹ️  Brak referencji do zaktualizowania.");
}

// ── Raport końcowy ───────────────────────────────────────────────────────────

const totalOld = report.reduce((s, r) => s + r.oldSize, 0);
const totalNew = report.reduce((s, r) => s + r.newSize, 0);
const totalSaved = totalOld - totalNew;

console.log("\n" + "─".repeat(70));
console.log("📊 RAPORT KOŃCOWY");
console.log("─".repeat(70));

// Top 10 wg oszczędności
const top10 = [...report].sort((a, b) => b.saved - a.saved).slice(0, 10);
console.log("\nTop 10 plików wg oszczędności:");
for (const r of top10) {
  console.log(`  ${humanSize(r.oldSize).padStart(8)} → ${humanSize(r.newSize).padStart(8)}  (−${r.pct}%)  ${r.rel}`);
}

const alphaPngs = report.filter((r) => r.action === "png→png (alpha)");
if (alphaPngs.length > 0) {
  console.log(`\n⚠️  Pliki PNG z kanałem alpha (nie konwertowano na JPG):`);
  for (const r of alphaPngs) console.log(`  ${r.rel}`);
}

console.log(`\n✅ Łącznie: ${report.length} plików`);
console.log(`   Przed:   ${humanSize(totalOld)}`);
console.log(`   Po:      ${humanSize(totalNew)}`);
console.log(`   Zaoszczędzono: ${humanSize(totalSaved)} (${((totalSaved / totalOld) * 100).toFixed(1)}%)\n`);
