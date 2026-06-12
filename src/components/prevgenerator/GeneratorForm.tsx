"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// ── Design tokens (spójne z /brief, contact-form) ───────────────────────────────

const FIELD =
  "bg-surface border-border rounded-button text-ink placeholder:text-muted w-full border px-4 py-3 text-base focus-visible:border-lime focus:outline-none transition-colors";

const LABEL = "block text-xs font-semibold text-muted uppercase tracking-widest mb-2";

// ── Szablon promptu dla LLM ─────────────────────────────────────────────────────
// Generator nie produkuje masterpromptu bezpośrednio — produkuje prompt dla LLM
// (Claude Opus lub inny), który Michał wkleja razem ze screenshotami klienta.
// LLM analizuje dane i pisze gotowy masterprompt do narzędzia generującego strony.

function buildOpusPrompt(data: { url: string; notes: string }): string {
  const url = data.url.trim();
  const notes = data.notes.trim();

  return `Jesteś doświadczonym Senior Graphic Designerem z 15-letnim doświadczeniem w brandingu i projektowaniu stron internetowych.

Twoim zadaniem jest stworzenie szczegółowego MASTERPROMPTU do wygenerowania wizualizacji strony internetowej dla poniższego klienta. Ten masterprompt trafi do narzędzia AI do generowania stron (np. NanoBanana, Seedance lub podobnego).

## Nadrzędna filozofia projektu — The $10K Checklist
Każda decyzja projektowa w masterprompcie który napiszesz musi przejść przez osiem filtrów które oddzielają stronę za $10K od strony za $200:

01. Point of view, not a template.
    Strona ma konkretny design direction — brutalist, editorial, dark-luxury, retro-modern, cokolwiek pasuje do TEGO klienta — i realizuje go bez wahania. Strona za $200 jest generyczna. Strona za $10K ma smak i punkt widzenia.

02. Typography that does work.
    Para display + body, żadna z nich to nie Inter ani Roboto. Skala i grubość budują hierarchię. Nagłówki wyglądają jak wybrane, nie domyślne.

03. A restrained color system.
    3-5 kolorów używanych konsekwentnie. Żadnych tęczowych palet. Premium sygnalizowane przez powściągliwość, nie dekorację.

04. Hierarchy that breathes.
    Whitespace, skala i kontrast prowadzą wzrok bez wysiłku. Strona ma wyraźne priorytety: primary, secondary, tertiary — żadnych ścian równorzędnej treści.

05. Imagery with intent.
    Nie domyślne stocki z Unsplash które wszyscy widzieli. Albo custom fotografia, albo generowane assety pasujące do art direction, albo curation tak precyzyjna że obrazy wyglądają jak zamówione.

06. Motion that whispers.
    Mikrointerakcje i scroll behavior wyglądają jak ręcznie zrobione, nie AOS-fade-up na wszystkim. Designer kiwa głową, nie przewraca oczami.

07. Mobile that's designed, not shrunk.
    Decyzje layoutu na telefonie są inne niż na desktopie — nie skompresowana wersja desktopu. Tu 90% tanich stron odpada.

08. The invisible expensive stuff.
    Ładowanie poniżej 2s, WCAG AA kontrast, keyboard navigation, semantyczny HTML, prawdziwe meta tagi. Użytkownicy tego nie widzą — ale czują "ta strona jest szybka i działa". To różnica między drogim a tanim.

Każda sekcja masterpromptu który napiszesz musi respektować te osiem zasad. Jeśli jakaś decyzja nie przechodzi przez ten filtr — zmień ją.

## Dane klienta
${notes ? notes : "[brak danych — uzupełnij przed wysłaniem]"}
${url ? `\nStrona klienta do analizy: ${url}` : ""}

## Twoje zadanie
Na podstawie powyższych danych napisz masterprompt który:

1. Określa dokładny design direction dla tego klienta
   (nastrój, styl, inspiracje — wyprowadzone wyłącznie z danych klienta i jego branży, nie generyczne)
2. Definiuje paletę kolorów (bazując na danych klienta — jeśli są wskazówki kolorystyczne, użyj ich jako punktu wyjścia; jeśli nie ma — dobierz do branży i klimatu)
3. Dobiera typografię z charakterem dopasowaną do tego konkretnego klienta
4. Projektuje strukturę strony dopasowaną do branży i grup docelowych klienta
5. Zawiera wytyczne humanizacji designu

## Zasady projektowe których zawsze przestrzegasz

Czego unikać bezwzględnie:
- Generycznego SaaS looku
- Fioletowych gradientów AI
- Glassmorphismu, blobów 3D
- Przesadnego parallaxu
- Szablonowego wyglądu 2024/2025
- Inter jako głównej czcionki
- Poppins+Roboto combo
- Font-weight tylko 400/600/800
- grid-cols-3 gap-8 wszędzie
- Hero z tekstem idealnie na środku
- max-w-7xl dla każdego kontenera
- py-16/py-12 dla każdej sekcji

Co robić zamiast:
- Palety inspirowane charakterem i klimatem tego konkretnego klienta
- 2-3 nieoczekiwane akcenty które działają
- Zmienne fonty z dynamicznymi wagami
- Niestandardowe pary czcionek z charakterem
- Bento box layouts, nieregularne siatki
- Elementy zachodzące na siebie organicznie
- Nieregularne marginesy i organiczna biała przestrzeń
- Celowe niedoskonałości (20% designu)
- Mikroanimacje 200-500ms z cubic-bezier

## Wymagania techniczne masterpromptu
Masterprompt który napiszesz musi nakazywać:
- Wszystko w 1 pliku HTML z wbudowanym CSS i JavaScript
- Favicon jako inline SVG
- Responsive, mobile-first
- Semantyczny HTML5
- WCAG 2.1 basics
- Smooth scrolling, lazy loading
- Keyboard navigation

## Format wyjściowy
Napisz masterprompt gotowy do skopiowania i wklejenia w narzędzie do generowania stron. Zacznij od "# MASTERPROMPT —" i pisz bezpośrednio — bez wstępów, bez komentarzy, bez "oto masterprompt:".

## Ważne
Jeśli przekazuję Ci screenshoty — przeanalizuj je dokładnie przed napisaniem masterpromptu. Screenshoty pokazują obecną stronę lub materiały klienta — wyciągnij z nich DNA marki i użyj jako punktu wyjścia.`;
}

// ── Komponent ────────────────────────────────────────────────────────────────────

export function GeneratorForm() {
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [justGenerated, setJustGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const justGeneratedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Sprzątanie timerów ("Gotowe ✓" / "Skopiowano ✓") przy odmontowaniu —
  // brak setState po unmount.
  useEffect(() => {
    return () => {
      if (justGeneratedTimer.current) clearTimeout(justGeneratedTimer.current);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  function handleGenerate() {
    setOutput(buildOpusPrompt({ url, notes }));
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
    setNotes("");
    setUrl("");
    setOutput("");
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      {/* Nagłówek */}
      <header className="mb-8 md:mb-12">
        <h1 className="font-display text-h2 text-ink">Preview Generator</h1>
        <p className="text-muted mt-2 text-base leading-relaxed">
          Wpisz co wiesz o kliencie → skopiuj → wklej w LLM razem ze screenshotami klienta
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Wejście ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          {/* Notatki */}
          <div>
            <label htmlFor="pg-notes" className={LABEL}>
              Co wiesz o kliencie
            </label>
            <textarea
              id="pg-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wpisz wszystko co masz — nazwa firmy, branża, co sprzedają, do kogo, obecna strona (dobra/zła?), klimat marki, kolory jeśli znasz, co Ci się podoba/nie podoba, wrażenia z rozmowy... im więcej tym lepiej, może być totalny chaos"
              className={cn(FIELD, "min-h-[200px] resize-y")}
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="pg-url" className={LABEL}>
              Link do strony klienta (opcjonalnie)
            </label>
            <input
              id="pg-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... — LLM uwzględni jako kontekst"
              className={FIELD}
              inputMode="url"
            />
          </div>

          {/* Generuj */}
          <div>
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full rounded-button bg-lime px-6 py-4 text-base font-semibold text-navy transition-opacity hover:opacity-90"
            >
              {justGenerated ? "Gotowe ✓" : "Generuj prompt"}
            </button>
            <p className="mt-2 text-xs text-muted">
              Screenshoty klienta daj bezpośrednio w LLM razem z tym promptem
            </p>
          </div>
        </section>

        {/* ── Wyjście ──────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <label htmlFor="pg-output" className={LABEL}>
            Wygenerowany prompt
          </label>
          <textarea
            id="pg-output"
            ref={outputRef}
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Tu pojawi się prompt do wklejenia w LLM…"
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
