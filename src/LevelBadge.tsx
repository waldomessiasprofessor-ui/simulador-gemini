// Seal de nível reutilizável — aparece ao lado do nome do aluno
// em qualquer lugar da UI.

export type DiagnosisLevel = "iniciante" | "intermediario" | "avancado";

interface Props {
  level: DiagnosisLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const INFO: Record<DiagnosisLevel, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  iniciante:     { emoji: "🌱", label: "Iniciante",     color: "#16A34A", bg: "#DCFCE7", border: "#86EFAC" },
  intermediario: { emoji: "⚡", label: "Intermediário", color: "#D97706", bg: "#FEF9C3", border: "#FDE047" },
  avancado:      { emoji: "🚀", label: "Avançado",      color: "#7C3AED", bg: "#F3E8FF", border: "#C4B5FD" },
};

const SIZES = {
  sm: { fontSize: 10, padding: "2px 6px", emojiSize: 11, borderRadius: 6, gap: 3 },
  md: { fontSize: 12, padding: "3px 8px", emojiSize: 13, borderRadius: 8, gap: 4 },
  lg: { fontSize: 14, padding: "5px 12px", emojiSize: 16, borderRadius: 10, gap: 5 },
};

export default function LevelBadge({ level, size = "sm", showLabel = true }: Props) {
  const info = INFO[level];
  const s = SIZES[size];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      padding: s.padding, borderRadius: s.borderRadius,
      background: info.bg, border: `1.5px solid ${info.border}`,
      color: info.color, fontWeight: 700, fontSize: s.fontSize,
      whiteSpace: "nowrap", flexShrink: 0, lineHeight: 1,
    }}>
      <span style={{ fontSize: s.emojiSize }}>{info.emoji}</span>
      {showLabel && <span>{info.label}</span>}
    </span>
  );
}
