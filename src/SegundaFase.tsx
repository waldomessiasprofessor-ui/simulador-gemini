import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import { Loader2, AlertCircle, BookOpen, ChevronDown, ChevronUp, Sparkles, Youtube, Info } from "@/icons";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Resultado = "acertei" | "quase" | "errei";

const RESULTADO_CONFIG: Record<
  Resultado,
  { label: string; emoji: string; xp: number; style: React.CSSProperties; dotStyle: React.CSSProperties }
> = {
  acertei: {
    label: "Acertei!",
    emoji: "✅",
    xp: 3,
    style: { background: "#DCFCE7", color: "#15803D", border: "2px solid #86EFAC" },
    dotStyle: { background: "#16A34A" },
  },
  quase: {
    label: "Quase acertei",
    emoji: "🟡",
    xp: 1,
    style: { background: "#FFFBEB", color: "#B45309", border: "2px solid #FCD34D" },
    dotStyle: { background: "#D97706" },
  },
  errei: {
    label: "Errei",
    emoji: "❌",
    xp: 0,
    style: { background: "#FEF2F2", color: "#DC2626", border: "2px solid #FECACA" },
    dotStyle: { background: "#DC2626" },
  },
};

const FONTE_INFO: Record<string, { label: string; desc: string }> = {
  UNICAMP: {
    label: "UNICAMP — Segunda Fase",
    desc: "Questões dissertativas de Matemática da 2ª fase da UNICAMP. Resolva no papel, depois compare com o gabarito e faça sua autocorreção.",
  },
};

// ─── "Como funciona?" collapsível ────────────────────────────────────────────

function ComoFunciona() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--card)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:opacity-80 transition-opacity"
      >
        <Info className="h-4 w-4 flex-shrink-0" style={{ color: "#009688" }} />
        <span className="text-sm font-semibold flex-1" style={{ color: "var(--foreground)" }}>
          Como funciona a autocorreção?
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
        ) : (
          <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-sm pt-3" style={{ color: "var(--foreground)" }}>
            A <strong>autocorreção ativa</strong> é uma das metodologias de estudo mais eficazes comprovadas pela ciência cognitiva. Veja como funciona:
          </p>
          <div className="space-y-2">
            {[
              {
                emoji: "🧠",
                title: "Recuperação ativa",
                text: "Resolver antes de ver a resposta força seu cérebro a ativar o conhecimento armazenado — esse esforço consolida o aprendizado muito mais do que reler o conteúdo.",
              },
              {
                emoji: "🔍",
                title: "Metacognição",
                text: "Comparar sua resolução com o gabarito e avaliar onde errou treina sua capacidade de identificar lacunas reais — você aprende a \"aprender a aprender\".",
              },
              {
                emoji: "📊",
                title: "Como pontuar honestamente",
                text: "✅ Acertei (+3 XP): raciocínio correto e chegou ao resultado certo.\n🟡 Quase (+1 XP): entendeu a lógica mas cometeu erro de cálculo ou notação.\n❌ Errei (0 XP): caminho errado ou em branco — hora de rever o conteúdo!",
              },
              {
                emoji: "🎯",
                title: "Por que ser honesto?",
                text: "Marcar \"acertei\" quando errou prejudica só você. O XP reflete seu domínio real — use-o para identificar os temas que precisam de mais atenção.",
              },
            ].map(({ emoji, title, text }) => (
              <div
                key={title}
                className="rounded-xl px-3 py-2.5"
                style={{ background: "var(--muted)" }}
              >
                <p className="text-sm font-bold mb-0.5" style={{ color: "var(--foreground)" }}>
                  {emoji} {title}
                </p>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--muted-foreground)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Card individual de questão ───────────────────────────────────────────────

type QuestionData = {
  id: number;
  ano: number | null;
  numero_prova: number | null;
  conteudo_principal: string;
  nivel_dificuldade: string;
  enunciado: string;
  imagens: Array<{ posicao: string; descricao: string; url?: string }>;
  resolucao: string;
  url_youtube?: string | null;
  ultimoResultado: Resultado | null;
};

function QuestionRow({
  q,
  index,
}: {
  q: QuestionData;
  index: number;
}) {
  const utils = trpc.useUtils();
  const saveProgress = trpc.segundaFase.saveProgress.useMutation({
    onSuccess: (data) => {
      utils.segundaFase.getQuestions.invalidate();
      utils.segundaFase.getStats.invalidate();
      if (data.xpEarned > 0) toast.success(`+${data.xpEarned} XP ganhos!`);
      setPhase("done");
    },
    onError: (e) => toast.error(e.message),
  });

  const [phase, setPhase] = useState<"closed" | "reading" | "resolucao" | "done">(
    q.ultimoResultado ? "done" : "closed"
  );
  const [lastResult, setLastResult] = useState<Resultado | null>(q.ultimoResultado);

  function handleAutoCorrecao(resultado: Resultado) {
    setLastResult(resultado);
    saveProgress.mutate({ questionId: q.id, resultado });
  }

  const isOpen = phase !== "closed";
  const cfg = lastResult ? RESULTADO_CONFIG[lastResult] : null;

  // Separar imagens com e sem URL
  const imagensComUrl = q.imagens.filter((img) => img.url);
  const imagensSemUrl = q.imagens.filter((img) => !img.url);

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      {/* Cabeçalho sempre visível */}
      <button
        onClick={() => setPhase((p) => (p === "closed" ? "reading" : "closed"))}
        className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:opacity-90"
        style={{ background: isOpen ? "#E0F2F1" : "var(--card)" }}
      >
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{ background: "#009688", color: "#fff" }}
        >
          {q.numero_prova}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>
            {q.conteudo_principal}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {q.nivel_dificuldade}{q.ano ? ` · ${q.ano}` : ""}
          </p>
        </div>
        {/* Badge de último resultado */}
        {cfg && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
            style={cfg.style}
          >
            {cfg.emoji} {cfg.label}
          </span>
        )}
        <div style={{ color: "#009688", flexShrink: 0 }}>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Conteúdo expandido */}
      {isOpen && (
        <div className="px-4 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Enunciado */}
          <div className="pt-4">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              Enunciado
            </p>
            {/* LaTeX rendering */}
            <LatexRenderer fontSize="sm">{q.enunciado}</LatexRenderer>

            {/* Imagens com URL — mostra diretamente */}
            {imagensComUrl.length > 0 && (
              <div className="mt-3 space-y-3">
                {imagensComUrl.map((img, i) => (
                  <figure key={i} className="m-0">
                    {img.posicao && (
                      <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                        [{img.posicao}]{img.descricao ? ` — ${img.descricao}` : ""}
                      </p>
                    )}
                    <img
                      src={img.url}
                      alt={img.descricao || `Figura ${i + 1}`}
                      className="max-w-full rounded-xl"
                      style={{ border: "1px solid var(--border)" }}
                    />
                  </figure>
                ))}
              </div>
            )}

            {/* Aviso de imagem sem URL ainda */}
            {imagensSemUrl.length > 0 && (
              <div
                className="mt-3 rounded-xl px-3 py-2.5 flex items-start gap-2 text-xs"
                style={{ background: "#FFFBEB", border: "1px solid #FCD34D", color: "#B45309" }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Imagem referenciada (ainda não disponível):</p>
                  {imagensSemUrl.map((img, i) => (
                    <p key={i} className="mt-0.5 opacity-80">
                      [{img.posicao}] {img.descricao}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botão "Ver resolução" */}
          {phase === "reading" && (
            <button
              onClick={() => setPhase("resolucao")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-85"
              style={{ background: "#263238", color: "#fff" }}
            >
              <BookOpen className="h-4 w-4" />
              Ver resolução oficial
            </button>
          )}

          {/* Resolução + autocorreção */}
          {(phase === "resolucao" || phase === "done") && (
            <>
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Resolução oficial
                </p>
                {/* LaTeX rendering na resolução */}
                <LatexRenderer fontSize="sm">{q.resolucao}</LatexRenderer>

                {/* Botão YouTube se disponível */}
                {q.url_youtube && (
                  <a
                    href={q.url_youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full justify-center hover:opacity-85 transition-opacity"
                    style={{ background: "#DC2626", color: "#fff" }}
                  >
                    <Youtube className="h-4 w-4" />
                    Ver resolução em vídeo
                  </a>
                )}
              </div>

              {phase === "resolucao" && (
                <div className="space-y-3">
                  <p
                    className="text-xs font-bold text-center"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Como você se saiu?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["acertei", "quase", "errei"] as Resultado[]).map((r) => {
                      const c = RESULTADO_CONFIG[r];
                      return (
                        <button
                          key={r}
                          onClick={() => handleAutoCorrecao(r)}
                          disabled={saveProgress.isPending}
                          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-bold text-xs transition-opacity hover:opacity-85"
                          style={c.style}
                        >
                          <span className="text-lg">{c.emoji}</span>
                          <span>{c.label}</span>
                          {c.xp > 0 && (
                            <span className="text-[10px] font-black opacity-70">+{c.xp} XP</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {saveProgress.isPending && (
                    <div className="flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#009688" }} />
                    </div>
                  )}
                  {/* Como funciona — dentro da autocorreção */}
                  <ComoFunciona />
                </div>
              )}

              {/* Refazer autocorreção */}
              {phase === "done" && lastResult && (
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-sm font-bold px-3 py-2 rounded-xl"
                    style={RESULTADO_CONFIG[lastResult].style}
                  >
                    {RESULTADO_CONFIG[lastResult].emoji} {RESULTADO_CONFIG[lastResult].label}
                  </span>
                  <button
                    onClick={() => setPhase("resolucao")}
                    className="text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-80"
                    style={{ color: "var(--muted-foreground)", background: "var(--muted)" }}
                  >
                    Refazer autocorreção
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Barra de progresso / stats ───────────────────────────────────────────────

function StatsBar({ stats }: { stats: { acertei: number; quase: number; errei: number; total: number } }) {
  if (stats.total === 0) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap"
      style={{ background: "#E0F2F1", border: "1.5px solid #B2DFDB" }}
    >
      <span className="text-xs font-bold" style={{ color: "#009688" }}>
        {stats.total} respondidas
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        {(["acertei", "quase", "errei"] as Resultado[]).map((r) => {
          const c = RESULTADO_CONFIG[r];
          const n = stats[r];
          if (n === 0) return null;
          return (
            <span key={r} className="flex items-center gap-1 text-xs font-semibold">
              <span
                className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                style={c.dotStyle}
              />
              {n} {c.label.toLowerCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function SegundaFase({ fonte = "UNICAMP" }: { fonte?: string }) {
  const { data: questions, isLoading, isError } = trpc.segundaFase.getQuestions.useQuery({ fonte });
  const { data: stats } = trpc.segundaFase.getStats.useQuery();

  const info = FONTE_INFO[fonte] ?? FONTE_INFO["UNICAMP"];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card text-center py-12 space-y-3">
        <p className="text-3xl">⚠️</p>
        <p className="font-bold" style={{ color: "var(--foreground)" }}>Tabela não encontrada</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Execute no servidor:<br />
          <code className="text-xs px-2 py-1 rounded" style={{ background: "var(--muted)" }}>
            node add-segunda-fase-tables.mjs
          </code><br />
          <code className="text-xs px-2 py-1 rounded mt-1 inline-block" style={{ background: "var(--muted)" }}>
            node insert-unicamp2026-discursivas.mjs
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div
        className="rounded-2xl px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-75">Segunda Fase</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{info.label}</h1>
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.85)" }}>
          {info.desc}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: String(questions?.length ?? "—"), sub: "questões" },
            { label: "Dissertativa", sub: "tipo" },
            { label: "Autocorreção", sub: "metodologia" },
          ].map(({ label, sub }) => (
            <div
              key={sub}
              className="px-4 py-2.5 rounded-xl text-xs"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <span className="font-black text-lg block">{label}</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Como funciona — visível antes de começar */}
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
      >
        <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>Como funciona</p>
        <ol className="space-y-0.5 list-decimal list-inside">
          <li>Abra a questão e leia o enunciado com calma.</li>
          <li>Resolva no papel ou mentalmente.</li>
          <li>Clique em <strong>Ver resolução oficial</strong> para conferir.</li>
          <li>Avalie sua resposta: ✅ Acertei (+3 XP) · 🟡 Quase (+1 XP) · ❌ Errei.</li>
        </ol>
      </div>

      {/* Stats */}
      {stats && <StatsBar stats={stats} />}

      {/* Lista de questões */}
      {!questions || questions.length === 0 ? (
        <div
          className="rounded-2xl px-6 py-12 text-center"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
            Nenhuma questão disponível
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            As questões de segunda fase da {fonte} ainda não foram adicionadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <QuestionRow key={q.id} q={q as QuestionData} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
