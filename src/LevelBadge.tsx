// Seal de nível reutilizável — aparece ao lado do nome do aluno
// em qualquer lugar da UI.
import { DIAGNOSIS_LEVELS } from "@/lib/xp";

export type DiagnosisLevel = "curioso" | "aprendiz" | "calculista" | "expert" | "genio";

interface Props {
  level: DiagnosisLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const SIZES = {
  sm: { fontSize: 10, padding: "2px 6px", emojiSize: 11, borderRadius: 6, gap: 3 },
  md: { fontSize: 12, padding: "3px 8px", emojiSize: 13, borderRadius: 8, gap: 4 },
  lg: { fontSize: 14, padding: "5px 12px", emojiSize: 16, borderRadius: 10, gap: 5 },
};

export default function LevelBadge({ level, size = "sm", showLabel = true }: Props) {
  const info = DIAGNOSIS_LEVELS[level] ?? DIAGNOSIS_LEVELS["curioso"];
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
