import { Container, Section } from "@/components/ui/layout";
import { yearsOfExperience } from "@/lib/experience";
import { STATS } from "@/lib/site-content";

/**
 * EXPERIENCE / NUMBERS (sek. 8.6). Lata liczone DYNAMICZNIE od 2012. Liczby
 * w kolorze lime, pod każdą label (wersaliki, secondary text).
 */
export function Numbers() {
  const stats = [
    { value: `${yearsOfExperience()}+`, label: "Lat doświadczenia" },
    ...STATS,
  ];

  return (
    <Section size="sm">
      <Container>
        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="border-border border-t pt-6">
              <dd className="font-display text-lime text-[clamp(3rem,7vw,5rem)] leading-none font-semibold">
                {s.value}
              </dd>
              <dt className="text-label text-muted mt-4 uppercase">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
