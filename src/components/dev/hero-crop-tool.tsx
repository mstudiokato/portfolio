"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Narzędzie kadrowania hero — WYŁĄCZNIE w development (w produkcji renderuje null,
 * a endpoint zapisu zwraca 404). Pozwala przeciągać zdjęcie (zmienia X/Y),
 * ustawić zoom suwakiem i zapisać wartości do src/content/settings/site.json.
 * Podgląd jest live: ustawia object-position / transform bezpośrednio na DOM
 * hero (#hero-photo / #hero-photo-scale).
 */

export function HeroCropTool({
  initialX,
  initialY,
  initialScale,
}: {
  initialX: number;
  initialY: number;
  initialScale: number;
}) {
  const isDev = process.env.NODE_ENV === "development";

  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [scale, setScale] = useState(initialScale);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null,
  );

  // Live-podgląd: aplikuj kadr bezpośrednio na elementy hero.
  useEffect(() => {
    if (!isDev) return;
    const img = document.getElementById("hero-photo");
    if (img) img.style.objectPosition = `${x}% ${y}%`;
    const wrap = document.getElementById("hero-photo-scale");
    if (wrap) wrap.style.transform = `scale(${scale / 100})`;
  }, [x, y, scale, isDev]);

  if (!isDev) return null;

  function onPointerDown(e: React.PointerEvent) {
    overlayRef.current?.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x, y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    // deltaX/deltaY względem SZEROKOŚCI i WYSOKOŚCI kontenera hero (oba aktywne).
    const deltaX = e.clientX - drag.current.px;
    const deltaY = e.clientY - drag.current.py;
    // Przeciągnięcie w prawo przesuwa postać w prawo (gradient pokryje brak po
    // lewej). BEZ clampowania — wartości mogą wychodzić poza 0–100.
    setX(Math.round(drag.current.x - (deltaX / rect.width) * 100));
    setY(Math.round(drag.current.y - (deltaY / rect.height) * 100));
    if (status !== "idle") setStatus("idle");
  }
  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    overlayRef.current?.releasePointerCapture(e.pointerId);
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/dev/save-hero-crop", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ positionX: x, positionY: y, scale }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Warstwa przeciągania nad hero — tylko gdy tryb kadrowania włączony. */}
      {enabled ? (
        <div
          ref={overlayRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute inset-0 z-[9990] cursor-grab touch-none select-none active:cursor-grabbing"
          aria-hidden="true"
        />
      ) : null}

      {/* Panel sterowania — prawy dolny róg, nie zasłania treści hero. */}
      <div className="fixed right-4 bottom-4 z-[9999] w-64 rounded-lg border border-white/15 bg-black/85 p-4 text-xs text-white shadow-xl backdrop-blur">
        <p className="font-semibold tracking-wide">Kadrowanie hero (dev)</p>

        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          className={`mt-3 w-full rounded border px-3 py-2 font-medium transition-colors ${
            enabled
              ? "border-lime bg-lime/20 text-lime"
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          {enabled ? "Tryb kadrowania: WŁ" : "Włącz tryb kadrowania"}
        </button>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center tabular-nums">
          <div>
            <div className="text-white/50">X</div>
            <div>{x}%</div>
          </div>
          <div>
            <div className="text-white/50">Y</div>
            <div>{y}%</div>
          </div>
          <div>
            <div className="text-white/50">Zoom</div>
            <div>{scale}%</div>
          </div>
        </div>

        <label className="mt-3 block">
          <span className="text-white/60">Zoom (100–200%)</span>
          <input
            type="range"
            min={100}
            max={200}
            value={scale}
            onChange={(e) => {
              setScale(Number(e.target.value));
              if (status !== "idle") setStatus("idle");
            }}
            className="accent-lime mt-1 w-full"
          />
        </label>

        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="bg-lime text-navy mt-3 w-full rounded px-3 py-2 font-semibold disabled:opacity-60"
        >
          {status === "saving" ? "Zapisywanie…" : "Zapisz ustawienia"}
        </button>

        {status === "saved" ? (
          <p className="mt-2 text-center text-[#9be15d]">Zapisano do site.json ✓</p>
        ) : null}
        {status === "error" ? (
          <p className="mt-2 text-center text-red-400">Błąd zapisu</p>
        ) : null}
      </div>
    </>
  );
}
