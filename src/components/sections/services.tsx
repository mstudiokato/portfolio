import { Container, Section } from "@/components/ui/layout";
import { H2, H4, Body, Label } from "@/components/ui/typography";
import { SERVICES } from "@/lib/site-content";

/**
 * WHAT I DESIGN / SERVICES (sek. 8.4). 6 obszarów bez ikon: nazwa (H4) +
 * 1–2 zdania. Układ: 3 kolumny desktop / 2 tablet / 1 mobile.
 * Tło sekcji = section i zwarty padding (V5). (Osobny blok AI-Augmented
 * Workflow usunięty — AI jest jedną ze specjalizacji w siatce.)
 * Hover (FIX 8): tytuł specjalizacji → bold + lime, transition 150ms.
 */
export function Services() {
  return (
    <Section id="specjalizacje" size="tight">
      <Container>
        <Label>— CO PROJEKTUJĘ</Label>
        <H2 className="mt-4 max-w-2xl">Specjalizacje</H2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group border-border border-t pt-5"
            >
              <H4 className="transition-colors duration-150 group-hover:font-bold group-hover:text-lime">
                {service.title}
              </H4>
              <Body className="text-muted mt-3">{service.description}</Body>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
