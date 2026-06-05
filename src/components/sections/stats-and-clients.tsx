import { Container, Section } from "@/components/ui/layout";
import { yearsOfExperience } from "@/lib/experience";
import { STATS, CREDIBILITY_CLIENTS } from "@/lib/site-content";

/**
 * STATS + CREDIBILITY w jednej poziomej bandzie (tło section).
 * Desktop: liczby po lewej (lime, z labelkami) | linia podziału | logotypy po
 * prawej. Mobile: liczby na górze (3 kolumny), logotypy pod spodem (zawijają).
 * Zastępuje dawne <Numbers /> i <CredibilityStrip />.
 */
export function StatsAndClients() {
  const stats = [
    { value: `${yearsOfExperience()}+`, label: "Lat doświadczenia" },
    ...STATS,
  ];

  return (
    <Section size="sm" tone="section">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LICZBY */}
          <dl className="border-border grid grid-cols-3 gap-6 lg:col-span-5 lg:border-r lg:pr-12">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-lime text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold">
                  {s.value}
                </dd>
                <dt className="text-label text-muted mt-3 uppercase">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* LOGOTYPY */}
          <div className="border-border border-t pt-8 lg:col-span-7 lg:border-t-0 lg:pt-0">
            <p className="text-label text-muted uppercase">
              Wybrane współprace
            </p>
            <ul className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              {CREDIBILITY_CLIENTS.map((name) => (
                <li
                  key={name}
                  className="font-display text-muted text-lg font-medium tracking-tight"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
