import { Container, Section } from "@/components/ui/layout";
import { H2, H4, Body, Label } from "@/components/ui/typography";
import { SERVICES, EYEBROW_COLOR } from "@/lib/site-content";
import { textColorHex } from "@/lib/text-color";
import { replaceWidows } from "@/lib/text";

/**
 * WHAT I DESIGN / SERVICES (sek. 8.4). 6 obszarów: ikona PNG (akcent) + nazwa
 * (H4) + 1–2 zdania. Układ: 3 kolumny desktop / 2 tablet / 1 mobile.
 * Tło sekcji = section i zwarty padding (V5).
 *
 * Ikona: upload z panelu (pole „Ikona (PNG)") albo fallback /ikonySpec/{n}.png
 * wg pozycji (1-indeks). Kolor tytułu i opisu: pole „Kolor tekstu" z panelu
 * (inline style, domyślnie biały). Eyebrow: kolor z ustawień strony.
 */
export function Services() {
  const eyebrowColor = textColorHex(EYEBROW_COLOR, "lime");

  return (
    <Section
      id="specjalizacje"
      size="tight"
      // Padding górny identyczny jak w sekcji „Rekomendacje" (Testimonials).
      style={{ paddingTop: "calc(var(--spacing-section-tight) * 0.7)" }}
    >
      <Container>
        <Label style={{ color: eyebrowColor }}>— CO PROJEKTUJĘ</Label>
        <H2 className="mt-4 max-w-2xl">Od social media do brandingu</H2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            // Ikona z panelu lub domyślna wg pozycji (1.png … 6.png).
            const iconSrc =
              service.icon && service.icon.trim() !== ""
                ? service.icon
                : `/ikonySpec/${i + 1}.png`;
            const color = textColorHex(service.color);
            return (
              <div
                key={service.title}
                className="group border-border border-t pt-5"
              >
                {/* Ikona-akcent nad tytułem: stały kwadrat 48×48 (h-12 w-12)
                    z object-contain — każdy PNG wpisuje się w ten sam kwadrat,
                    więc ikony są wizualnie równe. Glify wypełniają canvas niemal
                    do krawędzi (96–99%), więc p-1 daje jednolity margines, by
                    nie były stłoczone (zostają równe między sobą). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconSrc}
                  alt=""
                  aria-hidden="true"
                  width={48}
                  height={48}
                  className="mb-4 h-12 w-12 object-contain p-1"
                />
                <H4
                  className="text-balance transition-[font-weight] duration-150 group-hover:font-bold"
                  style={{ color }}
                >
                  {service.title}
                </H4>
                <Body className="mt-3 hyphens-auto" style={{ color }}>
                  {replaceWidows(service.description)}
                </Body>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
