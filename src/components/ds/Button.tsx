import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "valendo" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const SIZES: Record<ButtonSize, { padding: string; fontSize: string }> = {
  sm: { padding: "7px 13px", fontSize: "13px" },
  md: { padding: "10px 18px", fontSize: "15px" },
  lg: { padding: "13px 22px", fontSize: "16px" },
};

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--pr-grad-btn)",
    color: "#fff",
    border: "none",
    boxShadow: "var(--pr-shadow-teal)",
  },
  valendo: {
    background: "var(--pr-grad-hero)",
    color: "#fff",
    border: "none",
    boxShadow: "var(--pr-shadow-teal-lg)",
  },
  outline: {
    background: "transparent",
    color: "var(--pr-teal-darker)",
    border: "2px solid var(--pr-teal)",
  },
  ghost: {
    background: "transparent",
    color: "var(--pr-muted-fg)",
    border: "none",
  },
  danger: {
    background: "var(--pr-danger)",
    color: "#fff",
    border: "none",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon: Left,
  rightIcon: Right,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const s = SIZES[size];
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--pr-font-ui)",
        fontWeight: 700,
        borderRadius: "var(--pr-radius)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s, transform 0.15s",
        lineHeight: 1,
        opacity: disabled ? 0.5 : 1,
        padding: s.padding,
        fontSize: s.fontSize,
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {Left && <Left size={16} />}
      {children}
      {Right && <Right size={16} />}
    </button>
  );
}
