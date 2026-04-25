import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  /** Usa Source Serif 4 no h3 — para seções editoriais/leitura longa */
  editorial?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export function SectionHeader({ eyebrow, title, editorial = false, children, style }: SectionHeaderProps) {
  return (
    <div className="pr-section-header" style={style}>
      {eyebrow && (
        <span className="pr-eyebrow">{eyebrow}</span>
      )}
      <h3 className={editorial ? "pr-h3 pr-h3--editorial" : "pr-h3"}>{title}</h3>
      {children}
    </div>
  );
}
