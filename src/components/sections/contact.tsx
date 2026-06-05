import { Container, Section } from "@/components/ui/layout";
import { H2, Body, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/site-content";

/**
 * CONTACT (sek. 8.8). Lewa kolumna: dane kontaktowe + dostępność. Prawa:
 * działający formularz (Resend + Turnstile + RODO) — komponent ContactForm.
 */
export function Contact() {
  const calConfigured = CONTACT.calUrl !== "#";

  return (
    <Section
      id="kontakt"
      tone="section"
      style={{ paddingTop: "calc(var(--spacing-section) * 0.7)" }}
    >
      <Container>
        <Label>— Kontakt</Label>
        <H2 className="mt-4 max-w-2xl">Chcesz porozmawiać?</H2>

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
                  href={`tel:${CONTACT.phone.replace(/\D/g, "")}`}
                  className="hover:text-lime"
                >
                  {CONTACT.phone}
                </a>
              </Body>
            </div>
            <div>
              <Label className="text-muted">Wolisz porozmawiać od razu?</Label>
              <Body className="text-muted mt-2 max-w-md">
                Zarezerwuj 30 minut w moim kalendarzu — bez zobowiązań, po prostu
                porozmawiajmy o projekcie.
              </Body>
              <div className="mt-4">
                {calConfigured ? (
                  <Button
                    href={CONTACT.calUrl}
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                    // Lime outline 2px (V2) — inline style wygrywa pewnie nad klasami wariantu.
                    style={{ borderColor: "#D4FF00", borderWidth: "2px" }}
                  >
                    Zarezerwuj rozmowę ↗
                  </Button>
                ) : (
                  <Body className="text-muted">Cal.com (link wkrótce)</Body>
                )}
              </div>
            </div>
            <div>
              <Label className="text-muted">Dostępność</Label>
              <Body className="text-muted mt-2">
                {CONTACT.availability.join(" · ")}
              </Body>
            </div>
          </div>

          {/* FORMULARZ */}
          <ContactForm calUrl={CONTACT.calUrl} />
        </div>
      </Container>
    </Section>
  );
}
