"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Narzędzie kompresji: przeciągnij/wybierz obraz → wysyłka do
 * /api/admin/compress-image (sharp → WebP) → podgląd „przed/po" rozmiaru i link
 * do pobrania lekkiego .webp. Plik wgrywasz potem ręcznie w panelu Keystatic.
 * Suwaki jakości (40–95) i maks. szerokości pozwalają sterować kompresją.
 */

type Result = {
  fileName: string;
  url: string;
  beforeBytes: number;
  afterBytes: number;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function CompressTool() {
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(2400);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(
    async (file: File) => {
      setError(null);
      setResult(null);
      if (!file.type.startsWith("image/")) {
        setError("To nie jest plik obrazu.");
        return;
      }
      setBusy(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("quality", String(quality));
        form.append("maxWidth", String(maxWidth));

        const res = await fetch("/api/admin/compress-image", {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || `Błąd ${res.status}`);
        }
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") || "";
        const match = cd.match(/filename="([^"]+)"/);
        const fileName = match?.[1] || "obraz.webp";

        setResult({
          fileName,
          url: URL.createObjectURL(blob),
          beforeBytes: file.size,
          afterBytes: blob.size,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nieznany błąd.");
      } finally {
        setBusy(false);
      }
    },
    [quality, maxWidth],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) compress(file);
    },
    [compress],
  );

  const saved =
    result && result.beforeBytes > 0
      ? Math.max(
          0,
          Math.round((1 - result.afterBytes / result.beforeBytes) * 100),
        )
      : 0;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Kompresja obrazów → WebP
      </h1>
      <p className="mt-3 text-sm text-neutral-500">
        Skompresuj zdjęcie tutaj, pobierz lekki plik <code>.webp</code>, a potem
        wgraj go w panelu (Case&nbsp;Studies / Pozostałe projekty). Loga klientów
        (SVG) zostaw bez kompresji.
      </p>

      {/* Ustawienia */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Jakość WebP: {quality}</span>
          <input
            type="range"
            min={40}
            max={95}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
          <span className="text-xs text-neutral-500">
            Niżej = mniejszy plik, mniej szczegółów. 80 to dobry punkt startu.
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Maks. szerokość: {maxWidth}px</span>
          <input
            type="range"
            min={800}
            max={4000}
            step={100}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
          />
          <span className="text-xs text-neutral-500">
            Większe zdjęcia zostaną zmniejszone do tej szerokości.
          </span>
        </label>
      </div>

      {/* Strefa upuszczania */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-8 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-neutral-900 bg-neutral-100"
            : "border-neutral-300 hover:border-neutral-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) compress(file);
            e.target.value = "";
          }}
        />
        {busy ? (
          <span className="text-sm text-neutral-500">Kompresuję…</span>
        ) : (
          <>
            <span className="text-sm font-medium">
              Przeciągnij zdjęcie tutaj
            </span>
            <span className="mt-1 text-xs text-neutral-500">
              albo kliknij, żeby wybrać plik (JPG, PNG, WebP — maks. 25 MB)
            </span>
          </>
        )}
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              <div className="font-medium">{result.fileName}</div>
              <div className="mt-1 text-neutral-500">
                {formatBytes(result.beforeBytes)} →{" "}
                <span className="font-semibold text-neutral-900">
                  {formatBytes(result.afterBytes)}
                </span>{" "}
                {saved > 0 ? (
                  <span className="text-green-600">(−{saved}%)</span>
                ) : null}
              </div>
            </div>
            <a
              href={result.url}
              download={result.fileName}
              className="shrink-0 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Pobierz .webp
            </a>
          </div>
        </div>
      ) : null}
    </main>
  );
}
