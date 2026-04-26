import type { LucideIcon } from "@/icons";

export type IconTileTone = "teal" | "info" | "warn" | "purple" | "gold";

const TONES: Record<IconTileTone, { bg: string; fg: string }> = {
  teal:   { bg: "var(--pr-teal-soft)",   fg: "var(--pr-teal-darker)" },
  info:   { bg: "var(--pr-info-bg)",     fg: "var(--pr-info-fg)" },
  warn:   { bg: "var(--pr-warn-soft)",   fg: "var(--pr-warn-fg)" },
  purple: { bg: "#F3E8FF",               fg: "var(--pr-accent-purple)" },
  gold:   { bg: "#FEF3C7",               fg: "var(--pr-accent-gold)" },
};

interface IconTileProps {
  icon: LucideIcon;
  tone?: IconTileTone;
  size?: number;
}

export function IconTile({ icon: Icon, tone = "teal", size = 40 }: IconTileProps) {
  const t = TONES[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        background: t.bg,
        color: t.fg,
        borderRadius: "var(--pr-radius)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={Math.round(size * 0.5)} />
    </div>
  );
}
