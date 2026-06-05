import { Container, Section } from "@/components/ui/layout";
import { H2, H4, Body, Label } from "@/components/ui/typography";
import { SERVICES, AI_WORKFLOW_PARAGRAPH } from "@/lib/site-content";

/**
 * WHAT I DESIGN / SERVICES (sek. 8.4). 6 obszarów bez ikon: nazwa (H4) +
 * 1–2 zdania. Układ: 3 kolumny desktop / 2 tablet / 1 mobile.
 * Tło sekcji = section (inne niż Selected Work) i zwarty padding (V5).
 * AI-Augmented Workflow przeniesiony tu jako wyróżniony 7. element —
 * pełna szerokość pod siatką, na tle surface (V4).
 */
export function Services() {
  return (
    <Section id="specjalizacje" size="tight" tone="section">
      <Container>
        <Label>— Co projektuję</Label>
        <H2 className="mt-4 max-w-2xl">Specjalizacje</H2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.title} className="border-border border-t pt-5">
              <H4>{service.title}</H4>
              <Body className="text-muted mt-3">{service.description}</Body>
            </div>
          ))}
        </div>

        {/* 7. element — AI-Augmented Workflow, pełna szerokość, tło surface. */}
        <div className="bg-surface border-border rounded-card mt-10 border p-8 sm:p-12">
          <Label>AI-Augmented Workflow</Label>
          <p className="text-ink text-h4 mt-6 max-w-3xl leading-relaxed font-normal">
            {AI_WORKFLOW_PARAGRAPH}
          </p>
        </div>
      </Container>
    </Section>
  );
}
