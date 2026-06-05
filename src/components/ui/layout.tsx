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

export function Section({
  id,
  tone = "navy",
  size = "md",
  className,
  children,
}: {
  id?: string;
  tone?: "navy" | "section";
  size?: "md" | "sm";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        size === "sm" ? "py-section-sm" : "py-section",
        tone === "section" && "bg-section",
        className,
      )}
    >
      {children}
    </section>
  );
}
