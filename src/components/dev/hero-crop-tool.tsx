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
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  // Live-podgląd: pozycjonowanie przez transform translate()+scale() (przesuw w
  // OBU osiach). Sterowane stanem (useState → ten effect synchronizuje DOM hero,
  // bo tło hero renderuje server component). 50% = środek.
  useEffect(() => {
    if (!isDev) return;
    const wrap = document.getElementById("hero-photo-scale");
    if (wrap)
      wrap.style.transform = `translate(${50 - x}%, ${50 - y}%) scale(${
        scale / 100
      })`;
  }, [x, y, scale, isDev]);

  if (!isDev) return null;

  function onPointerDown(e: React.PointerEvent) {
    overlayRef.current?.setPointerCapture(e.pointerId);
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x, y };
    dragging.current = true;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    // deltaX/deltaY jako % szerokości/wysokości kontenera hero (oba aktywne).
    const deltaX = ((e.clientX - startMouse.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - startMouse.current.y) / rect.height) * 100;
    // Drag w prawo → mniejszy X → obiekt przesuwa się w prawo. BEZ clampowania.
    setX(Math.round(startPos.current.x - deltaX));
    setY(Math.round(startPos.current.y - deltaY));
    if (status !== "idle") setStatus("idle");
  }
  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
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
