import { cn } from "@/lib/cn";

/**
 * Skala typograficzna (sek. 6.02). Nagłówki = Clash Display (font-display),
 * tekst/label/caption = Switzer (font-sans, domyślny). Rozmiar/leading/tracking/
 * weight niesie token text-* z @theme. Kolor domyślny można nadpisać className.
 */

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function H1({ className, children }: Props) {
  return (
    <h1 className={cn("font-display text-h1 text-ink text-balance", className)}>
      {children}
    </h1>
  );
}

export function H2({ className, children }: Props) {
  return (
    <h2 className={cn("font-display text-h2 text-ink", className)}>
      {children}
    </h2>
  );
}

export function H3({ className, children }: Props) {
  return (
    <h3 className={cn("font-display text-h3 text-ink", className)}>
      {children}
    </h3>
  );
}

export function H4({ className, children }: Props) {
  return (
    <h4 className={cn("font-display text-h4 text-ink", className)}>
      {children}
    </h4>
  );
}

/** Lead / akapit wprowadzający (większy body). */
export function Lead({ className, children }: Props) {
  return <p className={cn("text-body-lg text-muted", className)}>{children}</p>;
}

export function Body({ className, children }: Props) {
  return <p className={cn("text-body text-ink", className)}>{children}</p>;
}

/** Eyebrow/label — wersaliki, tracking, domyślnie limonkowy. */
export function Label({ className, children }: Props) {
  return (
    <span className={cn("text-label text-lime uppercase", className)}>
      {children}
    </span>
  );
}

export function Caption({ className, children }: Props) {
  return <p className={cn("text-caption text-muted", className)}>{children}</p>;
}
