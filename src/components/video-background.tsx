"use client";

import { useState, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroTransform } from "@/lib/hero-style";

/**
 * Tło hero — crossfade video loop z fallbackiem na zdjęcie.
 *
 * Dwa elementy <video> (refA, refB) nałożone absolutnie. Gdy aktywne video
 * zbliża się do końca (currentTime > duration - 1s), drugie video startuje
 * od 0 i fade-in przez 1s CSS transition. W każdej chwili jedno ma opacity:1,
 * drugie opacity:0. Brak skoku na granicy pętli.
 *
 * Mobile (< lg): wrapper video przesunięty -20px w lewo (twarz lepiej wykadrowana).
 * prefers-reduced-motion / onError → fallback na zdjęcie.
 */

const VIDEO_SRC = "/video_heroV3b.mp4";

type Props = {
  heroImage: string | null;
  posX: number;
  posY: number;
  scale: number;
};

const VIDEO_STYLE: React.CSSProperties = {
  objectPosition: "50% 20%",
  transition: "opacity 1s ease-in-out",
};

export function VideoBackground({ heroImage, posX, posY, scale }: Props) {
  const reduce = useReducedMotion();
  const [videoError, setVideoError] = useState(false);
  // Które video jest aktualnie aktywne (widoczne, opacity:1)
  const [active, setActive] = useState<"A" | "B">("A");
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  // Blokada — chroni przed podwójnym triggerem crossfade w tym samym cyklu
  const fadingRef = useRef(false);

  const showVideo = !reduce && !videoError;

  // Wywoływane przez onTimeUpdate aktywnego video.
  // Gdy zostaje < 1s do końca → startuje drugie video i swap opacity.
  const handleTimeUpdate = useCallback((which: "A" | "B") => {
    // Reaguj tylko na aktywne video (ignoruj idle)
    if (which !== (fadingRef.current ? null : active)) return;
    const cur = which === "A" ? refA.current : refB.current;
    const nxt = which === "A" ? refB.current : refA.current;
    if (!cur || !nxt) return;
    const { currentTime, duration } = cur;
    if (!duration || currentTime < duration - 1) return;
    if (fadingRef.current) return;

    fadingRef.current = true;
    nxt.currentTime = 0;
    nxt.play().catch(() => {});
    setActive(which === "A" ? "B" : "A");
    // Odblokuj po zakończeniu crossfade (1s + margines)
    setTimeout(() => { fadingRef.current = false; }, 1300);
  }, [active]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Zdjęcie — zawsze jako baza (fallback + tło podczas ładowania video).
          id="hero-photo-scale" / id="hero-photo" zachowane dla admina. */}
      {heroImage ? (
        <div
          id="hero-photo-scale"
          className="relative h-full w-full"
          style={{ transform: heroTransform(posX, posY, scale) }}
        >
          <Image
            id="hero-photo"
            src={heroImage}
            alt="Michał Stężały — projektant graficzny dla sportu i biznesu"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Para video (crossfade). Mobile: -20px w lewo; lg+: bez przesunięcia. */}
      {showVideo ? (
        <div className="absolute inset-0 z-[1] -translate-x-5 lg:translate-x-0">
          {/* Video A — startuje autoPlay */}
          <video
            ref={refA}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ ...VIDEO_STYLE, opacity: active === "A" ? 1 : 0 }}
            onTimeUpdate={() => handleTimeUpdate("A")}
            onError={() => setVideoError(true)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          {/* Video B — idle na starcie, przejmuje po pierwszym crossfade */}
          <video
            ref={refB}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ ...VIDEO_STYLE, opacity: active === "B" ? 1 : 0 }}
            onTimeUpdate={() => handleTimeUpdate("B")}
            onError={() => setVideoError(true)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
      ) : null}
    </div>
  );
}
