interface StatNumberProps {
  value: number | string;
  unit?: string;
  label?: string;
  color?: string;
}

export function StatNumber({ value, unit, label, color = "var(--pr-fg-heading)" }: StatNumberProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        className="pr-stat"
        style={{ color, fontSize: "2.25rem", lineHeight: 1 }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "0.6em", fontWeight: 800, marginLeft: 2 }}>{unit}</span>
        )}
      </div>
      {label && (
        <div
          style={{
            fontFamily: "var(--pr-font-ui)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--pr-meta-fg)",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
