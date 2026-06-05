import { Container, Section } from "@/components/ui/layout";
import { H2, Body, Label, Caption } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/site-content";

/**
 * CONTACT (sek. 8.8). Lewa kolumna: dane kontaktowe + dostępność (placeholdery).
 * Prawa: WIZUALNY placeholder formularza — działanie (Resend/Turnstile) wchodzi
 * w Etapie 7. Tu tylko wygląd.
 */

const FIELD =
  "bg-surface border-border rounded-button text-ink placeholder:text-muted mt-2 w-full border px-4 py-3";

export function Contact() {
  return (
    <Section id="kontakt" tone="section">
      <Container>
        <Label>Kontakt</Label>
        <H2 className="mt-4 max-w-2xl">Porozmawiajmy o projekcie</H2>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* DANE KONTAKTOWE */}
          <div className="flex flex-col gap-6">
            <div>
              <Label className="text-muted">E-mail</Label>
              <Body className="mt-2">
                <a href={`mailto:${CONTACT.email}`} className="hover:text-lime">
                  {CONTACT.email}
                </a>
              </Body>
            </div>
            <div>
              <Label className="text-muted">Telefon</Label>
              <Body className="mt-2">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="hover:text-lime"
                >
                  {CONTACT.phone}
                </a>
              </Body>
            </div>
            <div>
              <Label className="text-muted">Umów rozmowę</Label>
              <Body className="mt-2">
                <a
                  href={CONTACT.calUrl}
                  className="hover:text-lime underline-offset-4"
                >
                  Cal.com →
                </a>
              </Body>
            </div>
            <div>
              <Label className="text-muted">Dostępność</Label>
              <Body className="text-muted mt-2">
                {CONTACT.availability.join(" · ")}
              </Body>
            </div>
          </div>

          {/* PLACEHOLDER FORMULARZA — wygląd, bez działania (Etap 7). */}
          <form
            className="flex flex-col gap-5"
            aria-label="Formularz kontaktowy"
          >
            <div>
              <Label className="text-muted">Imię</Label>
              <input type="text" placeholder="Jan Kowalski" className={FIELD} />
            </div>
            <div>
              <Label className="text-muted">E-mail</Label>
              <input
                type="email"
                placeholder="jan@firma.pl"
                className={FIELD}
              />
            </div>
            <div>
              <Label className="text-muted">Wiadomość</Label>
              <textarea
                rows={4}
                placeholder="Kilka zdań o projekcie…"
                className={FIELD}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="button" variant="primary">
                Wyślij ↗
              </Button>
              <Caption>Formularz uruchomimy w Etapie 7.</Caption>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}
