"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroTransform } from "@/lib/hero-style";

/**
 * Tło hero — pojedyncze video z natywną pętlą (loop) + fallback na zdjęcie.
 * Video ma seamless loop (pierwsza = ostatnia klatka), więc natywny loop
 * wystarczy — bez crossfade.
 *
 * Fallback na zdjęcie gdy: prefers-reduced-motion: reduce lub onError.
 * Mobile (< lg): video przesunięte -20px w lewo (-translate-x-5).
 */

const VIDEO_SRC = "/video_heroV3b.mp4";

type Props = {
  heroImage: string | null;
  posX: number;
  posY: number;
  scale: number;
};

export function VideoBackground({ heroImage, posX, posY, scale }: Props) {
  const reduce = useReducedMotion();
  const [videoError, setVideoError] = useState(false);

  const showVideo = !reduce && !videoError;

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

      {/* Video — prosty natywny loop. Mobile: -20px w lewo. */}
      {showVideo ? (
        <div className="absolute inset-0 z-[1] -translate-x-5 lg:translate-x-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 20%" }}
            onError={() => setVideoError(true)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
      ) : null}
    </div>
  );
}
