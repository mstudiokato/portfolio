"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";

type MarqueeItem = {
  name: string;
  logo: string | null;
  logoExists: boolean;
  logoSize: number;
};

/**
 * Animowana lista logotypów (marquee). Wydzielona jako komponent kliencki —
 * StatsAndClients pozostaje serwerowy (importuje dane czytane z dysku), a tu
 * potrzebujemy efektów przeglądarki.
 *
 * Fix iOS Safari: keyframe translateX(-50%) jest zamrażany w chwili startu
 * animacji. Jeśli ruszy zanim logotypy nadadzą <ul> pełną szerokość, -50%
 * liczy się od zaniżonej szerokości i marquee stoi (losowo, zależnie od cache).
 * Track startuje wstrzymany (CSS: animation-play-state: paused); klasę
 * .marquee-track--ready dodajemy dopiero po załadowaniu wszystkich obrazów.
 */
export function ClientsMarquee({ items }: { items: MarqueeItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const imgs = Array.from(track.querySelectorAll("img"));
    if (imgs.length === 0) {
      setReady(true);
      return;
    }
    let remaining = imgs.length;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    const onOne = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };
    imgs.forEach((img) => {
      if (img.complete) {
        onOne();
      } else {
        img.addEventListener("load", onOne, { once: true });
        img.addEventListener("error", onOne, { once: true });
      }
    });
    // Bezpiecznik — uruchom nawet gdy któryś obraz nie wyśle eventu.
    const safety = window.setTimeout(finish, 1500);
    return () => {
      window.clearTimeout(safety);
      imgs.forEach((img) => {
        img.removeEventListener("load", onOne);
        img.removeEventListener("error", onOne);
      });
    };
  }, []);

  return (
    // style width:max-content — bardziej kompatybilne z Safari niż Tailwind
    // w-max (Safari czasem nie oblicza go przed pierwszą klatką animacji).
    <ul
      ref={trackRef}
      className={`marquee-track flex items-center${ready ? " marquee-track--ready" : ""}`}
      style={{ width: "max-content" }}
    >
      {items.map((c, i) => (
        <Fragment key={`${c.name}-${i}`}>
          {/* Logo bez ramki, object-contain. BEZ stałej wysokości li — rząd
              rośnie do najwyższego logo, więc maska (overflow-hidden, potrzebna
              do poziomego marquee) nie przycina dużych logotypów niezależnie od
              logoSize (20–200%). */}
          <li className="flex shrink-0 items-center">
            {c.logoExists && c.logo ? (
              <Image
                src={c.logo}
                alt={c.name}
                width={200}
                height={56}
                unoptimized
                // Wysokość bazowa 56px skalowana przez logoSize (%) z Keystatic
                // (Klienci → Rozmiar logo). 100% = 56px.
                style={{ height: `${(56 * c.logoSize) / 100}px` }}
                className="w-auto object-contain"
              />
            ) : (
              <span className="text-muted font-mono text-sm whitespace-nowrap">
                {c.name}
              </span>
            )}
          </li>
          {/* Pionowy separator 1px (#1F2D44) między logami. */}
          <li
            aria-hidden="true"
            className="bg-border mx-6 h-12 w-px shrink-0 self-center"
          />
        </Fragment>
      ))}
    </ul>
  );
}
