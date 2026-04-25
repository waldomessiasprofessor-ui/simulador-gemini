import type { HTMLAttributes } from "react";

export type CardTone = "teal" | "info" | "warn" | "danger" | "success";

const TONES: Record<CardTone, { bg: string; border: string }> = {
  teal:    { bg: "var(--pr-teal-soft)",   border: "var(--pr-teal-border)" },
  info:    { bg: "var(--pr-info-bg)",     border: "var(--pr-info-border)" },
  warn:    { bg: "var(--pr-warn-soft)",   border: "var(--pr-warn-border)" },
  danger:  { bg: "var(--pr-danger-bg)",   border: "var(--pr-danger-border)" },
  success: { bg: "var(--pr-success-bg)",  border: "var(--pr-success-border)" },
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tinted?: boolean;
  tone?: CardTone;
  clickable?: boolean;
  padding?: number | string;
}

export function Card({
  tinted = false,
  tone,
  clickable = false,
  padding = 20,
  children,
  style,
  onClick,
  ...props
}: CardProps) {
  const t = tinted && tone ? TONES[tone] : { bg: "var(--card)", border: "var(--border)" };
  const isClickable = clickable || !!onClick;

  return (
    <div
      {...props}
      onClick={onClick}
      style={{
        background: t.bg,
        border: `1.5px solid ${t.border}`,
        borderRadius: "var(--pr-radius-lg)",
        padding,
        cursor: isClickable ? "pointer" : "default",
        transition: "box-shadow 0.2s, transform 0.2s",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--pr-shadow)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }
      }}
    >
      {children}
    </div>
  );
}
