import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Loader2, Search, X, Save, Tag, FileCode2, ClipboardPaste, CheckCircle2, Sparkles, AlertTriangle, ThumbsUp, ThumbsDown, Info, ImageUp, Image as ImageIcon, ShieldCheck } from "lucide-react";

// ─── Importador LaTeX ─────────────────────────────────────────────────────────

function parseLatexQuestion(raw: string): Partial<typeof emptyForm> | null {
  try {
    const get = (label: string) => {
      const regex = new RegExp(`${label}[:\\s]+([\\s\\S]*?)(?=\\n[A-ZÁÉÍÓÚ_]{2,}[:\\s]|$)`, "i");
      return raw.match(regex)?.[1]?.trim() ?? "";
    };

    const enunciado = get("ENUNCIADO");
    const resolucao = get("RESOLU[ÇC][ÃA]O");
    const gabaritoRaw = get("GABARITO").toUpperCase().replace(/[^A-E]/g, "").charAt(0);
    const gabarito = ["A","B","C","D","E"].includes(gabaritoRaw) ? gabaritoRaw : "A";
    const conteudo = get("CONTE[ÚU]DO") || get("TOPICO") || get("T[ÓO]PICO");
    const anoRaw = get("ANO");
    const ano = anoRaw ? parseInt(anoRaw) || new Date().getFullYear() : new Date().getFullYear();
    const dificuldadeRaw = get("DIFICULDADE").trim();
    const nivel_dificuldade = (["Muito Baixa","Baixa","Média","Alta","Muito Alta"].find(
      n => n.toLowerCase() === dificuldadeRaw.toLowerCase()
    ) ?? "Média") as typeof NIVEIS[number];
    const tagsRaw = get("TAGS");
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];

    // Parse alternativas — aceita "A)" ou "A." ou "(A)"
    const altRegex = /^\s*[\[(]?([A-E])[\].)]\s*(.+)/gm;
    const alternativas: Record<string, string> = { A: "", B: "", C: "", D: "", E: "" };
    let match;
    while ((match = altRegex.exec(raw)) !== null) {
      alternativas[match[1]] = match[2].trim();
    }

    if (!enunciado && !alternativas.A) return null;

    return {
      enunciado,
      alternativas,
      gabarito,
      comentario_resolucao: resolucao,
      conteudo_principal: conteudo,
      ano,
      nivel_dificuldade,
      tags,
    };
  } catch {
    return null;
  }
}

const FORMATO_EXEMPLO = `ENUNCIADO:
Um capital de R$\\, 1.000,00 é aplicado a juros compostos de 10\\% ao mês. Após 2 meses, o montante será:

A) R$\\, 1.100,00
B) R$\\, 1.200,00
C) R$\\, 1.210,00
D) R$\\, 1.220,00
E) R$\\, 1.250,00

GABARITO: C

RESOLUÇÃO:
$M = C \\cdot (1+i)^t = 1000 \\cdot (1{,}1)^2 = 1000 \\cdot 1{,}21 = 1210$

CONTEUDO: Matemática Financeira
DIFICULDADE: Média
ANO: 2023
TAGS: Matemática Financeira, Funções de 1º e 2º Grau`;

function LatexImportModal({ onImport, onClose }: {
  onImport: (data: Partial<typeof emptyForm>) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<Partial<typeof emptyForm> | null>(null);
  const [showExample, setShowExample] = useState(false);

  function handleParse() {
    const result = parseLatexQuestion(text);
    if (!result) {
      toast.error("Não foi possível interpretar o formato. Verifique se seguiu o modelo.");
      return;
    }
    setPreview(result);
  }

  function handleConfirm() {
    if (!preview) return;
    onImport(preview);
    onClose();
    toast.success("Questão importada! Revise e clique em Criar.");
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          style={{ background: "#fff" }}>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #521F80, #01738d)", color: "#fff" }}>
            <div className="flex items-center gap-2">
              <FileCode2 className="h-5 w-5" />
              <span className="font-bold">Importar questão via LaTeX</span>
            </div>
            <button onClick={onClose}><X className="h-5 w-5 opacity-80 hover:opacity-100" /></button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-4">

            {/* Botão exemplo */}
            <button onClick={() => setShowExample(!showExample)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              style={{ background: "#E0F7F4", color: "#01738d" }}>
              <ClipboardPaste className="h-3.5 w-3.5" />
              {showExample ? "Ocultar" : "Ver"} formato esperado
            </button>

            {showExample && (
              <div className="rounded-xl p-4 text-xs font-mono overflow-x-auto"
                style={{ background: "#1A1A2E", color: "#A5F3FC", whiteSpace: "pre-wrap" }}>
                {FORMATO_EXEMPLO}
              </div>
            )}

            {/* Textarea de entrada */}
            <div>
              <label className="text-sm font-bold block mb-2" style={{ color: "#1A1A2E" }}>
                Cole aqui a questão gerada pela IA:
              </label>
              <textarea
                rows={12}
                value={text}
                onChange={(e) => { setText(e.target.value); setPreview(null); }}
                placeholder={`Cole o texto da questão aqui...\n\nO formato mínimo necessário é:\nENUNCIADO: ...\nA) ...\nB) ...\nC) ...\nD) ...\nE) ...\nGABARITO: X`}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                style={{ border: "1.5px solid #E2D9EE", resize: "vertical", color: "#1A1A2E" }}
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "#166534" }}>
                  <CheckCircle2 className="h-4 w-4" /> Prévia detectada — confirme antes de importar
                </div>
                <div className="space-y-1 text-xs" style={{ color: "#1A1A2E" }}>
                  {preview.conteudo_principal && <p><b>Conteúdo:</b> {preview.conteudo_principal}</p>}
                  {preview.ano && <p><b>Ano:</b> {preview.ano}</p>}
                  {preview.nivel_dificuldade && <p><b>Dificuldade:</b> {preview.nivel_dificuldade}</p>}
                  {preview.gabarito && <p><b>Gabarito:</b> {preview.gabarito}</p>}
                  {preview.tags && preview.tags.length > 0 && <p><b>Tags:</b> {preview.tags.join(", ")}</p>}
                  <p className="mt-2"><b>Enunciado:</b></p>
                  <p className="pl-2 italic line-clamp-3" style={{ color: "#374151" }}>{preview.enunciado?.slice(0, 200)}{(preview.enunciado?.length ?? 0) > 200 ? "..." : ""}</p>
                  <p className="mt-1"><b>Alternativas detectadas:</b> {Object.entries(preview.alternativas ?? {}).filter(([,v]) => v).map(([k]) => k).join(", ")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid #E2D9EE" }}>
            {!preview ? (
              <button onClick={handleParse} disabled={!text.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
                style={{ background: "#01738d" }}>
                <FileCode2 className="h-4 w-4" /> Interpretar questão
              </button>
            ) : (
              <button onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: "#166534" }}>
                <CheckCircle2 className="h-4 w-4" /> Confirmar e preencher formulário
              </button>
            )}
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: "#F1F5F9", color: "#64748B" }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


// ─── Modal de Auditoria Gemini (Interativo) ────────────────────────────────────

type AuditResult = {
  disciplina: "Matemática" | "Física" | "Química" | "Outra";
  disciplina_justificativa: string;
  gabarito_correto: boolean;
  gabarito_sugerido: string | null;
  dificuldade_real: string;
  dificuldade_compativel: boolean;
  tags_sugeridas: string[];
  tags_atuais_corretas: boolean;
  nota_qualidade: number;
  problemas: string[];
  sugestoes: string[];
  parecer: string;
  enunciado_reescrito: string | null;
  comentario_resolucao_reescrito: string | null;
};

type ApplyState = {
  gabarito: boolean;
  dificuldade: boolean;
  enunciado: boolean;
  resolucao: boolean;
  tags: boolean;
};

const DISCIPLINA_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  "Matemática": { bg: "#E0F7F4", border: "#00BFA5", text: "#004D40", badge: "#00897B" },
  "Física":     { bg: "#E3F2FD", border: "#42A5F5", text: "#0D47A1", badge: "#1565C0" },
  "Química":    { bg: "#FFF8E1", border: "#FFD54F", text: "#E65100", badge: "#F57F17" },
  "Outra":      { bg: "#F3E5F5", border: "#CE93D8", text: "#4A148C", badge: "#7B1FA2" },
};

function AuditModal({ questionId, onClose, provider = "gemini" }: { questionId: number; onClose: () => void; provider?: "gemini" | "claude" }) {
  const utils = trpc.useUtils();
  const geminiMutation = trpc.questions.auditQuestion.useMutation();
  const claudeMutation = trpc.questions.auditQuestionClaude.useMutation();
  const auditMutation = provider === "claude" ? claudeMutation : geminiMutation;
  const applyMutation = trpc.questions.applyAuditFixes.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ ${data.applied.length} correção(ões) aplicada(s) com sucesso!`);
      utils.questions.list.invalidate();
    },
    onError: (e) => toast.error(`Erro ao salvar: ${e.message}`),
  });
  const deleteMutation = trpc.questions.delete.useMutation({
    onSuccess: () => {
      toast.success("Questão excluída.");
      utils.questions.list.invalidate();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  const audit = auditMutation.data?.audit as AuditResult | undefined;

  const [apply, setApply] = useState<ApplyState>({
    gabarito: false, dificuldade: false, enunciado: false, resolucao: false, tags: false,
  });
  const [enunciadoPreview, setEnunciadoPreview] = useState("");
  const [resolucaoPreview, setResolucaoPreview] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function onAuditSuccess(result: AuditResult) {
    setEnunciadoPreview(result.enunciado_reescrito ?? "");
    setResolucaoPreview(result.comentario_resolucao_reescrito ?? "");
    setApply({
      gabarito: !result.gabarito_correto && !!result.gabarito_sugerido,
      dificuldade: !result.dificuldade_compativel,
      enunciado: !!result.enunciado_reescrito,
      resolucao: !!result.comentario_resolucao_reescrito,
      tags: !result.tags_atuais_corretas && (result.tags_sugeridas?.length ?? 0) > 0,
    });
    setConfirmDelete(false);
    utils.questions.getAuditStats.invalidate();
  }

  function handleApply() {
    if (!audit) return;
    const payload: any = { id: questionId };
    if (apply.gabarito && audit.gabarito_sugerido)          payload.gabarito = audit.gabarito_sugerido;
    if (apply.dificuldade)                                   payload.nivel_dificuldade = audit.dificuldade_real;
    if (apply.enunciado && enunciadoPreview.trim())          payload.enunciado = enunciadoPreview.trim();
    if (apply.resolucao && resolucaoPreview.trim())          payload.comentario_resolucao = resolucaoPreview.trim();
    if (apply.tags && audit.tags_sugeridas?.length > 0)     payload.tags = audit.tags_sugeridas;
    if (Object.keys(payload).length <= 1) { toast.error("Nenhuma correção selecionada."); return; }
    applyMutation.mutate(payload);
  }

  function nota_cor(n: number) {
    if (n >= 8) return "#166534";
    if (n >= 6) return "#92400E";
    return "#991B1B";
  }

  const isMath = audit?.disciplina === "Matemática";
  const disciplinaMeta = audit ? (DISCIPLINA_COLORS[audit.disciplina] ?? DISCIPLINA_COLORS["Outra"]) : null;

  const hasCorrections = audit && (
    !audit.gabarito_correto ||
    !audit.dificuldade_compativel ||
    !audit.tags_atuais_corretas ||
    !!audit.enunciado_reescrito ||
    !!audit.comentario_resolucao_reescrito
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{ background: "#fff" }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: provider === "claude" ? "linear-gradient(135deg, #263238, #009688)" : "linear-gradient(135deg, #1A1A2E, #521F80)", color: "#fff" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="font-bold">Auditoria {provider === "claude" ? "Claude" : "Gemini"} — Questão #{questionId}</span>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 opacity-80 hover:opacity-100" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Estado inicial */}
          {!auditMutation.isPending && !audit && !auditMutation.error && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: provider === "claude" ? "linear-gradient(135deg, #263238, #009688)" : "linear-gradient(135deg, #1A1A2E, #521F80)" }}>
                <Sparkles className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: "#1A1A2E" }}>Auditar com Gemini</p>
                <p className="text-sm mt-1" style={{ color: "#64748B" }}>
                  O Gemini vai analisar esta questão, identificar a disciplina e sugerir correções que você poderá revisar e aplicar com um clique.
                </p>
              </div>
              <button
                onClick={() => auditMutation.mutate({ id: questionId }, { onSuccess: (d) => onAuditSuccess(d.audit as AuditResult) })}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #521F80, #01738d)" }}>
                <Sparkles className="h-4 w-4" /> Iniciar auditoria
              </button>
            </div>
          )}

          {/* Carregando */}
          {auditMutation.isPending && (
            <div className="text-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: "#521F80" }} />
              <p className="text-sm font-semibold" style={{ color: "#64748B" }}>Gemini analisando a questão...</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Isso pode levar alguns segundos</p>
            </div>
          )}

          {/* Erro */}
          {auditMutation.error && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}>
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "#991B1B" }}>
                <AlertTriangle className="h-4 w-4" /> Erro na auditoria
              </div>
              <p className="text-sm" style={{ color: "#991B1B" }}>{auditMutation.error.message}</p>
              <button onClick={() => auditMutation.mutate({ id: questionId }, { onSuccess: (d) => onAuditSuccess(d.audit as AuditResult) })}
                className="text-xs font-bold px-3 py-1.5 rounded-lg mt-1"
                style={{ background: "#FECACA", color: "#991B1B" }}>
                Tentar novamente
              </button>
            </div>
          )}

          {/* Resultado */}
          {audit && disciplinaMeta && (
            <div className="space-y-4">

              {/* ── Badge de disciplina ── */}
              <div className="rounded-xl p-4 flex items-start gap-4"
                style={{ background: disciplinaMeta.bg, border: `2px solid ${disciplinaMeta.border}` }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase" style={{ color: disciplinaMeta.text }}>
                      Disciplina identificada
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black text-white"
                      style={{ background: disciplinaMeta.badge }}>
                      {audit.disciplina}
                    </span>
                    {!isMath && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
                        ⚠️ Fora do escopo
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1.5" style={{ color: disciplinaMeta.text }}>
                    {audit.disciplina_justificativa}
                  </p>
                </div>
              </div>

              {/* ── Alerta + botão de excluir se não for Matemática ── */}
              {!isMath && (
                <div className="rounded-xl p-4 space-y-3"
                  style={{ background: "#FFF5F5", border: "2px solid #FFCDD2" }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#C62828" }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#C62828" }}>
                        Esta questão não é de Matemática
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#E57373" }}>
                        O Gemini identificou que esta é uma questão de <b>{audit.disciplina}</b>. Ela pode ter sido importada por engano e não se encaixa no simulador de Matemática ENEM.
                      </p>
                    </div>
                  </div>
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: "#FFCDD2", color: "#C62828", border: "1.5px solid #EF9A9A" }}>
                      <Trash2 className="h-4 w-4" /> Excluir esta questão
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-center" style={{ color: "#C62828" }}>
                        Tem certeza? Esta ação é irreversível.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteMutation.mutate({ id: questionId })}
                          disabled={deleteMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
                          style={{ background: "#C62828" }}>
                          {deleteMutation.isPending
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                          Sim, excluir
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                          style={{ background: "#F1F5F9", color: "#64748B" }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nota + Parecer */}
              <div className="rounded-xl p-4 flex items-start gap-4"
                style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
                <div className="h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-black"
                  style={{ background: nota_cor(audit.nota_qualidade), color: "#fff" }}>
                  {audit.nota_qualidade}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: "#94A3B8" }}>Nota de qualidade</p>
                  <p className="text-sm mt-1" style={{ color: "#1A1A2E" }}>{audit.parecer}</p>
                </div>
              </div>

              {/* Gabarito */}
              <div className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: audit.gabarito_correto ? "#F0FDF4" : "#FEF2F2",
                  border: `1.5px solid ${audit.gabarito_correto ? "#86EFAC" : "#FECACA"}`
                }}>
                {audit.gabarito_correto
                  ? <ThumbsUp className="h-5 w-5 flex-shrink-0" style={{ color: "#166534" }} />
                  : <ThumbsDown className="h-5 w-5 flex-shrink-0" style={{ color: "#991B1B" }} />}
                <div>
                  <p className="text-sm font-bold" style={{ color: audit.gabarito_correto ? "#166534" : "#991B1B" }}>
                    {audit.gabarito_correto ? "Gabarito correto ✓" : "Gabarito possivelmente incorreto!"}
                  </p>
                  {!audit.gabarito_correto && audit.gabarito_sugerido && (
                    <p className="text-xs mt-0.5" style={{ color: "#991B1B" }}>
                      Gabarito sugerido pelo Gemini: <b>{audit.gabarito_sugerido}</b>
                    </p>
                  )}
                </div>
              </div>

              {/* Dificuldade */}
              <div className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: audit.dificuldade_compativel ? "#F0FDF4" : "#FFFBEB",
                  border: `1.5px solid ${audit.dificuldade_compativel ? "#86EFAC" : "#FCD34D"}`
                }}>
                <Info className="h-5 w-5 flex-shrink-0" style={{ color: audit.dificuldade_compativel ? "#166534" : "#92400E" }} />
                <p className="text-sm font-bold" style={{ color: audit.dificuldade_compativel ? "#166534" : "#92400E" }}>
                  Dificuldade real: {audit.dificuldade_real}
                  {!audit.dificuldade_compativel && " ⚠️ diferente da declarada"}
                </p>
              </div>

              {/* Tags */}
              <div className="rounded-xl p-4"
                style={{
                  background: audit.tags_atuais_corretas ? "#F0FDF4" : "#EFF6FF",
                  border: `1.5px solid ${audit.tags_atuais_corretas ? "#86EFAC" : "#93C5FD"}`
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 flex-shrink-0" style={{ color: audit.tags_atuais_corretas ? "#166534" : "#1D4ED8" }} />
                  <p className="text-sm font-bold" style={{ color: audit.tags_atuais_corretas ? "#166534" : "#1D4ED8" }}>
                    {audit.tags_atuais_corretas ? "Tags corretas ✓" : "Tags precisam de atualização"}
                  </p>
                </div>
                {audit.tags_sugeridas?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {audit.tags_sugeridas.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "#DBEAFE", color: "#1D4ED8", border: "1px solid #93C5FD" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Problemas */}
              {audit.problemas?.length > 0 && (
                <div className="rounded-xl p-4 space-y-2" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}>
                  <p className="text-xs font-bold uppercase" style={{ color: "#991B1B" }}>Problemas encontrados</p>
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
                <div className="rounded-xl p-4 space-y-2" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
                  <p className="text-xs font-bold uppercase" style={{ color: "#166534" }}>Sugestões de melhoria</p>
                  <ul className="space-y-1">
                    {audit.sugestoes.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" style={{ color: "#14532D" }}>
                        <span className="mt-0.5 flex-shrink-0">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Correções interativas (só aparece se há sugestões E é matemática) ── */}
              {hasCorrections && (
                <div className="rounded-xl overflow-hidden" style={{ border: "2px solid #521F8040" }}>
                  <div className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1A1A2E, #521F80)" }}>
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm font-bold text-white">Correções sugeridas — selecione o que aplicar</p>
                  </div>

                  <div style={{ borderTop: "1px solid #E2D9EE" }}>
                    {!audit.gabarito_correto && audit.gabarito_sugerido && (
                      <div className="px-4 py-4" style={{ borderBottom: "1px solid #E2D9EE" }}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={apply.gabarito}
                            onChange={(e) => setApply((a) => ({ ...a, gabarito: e.target.checked }))}
                            className="h-4 w-4 accent-purple-700" />
                          <div>
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4" style={{ color: "#991B1B" }} />
                              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>Corrigir gabarito</p>
                            </div>
                            <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                              Sugerido: <b className="text-green-700">{audit.gabarito_sugerido}</b>
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    {!audit.dificuldade_compativel && (
                      <div className="px-4 py-4" style={{ borderBottom: "1px solid #E2D9EE" }}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={apply.dificuldade}
                            onChange={(e) => setApply((a) => ({ ...a, dificuldade: e.target.checked }))}
                            className="h-4 w-4 accent-purple-700" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4" style={{ color: "#92400E" }} />
                              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>Ajustar dificuldade</p>
                            </div>
                            <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                              Dificuldade real: <b style={{ color: "#92400E" }}>{audit.dificuldade_real}</b>
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    {!audit.tags_atuais_corretas && audit.tags_sugeridas?.length > 0 && (
                      <div className="px-4 py-4" style={{ borderBottom: "1px solid #E2D9EE" }}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={apply.tags}
                            onChange={(e) => setApply((a) => ({ ...a, tags: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 accent-purple-700" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4" style={{ color: "#01738d" }} />
                              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>Atualizar tags de conteúdo</p>
                            </div>
                            <p className="text-xs mt-0.5 mb-2" style={{ color: "#64748B" }}>
                              Tags atuais estão incorretas ou incompletas. O Gemini sugere:
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {audit.tags_sugeridas.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={{ background: "#E0F7F4", color: "#01738d", border: "1px solid #01738d44" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </label>
                      </div>
                    )}

                    {audit.enunciado_reescrito && (
                      <div className="px-4 py-4 space-y-3" style={{ borderBottom: "1px solid #E2D9EE" }}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={apply.enunciado}
                            onChange={(e) => setApply((a) => ({ ...a, enunciado: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 accent-purple-700" />
                          <div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" style={{ color: "#166534" }} />
                              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>Aplicar enunciado melhorado</p>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Edite abaixo antes de aplicar se desejar</p>
                          </div>
                        </label>
                        {apply.enunciado && (
                          <textarea rows={5} value={enunciadoPreview}
                            onChange={(e) => setEnunciadoPreview(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-vertical"
                            style={{ border: "1.5px solid #521F8060", background: "#FAFAFA", color: "#1A1A2E" }} />
                        )}
                      </div>
                    )}

                    {audit.comentario_resolucao_reescrito && (
                      <div className="px-4 py-4 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={apply.resolucao}
                            onChange={(e) => setApply((a) => ({ ...a, resolucao: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 accent-purple-700" />
                          <div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" style={{ color: "#166534" }} />
                              <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>Aplicar resolução melhorada</p>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Edite abaixo antes de aplicar se desejar</p>
                          </div>
                        </label>
                        {apply.resolucao && (
                          <textarea rows={4} value={resolucaoPreview}
                            onChange={(e) => setResolucaoPreview(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-vertical"
                            style={{ border: "1.5px solid #521F8060", background: "#FAFAFA", color: "#1A1A2E" }} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-4" style={{ background: "#F8F4FF", borderTop: "1px solid #E2D9EE" }}>
                    <button onClick={handleApply} disabled={applyMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
                      style={{ background: applyMutation.isPending ? "#9CA3AF" : "linear-gradient(135deg, #521F80, #01738d)", cursor: applyMutation.isPending ? "not-allowed" : "pointer" }}>
                      {applyMutation.isPending
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Aplicando...</>
                        : <><Sparkles className="h-4 w-4" /> Aplicar correções selecionadas</>}
                    </button>
                    {applyMutation.isSuccess && (
                      <p className="text-center text-xs mt-2 font-semibold" style={{ color: "#166534" }}>
                        ✅ Correções aplicadas! A questão foi atualizada no banco.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!hasCorrections && isMath && (
                <div className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
                  <ThumbsUp className="h-5 w-5 flex-shrink-0" style={{ color: "#166534" }} />
                  <p className="text-sm font-bold" style={{ color: "#166534" }}>
                    Questão aprovada! O Gemini não identificou correções necessárias.
                  </p>
                </div>
              )}

              {/* Auditar novamente */}
              <button onClick={() => { auditMutation.reset(); applyMutation.reset(); setConfirmDelete(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#F1F5F9", color: "#64748B" }}>
                <Sparkles className="h-4 w-4" /> Auditar novamente
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #E2D9EE" }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#F1F5F9", color: "#64748B" }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Botão: inserir imagem inline no enunciado ────────────────────────────────
function InlineImageInsert({ onInsert }: { onInsert: (tag: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button type="button" disabled={loading}
        onClick={() => ref.current?.click()}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
        style={{ background: "#E0F7F4", color: "#01738d", border: "1.5px solid #01738d44" }}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
        Inserir imagem
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setLoading(true);
        try {
          const url = await uploadToImgBB(file);
          onInsert(`[Imagem: ${url}]`);
          toast.success("Imagem inserida no enunciado!");
        } catch (err: any) { toast.error(err.message); }
        finally { setLoading(false); e.target.value = ""; }
      }} />
    </>
  );
}

// ─── Botão: upload de imagem para alternativa ─────────────────────────────────
function AltImageUpload({ currentUrl, onUpload }: { currentUrl: string | null; onUpload: (url: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button type="button" disabled={loading}
        onClick={() => ref.current?.click()}
        title={currentUrl ? "Trocar imagem" : "Adicionar imagem à alternativa"}
        className="flex-shrink-0 p-2 rounded-lg"
        style={{ background: currentUrl ? "#E0F7F4" : "#F8FAFC", border: "1.5px solid #E2D9EE", color: "#01738d" }}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setLoading(true);
        try {
          const url = await uploadToImgBB(file);
          onUpload(url);
          toast.success("Imagem adicionada!");
        } catch (err: any) { toast.error(err.message); }
        finally { setLoading(false); e.target.value = ""; }
      }} />
    </>
  );
}

// ─── AdminQuestoes ────────────────────────────────────────────────────────────

const TAGS_CONTEUDO = [
  "Análise Combinatória",
  "Áreas de Figuras Planas",
  "Conversão de Unidades",
  "Equações e Inequações",
  "Escala",
  "Estatística",
  "Função Composta",
  "Função do Primeiro Grau",
  "Geometria Analítica",
  "Função Exponencial",
  "Função Logarítmica",
  "Função Quadrática",
  "Funções de 1º e 2º Grau",
  "Geometria Espacial",
  "Geometria Plana",
  "Leitura de Gráficos e Tabelas",
  "Logaritmos",
  "Matemática Financeira",
  "Medidas de Tendência Central",
  "Noções de Lógica Matemática",
  "Operações Básicas",
  "Polinômios",
  "Porcentagem",
  "Probabilidade",
  "Progressão Aritmética",
  "Progressão Geométrica",
  "Razão, Proporção e Regra de Três",
  "Sequências",
  "Trigonometria",
  "Visualização Espacial/Projeção Ortogonal",
];

const NIVEIS = ["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"] as const;

const emptyForm = {
  fonte: "ENEM",
  ano: new Date().getFullYear(),
  conteudo_principal: "",
  nivel_dificuldade: "Média" as typeof NIVEIS[number],
  param_a: 1.0,
  param_b: 0.0,
  param_c: 0.2,
  enunciado: "",
  url_imagem: "",
  alternativas: { A: "", B: "", C: "", D: "", E: "" },
  gabarito: "A",
  comentario_resolucao: "",
  tags: [] as string[],
};

type Form = typeof emptyForm;

// ─── Campo de imagem com upload para Cloudinary ───────────────────────────────

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMGBB_KEY) {
      toast.error("Chave ImgBB não configurada. Cole a URL da imagem diretamente no campo.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      // Converte para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload direto para ImgBB (client-side, sem servidor)
      const body = new FormData();
      body.append("image", base64);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? "Erro no upload");
      onChange(data.data.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (err: any) {
      toast.error(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "0.6rem 0.85rem", borderRadius: "0.75rem",
    border: "1.5px solid var(--border)", fontSize: "0.875rem",
    outline: "none", color: "var(--foreground)", background: "var(--card)",
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou use o botão para enviar"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
          style={{ background: "var(--teal-soft)", color: "#01738d", border: "1.5px solid #01738d44" }}>
          {uploading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <ImageUp className="h-4 w-4" />}
          {uploading ? "Enviando..." : "Enviar"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-xl hover:opacity-70 flex-shrink-0"
            style={{ color: "var(--muted-foreground)" }}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {value && (
        <img src={value} alt="Preview" className="max-h-32 rounded-lg object-contain"
          style={{ border: "1px solid var(--border)" }} />
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── Upload ImgBB reutilizável ────────────────────────────────────────────────
async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error("Chave ImgBB não configurada (VITE_IMGBB_API_KEY).");
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const body = new FormData();
  body.append("image", base64);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message ?? "Erro no upload ImgBB");
  return data.data.url as string;
}

// ─── Helpers: texto e imagem por alternativa ──────────────────────────────────
function getAltText(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.text ?? "";
}
function getAltFile(val: any): string | null {
  if (!val || typeof val !== "object") return null;
  return val.file ?? null;
}

export default function AdminQuestoes() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [showLatexImport, setShowLatexImport] = useState(false);
  const [auditQuestionId, setAuditQuestionId] = useState<number | null>(null);
  const [auditProvider, setAuditProvider] = useState<"gemini" | "claude">("gemini");
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [openId, setOpenId] = useState<number | null>(null);
  const enunciadoRef = useRef<HTMLTextAreaElement>(null);

  const utils = trpc.useUtils();

  const { data: auditStats } = trpc.questions.getAuditStats.useQuery();

  const { data, isLoading } = trpc.questions.list.useQuery({
    page, pageSize: 20,
    conteudo: search || undefined,
    activeOnly: false,
    orderBy: "conteudo_principal",
    orderDir: "asc",
  });

  const createMutation = trpc.questions.create.useMutation({
    onSuccess: () => { toast.success("Questão criada!"); resetForm(); utils.questions.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.questions.update.useMutation({
    onSuccess: () => { toast.success("Questão atualizada!"); resetForm(); utils.questions.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.questions.delete.useMutation({
    onSuccess: () => { toast.success("Questão removida."); utils.questions.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const toggleMutation = trpc.questions.toggleActive.useMutation({
    onSuccess: () => utils.questions.list.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  function handleLatexImport(data: Partial<typeof emptyForm>) {
    setForm({ ...emptyForm, ...data });
    setEditId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(q: any) {
    setForm({
      fonte: q.fonte ?? "ENEM",
      ano: q.ano ?? new Date().getFullYear(),
      conteudo_principal: q.conteudo_principal,
      nivel_dificuldade: q.nivel_dificuldade,
      param_a: q.param_a,
      param_b: q.param_b,
      param_c: q.param_c,
      enunciado: q.enunciado,
      url_imagem: q.url_imagem ?? "",
      alternativas: { A: "", B: "", C: "", D: "", E: "", ...(typeof q.alternativas === "object" ? q.alternativas : {}) },
      gabarito: q.gabarito,
      comentario_resolucao: q.comentario_resolucao ?? "",
      tags: Array.isArray(q.tags) ? q.tags : [],
    });
    setEditId(q.id);
    setShowForm(true);
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function handleSubmit() {
    if (!form.conteudo_principal.trim()) { toast.error("Preencha o conteúdo principal."); return; }
    if (!form.enunciado.trim()) { toast.error("Preencha o enunciado."); return; }
    const payload = { ...form, url_imagem: form.url_imagem || null };
    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const DELETE_PASSWORD = "ExcluirWaldo16@";

  const deleteAllMutation = trpc.questions.deleteAll.useMutation({
    onSuccess: () => {
      toast.success("Todas as questões foram excluídas.");
      setConfirmDelete(false);
      setDeletePassword("");
      utils.questions.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Filtra por tag no frontend
  const allQuestions = data?.questions ?? [];
  const filtered = filterTag === "Todas"
    ? allQuestions
    : allQuestions.filter((q) => Array.isArray(q.tags) && q.tags.includes(filterTag));

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm outline-none";
  const inputStyle = { border: "1.5px solid #E2D9EE", background: "#fff", color: "#1A1A2E" };
  const labelStyle: React.CSSProperties = { color: "#1A1A2E", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 4 };

  return (
    <div className="space-y-6 py-2">

      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #521F80, #01738d)" }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">Gerenciar Questões</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              {data?.pagination.total ?? 0} questões no banco
            </p>
          </div>
          {auditStats && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <ShieldCheck className="h-5 w-5 flex-shrink-0" style={{ color: auditStats.auditadas === auditStats.total ? "#4ADE80" : "rgba(255,255,255,0.9)" }} />
              <div>
                <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>Auditadas</p>
                <p className="text-base font-bold leading-tight">
                  {auditStats.auditadas}
                  <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.7)" }}>/{auditStats.total}</span>
                </p>
              </div>
              <div className="ml-1 h-8 w-8 relative flex-shrink-0">
                <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="14" fill="none"
                    stroke={auditStats.auditadas === auditStats.total ? "#4ADE80" : "#A78BFA"}
                    strokeWidth="3.5"
                    strokeDasharray={`${(auditStats.auditadas / Math.max(auditStats.total, 1)) * 87.96} 87.96`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.6s ease" }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                  {auditStats.total > 0 ? Math.round((auditStats.auditadas / auditStats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLatexImport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
            <FileCode2 className="h-4 w-4" /> Importar LaTeX
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Plus className="h-4 w-4" /> Nova questão
          </button>
        </div>
      </div>

      {/* Zona de perigo */}
      <div className="rounded-xl p-4" style={{ border: "1.5px solid #FFCDD2", background: "#FFF5F5" }}>
        {!confirmDelete ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-bold" style={{ color: "#C62828" }}>Zona de perigo</p>
              <p className="text-xs mt-0.5" style={{ color: "#E57373" }}>
                Excluir todas as questões é irreversível. Use para auditar o banco ano a ano.
              </p>
            </div>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "#FFCDD2", color: "#C62828", border: "1.5px solid #EF9A9A" }}
            >
              <Trash2 className="h-4 w-4" />
              Excluir todas as questões
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-bold" style={{ color: "#C62828" }}>
              Confirme a senha para excluir todas as questões permanentemente.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Digite a senha de confirmação"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid #EF9A9A", background: "#fff", color: "#1A1A2E", minWidth: 220 }}
                onFocus={(e) => (e.target.style.borderColor = "#C62828")}
                onBlur={(e) => (e.target.style.borderColor = "#EF9A9A")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && deletePassword === DELETE_PASSWORD) {
                    deleteAllMutation.mutate();
                  }
                }}
              />
              <button
                onClick={() => {
                  if (deletePassword !== DELETE_PASSWORD) {
                    toast.error("Senha incorreta.");
                    setDeletePassword("");
                    return;
                  }
                  deleteAllMutation.mutate();
                }}
                disabled={deleteAllMutation.isPending || !deletePassword}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "#C62828" }}
              >
                {deleteAllMutation.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />}
                Confirmar exclusão
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setDeletePassword(""); }}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "#F1F5F9", color: "#64748B" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formulário — Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            style={{ background: "#fff" }}>

            {/* Header do modal */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
              style={{ background: editId ? "linear-gradient(135deg, #E65100, #BF360C)" : "linear-gradient(135deg, #01738d, #004d61)", color: "#fff" }}>
              <div className="flex items-center gap-2">
                {editId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                <span className="font-bold">
                  {editId ? `Editar questão #${editId}` : "Nova questão"}
                </span>
              </div>
              <button onClick={resetForm}><X className="h-5 w-5 opacity-80 hover:opacity-100" /></button>
            </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Metadados */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label style={labelStyle}>Fonte</label>
              <select className={inputClass} style={inputStyle} value={form.fonte}
                onChange={(e) => setForm({ ...form, fonte: e.target.value })}>
                {["ENEM", "UNICAMP", "FUVEST", "UNESP"].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Conteúdo principal</label>
              <input className={inputClass} style={inputStyle} value={form.conteudo_principal}
                onChange={(e) => setForm({ ...form, conteudo_principal: e.target.value })}
                placeholder="Ex: Logaritmos"
                onFocus={(e) => (e.target.style.borderColor = "#01738d")}
                onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
            </div>
            <div>
              <label style={labelStyle}>Ano</label>
              <input className={inputClass} style={inputStyle} type="number" value={form.ano}
                onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })}
                onFocus={(e) => (e.target.style.borderColor = "#01738d")}
                onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
            </div>
            <div>
              <label style={labelStyle}>Dificuldade</label>
              <select className={inputClass} style={inputStyle} value={form.nivel_dificuldade}
                onChange={(e) => setForm({ ...form, nivel_dificuldade: e.target.value as any })}>
                {NIVEIS.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Tags de conteúdo */}
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6 }}>
              <Tag className="h-3.5 w-3.5" style={{ color: "#01738d" }} />
              Tags de conteúdo
              <span style={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.75rem" }}>
                — clique para selecionar (pode escolher várias)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TAGS_CONTEUDO.map((tag) => {
                const selected = form.tags.includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={selected
                      ? { background: "#01738d", color: "#fff", border: "1.5px solid #01738d" }
                      : { background: "#fff", color: "#01738d", border: "1.5px solid #01738d" }}>
                    {selected ? "✓ " : ""}{tag}
                  </button>
                );
              })}
            </div>
            {form.tags.length > 0 && (
              <p className="text-xs mt-2" style={{ color: "#64748B" }}>
                Selecionadas: {form.tags.join(", ")}
              </p>
            )}
          </div>

          {/* Enunciado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label style={labelStyle}>Enunciado (suporta LaTeX com $...$)</label>
              <InlineImageInsert onInsert={(tag) => {
                const ta = enunciadoRef.current;
                if (!ta) { setForm(f => ({ ...f, enunciado: f.enunciado + tag })); return; }
                const start = ta.selectionStart ?? form.enunciado.length;
                const end   = ta.selectionEnd   ?? start;
                const next  = form.enunciado.slice(0, start) + tag + form.enunciado.slice(end);
                setForm(f => ({ ...f, enunciado: next }));
                requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + tag.length; });
              }} />
            </div>
            <textarea ref={enunciadoRef} className={inputClass} style={{ ...inputStyle, resize: "vertical" }} rows={5}
              value={form.enunciado}
              onChange={(e) => setForm({ ...form, enunciado: e.target.value })}
              placeholder="Texto do enunciado... Use o botão 'Inserir imagem' para colocar imagens onde quiser."
              onFocus={(e) => (e.target.style.borderColor = "#01738d")}
              onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
              Use <code style={{ fontSize: 11 }}>[Imagem: url]</code> para inserir imagens dentro do texto. O botão acima faz isso automaticamente.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Imagem do enunciado (opcional)</label>
            <ImageUploadField
              value={form.url_imagem}
              onChange={(url) => setForm({ ...form, url_imagem: url })}
            />
          </div>

          {/* Alternativas */}
          <div>
            <label style={labelStyle}>Alternativas (suportam LaTeX e imagem)</label>
            <div className="space-y-3">
              {["A", "B", "C", "D", "E"].map((letra) => {
                const altVal = form.alternativas[letra];
                const altFile = getAltFile(altVal);
                return (
                  <div key={letra} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black w-5 text-sm flex-shrink-0" style={{ color: "#01738d" }}>{letra}</span>
                      <input className={inputClass} style={{ ...inputStyle, flex: 1 }}
                        value={getAltText(altVal)}
                        onChange={(e) => {
                          const file = getAltFile(altVal);
                          setForm(f => ({ ...f, alternativas: { ...f.alternativas, [letra]: file ? { text: e.target.value, file } : e.target.value } }));
                        }}
                        placeholder={`Alternativa ${letra} — texto opcional se tiver imagem`}
                        onFocus={(e) => (e.target.style.borderColor = "#01738d")}
                        onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
                      <AltImageUpload
                        currentUrl={altFile}
                        onUpload={(url) => {
                          const text = getAltText(altVal);
                          setForm(f => ({ ...f, alternativas: { ...f.alternativas, [letra]: url ? { text, file: url } : text } }));
                        }}
                      />
                    </div>
                    {altFile && (
                      <div className="ml-7 flex items-center gap-2">
                        <img src={altFile} alt={`Alternativa ${letra}`}
                          className="max-h-20 rounded-lg object-contain"
                          style={{ border: "1px solid #E2D9EE" }} />
                        <button type="button" onClick={() => {
                          const text = getAltText(altVal);
                          setForm(f => ({ ...f, alternativas: { ...f.alternativas, [letra]: text } }));
                        }} className="p-1 rounded hover:opacity-70" title="Remover imagem">
                          <X className="h-3.5 w-3.5" style={{ color: "#E53935" }} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gabarito + TRI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Gabarito</label>
              <select className={inputClass} style={inputStyle} value={form.gabarito}
                onChange={(e) => setForm({ ...form, gabarito: e.target.value })}>
                {["A", "B", "C", "D", "E"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Parâmetros TRI — discriminação (a) / dificuldade (b) / chute (c)</label>
              <div className="flex gap-2">
                {(["param_a", "param_b", "param_c"] as const).map((p, i) => (
                  <div key={p} className="flex-1">
                    <input type="number" step="0.1" className={inputClass} style={inputStyle}
                      value={form[p]}
                      onChange={(e) => setForm({ ...form, [p]: Number(e.target.value) })}
                      placeholder={["a", "b", "c"][i]}
                      onFocus={(e) => (e.target.style.borderColor = "#01738d")}
                      onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resolução */}
          <div>
            <label style={labelStyle}>Resolução comentada (opcional — suporta LaTeX)</label>
            <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical" }} rows={3}
              value={form.comentario_resolucao}
              onChange={(e) => setForm({ ...form, comentario_resolucao: e.target.value })}
              placeholder="Passo a passo da resolução..."
              onFocus={(e) => (e.target.style.borderColor = "#01738d")}
              onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
          </div>

          <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit} disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: "#01738d" }}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editId ? "Salvar alterações" : "Criar questão"}
              </button>
              <button onClick={resetForm} className="px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "#F1F5F9", color: "#64748B" }}>
                Cancelar
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Busca + filtro por tag */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94A3B8" }} />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por conteúdo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: "1.5px solid #E2D9EE", background: "#fff", color: "#1A1A2E" }}
            onFocus={(e) => (e.target.style.borderColor = "#01738d")}
            onBlur={(e) => (e.target.style.borderColor = "#E2D9EE")} />
        </div>

        {/* Filtro por tag */}
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "#64748B" }}>
            <Tag className="h-3.5 w-3.5" /> Filtrar por tag:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["Todas", ...TAGS_CONTEUDO].map((tag) => (
              <button key={tag} onClick={() => setFilterTag(tag)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                style={filterTag === tag
                  ? { background: "#01738d", color: "#fff" }
                  : { background: "#E0F7F4", color: "#01738d" }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm" style={{ color: "#64748B" }}>
        {filtered.length} questão(ões)
        {filterTag !== "Todas" ? ` com tag "${filterTag}"` : ""}
      </p>

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#01738d" }} />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => {
            const isOpen = openId === q.id;
            const qTags = Array.isArray(q.tags) ? q.tags.filter((t: string) => TAGS_CONTEUDO.includes(t)) : [];

            return (
              <div key={q.id} className="rounded-xl overflow-hidden"
                style={{ border: "1.5px solid #E2D9EE", background: q.active ? "#fff" : "#F8FAFC", opacity: q.active ? 1 : 0.6 }}>

                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => setOpenId(isOpen ? null : q.id)} className="flex-1 flex items-start gap-3 text-left">
                    <span className="text-xs font-bold w-8 flex-shrink-0 mt-0.5" style={{ color: "#94A3B8" }}>#{q.id}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>{q.conteudo_principal}</p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>{q.fonte} {q.ano} · {q.nivel_dificuldade} · Gabarito: {q.gabarito}</p>
                      {qTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {qTags.map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: "#E0F7F4", color: "#00897B" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "#94A3B8" }} />
                      : <ChevronDown className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "#94A3B8" }} />}
                  </button>

                  {/* Acções */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => { setAuditProvider("gemini"); setAuditQuestionId(q.id); }} className="p-1.5 rounded-lg hover:bg-purple-50" title="Auditar com Gemini">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: "#521F80" }} />
                    </button>
                    <button onClick={() => { setAuditProvider("claude"); setAuditQuestionId(q.id); }} className="p-1.5 rounded-lg hover:bg-teal-50" title="Auditar com Claude">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: "#009688" }} />
                    </button>
                    <button onClick={() => startEdit(q)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Editar">
                      <Pencil className="h-3.5 w-3.5" style={{ color: "#01738d" }} />
                    </button>
                    <button onClick={() => toggleMutation.mutate({ id: q.id, active: !q.active })}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title={q.active ? "Desativar" : "Ativar"}>
                      {q.active
                        ? <EyeOff className="h-3.5 w-3.5" style={{ color: "#F57F17" }} />
                        : <Eye className="h-3.5 w-3.5" style={{ color: "#00897B" }} />}
                    </button>
                    <button onClick={() => { if (confirm("Excluir permanentemente?")) deleteMutation.mutate({ id: q.id }); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title="Excluir">
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "#E53935" }} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid #E2D9EE" }}>
                    <div className="pt-3">
                      <LatexRenderer fontSize="sm">{q.enunciado}</LatexRenderer>
                    </div>
                    {q.url_imagem && (
                      <img src={q.url_imagem} alt="" className="max-w-full rounded-lg" style={{ border: "1px solid #E2D9EE" }} />
                    )}
                    <div className="space-y-1">
                      {Object.entries(q.alternativas as Record<string, any>).sort().filter(([, value]) => value !== null && value !== "").map(([id, value]) => {
                        const text = value !== null && typeof value === "object" ? value.text ?? "" : value ?? "";
                        const file = value !== null && typeof value === "object" ? value.file : null;
                        return (
                          <div key={id} className="flex gap-2 px-3 py-1.5 rounded-lg text-sm"
                            style={{ background: id === q.gabarito ? "#E0F7F4" : "#F8FAFC", border: id === q.gabarito ? "1px solid #00897B" : "none" }}>
                            <span className="font-bold w-4 flex-shrink-0" style={{ color: id === q.gabarito ? "#00897B" : "#01738d" }}>{id}</span>
                            <div className="flex-1">
                              {file && <img src={file} alt={`Alt ${id}`} className="max-w-xs rounded mb-1" />}
                              {text && <LatexRenderer inline>{text}</LatexRenderer>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {q.comentario_resolucao && (
                      <div className="rounded-lg p-3" style={{ background: "#F3EAF9" }}>
                        <p className="text-xs font-bold mb-1" style={{ color: "#521F80" }}>Resolução</p>
                        <LatexRenderer fontSize="sm">{q.comentario_resolucao}</LatexRenderer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {data && data.pagination.totalPages > 1 && filterTag === "Todas" && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "#F1F5F9", color: "#1A1A2E" }}>Anterior</button>
          <span className="text-sm" style={{ color: "#64748B" }}>{page} / {data.pagination.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "#F1F5F9", color: "#1A1A2E" }}>Próxima</button>
        </div>
      )}

      {/* Modal auditoria */}
      {auditQuestionId && (
        <AuditModal
          questionId={auditQuestionId}
          onClose={() => setAuditQuestionId(null)}
          provider={auditProvider}
        />
      )}

      {/* Modal importador LaTeX */}
      {showLatexImport && (
        <LatexImportModal
          onImport={handleLatexImport}
          onClose={() => setShowLatexImport(false)}
        />
      )}
    </div>
  );
}
