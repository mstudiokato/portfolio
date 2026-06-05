import { z } from "zod";

/**
 * Wspólny schemat walidacji formularza kontaktowego (klient + serwer).
 * Komunikaty po polsku. Honeypot i token Turnstile są obsługiwane osobno
 * (poza tym schematem) — tu walidujemy pola widoczne dla użytkownika.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Podaj imię i nazwisko."),
  email: z
    .string()
    .trim()
    .min(1, "Podaj adres e-mail.")
    .email("Nieprawidłowy adres e-mail."),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Wpisz treść wiadomości."),
  consent: z
    .boolean()
    .refine((v) => v === true, "Zgoda na przetwarzanie danych jest wymagana."),
});

export type ContactInput = z.infer<typeof contactSchema>;
