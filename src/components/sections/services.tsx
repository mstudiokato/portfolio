import { Container, Section } from "@/components/ui/layout";
import { H2, H4, Body, Label } from "@/components/ui/typography";
import { SERVICES } from "@/lib/site-content";

/**
 * WHAT I DESIGN / SERVICES (sek. 8.4). 6 obszarów bez ikon: nazwa (H4) +
 * 1–2 zdania. Układ: 3 kolumny desktop / 2 tablet / 1 mobile.
 */
export function Services() {
  return (
    <Section id="specjalizacje">
      <Container>
        <Label>Co projektuję</Label>
        <H2 className="mt-4 max-w-2xl">Specjalizacje</H2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.title} className="border-border border-t pt-5">
              <H4>{service.title}</H4>
              <Body className="text-muted mt-3">{service.body}</Body>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
