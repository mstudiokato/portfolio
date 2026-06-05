import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, H3, Body, Lead } from "@/components/ui/typography";
import { CONTACT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Informacje o przetwarzaniu danych osobowych przekazanych przez formularz kontaktowy.",
};

function Para({ children }: { children: React.ReactNode }) {
  return <Body className="text-muted mt-3 max-w-2xl">{children}</Body>;
}

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <SiteHeader />
      <Section size="sm">
        <Container className="max-w-3xl">
          <H1 className="text-h2">Polityka prywatności</H1>
          <Lead className="mt-4">
            Zasady przetwarzania danych osobowych przekazanych przez formularz
            kontaktowy na tej stronie.
          </Lead>

          <div className="mt-12 flex flex-col gap-10">
            <section>
              <H3>1. Administrator danych</H3>
              <Para>
                Administratorem Twoich danych osobowych jest Michał Stężały
                (Senior Graphic Designer), z siedzibą w Katowicach. W sprawach
                dotyczących danych osobowych skontaktujesz się pod adresem{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lime hover:underline"
                >
                  {CONTACT.email}
                </a>
                .
              </Para>
            </section>

            <section>
              <H3>2. Jakie dane i w jakim celu przetwarzamy</H3>
              <Para>
                Za pośrednictwem formularza kontaktowego przetwarzamy: imię i
                nazwisko, adres e-mail, opcjonalny temat oraz treść wiadomości.
                Dane są przetwarzane wyłącznie w celu udzielenia odpowiedzi na
                przesłane zapytanie i nawiązania ewentualnej współpracy.
              </Para>
              <Para>
                Podstawą przetwarzania jest Twoja zgoda (art. 6 ust. 1 lit. a
                RODO) wyrażona przy wysłaniu formularza oraz prawnie uzasadniony
                interes administratora polegający na odpowiedzi na kierowane
                zapytania (art. 6 ust. 1 lit. f RODO).
              </Para>
            </section>

            <section>
              <H3>3. Odbiorcy danych i przekazywanie poza EOG</H3>
              <Para>
                W celu obsługi wiadomości korzystamy z podmiotów
                przetwarzających dane w naszym imieniu:
              </Para>
              <ul className="text-muted mt-3 flex max-w-2xl list-disc flex-col gap-2 pl-5">
                <li>
                  <strong className="text-ink">Resend</strong> (Resend, Inc.,
                  USA) — dostawca usługi wysyłki wiadomości e-mail z formularza.
                </li>
                <li>
                  <strong className="text-ink">Netlify</strong> (USA) — hosting
                  strony.
                </li>
                <li>
                  <strong className="text-ink">Cloudflare Turnstile</strong> —
                  ochrona formularza przed spamem (weryfikacja, że formularz
                  wypełnia człowiek).
                </li>
              </ul>
              <Para>
                Część z tych podmiotów ma siedzibę w USA, co może wiązać się z
                przekazaniem danych poza Europejski Obszar Gospodarczy.
                Przekazanie odbywa się na podstawie standardowych klauzul
                umownych lub uczestnictwa dostawcy w programie Data Privacy
                Framework.
              </Para>
            </section>

            <section>
              <H3>4. Okres przechowywania</H3>
              <Para>
                Dane przechowujemy przez czas niezbędny do udzielenia odpowiedzi
                i prowadzenia korespondencji, a następnie do czasu przedawnienia
                ewentualnych roszczeń lub wycofania zgody — w zależności od
                tego, co nastąpi wcześniej.
              </Para>
            </section>

            <section>
              <H3>5. Twoje prawa</H3>
              <Para>
                Masz prawo do: dostępu do swoich danych, ich sprostowania,
                usunięcia, ograniczenia przetwarzania, przenoszenia danych,
                wniesienia sprzeciwu oraz wycofania zgody w dowolnym momencie
                (bez wpływu na zgodność z prawem przetwarzania sprzed
                wycofania). Aby skorzystać z tych praw — w tym usunąć swoje dane
                — napisz na{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lime hover:underline"
                >
                  {CONTACT.email}
                </a>
                . Przysługuje Ci również prawo wniesienia skargi do Prezesa
                Urzędu Ochrony Danych Osobowych (PUODO).
              </Para>
            </section>

            <section>
              <H3>6. Pliki cookie i analityka</H3>
              <Para>
                Strona używa wyłącznie niezbędnych plików cookie. Statystyki
                oglądalności prowadzimy w sposób bezcookie’owy (Cloudflare Web
                Analytics) — nie wymaga to Twojej zgody i nie pozwala na
                identyfikację konkretnej osoby.
              </Para>
            </section>

            <section>
              <H3>7. Dobrowolność podania danych</H3>
              <Para>
                Podanie danych jest dobrowolne, jednak niezbędne do udzielenia
                odpowiedzi na wiadomość wysłaną przez formularz.
              </Para>
            </section>
          </div>
        </Container>
      </Section>
      <SiteFooter />
    </>
  );
}
