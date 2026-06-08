import { Fragment } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { CountUp } from "@/components/count-up";
import {
  STATS,
  CREDIBILITY,
  STATS_LABEL_COLOR,
  EYEBROW_COLOR,
} from "@/lib/site-content";
import { textColorHex } from "@/lib/text-color";

/**
 * STATS + CREDIBILITY — banda na pełną szerokość. Eyebrow liczb („— Fakty
 * i liczby") i eyebrow logo („Pracowałem dla") wyrównane do góry (items-start,
 * FIX 3). Liczby z pionowymi separatorami; loga jako marquee z hover-pause —
 * 56px wysokości, bez ramek, pionowe separatory między nimi (FIX 3).
 * Padding sekcji góra i dół −15% (FIX 4).
 */
export function StatsAndClients() {
  const stats = STATS;

  // Track marquee = zduplikowana lista (płynna pętla przy translateX(-50%)).
  const marqueeClients = [...CREDIBILITY, ...CREDIBILITY];

  return (
    <Section
      id="klienci"
      size="sm"
      tone="section"
      style={{
        paddingTop: "calc(var(--spacing-section-sm) * 0.45)",
        paddingBottom: "calc(var(--spacing-section-sm) * 0.45)",
      }}
    >
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* LICZBY — eyebrow + bloki z separatorami; wycentrowane i wertykalnie
              wyrównane do logów, dosunięte do linii podziału (lg:pr-4). */}
          <div className="min-w-0 lg:col-span-5 lg:flex lg:flex-col lg:items-center lg:border-r lg:pr-4">
            <Label style={{ color: textColorHex(EYEBROW_COLOR, "lime") }}>
              — Fakty i liczby
            </Label>
            <dl className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-0 lg:mt-5">
              {stats.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 ? (
                    <div
                      aria-hidden="true"
                      className="bg-border hidden h-16 w-px self-center md:mx-4 md:block lg:mx-[0.8rem] lg:h-[3.2rem]"
                    />
                  ) : null}
                  <div className="flex flex-col items-center text-center">
                    {/* Prefix (np. „Ponad") nad liczbą. Gdy brak — pusty placeholder
                        o tych samych klasach rezerwuje wiersz, by górne krawędzie
                        wszystkich liczb były wyrównane (md:items-start). */}
                    {s.prefix ? (
                      <span className="text-muted mb-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase lg:mb-0.5 lg:text-[0.52rem]">
                        {s.prefix}
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="mb-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase lg:mb-0.5 lg:text-[0.52rem]"
                      >
                        &nbsp;
                      </span>
                    )}
                    {/* Liczba (limonkowa). Stat z jednostką (np. „14 LAT") jest
                        wyeksponowany jako główny akcent — większy font, jednostka
                        w tym samym kolorze obok liczby. */}
                    <dd className="font-display text-lime text-[clamp(2.25rem,4vw,2.8rem)] leading-none font-semibold tabular-nums">
                      <CountUp value={s.value} />
                      {/* Jednostka (np. „LAT") w TYM SAMYM rozmiarze co liczba —
                          wszystkie trzy bloki (14 LAT, 1000+, 30+) mają identyczny
                          rozmiar fontu. Etykiety pod spodem zostają mniejsze. */}
                      {s.unit ? (
                        <span className="ml-1.5 tracking-tight">{s.unit}</span>
                      ) : null}
                    </dd>
                    {/* Mobile: mniejszy font + zawijanie (np. „Lat doświadczenia"),
                        by uniknąć ucięcia etykiet. Desktop: text-label −20% (0.6rem). */}
                    <dt
                      className="text-muted sm:text-label mt-3 text-xs uppercase lg:mt-[0.6rem] lg:text-[0.6rem] lg:whitespace-nowrap"
                      style={{ color: textColorHex(STATS_LABEL_COLOR) }}
                    >
                      {s.label.split("\n").map((line, li) => (
                        <Fragment key={li}>
                          {li > 0 ? <br /> : null}
                          {line}
                        </Fragment>
                      ))}
                    </dt>
                  </div>
                </Fragment>
              ))}
            </dl>
          </div>

          {/* LOGOTYPY — eyebrow + marquee 56px bez ramek, separatory pionowe. */}
          <div className="border-border mt-2 min-w-0 border-t pt-8 lg:col-span-7 lg:mt-0 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">
              Współpracowałem min. z
            </p>
            <div className="marquee-mask relative mt-6 w-full max-w-full overflow-hidden">
              <ul className="marquee-track flex w-max items-center">
                {marqueeClients.map((c, i) => (
                  <Fragment key={`${c.name}-${i}`}>
                    {/* Logo bez ramki, object-contain. BEZ stałej wysokości li —
                        rząd rośnie do najwyższego logo, więc maska (overflow-hidden,
                        potrzebna do poziomego marquee) nie przycina dużych logotypów
                        niezależnie od logoSize (20–200%). */}
                    <li className="flex shrink-0 items-center">
                      {c.logoExists && c.logo ? (
                        <Image
                          src={c.logo}
                          alt={c.name}
                          width={200}
                          height={56}
                          unoptimized
                          // Wysokość bazowa 56px skalowana przez logoSize (%) z
                          // Keystatic (Klienci → Rozmiar logo). 100% = 56px.
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
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
