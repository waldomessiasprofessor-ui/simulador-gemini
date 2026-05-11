import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Sparkles, X, Loader2, AlertTriangle, ThumbsUp, ThumbsDown, Tag, Info } from "@/icons";

export type AuditGenericType = "discursiva" | "flashcard" | "formula" | "exercicio";

type AuditResult = {
  nota_qualidade: number;
  problemas: string[];
  sugestoes: string[];
  parecer: string;
  conteudo_melhorado: string | null;
  gabarito_correto: boolean | null;
  gabarito_sugerido: string | null;
  tags_sugeridas: string[];
  dificuldade_real: string | null;
};

const TYPE_LABELS: Record<AuditGenericType, string> = {
  discursiva: "Questão Discursiva",
  flashcard:  "Flashcard",
  formula:    "Fórmula",
  exercicio:  "Exercício",
};

const APPLY_LABEL: Record<AuditGenericType, string> = {
  discursiva: "resolução melhorada",
  flashcard:  "verso melhorado",
  formula:    "fórmula corrigida",
  exercicio:  "explicação melhorada",
};

export function GeminiAuditModal({
  type,
  content,
  itemLabel,
  onApplyFix,
  onClose,
}: {
  type: AuditGenericType;
  content: string;
  itemLabel?: string;
  onApplyFix?: (improved: string) => void;
  onClose: () => void;
}) {
  const auditMutation = trpc.questions.auditGenericContent.useMutation();
  const audit = auditMutation.data?.audit as AuditResult | undefined;
  const [applySelected, setApplySelected] = useState(false);
  const [editedImproved, setEditedImproved] = useState("");

  function onSuccess(result: AuditResult) {
    setEditedImproved(result.conteudo_melhorado ?? "");
    setApplySelected(!!result.conteudo_melhorado);
  }

  function handleStart() {
    auditMutation.mutate(
      { type, content, itemLabel },
      { onSuccess: (d) => onSuccess(d.audit as AuditResult) },
    );
  }

  function handleApply() {
    if (!editedImproved.trim() || !onApplyFix) return;
    onApplyFix(editedImproved.trim());
    onClose();
  }

  function notaCor(n: number) {
    if (n >= 8) return "#166534";
    if (n >= 6) return "#92400E";
    return "#991B1B";
  }

  const title = `${TYPE_LABELS[type]}${itemLabel ? ` — ${itemLabel}` : ""}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1A1A2E, #521F80)", color: "#fff" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="font-bold">Auditoria Gemini — {title}</span>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5 opacity-80 hover:opacity-100" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Estado inicial */}
          {!auditMutation.isPending && !audit && !auditMutation.error && (
            <div className="text-center py-6 space-y-4">
              <div
                className="h-16 w-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1A1A2E, #521F80)" }}
              >
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
                  Auditar com Gemini
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  O Gemini vai analisar este conteúdo, identificar problemas e sugerir melhorias que você poderá revisar e aplicar com um clique.
                </p>
              </div>
              <button
                onClick={handleStart}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #521F80, #01738d)" }}
              >
                <Sparkles className="h-4 w-4" /> Iniciar auditoria
              </button>
            </div>
          )}

          {/* Carregando */}
          {auditMutation.isPending && (
            <div className="text-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: "#521F80" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                Gemini analisando o conteúdo...
              </p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Isso pode levar alguns segundos</p>
            </div>
          )}

          {/* Erro */}
          {auditMutation.error && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}>
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "#DC2626" }}>
                <AlertTriangle className="h-4 w-4" /> Erro na auditoria
              </div>
              <p className="text-sm" style={{ color: "#DC2626" }}>{auditMutation.error.message}</p>
              <button
                onClick={handleStart}
                className="text-xs font-bold px-3 py-1.5 rounded-lg mt-1"
                style={{ background: "#FECACA", color: "#DC2626" }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Resultado */}
          {audit && (
            <div className="space-y-4">

              {/* Nota + Parecer */}
              <div
                className="rounded-xl p-4 flex items-start gap-4"
                style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}
              >
                <div
                  className="h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-black"
                  style={{ background: notaCor(audit.nota_qualidade), color: "#fff" }}
                >
                  {audit.nota_qualidade}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: "#94A3B8" }}>Nota de qualidade</p>
                  <p className="text-sm mt-1" style={{ color: "var(--foreground)" }}>{audit.parecer}</p>
                </div>
              </div>

              {/* Gabarito (apenas exercício) */}
              {audit.gabarito_correto !== null && (
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{
                    background: audit.gabarito_correto ? "#F0FDF4" : "#FEF2F2",
                    border: `1.5px solid ${audit.gabarito_correto ? "#86EFAC" : "#FECACA"}`,
                  }}
                >
                  {audit.gabarito_correto
                    ? <ThumbsUp className="h-5 w-5 flex-shrink-0" style={{ color: "#16A34A" }} />
                    : <ThumbsDown className="h-5 w-5 flex-shrink-0" style={{ color: "#DC2626" }} />}
                  <div>
                    <p className="text-sm font-bold" style={{ color: audit.gabarito_correto ? "#166534" : "#991B1B" }}>
                      {audit.gabarito_correto ? "Gabarito correto ✓" : "Gabarito possivelmente incorreto!"}
                    </p>
                    {!audit.gabarito_correto && audit.gabarito_sugerido && (
                      <p className="text-xs mt-0.5" style={{ color: "#DC2626" }}>
                        Gabarito sugerido pelo Gemini: <b>{audit.gabarito_sugerido}</b>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Dificuldade (se informada) */}
              {audit.dificuldade_real && (
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D" }}
                >
                  <Info className="h-5 w-5 flex-shrink-0" style={{ color: "#92400E" }} />
                  <p className="text-sm font-bold" style={{ color: "#92400E" }}>
                    Dificuldade estimada pelo Gemini: {audit.dificuldade_real}
                  </p>
                </div>
              )}

              {/* Tags sugeridas */}
              {audit.tags_sugeridas?.length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#EFF6FF", border: "1.5px solid #93C5FD" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 flex-shrink-0" style={{ color: "#1D4ED8" }} />
                    <p className="text-sm font-bold" style={{ color: "#1D4ED8" }}>Tags sugeridas</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {audit.tags_sugeridas.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Problemas */}
              {audit.problemas?.length > 0 && (
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}
                >
                  <p className="text-xs font-bold uppercase" style={{ color: "#DC2626" }}>Problemas encontrados</p>
                  <ul className="space-y-1">
                    {audit.problemas.map((p, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" style={{ color: "#7F1D1D" }}>
                        <span className="mt-0.5 flex-shrink-0">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sugestões */}
              {audit.sugestoes?.length > 0 && (
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}
                >
                  <p className="text-xs font-bold uppercase" style={{ color: "#16A34A" }}>Sugestões de melhoria</p>
                  <ul className="space-y-1">
                    {audit.sugestoes.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" style={{ color: "#14532D" }}>
                        <span className="mt-0.5 flex-shrink-0">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conteúdo melhorado */}
              {audit.conteudo_melhorado && onApplyFix && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: "2px solid #521F8040" }}
                >
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1A1A2E, #521F80)" }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm font-bold text-white">
                      Conteúdo melhorado — {APPLY_LABEL[type]}
                    </p>
                  </div>
                  <div className="p-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applySelected}
                        onChange={(e) => setApplySelected(e.target.checked)}
                        className="h-4 w-4 mt-0.5 accent-purple-700"
                      />
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Aplicar {APPLY_LABEL[type]}
                      </p>
                    </label>
                    {applySelected && (
                      <textarea
                        rows={6}
                        value={editedImproved}
                        onChange={(e) => setEditedImproved(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-vertical"
                        style={{ border: "1.5px solid #521F8060", background: "var(--muted)", color: "var(--foreground)" }}
                      />
                    )}
                  </div>
                  <div
                    className="px-4 py-4"
                    style={{ background: "var(--muted)", borderTop: "1px solid var(--border)" }}
                  >
                    <button
                      onClick={handleApply}
                      disabled={!applySelected || !editedImproved.trim()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg, #521F80, #01738d)" }}
                    >
                      <Sparkles className="h-4 w-4" /> Aplicar melhoria
                    </button>
                  </div>
                </div>
              )}

              {!audit.conteudo_melhorado && !audit.problemas?.length && (
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}
                >
                  <ThumbsUp className="h-5 w-5 flex-shrink-0" style={{ color: "#16A34A" }} />
                  <p className="text-sm font-bold" style={{ color: "#16A34A" }}>
                    Conteúdo aprovado! O Gemini não identificou correções necessárias.
                  </p>
                </div>
              )}

              {/* Auditar novamente */}
              <button
                onClick={() => { auditMutation.reset(); setApplySelected(false); setEditedImproved(""); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                <Sparkles className="h-4 w-4" /> Auditar novamente
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
