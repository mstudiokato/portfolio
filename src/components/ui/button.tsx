import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Button (sek. 6 polish). Warianty: primary (lime, wypełniony) i secondary
 * (outline). Polimorficzny — z `href` renderuje next/link <a>, inaczej <button>.
 * Focus-visible (lime) dziedziczony globalnie z globals.css.
 */

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-lime text-navy hover:opacity-90",
  secondary: "border border-border text-ink hover:border-muted",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-caption",
  md: "px-6 py-3 text-body",
  lg: "px-8 py-4 text-body-lg",
};

// rounded-button (2px) — ostry, sportowy kant; świadomie NIE pill (Editorial Sports Dark).
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-button font-medium transition-[opacity,border-color,color] duration-200";

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  // Przekazywane do <a>, gdy renderujemy jako link (np. link zewnętrzny).
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
>;

export function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
