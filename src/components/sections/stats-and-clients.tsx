import { Fragment } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";
import { STATS, CREDIBILITY } from "@/lib/site-content";

/**
 * STATS + CREDIBILITY (NAPRAWA 2) — banda na PEŁNĄ SZEROKOŚĆ strony.
 * Liczby po lewej z pionowymi separatorami (FIX 3), loga po prawej jako marquee
 * z hover-pause (FIX 7): prawdziwe logotypy SVG w ramkach 160×48 (object-contain),
 * fallback tekstowy gdy brak pliku. Mobile: liczby na górze, marquee pod spodem.
 */
export function StatsAndClients() {
  const stats = [
    { value: `${yearsOfExperience()}+`, label: "Lat doświadczenia" },
    ...STATS,
  ];

  // Track marquee = zduplikowana lista (płynna pętla przy translateX(-50%)).
  const marqueeClients = [...CREDIBILITY, ...CREDIBILITY];

  return (
    <Section id="klienci" size="sm" tone="section">
      <div className="px-6 md:px-12 lg:px-16">
        <Label>— Fakty i liczby</Label>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LICZBY — bloki + pionowe separatory (FIX 3: w-px h-16 self-center). */}
          <dl className="flex items-center lg:col-span-5 lg:border-r lg:pr-12">
            {stats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 ? (
                  <div
                    aria-hidden="true"
                    className="bg-border mx-4 h-16 w-px self-center"
                  />
                ) : null}
                <div className="flex flex-col items-start">
                  <dd className="font-display text-lime text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold">
                    {s.value}
                  </dd>
                  <dt className="text-label text-muted mt-3 whitespace-nowrap uppercase">
                    {s.label}
                  </dt>
                </div>
              </Fragment>
            ))}
          </dl>

          {/* LOGOTYPY — marquee prawdziwych logotypów (SVG), hover-pause. */}
          <div className="border-border border-t pt-8 lg:col-span-7 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">Współpracowałem z</p>
            <div className="marquee-mask relative mt-5 overflow-hidden">
              <ul className="marquee-track flex w-max items-center gap-4">
                {marqueeClients.map((c, i) => (
                  <li key={`${c.name}-${i}`} className="shrink-0">
                    {c.logoExists && c.logo ? (
                      // Logo SVG w ramce 160×48, padding 12px, object-contain.
                      <span className="border-ink flex h-12 w-40 items-center justify-center border px-3">
                        <Image
                          src={c.logo}
                          alt={c.name}
                          width={140}
                          height={40}
                          unoptimized
                          className="max-h-6 w-auto object-contain"
                        />
                      </span>
                    ) : (
                      // Fallback tekstowy (prostokąt 48px z nazwą mono).
                      <span className="border-ink bg-section text-muted rounded-button flex h-12 items-center border px-6 font-mono text-sm whitespace-nowrap">
                        {c.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
