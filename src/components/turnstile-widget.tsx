"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; theme?: "light" | "dark" | "auto" },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

export type TurnstileHandle = {
  /** Aktualny token weryfikacji ("" gdy brak / widget nieaktywny). */
  getToken: () => string;
  /** Reset widgetu po zużyciu tokena (tokeny są jednorazowe). */
  reset: () => void;
};

/**
 * Widget Cloudflare Turnstile z poprawnym lifecycle Reacta.
 *
 * Explicit rendering: turnstile.render() w useEffect zwraca widgetId
 * trzymane w ref; cleanup woła turnstile.remove(widgetId). Bez tego
 * re-rendery (zmiana kroków formularza, StrictMode) zostawiają osierocone
 * widgety i reset() trafia w nieistniejący kontener
 * ("Cannot find Widget cf-chl-widget-…").
 *
 * Bez NEXT_PUBLIC_TURNSTILE_SITE_KEY renderuje null (dev/preview).
 */
export const TurnstileWidget = forwardRef<TurnstileHandle, object>(
  function TurnstileWidget(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      getToken: () =>
        (widgetIdRef.current !== null
          ? window.turnstile?.getResponse(widgetIdRef.current)
          : "") ?? "",
      reset: () => {
        if (widgetIdRef.current !== null) {
          window.turnstile?.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      if (!SITE_KEY) return;
      let cancelled = false;

      // Skrypt ładuje się asynchronicznie — czekamy aż window.turnstile
      // będzie dostępne, potem renderujemy dokładnie raz.
      const tryRender = () => {
        if (cancelled || widgetIdRef.current !== null) return;
        const el = containerRef.current;
        if (!el || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          theme: "dark",
        });
      };

      tryRender();
      const interval = window.setInterval(() => {
        tryRender();
        if (widgetIdRef.current !== null) window.clearInterval(interval);
      }, 100);

      return () => {
        cancelled = true;
        window.clearInterval(interval);
        if (widgetIdRef.current !== null) {
          try {
            window.turnstile?.remove(widgetIdRef.current);
          } catch {
            // widget mógł już zniknąć — ignorujemy
          }
          widgetIdRef.current = null;
        }
      };
    }, []);

    if (!SITE_KEY) return null;

    return (
      <>
        <Script src={SCRIPT_SRC} strategy="afterInteractive" />
        <div ref={containerRef} />
      </>
    );
  },
);
