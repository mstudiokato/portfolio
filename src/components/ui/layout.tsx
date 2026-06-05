import { cn } from "@/lib/cn";

/**
 * Layout primitives Etap 2.
 * Container — stała max-width + responsywny padding boczny (max-w-6xl = 72rem).
 * Section — pionowy rytm sekcji (token py-section / py-section-sm), opcjonalne tło.
 */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

const SECTION_SIZE: Record<"md" | "tight" | "sm", string> = {
  md: "py-section",
  tight: "py-section-tight", // ~30% mniej (Specjalizacje, V5)
  sm: "py-section-sm",
};

const SECTION_TONE: Record<"navy" | "section" | "surface", string> = {
  navy: "", // domyślne tło body (navy)
  section: "bg-section",
  surface: "bg-surface",
};

export function Section({
  id,
  tone = "navy",
  size = "md",
  className,
  children,
}: {
  id?: string;
  tone?: "navy" | "section" | "surface";
  size?: "md" | "tight" | "sm";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(SECTION_SIZE[size], SECTION_TONE[tone], className)}
    >
      {children}
    </section>
  );
}
