import React, { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

interface LatexRendererProps {
  children: string;
  className?: string;
  fontSize?: "sm" | "base" | "lg" | "xl";
  inline?: boolean;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "latex-display"; content: string }
  | { type: "latex-inline"; content: string }
  | { type: "image"; url: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "html"; content: string };

// ─── HTML blocks ─────────────────────────────────────────────────────────────

// Remove atributos perigosos do HTML (conteúdo vem do admin, não de usuários)
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "");
}

// Detecta se o texto contém pelo menos uma tag HTML de bloco
const HTML_BLOCK_RE = /<(table|div|ul|ol|pre|blockquote|figure|section|article|h[1-6])[^>]*>[\s\S]*?<\/\1>/gi;

// Divide o texto separando blocos HTML de nível de bloco do restante
function splitHtmlAndText(text: string): Array<{ isHtml: boolean; content: string }> {
  // Reset lastIndex (regex com /g é stateful)
  HTML_BLOCK_RE.lastIndex = 0;
  const chunks: Array<{ isHtml: boolean; content: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = HTML_BLOCK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      if (before.trim()) chunks.push({ isHtml: false, content: before });
    }
    chunks.push({ isHtml: true, content: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const after = text.slice(lastIndex);
    if (after.trim()) chunks.push({ isHtml: false, content: after });
  }

  if (chunks.length === 0) {
    chunks.push({ isHtml: false, content: text });
  }

  return chunks;
}

// ─── Tabelas Markdown ────────────────────────────────────────────────────────

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.length > 2;
}

function isSeparatorRow(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableBlock(lines: string[]): { headers: string[]; rows: string[][] } {
  const splitRow = (line: string) =>
    line.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
  const dataLines = lines.filter(l => !isSeparatorRow(l));
  const [headerLine, ...bodyLines] = dataLines;
  return {
    headers: headerLine ? splitRow(headerLine) : [],
    rows: bodyLines.map(splitRow),
  };
}

// ─── Normalização ─────────────────────────────────────────────────────────────

function normalizeImageFormats(text: string): string {
  // Converte formato Markdown ![alt](url) para [Imagem: url]
  // Cobre questões já no banco importadas antes da correção do importador
  return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "[Imagem: $2]");
}

// Divide o texto em "chunks" separando blocos de tabela Markdown do restante.
function splitTableChunks(text: string): Array<{ isTable: boolean; content: string }> {
  const lines = text.split("\n");
  const chunks: Array<{ isTable: boolean; content: string }> = [];
  let i = 0;

  while (i < lines.length) {
    if (isTableRow(lines[i])) {
      // Coleta todas as linhas consecutivas da tabela
      const tableLines: string[] = [];
      while (i < lines.length && (isTableRow(lines[i]) || isSeparatorRow(lines[i]))) {
        tableLines.push(lines[i]);
        i++;
      }
      chunks.push({ isTable: true, content: tableLines.join("\n") });
    } else {
      // Coleta linhas de texto comuns
      const textLines: string[] = [];
      while (i < lines.length && !isTableRow(lines[i])) {
        textLines.push(lines[i]);
        i++;
      }
      const joined = textLines.join("\n");
      if (joined) chunks.push({ isTable: false, content: joined });
    }
  }

  return chunks;
}

function parseLatexChunk(text: string): Segment[] {
  const segments: Segment[] = [];
  const combined = /\[Imagem(?::\s*(https?:\/\/[^\]]+))?\]|\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$|\\\(([\s\S]*?)\\\)|\$([^\s$][^$]*?[^\s$]|\S)\$/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const full = match[0];
    if (full.toLowerCase().startsWith("[imagem")) {
      const url = match[1];
      segments.push(url ? { type: "image", url } : { type: "text", content: "[imagem não disponível]" });
    } else if (match[2] !== undefined || match[3] !== undefined) {
      segments.push({ type: "latex-display", content: (match[2] ?? match[3]).trim() });
    } else {
      segments.push({ type: "latex-inline", content: (match[4] ?? match[5] ?? "").trim() });
    }
    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

function parseSegments(rawText: string): Segment[] {
  const text = normalizeImageFormats(rawText);
  const segments: Segment[] = [];

  for (const htmlChunk of splitHtmlAndText(text)) {
    if (htmlChunk.isHtml) {
      // Bloco HTML nativo — sanitiza e empacota
      segments.push({ type: "html", content: sanitizeHtml(htmlChunk.content) });
    } else {
      // Texto comum — processa Markdown tables e LaTeX
      for (const chunk of splitTableChunks(htmlChunk.content)) {
        if (chunk.isTable) {
          const tableLines = chunk.content.split("\n");
          const { headers, rows } = parseTableBlock(tableLines);
          segments.push({ type: "table", headers, rows });
        } else {
          segments.push(...parseLatexChunk(chunk.content));
        }
      }
    }
  }

  return segments;
}

function renderTextSegment(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) nodes.push(<br key={`br-${lineIdx}`} />);
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    parts.forEach((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        nodes.push(<strong key={`b-${lineIdx}-${partIdx}`} className="font-semibold">{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        nodes.push(<em key={`i-${lineIdx}-${partIdx}`}>{part.slice(1, -1)}</em>);
      } else if (part) {
        nodes.push(<React.Fragment key={`t-${lineIdx}-${partIdx}`}>{part}</React.Fragment>);
      }
    });
  });
  return nodes;
}

// Renderiza $...$ e $$...$$ dentro de HTML bruto (ex: células de tabela)
function renderLatexInHtml(html: string): string {
  // $$...$$ display mode primeiro
  let result = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => {
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false, strict: false, trust: true });
    } catch { return `$$${latex}$$`; }
  });
  // $...$ inline — evita matches dentro de atributos HTML (não contém < ou >)
  result = result.replace(/\$([^$<>\n]+?)\$/g, (_, latex) => {
    const trimmed = latex.trim();
    if (!trimmed) return `$${latex}$`;
    try {
      return katex.renderToString(trimmed, { displayMode: false, throwOnError: false, strict: false, trust: true });
    } catch { return `$${latex}$`; }
  });
  return result;
}

function renderHtmlBlock(html: string, key: string): React.ReactNode {
  return (
    <div
      key={key}
      className="html-content overflow-x-auto my-3"
      dangerouslySetInnerHTML={{ __html: renderLatexInHtml(html) }}
    />
  );
}

function renderMarkdownTable(headers: string[], rows: string[][], key: string): React.ReactNode {
  return (
    <div key={key} className="overflow-x-auto my-3">
      <table className="min-w-full border-collapse text-sm" style={{ borderColor: "var(--border)" }}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold"
                  style={{ border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--secondary-foreground)" }}>
                  <LatexRenderer inline fontSize="sm">{h}</LatexRenderer>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "var(--card)" : "var(--secondary)" }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2"
                  style={{ border: "1px solid var(--border)", color: "var(--card-foreground)" }}>
                  <LatexRenderer inline fontSize="sm">{cell}</LatexRenderer>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderKatex(latex: string, displayMode: boolean, key: string): React.ReactNode {
  // Pre-processamento: normaliza comandos comuns do LaTeX brasileiro / ENEM
  const normalized = latex
    .replace(/\\sen\b/g, "\\sin")
    .replace(/\\tg\b/g, "\\tan")
    .replace(/\\cotg\b/g, "\\cot")
    .replace(/\\cossec\b/g, "\\csc")
    .replace(/\\arctg\b/g, "\\arctan")
    .replace(/\\arcsen\b/g, "\\arcsin")
    .replace(/\\arccossec\b/g, "\\text{arccsc}")
    .replace(/\\nao\b/g, "\\neg")
    .replace(/\\ou\b/g, "\\lor")
    .replace(/\\e\b/g, "\\land")
    .replace(/\\mediana\b/g, "\\text{Md}")
    .replace(/\\moda\b/g, "\\text{Mo}")
    .replace(/\\media\b/g, "\\bar{x}")
    .replace(/\\real/g, "\\mathbb{R}")
    .replace(/\\natural/g, "\\mathbb{N}")
    .replace(/\\inteiro/g, "\\mathbb{Z}")
    .replace(/\\racional/g, "\\mathbb{Q}");

  try {
    const html = katex.renderToString(normalized, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      output: "html",
      macros: {
        // Português / ENEM
        "\\sen": "\\sin",
        "\\tg": "\\tan",
        "\\cotg": "\\cot",
        "\\cossec": "\\csc",
        "\\arctg": "\\arctan",
        "\\arcsen": "\\arcsin",
        // Conjuntos
        "\\R": "\\mathbb{R}",
        "\\N": "\\mathbb{N}",
        "\\Z": "\\mathbb{Z}",
        "\\Q": "\\mathbb{Q}",
        "\\C": "\\mathbb{C}",
        // Operadores
        "\\sen": "\\operatorname{sen}",
        "\\tg": "\\operatorname{tg}",
        "\\cotg": "\\operatorname{cotg}",
        "\\cossec": "\\operatorname{cossec}",
        "\\mdc": "\\operatorname{mdc}",
        "\\mmc": "\\operatorname{mmc}",
        "\\mod": "\\operatorname{mod}",
        "\\irr": "\\mathbb{I}",
        // Atalhos comuns
        "\\floor": "\\lfloor #1 \\rfloor",
        "\\ceil": "\\lceil #1 \\rceil",
        "\\abs": "\\left| #1 \\right|",
        "\\norm": "\\left\\| #1 \\right\\|",
        "\\diff": "\\,\\mathrm{d}",
        // Geometria
        "\\grau": "^\\circ",
        "\\paralelo": "\\parallel",
        "\\perp": "\\perp",
        "\\angulo": "\\angle",
        "\\tri": "\\triangle",
        // Probabilidade / Estatística
        "\\P": "P",
        "\\E": "E",
        "\\Var": "\\operatorname{Var}",
        // Análise Combinatória
        "\\comb": "C_{#1}^{#2}",
        "\\perm": "P_{#1}^{#2}",
        "\\arr": "A_{#1}^{#2}",
      },
    });

    if (displayMode) {
      return (
        <span
          key={key}
          className="block my-3 overflow-x-auto text-center"
          style={{ lineHeight: 2 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <span
        key={key}
        className="inline-block align-middle"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    // Fallback: tenta renderizar sem os macros personalizados
    try {
      const fallbackHtml = katex.renderToString(normalized, {
        displayMode,
        throwOnError: false,
        strict: "ignore",
        trust: true,
      });
      if (displayMode) {
        return <span key={key} className="block my-3 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: fallbackHtml }} />;
      }
      return <span key={key} className="inline-block align-middle" dangerouslySetInnerHTML={{ __html: fallbackHtml }} />;
    } catch {
      // Último recurso: mostra o LaTeX cru com estilo
      return (
        <code key={key}
          className="px-1.5 py-0.5 rounded font-mono text-sm"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
          title="Fórmula não pôde ser renderizada">
          {displayMode ? `$$${latex}$$` : `$${latex}$`}
        </code>
      );
    }
  }
}

const fontSizeMap = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" };

export function LatexRenderer({ children, className, fontSize = "base", inline = false }: LatexRendererProps) {
  const rendered = useMemo(() => {
    if (!children) return null;
    return parseSegments(children).map((seg, idx) => {
      const key = `seg-${idx}`;
      switch (seg.type) {
        case "latex-display": return renderKatex(seg.content, true, key);
        case "latex-inline": return renderKatex(seg.content, false, key);
        case "image": return (
          <img key={key} src={seg.url} alt="Imagem da questão"
            className="max-w-full rounded-lg my-2 mx-auto block"
            style={{ border: "1px solid #E2D9EE" }} />
        );
        case "table": return renderMarkdownTable(seg.headers, seg.rows, key);
        case "html": return renderHtmlBlock(seg.content, key);
        case "text": return <React.Fragment key={key}>{renderTextSegment(seg.content)}</React.Fragment>;
      }
    });
  }, [children]);

  if (inline) return <span className={cn(fontSizeMap[fontSize], "leading-relaxed", className)} style={{ color: "var(--text-question)" }}>{rendered}</span>;
  return <div className={cn("leading-relaxed space-y-1", fontSizeMap[fontSize], className)} style={{ color: "var(--text-question)" }}>{rendered}</div>;
}

// =============================================================================
// Alternativa — suporte a LaTeX, imagem e texto
// =============================================================================

interface AlternativeProps {
  id: string;
  text: string;
  imageUrl?: string | null; // URL directa da imagem da alternativa
  selected: boolean;
  correct?: boolean | null;
  onClick: () => void;
  disabled?: boolean;
}

export function Alternative({ id, text, imageUrl, selected, correct, onClick, disabled = false }: AlternativeProps) {
  const isRevealed = correct !== null && correct !== undefined;
  const isCorrectAnswer = isRevealed && correct === true;
  const isWrongSelected = isRevealed && selected && correct === false;

  // Estilo "prova": borda esquerda colorida + fundo sutilmente tintado
  const accentColor = isCorrectAnswer ? "#16A34A"
    : isWrongSelected ? "#DC2626"
    : selected ? "#1E40AF"
    : "transparent";

  const bgColor = isCorrectAnswer ? "#F0FDF4"
    : isWrongSelected ? "#FEF2F2"
    : selected ? "#EFF6FF"
    : "#FAFAFA";

  const borderColor = isCorrectAnswer ? "#BBF7D0"
    : isWrongSelected ? "#FECACA"
    : selected ? "#BFDBFE"
    : "#E5E7EB";

  const badgeBg = isCorrectAnswer ? "#16A34A"
    : isWrongSelected ? "#DC2626"
    : selected ? "#1E40AF"
    : "#fff";

  const badgeBorder = isCorrectAnswer ? "#16A34A"
    : isWrongSelected ? "#DC2626"
    : selected ? "#1E40AF"
    : "#D1D5DB";

  const badgeColor = (selected || isCorrectAnswer) ? "#fff" : "#6B7280";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-start gap-3 text-left transition-all"
      style={{
        padding: "0.65rem 1rem",
        borderRadius: "0.5rem",
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${accentColor === "transparent" ? "#E5E7EB" : accentColor}`,
        background: bgColor,
        color: "#2C2C3A",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled && !selected && !isCorrectAnswer ? 0.55 : 1,
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <span
        className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{
          border: `1.5px solid ${badgeBorder}`,
          background: badgeBg,
          color: badgeColor,
          fontSize: "0.7rem",
          letterSpacing: "0.01em",
        }}
      >
        {id}
      </span>

      <div className="flex-1">
        {imageUrl && (
          <img src={imageUrl} alt={`Alternativa ${id}`}
            className="max-w-full rounded mb-1"
            style={{ maxHeight: 200, objectFit: "contain" }} />
        )}
        {text && text !== "[Imagem]" && (
          <LatexRenderer inline fontSize="sm">{text}</LatexRenderer>
        )}
        {text === "[Imagem]" && !imageUrl && (
          <span className="text-xs italic" style={{ color: "#94A3B8" }}>Imagem não disponível</span>
        )}
      </div>
    </button>
  );
}

// =============================================================================
// QuestionCard
// =============================================================================

interface QuestionCardProps {
  order: number;
  total: number;
  enunciado: string;
  url_imagem?: string | null;
  alternativas: Record<string, string | { text?: string; file?: string }>;
  selectedAnswer: string | null;
  correctAnswer?: string | null;
  onAnswer: (id: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  order, total, enunciado, url_imagem, alternativas,
  selectedAnswer, correctAnswer, onAnswer, disabled = false,
}: QuestionCardProps) {
  const altEntries = Object.entries(alternativas).filter(([, v]) => v !== null && v !== "").sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      {/* Contador — discreto, canto superior */}
      <p className="text-xs" style={{ color: "#9CA3AF", letterSpacing: "0.04em" }}>
        Questão <span style={{ fontWeight: 600, color: "#6B7280" }}>{order}</span> de {total}
      </p>

      {/* Enunciado — tipografia limpa, sem caixa */}
      <div style={{ lineHeight: 1.75, color: "#2C2C3A" }}>
        <LatexRenderer fontSize="base">{enunciado}</LatexRenderer>
      </div>

      {url_imagem && !enunciado.includes(url_imagem) && (
        <figure className="my-2">
          <img src={url_imagem} alt={`Imagem da questão ${order}`}
            className="max-w-full mx-auto"
            style={{ borderRadius: "0.375rem", border: "1px solid #E5E7EB" }} loading="lazy" />
        </figure>
      )}

      {/* Separador sutil antes das alternativas */}
      <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "0.75rem" }}>
        <div className="space-y-2">
          {altEntries.map(([id, value]) => {
            const text = typeof value === "string" ? value : (value !== null && value?.text) ? value.text : "";
            const imageUrl = value !== null && typeof value === "object" ? value.file ?? null : null;

            const isSelected = selectedAnswer === id;
            const isCorrect = correctAnswer != null
              ? id === correctAnswer ? true : isSelected ? false : null
              : null;

            return (
              <Alternative key={id} id={id} text={text} imageUrl={imageUrl}
                selected={isSelected} correct={isCorrect}
                onClick={() => onAnswer(id)} disabled={disabled} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
