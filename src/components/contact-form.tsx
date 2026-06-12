"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { contactSchema } from "@/lib/contact-schema";
import {
  TurnstileWidget,
  type TurnstileHandle,
} from "@/components/turnstile-widget";

const FIELD =
  "bg-surface border-border rounded-button text-ink placeholder:text-muted mt-2 w-full border px-4 py-3 focus-visible:border-lime";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<
  Record<"name" | "email" | "subject" | "message" | "consent", string>
>;

export function ContactForm({ calUrl }: { calUrl: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  // Kontrolowane wartości (proste, bez bibliotek formularzowych).
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
    firma: "", // honeypot
  });

  function update<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = contactSchema.safeParse({
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
      consent: values.consent,
    });

    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({
        name: f.name?.[0],
        email: f.email?.[0],
        subject: f.subject?.[0],
        message: f.message?.[0],
        consent: f.consent?.[0],
      });
      return;
    }

    setStatus("loading");
    setServerError("");

    const token = turnstileRef.current?.getToken() ?? "";

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          firma: values.firma,
          turnstileToken: token,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        delivered?: boolean;
        error?: string;
      } | null;

      // Sukces tylko gdy serwer potwierdził dostarczenie. ok:true z delivered:false
      // (np. tryb dev/preview bez klucza) NIE może pokazywać „Dziękuję".
      if (res.ok && data?.delivered !== false) {
        setStatus("success");
        setValues({
          name: "",
          email: "",
          subject: "",
          message: "",
          consent: false,
          firma: "",
        });
        turnstileRef.current?.reset();
        return;
      }

      setServerError(
        data?.error ??
          "Coś poszło nie tak, spróbuj ponownie lub napisz bezpośrednio na kontakt@michal-stezaly.pl",
      );
      setStatus("error");
      turnstileRef.current?.reset();
    } catch {
      setServerError(
        "Coś poszło nie tak. Napisz bezpośrednio na kontakt@michal-stezaly.pl",
      );
      setStatus("error");
      turnstileRef.current?.reset();
    }
  }

  if (status === "success") {
    const calConfigured = calUrl !== "#";
    return (
      <div
        role="status"
        className="border-lime/30 bg-surface rounded-card flex max-w-md flex-col items-start gap-4 self-start border p-6 text-left sm:p-8"
      >
        <span
          aria-hidden
          className="border-lime/40 text-lime flex h-9 w-9 items-center justify-center rounded-full border text-base"
        >
          ✓
        </span>

        <div className="flex flex-col gap-1.5">
          <p className="font-display text-ink text-h4">
            Dziękuję za wiadomość!
          </p>
          <p className="text-caption text-ink">
            Odezwę się najszybciej jak to możliwe — zazwyczaj w ciągu 24 godzin.
            Jeśli wolisz porozmawiać od razu,{" "}
            <a
              href={calConfigured ? calUrl : "#kontakt"}
              target={calConfigured ? "_blank" : undefined}
              rel={calConfigured ? "noopener noreferrer" : undefined}
              className="text-lime hover:underline"
            >
              zarezerwuj termin poniżej
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Formularz kontaktowy"
    >
      <div>
        <label htmlFor="cf-name" className="text-label text-muted uppercase">
          Imię i nazwisko
        </label>
        <input
          id="cf-name"
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Jan Kowalski"
          className={FIELD}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? (
          <p className="text-caption mt-1 text-red-400">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cf-email" className="text-label text-muted uppercase">
          E-mail
        </label>
        <input
          id="cf-email"
          type="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="jan@firma.pl"
          className={FIELD}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? (
          <p className="text-caption mt-1 text-red-400">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cf-subject" className="text-label text-muted uppercase">
          Temat <span className="normal-case">(opcjonalnie)</span>
        </label>
        <input
          id="cf-subject"
          type="text"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="np. Oprawa wizualna eventu"
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="text-label text-muted uppercase">
          Wiadomość
        </label>
        <textarea
          id="cf-message"
          rows={4}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Kilka zdań o projekcie…"
          className={FIELD}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p className="text-caption mt-1 text-red-400">{errors.message}</p>
        ) : null}
      </div>

      {/* Honeypot — ukryte pole; wypełnione = bot. NIE aria-hidden. */}
      <div style={{ display: "none" }} aria-hidden="false">
        <label htmlFor="cf-firma">Firma (nie wypełniaj)</label>
        <input
          id="cf-firma"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.firma}
          onChange={(e) => update("firma", e.target.value)}
        />
      </div>

      {/* Zgoda RODO. */}
      <div>
        <label className="text-caption text-muted flex items-start gap-3">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="accent-lime mt-1 shrink-0"
            aria-invalid={Boolean(errors.consent)}
          />
          <span>
            Wyrażam zgodę na przetwarzanie danych osobowych przez Michała
            Stężałego w celu odpowiedzi na wiadomość.{" "}
            <Link
              href="/polityka-prywatnosci"
              className="text-lime hover:underline"
            >
              Polityka prywatności
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="text-caption mt-1 text-red-400">{errors.consent}</p>
        ) : null}
      </div>

      {/* Widget Turnstile (gdy skonfigurowany site key). */}
      <TurnstileWidget ref={turnstileRef} />

      {serverError ? (
        <p role="alert" className="text-caption text-red-400">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-button bg-lime text-navy inline-flex w-fit items-center justify-center px-6 py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Wysyłanie…" : "Wyślij ↗"}
      </button>
    </form>
  );
}
