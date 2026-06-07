import {
  Megaphone,
  Zap,
  TrendingUp,
  Layers,
  Printer,
  Sparkles,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Container, Section } from "@/components/ui/layout";
import { H2, H4, Body, Label } from "@/components/ui/typography";
import { SERVICES } from "@/lib/site-content";

/**
 * WHAT I DESIGN / SERVICES (sek. 8.4). 6 obszarów: ikona (akcent) + nazwa (H4) +
 * 1–2 zdania. Układ: 3 kolumny desktop / 2 tablet / 1 mobile.
 * Tło sekcji = section i zwarty padding (V5). (Osobny blok AI-Augmented
 * Workflow usunięty — AI jest jedną ze specjalizacji w siatce.)
 * Hover (FIX 8): tytuł specjalizacji → bold + lime, transition 150ms.
 */

// Ikony Lucide (outline) przypisane po tytule specjalizacji. Akcent — nie
// dominują nad tekstem. Nieznany tytuł (np. nowa pozycja z panelu) → Palette.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "Social Media Systems": Megaphone,
  "Event Branding": Zap,
  "Sponsorship & Pitch Decks": TrendingUp,
  "Identity & Campaign Design": Layers,
  "Druk i materiały promocyjne": Printer,
  "Produkcja wizualna z AI": Sparkles,
};
export function Services() {
  return (
    <Section
      id="specjalizacje"
      size="tight"
      // Padding górny identyczny jak w sekcji „Rekomendacje" (Testimonials).
      style={{ paddingTop: "calc(var(--spacing-section-tight) * 0.7)" }}
    >
      <Container>
        <Label>— CO PROJEKTUJĘ</Label>
        <H2 className="mt-4 max-w-2xl">Od social media do brandingu</H2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.title] ?? Palette;
            return (
              <div
                key={service.title}
                className="group border-border border-t pt-5"
              >
                {/* Ikona-akcent nad tytułem: outline, lime (#D4FF00), 20px. */}
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  color="#D4FF00"
                  aria-hidden="true"
                  className="mb-3"
                />
                <H4 className="group-hover:text-lime transition-colors duration-150 group-hover:font-bold">
                  {service.title}
                </H4>
                <Body className="text-muted mt-3">{service.description}</Body>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
