import type { HTMLAttributes, ReactNode } from "react";

export type PillTone = "teal" | "info" | "warn" | "danger" | "success" | "ink";

const TONES: Record<PillTone, { bg: string; color: string; border: string }> = {
  teal:    { bg: "var(--pr-teal-soft)",   color: "var(--pr-teal-darker)", border: "var(--pr-teal-border)" },
  info:    { bg: "var(--pr-info-bg)",     color: "var(--pr-info-fg)",     border: "var(--pr-info-border)" },
  warn:    { bg: "var(--pr-warn-soft)",   color: "var(--pr-warn-fg)",     border: "var(--pr-warn-border)" },
  danger:  { bg: "var(--pr-danger-bg)",   color: "var(--pr-danger-fg)",   border: "var(--pr-danger-border)" },
  success: { bg: "var(--pr-success-bg)",  color: "var(--pr-success-fg)",  border: "var(--pr-success-border)" },
  ink:     { bg: "var(--pr-ink)",         color: "#fff",                  border: "transparent" },
};

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  children: ReactNode;
}

export function Pill({ tone = "teal", children, style, ...props }: PillProps) {
  const t = TONES[tone];
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--pr-font-ui)",
        fontSize: 12,
        fontWeight: 700,
        padding: "5px 11px",
        borderRadius: 99,
        lineHeight: 1,
        background: t.bg,
        color: t.color,
        border: `1.5px solid ${t.border}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
