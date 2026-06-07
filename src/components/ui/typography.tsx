import { cn } from "@/lib/cn";

/**
 * Skala typograficzna (sek. 6.02). Nagłówki = Clash Display (font-display),
 * tekst/label/caption = Switzer (font-sans, domyślny). Rozmiar/leading/tracking/
 * weight niesie token text-* z @theme. Kolor domyślny można nadpisać className
 * lub — gdy trzeba pewnie wygrać z klasą — inline `style` (np. kolor z panelu).
 */

type Props = {
  className?: string;
  /** Inline style — m.in. nadpisanie koloru (wygrywa z klasą Tailwinda). */
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function H1({ className, style, children }: Props) {
  return (
    <h1
      className={cn("font-display text-h1 text-ink text-balance", className)}
      style={style}
    >
      {children}
    </h1>
  );
}

export function H2({ className, style, children }: Props) {
  return (
    <h2 className={cn("font-display text-h2 text-ink", className)} style={style}>
      {children}
    </h2>
  );
}

export function H3({ className, style, children }: Props) {
  return (
    <h3 className={cn("font-display text-h3 text-ink", className)} style={style}>
      {children}
    </h3>
  );
}

export function H4({ className, style, children }: Props) {
  return (
    <h4 className={cn("font-display text-h4 text-ink", className)} style={style}>
      {children}
    </h4>
  );
}

/** Lead / akapit wprowadzający (większy body). */
export function Lead({ className, style, children }: Props) {
  return (
    <p className={cn("text-body-lg text-muted", className)} style={style}>
      {children}
    </p>
  );
}

export function Body({ className, style, children }: Props) {
  return (
    <p className={cn("text-body text-ink", className)} style={style}>
      {children}
    </p>
  );
}

/** Eyebrow/label — wersaliki, tracking, domyślnie limonkowy. */
export function Label({ className, style, children }: Props) {
  return (
    <span
      className={cn("text-label text-lime uppercase", className)}
      style={style}
    >
      {children}
    </span>
  );
}

export function Caption({ className, style, children }: Props) {
  return (
    <p className={cn("text-caption text-muted", className)} style={style}>
      {children}
    </p>
  );
}
