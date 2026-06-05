import { Container, Section } from "@/components/ui/layout";
import { CREDIBILITY_CLIENTS } from "@/lib/site-content";

/**
 * CREDIBILITY STRIP (sek. 8.2). Statyczny rząd mono-logotypów (placeholder
 * tekstowy). Marquee z hover-pause dochodzi w Etapie 8 — teraz statycznie.
 * Eyebrow w kolorze secondary (NIE lime).
 */
export function CredibilityStrip() {
  return (
    <Section size="sm" tone="section">
      <Container>
        <p className="text-label text-muted uppercase">Wybrane współprace</p>
        <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
          {CREDIBILITY_CLIENTS.map((name) => (
            <li
              key={name}
              className="font-display text-muted text-lg font-medium tracking-tight"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
