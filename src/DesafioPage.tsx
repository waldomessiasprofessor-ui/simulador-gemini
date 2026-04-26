import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { QuestionCard, LatexRenderer } from "@/LatexRenderer";
import { Loader2, CheckCircle2, XCircle, Flame, ChevronLeft, ChevronRight, BookOpen, RefreshCw } from "@/icons";
import { VideoButton } from "@/YoutubeEmbed";

type DailyQ = {
  id: number;
  enunciado: string;
  url_imagem: string | null;
  url_video: string | null;
  alternativas: Record<string, string>;
  gabarito: string;
  comentario_resolucao: string | null;
  conteudo_principal: string;
  nivel_dificuldade: string;
};

export default function DesafioPage() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: daily, isLoading, refetch } = trpc.simulations.getDailyChallenge.useQuery(undefined, { staleTime: 0 });
  const saveDailyAnswer = trpc.simulations.saveDailyAnswer.useMutation();
  const finishDaily = trpc.simulations.finishDailyChallenge.useMutation({
    onSuccess: () => {
      refetch();
      utils.simulations.getStats.invalidate();
      utils.simulations.getTopicStats.invalidate();
    },
  });
  const newChallenge = trpc.simulations.newDailyChallenge.useMutation({
    onSuccess: () => {
      setLocalAnswers({});
      setRevealed({});
      setOpenResolution({});
      setIdx(0);
      refetch();
      utils.simulations.getStats.invalidate();
      utils.simulations.getTopicStats.invalidate();
    },
  });

  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [openResolution, setOpenResolution] = useState<Record<number, boolean>>({});
  const [openVideo, setOpenVideo] = useState<Record<number, boolean>>({});
  const [idx, setIdx] = useState(0);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [idx]);
  useEffect(() => { if (daily) window.scrollTo({ top: 0, behavior: "instant" }); }, [daily?.id]);

  // Cronômetro — marca o início da sessão (ao abrir o desafio). Se o aluno
  // fechar e voltar, reinicia; contamos só o tempo ativo desta sessão.
  const startTsRef = useRef<number>(Date.now());
  useEffect(() => {
    if (daily && !daily.completed) startTsRef.current = Date.now();
  }, [daily?.challengeId, daily?.completed]);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
    </div>
  );
  if (!daily) return null;

  const questions = daily.questions as DailyQ[];
  const answers = { ...(daily.answers as Record<string, string>), ...localAnswers };
  const allAnswered = questions.every((q) => answers[q.id]);

  // ─── Tela de resultado ──────────────────────────────────────────────────────
  if (daily.completed) {
    const correct = daily.correctCount ?? 0;
    const total = questions.length;
    const color = correct === total ? "#16A34A" : correct >= 2 ? "#B45309" : "#DC2626";
    const bg = correct === total ? "#F0FDF4" : correct >= 2 ? "#FFFBEB" : "#FEF2F2";
    const border = correct === total ? "#A7F3D0" : correct >= 2 ? "#FCD34D" : "#FECACA";

    return (
      <div className="space-y-4 py-2">
        {/* Placar */}
        <div className="rounded-2xl p-6 text-center" style={{ background: bg, border: `1.5px solid ${border}` }}>
          <Flame className="h-10 w-10 mx-auto mb-3" style={{ color }} />
          <p className="text-3xl font-black mb-1" style={{ color }}>{correct}/{total}</p>
          <p className="font-semibold" style={{ color }}>
            {correct === total ? "Perfeito! Acertou tudo!" : correct >= 2 ? "Bom desempenho!" : "Continue praticando!"}
          </p>
        </div>

        {/* Gabarito comentado — todas as questões */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>
            Gabarito comentado
          </p>
          {questions.map((q) => {
            const isCorrect = answers[q.id] === q.gabarito;
            const resOpen = openResolution[q.id];
            return (
              <div key={q.id} className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${isCorrect ? "#A7F3D0" : "#FECACA"}` }}>
                {/* Linha de resultado */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: isCorrect ? "#F0FDF4" : "#FEF2F2" }}>
                  {isCorrect
                    ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#16A34A" }} />
                    : <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#DC2626" }} />}
                  <span className="flex-1 text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {q.conteudo_principal}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: isCorrect ? "#F0FDF4" : "#FEF2F2", color: isCorrect ? "#16A34A" : "#DC2626", border: `1px solid ${isCorrect ? "#A7F3D0" : "#FECACA"}` }}>
                      {answers[q.id] ?? "—"} → {q.gabarito}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {q.comentario_resolucao && (
                        <button
                          onClick={() => setOpenResolution(p => ({ ...p, [q.id]: !p[q.id] }))}
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all"
                          style={{
                            background: resOpen ? "#1D4ED8" : "#EFF6FF",
                            color: resOpen ? "#fff" : "#1D4ED8",
                            border: `1px solid #BFDBFE`,
                          }}>
                          <BookOpen className="h-3 w-3" />
                          {resOpen ? "Fechar" : "Resolução"}
                        </button>
                      )}
                      {q.url_video && (
                        <VideoButton
                          url={q.url_video}
                          open={!!openVideo[q.id]}
                          onToggle={() => setOpenVideo(p => ({ ...p, [q.id]: !p[q.id] }))}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Resolução expandida com LaTeX */}
                {resOpen && q.comentario_resolucao && (
                  <div className="px-4 pb-4 pt-3 space-y-2" style={{ background: "var(--card)", borderTop: "3px solid #1D4ED8" }}>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1D4ED8" }}>Resolução</p>
                    <LatexRenderer fontSize="sm">{q.comentario_resolucao}</LatexRenderer>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <button onClick={() => navigate("/")} className="btn-outline flex-1 justify-center">
            Voltar ao início
          </button>
          <button
            onClick={() => newChallenge.mutate()}
            disabled={newChallenge.isPending}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {newChallenge.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <RefreshCw className="h-4 w-4" />}
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ─── Questão atual ──────────────────────────────────────────────────────────
  const q = questions[idx];
  const isRevealed = revealed[q.id];

  async function handleAnswer(alt: string) {
    if (revealed[q.id]) return;
    setLocalAnswers((p) => ({ ...p, [q.id]: alt }));
    setRevealed((p) => ({ ...p, [q.id]: true }));
    await saveDailyAnswer.mutateAsync({ challengeId: daily!.challengeId, questionId: q.id, selectedAnswer: alt });
  }

  return (
    <div className="space-y-5 py-2">
      {/* Barra de progresso */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: "#E0F2F1", border: "1.5px solid #B2DFDB" }}>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4" style={{ color: "#B45309" }} />
          <span className="font-bold text-sm" style={{ color: "#009688" }}>Desafio do dia</span>
        </div>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="h-2 rounded-full transition-all"
              style={{ width: idx === i ? 20 : 8, background: answers[questions[i].id] ? "#009688" : "var(--border)" }} />
          ))}
        </div>
      </div>

      {/* Questão */}
      <div className="card">
        <QuestionCard
          order={idx + 1}
          total={questions.length}
          enunciado={q.enunciado}
          url_imagem={q.url_imagem}
          alternativas={q.alternativas}
          selectedAnswer={localAnswers[q.id] ?? (daily.answers as Record<string,string>)[q.id] ?? null}
          correctAnswer={isRevealed ? q.gabarito : null}
          onAnswer={handleAnswer}
          disabled={isRevealed}
        />
      </div>

      {/* Resolução inline com LaTeX */}
      {isRevealed && (q.comentario_resolucao || q.url_video) && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {q.comentario_resolucao && (
              <button
                onClick={() => setOpenResolution(p => ({ ...p, [q.id]: !p[q.id] }))}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all"
                style={{ background: openResolution[q.id] ? "#1D4ED8" : "#EFF6FF", color: openResolution[q.id] ? "#fff" : "#1D4ED8", border: "1px solid #BFDBFE" }}>
                <BookOpen className="h-4 w-4" />
                {openResolution[q.id] ? "Ocultar resolução" : "Ver resolução"}
              </button>
            )}
            {q.url_video && (
              <VideoButton
                url={q.url_video}
                open={!!openVideo[q.id]}
                onToggle={() => setOpenVideo(p => ({ ...p, [q.id]: !p[q.id] }))}
              />
            )}
          </div>
          {openResolution[q.id] && q.comentario_resolucao && (
            <div className="rounded-xl p-4" style={{ background: "var(--card)", borderLeft: "3px solid #1D4ED8", border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#1D4ED8" }}>Resolução</p>
              <LatexRenderer fontSize="sm">{q.comentario_resolucao}</LatexRenderer>
            </div>
          )}
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
          className="btn-outline flex items-center gap-1" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{idx + 1}/{questions.length}</span>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx(idx + 1)} className="btn-outline flex items-center gap-1"
            style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        ) : allAnswered ? (
          <button onClick={() => finishDaily.mutateAsync({
              challengeId: daily.challengeId,
              totalTimeSeconds: Math.max(0, Math.round((Date.now() - startTsRef.current) / 1000)),
            })}
            disabled={finishDaily.isPending}
            className="btn-primary flex items-center gap-1">
            {finishDaily.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Ver resultado
          </button>
        ) : (
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Responda todas</span>
        )}
      </div>
    </div>
  );
}
