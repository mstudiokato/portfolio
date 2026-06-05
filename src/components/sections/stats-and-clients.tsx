import { Container, Section } from "@/components/ui/layout";
import { yearsOfExperience } from "@/lib/experience";
import { STATS, CREDIBILITY_CLIENTS } from "@/lib/site-content";

/**
 * STATS + CREDIBILITY w jednej poziomej bandzie (tło section).
 * Liczby z pionowymi separatorami (C1). Logotypy jako prostokąty-outline
 * w automatycznym marquee z pauzą na hover (C2). Mobile: liczby na górze,
 * marquee pod spodem.
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
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LICZBY (C1, NAPRAWA 4) — pełnowysokościowe separatory (cele rozciągnięte),
              treść wyrównana do dolnej linii bazowej (justify-end), symetryczny padding. */}
          <dl className="divide-border grid grid-cols-3 divide-x lg:col-span-5 lg:border-r lg:pr-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col justify-end px-5 sm:px-6"
              >
                <dd className="font-display text-lime text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold">
                  {s.value}
                </dd>
                <dt className="text-label text-muted mt-3 uppercase">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* LOGOTYPY (C2, NAPRAWA 4) — marquee prostokątów o jednakowej wysokości 48px.
              Oddzielone od liczb: na desktop border-r dl + gap, na mobile border-t + pt. */}
          <div className="border-border border-t pt-8 lg:col-span-7 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">Współpracowałem z</p>
            <div className="marquee-mask relative mt-5 overflow-hidden">
              <ul className="marquee-track flex w-max items-center gap-4">
                {marqueeClients.map((name, i) => (
                  <li key={`${name}-${i}`} className="shrink-0">
                    {/* Prostokąt-outline 48px z nazwą mono (docelowo SVG logo z Keystatic). */}
                    <span className="border-ink bg-section text-muted rounded-button flex h-12 items-center border px-6 font-mono text-sm whitespace-nowrap">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
