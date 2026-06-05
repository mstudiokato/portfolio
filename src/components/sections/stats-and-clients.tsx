import { Fragment } from "react";
import { Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";
import { STATS, CREDIBILITY_CLIENTS } from "@/lib/site-content";

/**
 * STATS + CREDIBILITY (NAPRAWA 2) — banda na PEŁNĄ SZEROKOŚĆ strony (bez
 * max-width kontenera, padding px-6/md:px-12/lg:px-16). Liczby po lewej
 * z pionowymi separatorami (self-stretch, wyśrodkowane), loga po prawej jako
 * marquee prostokątów 48px. Mobile: liczby na górze, marquee pod spodem.
 */
export function StatsAndClients() {
  const stats = [
    { value: `${yearsOfExperience()}+`, label: "Lat doświadczenia" },
    ...STATS,
  ];

  // Track marquee = zduplikowana lista (płynna pętla przy translateX(-50%)).
  const marqueeClients = [...CREDIBILITY_CLIENTS, ...CREDIBILITY_CLIENTS];

  return (
    <Section id="klienci" size="sm" tone="section">
      <div className="px-6 md:px-12 lg:px-16">
        <Label>— Doświadczenie</Label>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LICZBY — flex z separatorami self-stretch, równy gap, labelki nowrap. */}
          <dl className="flex items-stretch gap-8 lg:col-span-5 lg:gap-10 lg:border-r lg:pr-12">
            {stats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="bg-border w-px self-stretch"
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

          {/* LOGOTYPY — marquee prostokątów 48px, wyśrodkowane pionowo. */}
          <div className="border-border border-t pt-8 lg:col-span-7 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">Współpracowałem z</p>
            <div className="marquee-mask relative mt-5 overflow-hidden">
              <ul className="marquee-track flex w-max items-center gap-4">
                {marqueeClients.map((name, i) => (
                  <li key={`${name}-${i}`} className="shrink-0">
                    <span className="border-ink bg-section text-muted rounded-button flex h-12 items-center border px-6 font-mono text-sm whitespace-nowrap">
                      {name}
                    </span>
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
