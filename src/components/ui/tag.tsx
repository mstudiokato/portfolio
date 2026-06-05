import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Tag / chip kategorii. Używany jako etykieta na karcie projektu oraz jako
 * pigułka filtra na /projekty. Z `href` renderuje link, inaczej statyczny span.
 * `active` = stan wybrany (lime, wypełniony).
 */

const BASE =
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-caption transition-colors";

function styles(active: boolean): string {
  return active
    ? "border border-lime bg-lime text-navy"
    : "border border-border text-muted hover:text-ink hover:border-muted";
}

type Props = {
  href?: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-current"?: "page" | undefined;
};

export function Tag({
  href,
  active = false,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(BASE, styles(active), className);
  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
