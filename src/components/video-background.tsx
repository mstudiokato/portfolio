"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { heroTransform } from "@/lib/hero-style";

/**
 * Tło hero — video (autoPlay/muted/loop) z fallbackiem na zdjęcie.
 * Wyodrębniony jako "use client" bo server component (hero.tsx) nie może
 * obsługiwać autoPlay ani hooków React.
 *
 * Priorytet wyświetlania:
 *   1. Video — gdy plik dostępny i !prefers-reduced-motion
 *   2. Zdjęcie — zawsze renderowane jako baza (fallback przy błędzie video
 *      lub prefers-reduced-motion: reduce)
 *
 * Zdjęcie jest zawsze wyrenderowane pod spodem (zapobiega migotaniu gdy
 * video jeszcze się ładuje). Video nakłada się na zdjęcie.
 */
type Props = {
  heroImage: string | null;
  posX: number;
  posY: number;
  scale: number;
};

export function VideoBackground({ heroImage, posX, posY, scale }: Props) {
  const reduce = useReducedMotion();
  const [videoError, setVideoError] = useState(false);

  // Video widoczne gdy: brak preferencji redukcji ruchu + brak błędu ładowania.
  const showVideo = !reduce && !videoError;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Zdjęcie — zawsze jako baza (fallback + tło podczas ładowania video).
          id="hero-photo-scale" / id="hero-photo" zachowane dla admina (/admin/hero-editor). */}
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

      {/* Video — na wierzchu zdjęcia; ukryte gdy błąd lub prefers-reduced-motion. */}
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          style={{ objectPosition: "50% 20%" }}
          onError={() => setVideoError(true)}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
