"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pływające menu (speed dial) w panelu Keystatic. Główny przycisk rozwija listę
 * trzech narzędzi właściciela. Keystatic 0.5 nie pozwala dodać własnych linków
 * do nawigacji bocznej, więc kotwiczymy je jako stały element u dołu.
 *
 * - "Wizualny edytor hero" → /admin/hero-editor (ta sama trasa co wcześniej)
 * - "Kreator briefu"       → /brief (nowa karta)
 * - "Generator podglądu"   → /prevgenerator (nowa karta)
 *
 * Inline style (jak poprzedni przycisk) — panel Keystatic ma własny runtime,
 * więc nie polegamy na klasach Tailwind w tej trasie.
 */

type Item = {
  label: string;
  href: string;
  icon: string;
  newTab?: boolean;
};

const ITEMS: Item[] = [
  { label: "Wizualny edytor hero", href: "/admin/hero-editor", icon: "🎚️" },
  { label: "Kreator briefu", href: "/brief", icon: "📝", newTab: true },
  { label: "Generator podglądu", href: "/prevgenerator", icon: "🖼️", newTab: true },
];

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.625rem 1rem",
  borderRadius: "9999px",
  background: "#111827",
  color: "#ffffff",
  fontFamily: "system-ui, sans-serif",
  fontSize: "0.875rem",
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.12)",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export function KeystaticFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Klik poza menu zamyka je.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      {/* Lista opcji — rozwija się nad przyciskiem */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
          // Animacja: transform + opacity, 200ms.
          transform: open ? "translateY(0)" : "translateY(0.5rem)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 200ms ease, opacity 200ms ease",
        }}
      >
        {ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noopener noreferrer" : undefined}
            style={PILL}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      {/* Główny przycisk — przełącznik */}
      <button
        type="button"
        aria-expanded={open}
        aria-label="Narzędzia"
        onClick={() => setOpen((v) => !v)}
        style={PILL}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
            fontSize: "1.1rem",
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        Narzędzia
      </button>
    </div>
  );
}
