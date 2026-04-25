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

// Hex hardcoded — var() in inline styles fails on Safari mobile and some
// Tailwind v4 contexts where the custom property isn't inherited correctly.
const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #009688, #00695C)",
    color: "#fff",
    border: "none",
    boxShadow: "0 2px 10px rgba(0,150,136,0.35)",
  },
  valendo: {
    background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 6px 20px rgba(0,150,136,0.40)",
  },
  outline: {
    background: "transparent",
    color: "#004D40",
    border: "2px solid #009688",
  },
  ghost: {
    background: "transparent",
    color: "#475569",
    border: "none",
  },
  danger: {
    background: "#DC2626",
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
        fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
        fontWeight: 700,
        borderRadius: "0.75rem",
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
