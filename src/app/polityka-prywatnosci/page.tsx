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

function MailLink() {
  return (
    <a
      href={`mailto:${CONTACT.email}`}
      className="text-lime hover:underline"
    >
      {CONTACT.email}
    </a>
  );
}

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <SiteHeader />
      <Section size="sm">
        <Container className="max-w-3xl">
          <H1 className="text-h2">Polityka prywatności</H1>
          <Lead className="mt-4">
            Poniżej wyjaśniam, kto i w jaki sposób przetwarza dane osobowe
            przekazane przez formularz kontaktowy na tej stronie — prosto i bez
            prawniczego żargonu.
          </Lead>

          <div className="mt-12 flex flex-col gap-10">
            <section>
              <H3>1. Administrator danych</H3>
              <Para>
                Administratorem Twoich danych osobowych jest:
              </Para>
              <div className="text-muted mt-3 max-w-2xl leading-relaxed">
                <p className="text-ink font-semibold">MSTUDIO Michał Stężały</p>
                <p>ul. Jaworowa 20b/28</p>
                <p>40-650 Katowice</p>
                <p>NIP: 9542732276</p>
                <p>
                  E-mail: <MailLink />
                </p>
              </div>
              <Para>
                W każdej sprawie dotyczącej danych osobowych możesz napisać na
                adres <MailLink />.
              </Para>
            </section>

            <section>
              <H3>2. Jakie dane i w jakim celu przetwarzam</H3>
              <Para>
                Przez formularz kontaktowy zbieram: imię i nazwisko, adres
                e-mail, opcjonalny temat oraz treść wiadomości. Używam ich
                wyłącznie po to, aby odpowiedzieć na Twoje zapytanie i — jeśli
                taka będzie wola obu stron — omówić ewentualną współpracę.
              </Para>
            </section>

            <section>
              <H3>3. Podstawa prawna</H3>
              <Para>
                Dane przetwarzam na podstawie art. 6 ust. 1 lit. b RODO —
                przetwarzanie jest niezbędne do podjęcia działań na Twoje
                żądanie przed zawarciem ewentualnej umowy (odpowiedź na
                przesłane zapytanie).
              </Para>
            </section>

            <section>
              <H3>4. Komu powierzam dane i przekazywanie poza EOG</H3>
              <Para>
                Aby dostarczyć i obsłużyć Twoją wiadomość, korzystam z dostawców,
                którzy przetwarzają dane w moim imieniu (podmioty przetwarzające):
              </Para>
              <ul className="text-muted mt-3 flex max-w-2xl list-disc flex-col gap-2 pl-5">
                <li>
                  <strong className="text-ink">Resend</strong> (Resend, Inc.,
                  USA) — wysyłka wiadomości e-mail z formularza. Serwery znajdują
                  się w USA; przekazanie danych poza Europejski Obszar
                  Gospodarczy odbywa się na podstawie standardowych klauzul
                  umownych (SCC) zatwierdzonych przez Komisję Europejską.
                </li>
                <li>
                  <strong className="text-ink">Cloudflare Turnstile</strong> —
                  ochrona formularza przed spamem (sprawdza, że wiadomość wysyła
                  człowiek, a nie bot).
                </li>
              </ul>
            </section>

            <section>
              <H3>5. Pliki cookie i statystyki</H3>
              <Para>
                Statystyki odwiedzin prowadzę przez{" "}
                <strong className="text-ink">Cloudflare Web Analytics</strong> —
                rozwiązanie bezcookie’owe (cookieless). Nie zapisuje plików
                cookie, nie tworzy profilu użytkownika i nie pozwala
                zidentyfikować konkretnej osoby, dlatego nie wymaga Twojej zgody.
              </Para>
            </section>

            <section>
              <H3>6. Jak długo przechowuję dane</H3>
              <Para>
                Treść korespondencji przechowuję przez czas niezbędny do
                udzielenia odpowiedzi i prowadzenia rozmowy, a następnie do czasu
                przedawnienia ewentualnych roszczeń związanych z kontaktem. Gdy
                dane przestają być potrzebne — usuwam je.
              </Para>
            </section>

            <section>
              <H3>7. Twoje prawa</H3>
              <Para>
                Masz prawo do: dostępu do swoich danych, ich sprostowania,
                usunięcia oraz przenoszenia danych, a także do ograniczenia
                przetwarzania i wniesienia sprzeciwu. Aby skorzystać z tych praw
                — w tym usunąć swoje dane — napisz na <MailLink />. Przysługuje
                Ci również prawo wniesienia skargi do Prezesa Urzędu Ochrony
                Danych Osobowych (PUODO).
              </Para>
            </section>

            <section>
              <H3>8. Brak profilowania i automatycznych decyzji</H3>
              <Para>
                Nie profiluję użytkowników i nie podejmuję wobec Ciebie żadnych
                decyzji w sposób wyłącznie zautomatyzowany. Twoje dane nie są
                wykorzystywane do automatycznej oceny ani podejmowania decyzji
                wywołujących skutki prawne.
              </Para>
            </section>

            <section>
              <H3>9. Dobrowolność podania danych</H3>
              <Para>
                Podanie danych jest dobrowolne, ale niezbędne do udzielenia
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
