import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import {
  Loader2, BookOpen, ChevronRight, CheckCircle2, XCircle,
  ChevronLeft, ArrowLeft, Brain
} from "lucide-react";

const LETTERS = ["A", "B", "C", "D"];

export default function Revise() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data, isLoading, refetch } = trpc.review.getDaily.useQuery(undefined, { staleTime: 0 });
  const saveAnswer = trpc.review.saveAnswer.useMutation({
    onSuccess: (res) => {
      if (res.allDone) { refetch(); utils.simulations.getStats.invalidate(); }
    },
  });

  const [phase, setPhase] = useState<"reading" | "questions">("reading");
  const [currentQ, setCurrentQ] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7B3FA0" }} />
    </div>
  );

  if (!data?.content) return (
    <div className="text-center py-20 space-y-3">
      <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "#7B3FA0" }} />
      <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum conteúdo disponível</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        O administrador ainda não cadastrou textos para revisão.
      </p>
      <button onClick={() => navigate("/")} className="btn-outline">Voltar ao início</button>
    </div>
  );

  const { review, content } = data;
  const questoes = content.questoes as Array<{ enunciado: string; opcoes: string[]; correta: number }>;
  const existingAnswers = review?.answers as Record<string, number> ?? {};
  const allAnswers = { ...existingAnswers, ...localAnswers };

  // ── Resultado final ───────────────────────────────────────────────────────
  if (review?.completed) {
    const correct = review.correctCount ?? 0;
    const total = questoes.length;

    return (
      <div className="space-y-6 py-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </button>

        <div className="rounded-2xl p-6 text-center" style={{
          background: correct === total ? "#F3EAF9" : "var(--card)",
          border: `1.5px solid ${correct === total ? "#7B3FA0" : "var(--border)"}`,
        }}>
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: correct === total ? "#7B3FA0" : "#E0F7F4" }}>
            <Brain className="h-8 w-8" style={{ color: correct === total ? "#fff" : "#4A148C" }} />
          </div>
          <p className="text-3xl font-black mb-1" style={{ color: correct === total ? "#7B3FA0" : "var(--foreground)" }}>
            {correct}/{total}
          </p>
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
            {correct === total ? "Perfeito! Você leu com atenção!" : correct >= 2 ? "Muito bem!" : "Continue praticando!"}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{content.titulo}</p>
        </div>

        {/* Gabarito */}
        <div className="space-y-3">
          {questoes.map((q, i) => {
            const chosen = allAnswers[i];
            const isCorrect = chosen === q.correta;
            return (
              <div key={i} className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {i + 1}. {q.enunciado}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.opcoes.map((op, j) => (
                    <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                      style={{
                        background: j === q.correta ? "#E8F5E9" : j === chosen && !isCorrect ? "#FFEBEE" : "var(--muted)",
                        border: `1px solid ${j === q.correta ? "#4CAF50" : j === chosen && !isCorrect ? "#E53935" : "transparent"}`,
                      }}>
                      <span className="font-bold" style={{ color: j === q.correta ? "#2E7D32" : j === chosen && !isCorrect ? "#C62828" : "var(--muted-foreground)" }}>
                        {LETTERS[j]}
                      </span>
                      <LatexRenderer inline fontSize="sm">{op}</LatexRenderer>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {isCorrect
                    ? <><CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#2E7D32" }} /><span className="text-xs font-medium" style={{ color: "#2E7D32" }}>Correto!</span></>
                    : <><XCircle className="h-3.5 w-3.5" style={{ color: "#C62828" }} /><span className="text-xs font-medium" style={{ color: "#C62828" }}>Resposta: {LETTERS[q.correta]}</span></>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Fase de leitura ───────────────────────────────────────────────────────
  if (phase === "reading") {
    return (
      <div className="space-y-5 py-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft className="h-4 w-4" /> Início
        </button>

        <div className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "#F3EAF9", border: "1.5px solid #7B3FA044" }}>
          <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "#7B3FA0" }} />
          <div>
            <p className="font-bold text-sm" style={{ color: "#7B3FA0" }}>Revise</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {content.topico ?? "Leitura"} · Leia com atenção antes de responder
            </p>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-black text-base" style={{ color: "var(--foreground)" }}>{content.titulo}</h2>
          <LatexRenderer fontSize="base">{content.conteudo}</LatexRenderer>
        </div>

        <button onClick={() => setPhase("questions")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white"
          style={{ background: "#7B3FA0" }}>
          Responder questões <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── Fase de questões ──────────────────────────────────────────────────────
  const q = questoes[currentQ];
  const chosen = allAnswers[currentQ];
  const isAnswered = chosen !== undefined;
  const allDone = questoes.every((_, i) => allAnswers[i] !== undefined);

  async function handleAnswer(optIdx: number) {
    if (isAnswered || !review) return;
    setLocalAnswers(p => ({ ...p, [currentQ]: optIdx }));
    await saveAnswer.mutateAsync({ reviewId: review.id, questionIndex: currentQ, answer: optIdx });
  }

  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: "#F3EAF9", border: "1.5px solid #7B3FA044" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setPhase("reading")} className="p-1 rounded-lg hover:opacity-70"
            style={{ color: "#7B3FA0" }}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-bold text-sm" style={{ color: "#7B3FA0" }}>Revise — questões</span>
        </div>
        <div className="flex gap-1.5">
          {questoes.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className="h-2 rounded-full transition-all"
              style={{ width: currentQ === i ? 20 : 8, background: allAnswers[i] !== undefined ? "#7B3FA0" : "var(--border)" }} />
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Questão {currentQ + 1} de {questoes.length}
        </p>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--foreground)" }}>
          {q.enunciado}
        </p>
        <div className="space-y-2">
          {q.opcoes.map((op, j) => {
            const isChosen = chosen === j;
            const isCorrect = isAnswered && j === q.correta;
            const isWrong = isAnswered && isChosen && j !== q.correta;
            return (
              <button key={j} onClick={() => handleAnswer(j)} disabled={isAnswered}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isCorrect ? "#E8F5E9" : isWrong ? "#FFEBEE" : isChosen ? "#F3EAF9" : "var(--muted)",
                  border: `1.5px solid ${isCorrect ? "#4CAF50" : isWrong ? "#E53935" : isChosen ? "#7B3FA0" : "var(--border)"}`,
                  opacity: isAnswered && !isChosen && !isCorrect ? 0.5 : 1,
                }}>
                <span className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: isCorrect ? "#4CAF50" : isWrong ? "#E53935" : isChosen ? "#7B3FA0" : "var(--border)",
                    color: isCorrect || isWrong || isChosen ? "#fff" : "var(--muted-foreground)",
                  }}>
                  {LETTERS[j]}
                </span>
                <span className="text-sm flex-1" style={{ color: "var(--foreground)" }}>
                  <LatexRenderer inline fontSize="sm">{op}</LatexRenderer>
                </span>
                {isCorrect && <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#4CAF50" }} />}
                {isWrong && <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#E53935" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="btn-outline flex items-center gap-1 disabled:opacity-40"
          style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <span className="text-sm font-mono" style={{ color: "var(--muted-foreground)" }}>
          {currentQ + 1}/{questoes.length}
        </span>
        {currentQ < questoes.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)}
            className="btn-outline flex items-center gap-1"
            style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        ) : allDone ? (
          <button onClick={() => refetch()}
            className="btn-primary flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Ver resultado
          </button>
        ) : (
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Responda todas</span>
        )}
      </div>
    </div>
  );
}
