import { Fragment } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { CountUp } from "@/components/count-up";
import { STATS, CREDIBILITY } from "@/lib/site-content";

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
        paddingTop: "calc(var(--spacing-section-sm) * 0.85)",
        paddingBottom: "calc(var(--spacing-section-sm) * 0.85)",
      }}
    >
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* LICZBY — eyebrow + bloki z separatorami; wycentrowane i wertykalnie
              wyrównane do logów, dosunięte do linii podziału (lg:pr-4). */}
          <div className="min-w-0 lg:col-span-5 lg:flex lg:flex-col lg:items-center lg:border-r lg:pr-4">
            <Label>— Fakty i liczby</Label>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:items-center sm:justify-center sm:gap-0 lg:mt-5">
              {stats.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 ? (
                    <div
                      aria-hidden="true"
                      className="bg-border hidden h-16 w-px self-center sm:mx-4 sm:block lg:mx-[0.8rem] lg:h-[3.2rem]"
                    />
                  ) : null}
                  <div className="flex flex-col items-center text-center">
                    {/* Opcjonalny prefix (np. „Ponad") — mniejszy tekst nad liczbą. */}
                    {s.prefix ? (
                      <span className="text-muted mb-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase lg:mb-0.5 lg:text-[0.52rem]">
                        {s.prefix}
                      </span>
                    ) : null}
                    {/* Desktop −20%: font liczby clamp max 3.5rem → 2.8rem. */}
                    <dd className="font-display text-lime text-[clamp(2.25rem,4vw,2.8rem)] leading-none font-semibold tabular-nums">
                      <CountUp value={s.value} />
                    </dd>
                    {/* Mobile: mniejszy font + zawijanie (np. „Lat doświadczenia"),
                        by uniknąć ucięcia etykiet. Desktop: text-label −20% (0.6rem). */}
                    <dt className="text-muted mt-3 text-xs uppercase sm:text-label lg:mt-[0.6rem] lg:text-[0.6rem] lg:whitespace-nowrap">
                      {s.label}
                    </dt>
                  </div>
                </Fragment>
              ))}
            </dl>
          </div>

          {/* LOGOTYPY — eyebrow + marquee 56px bez ramek, separatory pionowe. */}
          <div className="border-border mt-2 min-w-0 border-t pt-8 lg:col-span-7 lg:mt-0 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">Pracowałem dla</p>
            <div className="marquee-mask relative mt-6 w-full max-w-full overflow-hidden">
              <ul className="marquee-track flex w-max items-center">
                {marqueeClients.map((c, i) => (
                  <Fragment key={`${c.name}-${i}`}>
                    {/* Logo bez ramki, wysokość 56px, object-contain. */}
                    <li className="flex h-14 shrink-0 items-center">
                      {c.logoExists && c.logo ? (
                        <Image
                          src={c.logo}
                          alt={c.name}
                          width={200}
                          height={56}
                          unoptimized
                          // SportValue −30% (h-[39px] ≈ 56px × 0.7); pozostałe 56px.
                          className={`${c.name === "SportValue" ? "h-[39px]" : "h-14"} w-auto object-contain`}
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
