"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-ack";

/**
 * Minimalny baner cookies (privacy-first). Analityka jest cookieless, więc
 * baner ma charakter informacyjny — jeden przycisk „Rozumiem", zapamiętany
 * w localStorage. Renderuje się dopiero po stronie klienta (brak miśmatchu).
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      /* localStorage niedostępny — nie pokazujemy banera */
    }
  }, []);

  if (!visible) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Informacja o plikach cookie"
      className="border-border bg-surface fixed inset-x-0 bottom-0 z-50 border-t"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-caption text-muted">
          Ta strona używa tylko niezbędnych plików cookie. Analityka jest
          cookieless (Cloudflare Web Analytics).{" "}
          <Link
            href="/polityka-prywatnosci"
            className="text-lime hover:underline"
          >
            Polityka prywatności
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="rounded-button bg-lime text-navy text-caption w-fit shrink-0 px-5 py-2 font-medium hover:opacity-90"
        >
          Rozumiem
        </button>
      </div>
    </div>
  );
}
