"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_OVERLAY, heroTransform } from "@/lib/hero-style";

/**
 * Wizualny edytor hero. Podgląd 1:1 z prawdziwą sekcją (te same proporcje,
 * gradient HERO_OVERLAY i wzór kadru heroTransform). Zdjęcie ustawia się uploadem
 * lub przeciąganiem w podglądzie; kadr suwakami X / Y / Zoom. Podgląd aktualizuje
 * się na żywo.
 *
 * - DEV: „Zapisz" wysyła wartości (+ zdjęcie) do /api/admin/save-hero → site.json.
 * - PROD: zapis przez API jest wyłączony (404) — pokazujemy gotowe wartości do
 *   przepisania w panelu Keystatic (Ustawienia strony → Hero).
 */

type Props = {
  isDev: boolean;
  initialImage: string | null;
  initialX: number;
  initialY: number;
  initialScale: number;
  eyebrow: string;
  subline: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function HeroEditor({
  isDev,
  initialImage,
  initialX,
  initialY,
  initialScale,
  eyebrow,
  subline,
}: Props) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [scale, setScale] = useState(initialScale);

  // Źródło podglądu: wgrany plik (objectURL) albo aktualne zdjęcie z /public.
  const [previewSrc, setPreviewSrc] = useState<string | null>(initialImage);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [status, setStatus] = useState<SaveStatus>("idle");

  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  // Zwolnij objectURL przy zmianie pliku / odmontowaniu (brak wycieku pamięci).
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    if (!picked) return;
    setFile(picked);
    setFileName(picked.name);
    if (status !== "idle") setStatus("idle");
  }

  // Drag w podglądzie → zmiana X/Y (jak w dawnym narzędziu). Bez clampowania:
  // gradient pokrywa ewentualny brak zdjęcia poza krawędzią.
  function onPointerDown(e: React.PointerEvent) {
    if (!previewSrc) return;
    stageRef.current?.setPointerCapture(e.pointerId);
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x, y };
    dragging.current = true;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - startMouse.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - startMouse.current.y) / rect.height) * 100;
    setX(Math.round(startPos.current.x - deltaX));
    setY(Math.round(startPos.current.y - deltaY));
    if (status !== "idle") setStatus("idle");
  }
  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
    stageRef.current?.releasePointerCapture(e.pointerId);
  }

  function reset() {
    setX(initialX);
    setY(initialY);
    setScale(initialScale);
    if (status !== "idle") setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const body = new FormData();
      body.set("positionX", String(x));
      body.set("positionY", String(y));
      body.set("scale", String(scale));
      if (file) body.set("image", file);
      const res = await fetch("/api/admin/save-hero", { method: "POST", body });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  const jsonSnippet = JSON.stringify(
    { positionX: x, positionY: y, scale },
    null,
    2,
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edytor hero — podgląd na żywo
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Ustaw zdjęcie i kadr. Podgląd poniżej pokazuje dokładnie to, co
            zobaczą odwiedzający (proporcje, gradient i tekst sekcji hero).
          </p>
        </header>

        {/* PODGLĄD — proporcje desktopowego hero (~16:9). */}
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`relative isolate aspect-[16/9] w-full touch-none overflow-hidden rounded-xl border border-white/15 bg-[#0b1220] select-none ${
            previewSrc ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          {previewSrc ? (
            <div
              className="absolute inset-0"
              style={{ transform: heroTransform(x, y, scale) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-white/40">
              Wgraj zdjęcie, aby zobaczyć podgląd
            </div>
          )}

          {/* Gradient — identyczny jak na stronie. */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ background: HERO_OVERLAY }}
            aria-hidden="true"
          />

          {/* Przykładowy tekst hero na wierzchu (lewa, wysoko). */}
          <div className="absolute inset-0 z-[2] flex flex-col justify-start p-[5%]">
            <span className="text-[1.4vw] tracking-wide text-lime/90 uppercase">
              {eyebrow}
            </span>
            <span className="mt-[1.5%] text-[6vw] leading-[0.92] font-semibold tracking-[-0.03em] text-white uppercase">
              Michał
              <br />
              Stężały
            </span>
            <span className="mt-[2%] max-w-[55%] text-[1.3vw] leading-snug text-white/85">
              {subline}
            </span>
          </div>
        </div>

        {/* STEROWANIE */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Lewa kolumna: zdjęcie */}
          <section className="rounded-xl border border-white/15 bg-white/5 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Zdjęcie
            </h2>
            <label className="mt-3 block">
              <span className="text-xs text-white/60">Wgraj nowe zdjęcie</span>
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="mt-2 block w-full text-sm text-white/80 file:mr-3 file:rounded file:border-0 file:bg-lime file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#0b1220] hover:file:opacity-90"
              />
            </label>
            <p className="mt-2 text-xs text-white/45">
              {fileName
                ? `Wybrano: ${fileName}`
                : previewSrc
                  ? `Aktualne: ${previewSrc}`
                  : "Brak zdjęcia."}
            </p>
            <p className="mt-3 text-xs text-white/45">
              Najlepiej kadr pionowy / kwadratowy z twarzą po prawej stronie —
              wtedy gradient po lewej ładnie przykryje krawędź.
            </p>
          </section>

          {/* Prawa kolumna: kadr */}
          <section className="rounded-xl border border-white/15 bg-white/5 p-5">
            <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
              Kadr
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm tabular-nums">
              <Stat label="Pozycja X" value={`${x}%`} />
              <Stat label="Pozycja Y" value={`${y}%`} />
              <Stat label="Zoom" value={`${scale}%`} />
            </div>

            <Slider
              label="Pozycja pozioma (X)"
              min={0}
              max={100}
              value={clampSlider(x)}
              onChange={(v) => {
                setX(v);
                if (status !== "idle") setStatus("idle");
              }}
            />
            <Slider
              label="Pozycja pionowa (Y)"
              min={0}
              max={100}
              value={clampSlider(y)}
              onChange={(v) => {
                setY(v);
                if (status !== "idle") setStatus("idle");
              }}
            />
            <Slider
              label="Zoom (powiększenie)"
              min={100}
              max={200}
              value={scale}
              onChange={(v) => {
                setScale(v);
                if (status !== "idle") setStatus("idle");
              }}
            />

            <button
              type="button"
              onClick={reset}
              className="mt-4 w-full rounded border border-white/20 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              Przywróć zapisane wartości
            </button>
          </section>
        </div>

        {/* ZAPIS */}
        <section className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5">
          {isDev ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={status === "saving"}
                className="rounded bg-lime px-5 py-2.5 text-sm font-semibold text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "saving" ? "Zapisywanie…" : "Zapisz do site.json"}
              </button>
              {status === "saved" ? (
                <span className="ml-3 text-sm text-[#9be15d]">
                  Zapisano ✓ {file ? "(zdjęcie + kadr)" : "(kadr)"}
                </span>
              ) : null}
              {status === "error" ? (
                <span className="ml-3 text-sm text-red-400">
                  Błąd zapisu — sprawdź konsolę dev.
                </span>
              ) : null}
              <p className="mt-3 text-xs text-white/45">
                Zapis lokalny (development). Po zapisie odśwież stronę główną,
                żeby zobaczyć efekt. Zmiany trafią do repo przy commicie.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">
                Jak zapisać (panel online)
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Tutaj dobierasz kadr wzrokowo. Następnie przepisz poniższe
                wartości do panelu Keystatic →{" "}
                <span className="text-white">Ustawienia strony → Hero</span>{" "}
                (pola „Kadr — pozycja X / Y” i „Zoom”). Zdjęcie wgraj w tym samym
                miejscu polem „Zdjęcie hero”.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-lime">
                {jsonSnippet}
              </pre>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(jsonSnippet);
                  setStatus("saved");
                }}
                className="mt-3 rounded border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
              >
                {status === "saved" ? "Skopiowano ✓" : "Kopiuj wartości"}
              </button>
            </>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-white/30">
          /admin/hero-editor — narzędzie wewnętrzne (nieindeksowane).
        </p>
      </div>
    </main>
  );
}

// Suwaki X/Y działają w zakresie 0–100; drag w podglądzie może wyjść poza zakres,
// więc wartość do suwaka przycinamy (sam stan/zapis pozostaje bez clampu).
function clampSlider(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/30 py-2">
      <div className="text-[11px] text-white/45">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-xs text-white/60">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-lime"
      />
    </label>
  );
}
