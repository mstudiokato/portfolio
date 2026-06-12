"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const MAX_FILES = 10;

// ── Design tokens (spójne z /brief, contact-form) ───────────────────────────────

const FIELD =
  "bg-surface border-border rounded-button text-ink placeholder:text-muted w-full border px-4 py-3 text-base focus-visible:border-lime focus:outline-none transition-colors";

const LABEL = "block text-xs font-semibold text-muted uppercase tracking-widest mb-2";

// ── Helpers ─────────────────────────────────────────────────────────────────────

function pluralFiles(n: number) {
  if (n === 1) return "1 plik";
  if (n >= 2 && n <= 4) return `${n} pliki`;
  return `${n} plików`;
}

// ── Szablon masterpromptu ────────────────────────────────────────────────────────

function buildMasterprompt(data: {
  url: string;
  notes: string;
  fileNames: string[];
}): string {
  const url = data.url.trim();
  const notes = data.notes.trim();
  const { fileNames } = data;

  const kontekst = [
    url ? `Strona klienta: ${url}` : "",
    notes ? `Informacje o kliencie:\n${notes}` : "Klient: [do uzupełnienia]",
  ]
    .filter(Boolean)
    .join("\n");

  const materialy =
    fileNames.length > 0
      ? `Załączone screenshoty do analizy: ${fileNames.join(", ")}
Przeanalizuj je pod kątem: obecnego stylu marki, kolorystyki, typografii, ogólnego klimatu. Użyj jako punktu wyjścia — zachowaj DNA marki, ale pokaż jak mogłoby wyglądać premium.`
      : "[brak screenshotów — bazuj na notatkach]";

  return `# MASTERPROMPT — Wizualizacja strony klienta

## Kontekst klienta
${kontekst}

## Cel wizualizacji
Stwórz wizualizację strony internetowej która pokazuje jak MOGŁABY wyglądać nowa strona tego klienta. Służy jako propozycja kierunku wizualnego do akceptacji — nie finalny projekt. Ma zachwycić klienta i skłonić go do pytania "kiedy zaczynamy?".

## Materiały referencyjne
${materialy}

## Design direction
Styl: nowoczesny, profesjonalny, dopasowany do branży klienta
Inspiracje: premium sports branding, editorial layouts, dopracowane systemy wizualne
Czego unikać bezwzględnie: generycznego SaaS looku, fioletowych gradientów AI, glassmorphismu, blobów 3D, przesadnego parallaxu, szablonowego wyglądu 2024/2025

## Kolorystyka
Dobierz paletę dopasowaną do branży i charakteru klienta.
Zasady:
- Użyj kulturowych palet inspirowanych konkretnym miejscem lub nastrojem
- Dodaj 2-3 nieoczekiwane akcenty które działają
- Jeden wyrazisty kolor jako akcent — nie dominanta
- Unikaj domyślnej palety Tailwind (gray-50, blue-500 itp.)
- Unikaj perfekcyjnie symetrycznych, "bezpiecznych" kombinacji

## Typografia
Mieszaj kultury designerskie — np. japoński minimalizm z europejskim editorialem.
Zasady:
- NIE używaj Inter jako głównej czcionki
- NIE używaj Poppins+Roboto combo
- NIE używaj tylko font-weight 400/600/800
- Użyj zmiennych fontów z dynamicznymi wagami
- Stwórz niestandardowe, ryzykowne pary czcionek z duszą

## Struktura strony
Hero z mocnym nagłówkiem i pojedynczym CTA →
O firmie/wartościach →
Usługi lub produkty →
Realizacje lub przykłady prac →
Opinie/social proof →
Kontakt

Layout — unikaj:
- grid grid-cols-3 gap-8 wszędzie
- Hero z tekstem idealnie na środku
- 3-kolumnowych sekcji features
- max-w-7xl dla każdego kontenera
- py-16/py-12 dla każdej sekcji

Layout — rób to zamiast:
- Bento box layouts, nieregularne siatki
- Elementy zachodzące na siebie organicznie
- Nieregularne marginesy i organiczna biała przestrzeń

## Humanizacja designu
Celowe niedoskonałości (20% designu):
- Nieregularne odstępy między sekcjami (1.75rem 2.1rem 2.3rem zamiast 2rem wszędzie)
- Lekko off-center wyrównanie tekstu (2-3%)
- Subtelne wariacje powtarzalnych elementów

Mikroanimacje 200-500ms z organicznym easingiem (cubic-bezier).
Hover effects z charakterem — nieoczekiwane ale subtelne.

## Wymagania techniczne
- Wszystko w 1 pliku HTML z wbudowanym CSS i JavaScript
- Favicon jako inline SVG
- Responsive, mobile-first
- Semantyczny HTML5, czyste klasy
- WCAG 2.1 basics
- Smooth scrolling, lazy loading
- Keyboard navigation

## Jakość wykonania
Daj z siebie wszystko — to ma być Twoje najlepsze dzieło.
Jakość która sprawi że designerzy Apple i Tesla powiedzą: wow.
To ma wyglądać jak projekt za kilka–kilkanaście tysięcy złotych, pokazujący klientowi "a gdyby twoja strona wyglądała tak?"`;
}

// ── Komponent ────────────────────────────────────────────────────────────────────

export function GeneratorForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [justGenerated, setJustGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileError, setFileError] = useState("");
  const justGeneratedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Miniaturki — obiektowe URL-e tworzone z plików (revoke przy zmianie).
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setThumbnailUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  // Sprzątanie timerów ("Gotowe ✓" / "Skopiowano ✓") przy odmontowaniu —
  // brak setState po unmount.
  useEffect(() => {
    return () => {
      if (justGeneratedTimer.current) clearTimeout(justGeneratedTimer.current);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const remaining = MAX_FILES - files.length;
    const allowed = selected.slice(0, remaining);
    if (selected.length > remaining) {
      setFileError(`Możesz dodać maks. ${MAX_FILES} plików łącznie (dodano ${allowed.length}).`);
    } else {
      setFileError("");
    }
    if (allowed.length > 0) setFiles((f) => [...f, ...allowed]);
    e.target.value = "";
  }

  function removeFile(i: number) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setFileError("");
  }

  function handleGenerate() {
    // Składanie promptu jest synchroniczne — generujemy natychmiast.
    // fileNames to same nazwy (prompt jest tekstowy); pliki Michał wrzuca
    // osobno do NanoBanana/Seedance.
    const prompt = buildMasterprompt({
      url,
      notes,
      fileNames: files.map((_, i) => `screenshot_${i + 1}.jpg`),
    });
    setOutput(prompt);
    // Wizualne potwierdzenie na przycisku przez 800ms — bez opóźniania generowania.
    setJustGenerated(true);
    if (justGeneratedTimer.current) clearTimeout(justGeneratedTimer.current);
    justGeneratedTimer.current = setTimeout(() => setJustGenerated(false), 800);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: zaznacz textarea, żeby Michał mógł skopiować ręcznie.
      outputRef.current?.select();
    }
  }

  function handleClearAll() {
    setFiles([]);
    setNotes("");
    setUrl("");
    setOutput("");
    setFileError("");
    setCopied(false);
  }

  const outputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      {/* Nagłówek */}
      <header className="mb-8 md:mb-12">
        <h1 className="font-display text-h2 text-ink">Preview Generator</h1>
        <p className="text-muted mt-2 text-base leading-relaxed">
          Złóż masterprompt do wizualizacji strony klienta
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Wejście ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          {/* Pole 1 — Screenshoty */}
          <div>
            <label className={LABEL}>Screenshoty klienta</label>
            <p className="text-muted mb-2 text-sm">
              Wrzuć co masz — strona, Instagram, wizytówka, cokolwiek
            </p>

            {files.length < MAX_FILES ? (
              <label
                htmlFor="pg-files"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border px-4 py-8 text-center transition-colors hover:border-muted"
              >
                <span className="text-2xl">📎</span>
                <span className="text-base text-ink">Kliknij żeby dodać pliki</span>
                <span className="text-sm text-muted">
                  JPG, PNG, GIF, WEBP — maks. {MAX_FILES} plików łącznie
                </span>
                <input
                  id="pg-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="sr-only"
                />
              </label>
            ) : null}

            {thumbnailUrls.length > 0 ? (
              <div className="mt-3">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {thumbnailUrls.map((u, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-card bg-surface"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt={`Screenshot ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Usuń plik ${i + 1}`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-xs text-ink transition-colors hover:bg-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">{pluralFiles(files.length)}</p>
              </div>
            ) : null}
            {fileError ? <p className="mt-1.5 text-sm text-red-400">{fileError}</p> : null}
          </div>

          {/* Pole 2 — Notatki */}
          <div>
            <label htmlFor="pg-notes" className={LABEL}>
              Co wiesz o kliencie
            </label>
            <textarea
              id="pg-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wklej tu wszystko co masz — tekst ze strony, opis z rozmowy, obserwacje, nazwa firmy, branża, co sprzedają, do kogo, jakie mają kolory, co Ci się podoba/nie podoba w ich obecnej stronie... im więcej tym lepiej, może być chaos"
              className={cn(FIELD, "min-h-[200px] resize-y")}
            />
          </div>

          {/* Pole 3 — URL */}
          <div>
            <label htmlFor="pg-url" className={LABEL}>
              Link do strony klienta (opcjonalnie)
            </label>
            <input
              id="pg-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... — tylko dla referencji, nie jest scrapowany"
              className={FIELD}
              inputMode="url"
            />
            <p className="text-muted mt-2 text-sm">
              Wklej jeśli masz — pojawi się w prompcie jako kontekst
            </p>
          </div>

          {/* Generuj */}
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full rounded-button bg-lime px-6 py-4 text-base font-semibold text-navy transition-opacity hover:opacity-90"
          >
            {justGenerated ? "Gotowe ✓" : "Generuj masterprompt"}
          </button>
        </section>

        {/* ── Wyjście ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <label htmlFor="pg-output" className={LABEL}>
            Wygenerowany masterprompt
          </label>
          <textarea
            id="pg-output"
            ref={outputRef}
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Tu pojawi się wygenerowany masterprompt…"
            spellCheck={false}
            className="w-full min-h-[400px] resize-y rounded-button border border-border bg-section px-4 py-3 font-mono text-[13px] leading-[1.6] text-ink placeholder:text-muted focus-visible:border-lime focus:outline-none"
          />

          {output ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-button bg-lime px-6 py-3 text-base font-semibold text-navy transition-opacity hover:opacity-90"
              >
                {copied ? "Skopiowano ✓" : "Kopiuj prompt"}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-button border border-border px-6 py-3 text-base text-ink transition-colors hover:border-muted"
              >
                Wyczyść wszystko
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
