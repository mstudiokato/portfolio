"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { cn } from "@/lib/cn";

const CONTACT_EMAIL = "kontakt@michal-stezaly.pl";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const MAX_FILES = 10;

// ── Design tokens ─────────────────────────────────────────────────────────────

const FIELD =
  "bg-surface border-border rounded-button text-ink placeholder:text-muted w-full border px-4 py-3 text-base focus-visible:border-lime focus:outline-none transition-colors";

const LABEL = "block text-xs font-semibold text-muted uppercase tracking-widest mb-2";

// ── Types ─────────────────────────────────────────────────────────────────────

type BriefData = {
  // Krok 1
  name: string;
  company: string;
  about: string;
  targetClient: string;
  // Krok 2
  goal: string;
  hasWebsite: string;
  existingLinks: string[];
  scale: string;
  // Krok 3
  inspirationLinks: string[];
  files: File[];
  noWant: string;
  wish: string;
  // Krok 4
  mood: string;
  colorsChoice: string;
  colorsText: string;
  bgStyle: string;
  // Krok 5
  sections: string[];
  otherSection: string;
  ready: string[];
  language: string;
  notes: string;
  // Krok 6
  budget: string;
  deadline: string;
  email: string;
  phone: string;
  contactPref: string;
  consent: boolean;
  // Honeypot
  website: string;
};

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "loading" | "success" | "error";

const INITIAL: BriefData = {
  name: "",
  company: "",
  about: "",
  targetClient: "",
  goal: "",
  hasWebsite: "",
  existingLinks: [""],
  scale: "",
  inspirationLinks: [""],
  files: [],
  noWant: "",
  wish: "",
  mood: "",
  colorsChoice: "",
  colorsText: "",
  bgStyle: "",
  sections: [],
  otherSection: "",
  ready: [],
  language: "",
  notes: "",
  budget: "",
  deadline: "",
  email: "",
  phone: "",
  contactPref: "",
  consent: false,
  website: "",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function pluralFiles(n: number) {
  if (n === 1) return "1 plik gotowy do wysłania";
  if (n >= 2 && n <= 4) return `${n} pliki gotowe do wysłania`;
  return `${n} plików gotowych do wysłania`;
}

function isEmailValid(v: string) {
  return /\S+@\S+\.\S+/.test(v.trim());
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1920;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX || h > MAX) {
        if (w >= h) {
          h = Math.round((h * MAX) / w);
          w = MAX;
        } else {
          w = Math.round((w * MAX) / h);
          h = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no canvas ctx")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img load error")); };
    img.src = url;
  });
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-sm text-red-400">{msg}</p>;
}

function StepHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-h3 text-ink">{title}</h1>
      {sub ? <p className="text-muted mt-2 text-base leading-relaxed">{sub}</p> : null}
    </div>
  );
}

function RadioCard({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-card border px-4 py-4 transition-colors",
        checked ? "border-lime bg-lime/5" : "border-border hover:border-muted",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-lime" : "border-muted",
        )}
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-lime" /> : null}
      </span>
      <span className="text-base text-ink leading-snug">{children}</span>
    </label>
  );
}

function CheckCard({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-card border px-4 py-4 transition-colors",
        checked ? "border-lime bg-lime/5" : "border-border hover:border-muted",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          checked ? "border-lime bg-lime" : "border-muted",
        )}
      >
        {checked ? <span className="text-navy text-xs font-bold leading-none">✓</span> : null}
      </span>
      <span className="text-base text-ink leading-snug">{children}</span>
    </label>
  );
}

function DynamicLinks({
  values,
  onChange,
  placeholder = "https://",
}: {
  values: string[];
  onChange: (links: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const add = () => onChange([...values, ""]);
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="url"
            value={v}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className={cn(FIELD, "flex-1 min-w-0")}
          />
          {values.length > 1 ? (
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Usuń link"
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-button border border-border text-muted transition-colors hover:border-red-400 hover:text-red-400"
            >
              ✕
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center gap-1 self-start text-sm text-lime hover:underline"
      >
        + Dodaj kolejny
      </button>
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────

type StepProps = { data: BriefData; set: <K extends keyof BriefData>(k: K, v: BriefData[K]) => void; errors: Errors };

function Step1({ data, set, errors }: StepProps) {
  return (
    <>
      <StepHeader
        title="Kim jesteś?"
        sub="Kilka słów o Tobie i Twojej firmie — żebyśmy wiedzieli z kim i o czym rozmawiamy."
      />
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="bf-name" className={LABEL}>Imię <span className="text-lime">*</span></label>
          <input
            id="bf-name"
            type="text"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="np. Anna Kowalska"
            className={FIELD}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError msg={errors.name} />
        </div>
        <div>
          <label htmlFor="bf-company" className={LABEL}>
            Nazwa firmy lub marki <span className="text-lime">*</span>
          </label>
          <input
            id="bf-company"
            type="text"
            value={data.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="np. Studio Kwiat, JanKowalski.pl, Firma XYZ"
            className={FIELD}
            aria-invalid={Boolean(errors.company)}
          />
          <FieldError msg={errors.company} />
        </div>
        <div>
          <label htmlFor="bf-about" className={LABEL}>
            Czym się zajmujesz? <span className="text-lime">*</span>
          </label>
          <p className="text-muted mb-2 text-sm">Napisz jakbyś tłumaczył znajomemu — bez żargonu.</p>
          <textarea
            id="bf-about"
            rows={4}
            value={data.about}
            onChange={(e) => set("about", e.target.value)}
            placeholder="np. Prowadzę studio fotograficzne dla rodzin. Robię zdjęcia na chrzcinach, komuniach i weselach w Krakowie i okolicach."
            className={cn(FIELD, "resize-y")}
            aria-invalid={Boolean(errors.about)}
          />
          <FieldError msg={errors.about} />
        </div>
        <div>
          <label htmlFor="bf-target" className={LABEL}>Kim jest Twój typowy klient?</label>
          <p className="text-muted mb-2 text-sm">Opcjonalne — ale bardzo pomocne.</p>
          <textarea
            id="bf-target"
            rows={3}
            value={data.targetClient}
            onChange={(e) => set("targetClient", e.target.value)}
            placeholder="np. Młode mamy z dziećmi 0–5 lat, Katowice i okolice. Albo: firmy B2B, głównie małe i średnie przedsiębiorstwa."
            className={cn(FIELD, "resize-y")}
          />
        </div>
      </div>
    </>
  );
}

function Step2({ data, set, errors }: StepProps) {
  return (
    <>
      <StepHeader
        title="Po co Ci strona?"
        sub="Pomóż nam zrozumieć co ma ta strona osiągnąć."
      />
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="bf-goal" className={LABEL}>
            Co chcesz żeby ktoś zrobił po wejściu na stronę? <span className="text-lime">*</span>
          </label>
          <p className="text-muted mb-2 text-sm">Zadzwonił? Wysłał zapytanie? Kupił produkt? Zapisał się na listę?</p>
          <textarea
            id="bf-goal"
            rows={3}
            value={data.goal}
            onChange={(e) => set("goal", e.target.value)}
            placeholder="np. Chcę żeby klient zadzwonił lub napisał przez formularz kontaktowy."
            className={cn(FIELD, "resize-y")}
            aria-invalid={Boolean(errors.goal)}
          />
          <FieldError msg={errors.goal} />
        </div>

        <div>
          <p className={LABEL}>
            Czy masz już stronę? <span className="text-lime">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {[
              { v: "yes", label: "Tak — chcę ją odświeżyć lub zrobić od nowa" },
              { v: "no", label: "Nie — to będzie moja pierwsza strona" },
            ].map(({ v, label }) => (
              <RadioCard
                key={v}
                name="hasWebsite"
                value={v}
                checked={data.hasWebsite === v}
                onChange={(val) => set("hasWebsite", val)}
              >
                {label}
              </RadioCard>
            ))}
          </div>
          <FieldError msg={errors.hasWebsite} />
        </div>

        <div>
          <label className={LABEL}>
            Wklej linki do tego co masz teraz
          </label>
          <p className="text-muted mb-2 text-sm">Strona, Facebook, Instagram — cokolwiek masz. Opcjonalne.</p>
          <DynamicLinks
            values={data.existingLinks}
            onChange={(v) => set("existingLinks", v)}
            placeholder="https://"
          />
        </div>

        <div>
          <label htmlFor="bf-scale" className={LABEL}>Ile mniej więcej usług, produktów lub podstron przewidujesz?</label>
          <input
            id="bf-scale"
            type="text"
            value={data.scale}
            onChange={(e) => set("scale", e.target.value)}
            placeholder="np. kilka usług, albo: sklep z ~50 produktami — orientacyjnie"
            className={FIELD}
          />
        </div>
      </div>
    </>
  );
}

type Step3Props = StepProps & {
  thumbnailUrls: string[];
  handleFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
};

function Step3({ data, set, errors, thumbnailUrls, handleFiles, removeFile }: Step3Props) {
  return (
    <>
      <StepHeader
        title="Jak ma wyglądać?"
        sub="Pokaż nam co Ci się podoba — a wspólnie znajdziemy styl który będzie pasował do Twojej marki."
      />
      <div className="flex flex-col gap-6">
        <div>
          <label className={LABEL}>Linki do stron które się podobają</label>
          <p className="text-muted mb-2 text-sm">
            Nie muszą być z Twojej branży — może to być cokolwiek co podoba Ci się wizualnie. Opcjonalne.
          </p>
          <DynamicLinks
            values={data.inspirationLinks}
            onChange={(v) => set("inspirationLinks", v)}
            placeholder="https://"
          />
        </div>

        <div>
          <label className={LABEL}>Screenshoty i zdjęcia inspiracji</label>
          <p className="text-muted mb-2 text-sm">Maks. {MAX_FILES} plików. Opcjonalne.</p>

          {data.files.length < MAX_FILES ? (
            <label
              htmlFor="bf-files"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border px-4 py-8 text-center transition-colors hover:border-muted"
            >
              <span className="text-2xl">📎</span>
              <span className="text-base text-ink">Kliknij żeby dodać pliki</span>
              <span className="text-sm text-muted">JPG, PNG, GIF, WEBP — maks. {MAX_FILES} plików łącznie</span>
              <input
                id="bf-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="sr-only"
              />
            </label>
          ) : null}

          {thumbnailUrls.length > 0 ? (
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {thumbnailUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-card bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Inspiracja ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label={`Usuń plik ${i + 1}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-xs text-ink transition-colors hover:bg-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">{pluralFiles(data.files.length)}</p>
            </div>
          ) : null}
          <FieldError msg={errors.files} />
        </div>

        <div>
          <label htmlFor="bf-nowant" className={LABEL}>Czego absolutnie nie chcesz?</label>
          <textarea
            id="bf-nowant"
            rows={3}
            value={data.noWant}
            onChange={(e) => set("noWant", e.target.value)}
            placeholder="Nie musisz nic tu pisać — dopracujemy to razem podczas pierwszej rozmowy"
            className={cn(FIELD, "resize-y")}
          />
        </div>

        <div>
          <label htmlFor="bf-wish" className={LABEL}>Konkretny pomysł lub życzenie</label>
          <textarea
            id="bf-wish"
            rows={4}
            value={data.wish}
            onChange={(e) => set("wish", e.target.value)}
            placeholder="np. chcę żeby na górze było wideo, animacja na wejściu, moje zdjęcie na całą szerokość, licznik zadowolonych klientów... cokolwiek Ci chodzi po głowie — nie ma głupich pomysłów"
            className={cn(FIELD, "resize-y")}
          />
        </div>
      </div>
    </>
  );
}

function Step4({ data, set, errors }: StepProps) {
  return (
    <>
      <StepHeader
        title="Kolory i klimat"
        sub="Nie musisz mieć wszystkiego doprecyzowanego — zaproponujemy to co będzie najlepiej pasować do Twojego stylu."
      />
      <div className="flex flex-col gap-8">
        <div>
          <p className={LABEL}>
            Klimat marki <span className="text-lime">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Poważna i profesjonalna",
              "Ciepła i przyjazna",
              "Energiczna i odważna",
              "Elegancka i premium",
              "Prosta i na temat",
              "Lokalna i swojska",
            ].map((opt) => (
              <RadioCard
                key={opt}
                name="mood"
                value={opt}
                checked={data.mood === opt}
                onChange={(v) => set("mood", v)}
              >
                {opt}
              </RadioCard>
            ))}
          </div>
          <FieldError msg={errors.mood} />
        </div>

        <div>
          <p className={LABEL}>
            Kolory firmowe <span className="text-lime">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {[
              { v: "has-codes", label: "Tak, mam konkretne kolory" },
              { v: "has-no-codes", label: "Mam kolory ale nie znam kodów" },
              { v: "none", label: "Nie mam — wspólnie dobierzemy paletę która będzie pasować do Twojego stylu" },
            ].map(({ v, label }) => (
              <RadioCard
                key={v}
                name="colorsChoice"
                value={v}
                checked={data.colorsChoice === v}
                onChange={(val) => { set("colorsChoice", val); set("colorsText", ""); }}
              >
                {label}
              </RadioCard>
            ))}
          </div>
          <FieldError msg={errors.colorsChoice} />

          {data.colorsChoice === "has-codes" ? (
            <div className="mt-3">
              <input
                type="text"
                value={data.colorsText}
                onChange={(e) => set("colorsText", e.target.value)}
                placeholder="np. #FF0000, #002244, albo: ciemny granat i złoto"
                className={FIELD}
              />
            </div>
          ) : null}

          {data.colorsChoice === "has-no-codes" ? (
            <div className="mt-3">
              <textarea
                rows={2}
                value={data.colorsText}
                onChange={(e) => set("colorsText", e.target.value)}
                placeholder="Opisz je słowami — np. ciepły brąz, biel, odrobina zieleni"
                className={cn(FIELD, "resize-y")}
              />
            </div>
          ) : null}
        </div>

        <div>
          <p className={LABEL}>
            Jasna czy ciemna strona? <span className="text-lime">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {[
              { v: "light", label: "Jasna — białe lub jasne tło" },
              { v: "dark", label: "Ciemna — czarne lub głęboko granatowe tło" },
              { v: "no-pref", label: "Nie mam zdania — zaproponujemy to co będzie najlepiej działać" },
            ].map(({ v, label }) => (
              <RadioCard
                key={v}
                name="bgStyle"
                value={v}
                checked={data.bgStyle === v}
                onChange={(val) => set("bgStyle", val)}
              >
                {label}
              </RadioCard>
            ))}
          </div>
          <FieldError msg={errors.bgStyle} />
        </div>
      </div>
    </>
  );
}

type Step5Props = StepProps & {
  toggleSection: (v: string) => void;
  toggleReady: (v: string) => void;
};

const SECTIONS = [
  "O mnie / O nas",
  "Lista usług lub produktów",
  "Zdjęcia moich prac lub realizacji",
  "Opinie klientów",
  "Formularz kontaktowy lub dane do kontaktu",
  "Możliwość rezerwacji lub umówienia się online",
  "Blog lub aktualności",
  "Sklep internetowy",
  "Coś innego",
];

const READY_OPTIONS = [
  "Logo",
  "Zdjęcia firmy lub produktów",
  "Teksty o firmie i usługach",
  "Na razie nic — omówimy to podczas projektu",
];

function Step5({ data, set, errors, toggleSection, toggleReady }: Step5Props) {
  return (
    <>
      <StepHeader
        title="Co ma być na stronie?"
        sub="Zaznacz wszystko co chcesz mieć — możesz zmienić zdanie podczas projektu."
      />
      <div className="flex flex-col gap-8">
        <div>
          <p className={LABEL}>Co ma znaleźć się na stronie?</p>
          <div className="flex flex-col gap-2">
            {SECTIONS.map((s) => (
              <CheckCard
                key={s}
                checked={data.sections.includes(s)}
                onChange={() => toggleSection(s)}
              >
                {s}
              </CheckCard>
            ))}
          </div>
          {data.sections.includes("Coś innego") ? (
            <div className="mt-3">
              <textarea
                rows={2}
                value={data.otherSection}
                onChange={(e) => set("otherSection", e.target.value)}
                placeholder="Napisz co masz na myśli"
                className={cn(FIELD, "resize-y")}
              />
            </div>
          ) : null}
        </div>

        <div>
          <p className={LABEL}>Co już masz gotowego?</p>
          <div className="flex flex-col gap-2">
            {READY_OPTIONS.map((r) => (
              <CheckCard
                key={r}
                checked={data.ready.includes(r)}
                onChange={() => toggleReady(r)}
              >
                {r}
              </CheckCard>
            ))}
          </div>
        </div>

        <div>
          <p className={LABEL}>Język strony</p>
          <div className="flex flex-col gap-2">
            {[
              { v: "pl", label: "Polski" },
              { v: "en", label: "Angielski" },
              { v: "pl-en", label: "Polski i angielski" },
            ].map(({ v, label }) => (
              <RadioCard
                key={v}
                name="language"
                value={v}
                checked={data.language === v}
                onChange={(val) => set("language", val)}
              >
                {label}
              </RadioCard>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="bf-notes" className={LABEL}>Dodatkowe uwagi</label>
          <textarea
            id="bf-notes"
            rows={3}
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Tu możesz napisać wszystko co przyszło Ci do głowy — każda wskazówka pomaga"
            className={cn(FIELD, "resize-y")}
          />
        </div>
      </div>
    </>
  );
}

function Step6({ data, set, errors }: StepProps) {
  return (
    <>
      <StepHeader
        title="Budżet, termin i kontakt"
        sub="Ostatni krok — i możemy zaczynać."
      />
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="bf-budget" className={LABEL}>Jaki masz budżet na ten projekt?</label>
          <input
            id="bf-budget"
            type="text"
            value={data.budget}
            onChange={(e) => set("budget", e.target.value)}
            placeholder="np. 4000 zł, 3–5 tys., albo: nie wiem jeszcze — podpowiecie"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="bf-deadline" className={LABEL}>Na kiedy potrzebujesz strony?</label>
          <input
            id="bf-deadline"
            type="text"
            value={data.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            placeholder="np. konkretna data, miesiąc, albo: jak najszybciej"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="bf-email" className={LABEL}>
            E-mail <span className="text-lime">*</span>
          </label>
          <input
            id="bf-email"
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="twoj@email.pl"
            className={FIELD}
            aria-invalid={Boolean(errors.email)}
            inputMode="email"
            autoComplete="email"
          />
          <FieldError msg={errors.email} />
        </div>

        <div>
          <label htmlFor="bf-phone" className={LABEL}>Telefon</label>
          <input
            id="bf-phone"
            type="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="np. 600 123 456"
            className={FIELD}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        <div>
          <p className={LABEL}>Jak wolisz żebyśmy się odezwali?</p>
          <div className="flex flex-col gap-2">
            {[
              { v: "email", label: "Mailowo" },
              { v: "phone", label: "Telefonicznie" },
              { v: "any", label: "Obojętnie" },
            ].map(({ v, label }) => (
              <RadioCard
                key={v}
                name="contactPref"
                value={v}
                checked={data.contactPref === v}
                onChange={(val) => set("contactPref", val)}
              >
                {label}
              </RadioCard>
            ))}
          </div>
        </div>

        {/* Turnstile */}
        {SITE_KEY ? (
          <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="dark" />
        ) : null}

        {/* Zgoda RODO */}
        <div>
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-card border px-4 py-4 transition-colors",
              data.consent ? "border-lime bg-lime/5" : errors.consent ? "border-red-400" : "border-border",
            )}
          >
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="sr-only"
              aria-invalid={Boolean(errors.consent)}
            />
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                data.consent ? "border-lime bg-lime" : "border-muted",
              )}
            >
              {data.consent ? <span className="text-navy text-xs font-bold leading-none">✓</span> : null}
            </span>
            <span className="text-sm text-muted leading-relaxed">
              Wyrażam zgodę na przetwarzanie moich danych w celu kontaktu i przygotowania oferty.{" "}
              <Link
                href="/polityka-prywatnosci"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Polityka prywatności
              </Link>
              . <span className="text-lime">*</span>
            </span>
          </label>
          <FieldError msg={errors.consent} />
        </div>
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const STEP_TITLES = [
  "Kim jesteś?",
  "Po co Ci strona?",
  "Jak ma wyglądać?",
  "Kolory i klimat",
  "Co ma być na stronie?",
  "Budżet, termin i kontakt",
];

export function BriefForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BriefData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urls = data.files.map((f) => URL.createObjectURL(f));
    setThumbnailUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [data.files]);

  function set<K extends keyof BriefData>(key: K, value: BriefData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleSection(val: string) {
    setData((d) => ({
      ...d,
      sections: d.sections.includes(val)
        ? d.sections.filter((s) => s !== val)
        : [...d.sections, val],
    }));
  }

  function toggleReady(val: string) {
    setData((d) => ({
      ...d,
      ready: d.ready.includes(val)
        ? d.ready.filter((s) => s !== val)
        : [...d.ready, val],
    }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const remaining = MAX_FILES - data.files.length;
    const allowed = selected.slice(0, remaining);
    if (selected.length > remaining) {
      setErrors((err) => ({
        ...err,
        files: `Możesz dodać maks. ${MAX_FILES} plików łącznie (dodano ${allowed.length}).`,
      }));
    } else {
      setErrors((err) => ({ ...err, files: undefined }));
    }
    if (allowed.length > 0) {
      setData((d) => ({ ...d, files: [...d.files, ...allowed] }));
    }
    e.target.value = "";
  }

  function removeFile(i: number) {
    setData((d) => ({ ...d, files: d.files.filter((_, idx) => idx !== i) }));
    setErrors((err) => ({ ...err, files: undefined }));
  }

  function validate(): boolean {
    const errs: Errors = {};
    if (step === 1) {
      if (!data.name.trim()) errs.name = "Podaj imię.";
      if (!data.company.trim()) errs.company = "Podaj nazwę firmy lub marki.";
      if (!data.about.trim()) errs.about = "Opisz czym się zajmujesz.";
    }
    if (step === 2) {
      if (!data.goal.trim()) errs.goal = "Opisz cel strony.";
      if (!data.hasWebsite) errs.hasWebsite = "Wybierz jedną opcję.";
    }
    if (step === 4) {
      if (!data.mood) errs.mood = "Wybierz klimat marki.";
      if (!data.colorsChoice) errs.colorsChoice = "Wybierz opcję dotyczącą kolorów.";
      if (!data.bgStyle) errs.bgStyle = "Wybierz styl tła.";
    }
    if (step === 6) {
      if (!data.email.trim()) errs.email = "Podaj adres e-mail.";
      else if (!isEmailValid(data.email)) errs.email = "Nieprawidłowy adres e-mail.";
      if (!data.consent) errs.consent = "Zgoda na przetwarzanie danych jest wymagana.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    setServerError("");

    try {
      const fd = new FormData();

      // Pola tekstowe
      const fields: (keyof BriefData)[] = [
        "name", "company", "about", "targetClient",
        "goal", "hasWebsite", "scale",
        "noWant", "wish",
        "mood", "colorsChoice", "colorsText", "bgStyle",
        "otherSection", "language", "notes",
        "budget", "deadline", "email", "phone", "contactPref",
        "website",
      ];
      for (const k of fields) {
        fd.append(k, String(data[k] ?? ""));
      }

      // Tablice jako JSON
      fd.append("existingLinks", JSON.stringify(data.existingLinks.filter(Boolean)));
      fd.append("inspirationLinks", JSON.stringify(data.inspirationLinks.filter(Boolean)));
      fd.append("sections", JSON.stringify(data.sections));
      fd.append("ready", JSON.stringify(data.ready));

      // Turnstile token
      const token =
        (containerRef.current?.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)
          ?.value ?? "";
      fd.append("turnstileToken", token);

      // Kompresja i dołączenie plików
      for (let i = 0; i < data.files.length; i++) {
        const compressed = await compressImage(data.files[i]);
        fd.append(`file_${i}`, compressed, `inspiracja_${i + 1}.jpg`);
      }

      const res = await fetch("/api/brief", { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (res.ok && json?.ok) {
        setStatus("success");
        return;
      }

      setServerError(
        json?.error ??
          `Coś poszło nie tak. Spróbuj jeszcze raz lub napisz bezpośrednio na ${CONTACT_EMAIL}`,
      );
      setStatus("error");
    } catch {
      setServerError(
        `Coś poszło nie tak. Spróbuj jeszcze raz lub napisz bezpośrednio na ${CONTACT_EMAIL}`,
      );
      setStatus("error");
    }
  }

  const canSubmit =
    status !== "loading" &&
    data.consent &&
    isEmailValid(data.email);

  // ── Success ────────────────────────────────────────────────────────────────

  if (status === "success") {
    const firstName = data.name.split(" ")[0];
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-lime/40 text-lime text-2xl">
          ✓
        </span>
        <h1 className="font-display text-h3 text-ink">
          Dziękujemy, {firstName}!
        </h1>
        <p className="text-muted mt-4 max-w-sm text-base leading-relaxed">
          Twój brief do nas dotarł. Odezwiemy się w ciągu 48 godzin.
        </p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="min-h-screen bg-navy">
      {SITE_KEY && step === 6 ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      {/* Progress bar */}
      <div className="sticky top-[var(--header-h,65px)] z-10 bg-navy/95 backdrop-blur-sm">
        <div className="h-1 bg-border">
          <div
            className="h-full bg-lime transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            Krok {step} z 6
          </span>
          <span className="text-xs text-muted">{STEP_TITLES[step - 1]}</span>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-xl px-6 py-10 md:py-14">
        {step === 1 ? <Step1 data={data} set={set} errors={errors} /> : null}
        {step === 2 ? <Step2 data={data} set={set} errors={errors} /> : null}
        {step === 3 ? (
          <Step3
            data={data}
            set={set}
            errors={errors}
            thumbnailUrls={thumbnailUrls}
            handleFiles={handleFiles}
            removeFile={removeFile}
          />
        ) : null}
        {step === 4 ? <Step4 data={data} set={set} errors={errors} /> : null}
        {step === 5 ? (
          <Step5
            data={data}
            set={set}
            errors={errors}
            toggleSection={toggleSection}
            toggleReady={toggleReady}
          />
        ) : null}
        {step === 6 ? <Step6 data={data} set={set} errors={errors} /> : null}

        {/* Nawigacja */}
        <div className="mt-10 flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="shrink-0 text-base text-muted transition-colors hover:text-ink"
            >
              ← Wstecz
            </button>
          ) : null}

          <div className="flex-1" />

          {step < 6 ? (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-button bg-lime px-6 py-4 text-base font-semibold text-navy transition-opacity hover:opacity-90 sm:w-auto sm:px-8 sm:py-3"
            >
              Dalej →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full rounded-button bg-lime px-6 py-4 text-base font-semibold text-navy transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8 sm:py-3"
            >
              {status === "loading" ? "Wysyłamy…" : "Wyślij brief →"}
            </button>
          )}
        </div>

        {serverError ? (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {serverError}
          </p>
        ) : null}

        {/* Honeypot — ukryte, nie wypełniaj */}
        <div style={{ display: "none" }} aria-hidden="true">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
