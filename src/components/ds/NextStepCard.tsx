import { ArrowRight } from "@/icons";
import { Card } from "./Card";
import { Button } from "./Button";

interface NextStepCardProps {
  /** Ex: "Diagnóstico · etapa 2 de 3" */
  stage?: string;
  title: string;
  context: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function NextStepCard({
  stage,
  title,
  context,
  primaryLabel,
  onPrimary,
  secondaryLabel = "Mais tarde",
  onSecondary,
}: NextStepCardProps) {
  return (
    <Card padding={22} style={{ borderLeft: "4px solid #009688" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span className="pr-eyebrow" style={{ fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0 }}>Próximo passo</span>
        {stage && (
          <span
            style={{
              fontFamily: "var(--pr-font-mono)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--pr-meta-fg)",
              textAlign: "right",
            }}
          >
            {stage}
          </span>
        )}
      </div>
      <h3
        className="pr-h3"
        style={{ marginBottom: 8, fontSize: "1.1rem" }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--pr-muted-fg)",
          fontSize: 15,
          marginBottom: 16,
          maxWidth: "56ch",
          lineHeight: 1.55,
        }}
      >
        {context}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button onClick={onPrimary} rightIcon={ArrowRight}>
          {primaryLabel}
        </Button>
        {onSecondary && (
          <Button variant="ghost" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
