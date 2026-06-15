import { Fragment } from "react";
import { Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { CountUp } from "@/components/count-up";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { STATS, CREDIBILITY, STATS_LABEL_COLOR } from "@/lib/site-content";
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
      className="pt-[calc(var(--spacing-section-sm)*0.45_+_15px)] lg:pt-[calc(var(--spacing-section-sm)*0.45_+_5px)]"
      style={{
        paddingBottom: "calc(var(--spacing-section-sm) * 0.45 + 15px)",
      }}
    >
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid gap-10 xl:grid-cols-[auto_1fr] xl:items-start xl:gap-0">
          {/* LICZBY — eyebrow + bloki z separatorami; wycentrowane i wertykalnie
              wyrównane do logów, dosunięte do linii podziału (lg:pr-4). */}
          <div className="min-w-0 text-center xl:flex xl:flex-col xl:items-start xl:pr-8 xl:text-left">
            <Label>— Fakty i liczby</Label>
            <dl className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-0 xl:mt-5">
              {stats.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 ? (
                    <div
                      aria-hidden="true"
                      className="bg-border hidden h-16 w-px self-center md:mx-4 md:block lg:mx-[1.4rem] lg:h-[3.2rem]"
                    />
                  ) : null}
                  <div className="flex flex-col items-center text-center">
                    {/* Prefix (np. „Ponad") nad liczbą. Gdy brak — pusty placeholder
                        o tych samych klasach rezerwuje wiersz, by górne krawędzie
                        wszystkich liczb były wyrównane (md:items-start). */}
                    {/* Stagger: kolejne bloki wchodzą z opóźnieniem 0/0.15/0.3 s.
                        Prefix, liczba i jednostka dzielą ten sam delay → wchodzą
                        razem (np. „PONAD", „14" i „LAT"). */}
                    {s.prefix ? (
                      <CountUp
                        value={s.prefix}
                        delay={i * 0.1}
                        className="text-muted mb-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase lg:mb-0.5 lg:text-[0.52rem]"
                      />
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
                      <CountUp value={s.value} delay={i * 0.1} />
                      {/* Jednostka (np. „LAT") w TYM SAMYM rozmiarze co liczba —
                          wszystkie trzy bloki (14 LAT, 1000+, 30+) mają identyczny
                          rozmiar fontu. Etykiety pod spodem zostają mniejsze.
                          Ten sam delay co liczba → „14" i „LAT" wchodzą razem. */}
                      {s.unit ? (
                        <CountUp
                          value={s.unit}
                          delay={i * 0.1}
                          className="ml-1.5 tracking-tight"
                        />
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
          <div className="border-border mt-2 min-w-0 border-t pt-8 xl:mt-0 xl:flex xl:flex-col xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
            <Label>— Pracowałem m.in. dla:</Label>
            <div className="marquee-mask relative mt-6 w-full max-w-full overflow-hidden">
              <ClientsMarquee items={marqueeClients} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
