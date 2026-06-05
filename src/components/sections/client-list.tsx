import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { ALL_CLIENTS } from "@/lib/site-content";

/**
 * FULL CLIENT LIST (sek. 8.7). Skompresowany grid tekstowy — wszyscy klienci.
 * Mono, elegancko, bez przesady. Forma „pracowałem dla / collaborated with".
 */
export function ClientList() {
  return (
    <Section id="klienci">
      <Container>
        <Label>Współpracowałem z</Label>
        <H2 className="mt-4">Klienci</H2>

        <ul className="border-border mt-10 grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {ALL_CLIENTS.map((name) => (
            <li
              key={name}
              className="border-border text-ink font-display border-b px-1 py-4 text-lg tracking-tight"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
