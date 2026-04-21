import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { QuestionCard, LatexRenderer } from "@/LatexRenderer";
import { Loader2, BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckSquare, Clock, Home } from "lucide-react";
import { VideoButton } from "@/YoutubeEmbed";
import { cn } from "@/lib/utils";

type TrainingQuestion = {
  id: number;
  enunciado: string;
  url_imagem: string | null;
  alternativas: Record<string, string>;
  gabarito: string;
  comentario_resolucao: string | null;
  url_video: string | null;
  conteudo_principal: string;
  nivel_dificuldade: string;
};

export default function Treino() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<TrainingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [openResolution, setOpenResolution] = useState<Record<number, boolean>>({});
  const [openVideo, setOpenVideo] = useState<Record<number, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simulationIdRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (questions.length > 0 && !finished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => { elapsedRef.current = s + 1; return s + 1; });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [questions.length, finished]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [idx]);

  function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  }

  const { data: topics, isLoading: loadingTopics } = trpc.simulations.getTopics.useQuery();
  const saveTrainingAnswer = trpc.simulations.saveTrainingAnswer.useMutation();
  const finishTrainingSession = trpc.simulations.finishTrainingSession.useMutation({
    onSuccess: () => {
      utils.simulations.getTopicStats.invalidate();
      utils.simulations.getStats.invalidate();
    },
  });

  const startTraining = trpc.simulations.startFreeTraining.useMutation({
    onSuccess: (data) => {
      simulationIdRef.current = data.simulationId;
      setQuestions(data.questions as TrainingQuestion[]);
      setAnswers({});
      setRevealed({});
      setOpenResolution({});
      setOpenVideo({});
      setIdx(0);
      setFinished(false);
      elapsedRef.current = 0;
      setElapsedSeconds(0);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  });

  function handleAnswer(questionId: number, alt: string) {
    if (revealed[questionId]) return;
    const q = questions.find(q => q.id === questionId);
    const isCorrect = q ? alt === q.gabarito : false;
    setAnswers((p) => ({ ...p, [questionId]: alt }));
    setRevealed((p) => ({ ...p, [questionId]: true }));
    // Save to DB in background for stats tracking
    if (simulationIdRef.current) {
      const order = questions.findIndex(q => q.id === questionId);
      saveTrainingAnswer.mutate({
        simulationId: simulationIdRef.current,
        questionId,
        selectedAnswer: alt,
        isCorrect,
        order,
      });
    }
  }

  function handleStart() {
    startTraining.mutate({ conteudo: selectedTopic ?? undefined, count });
  }

  function handleFinish(qs: TrainingQuestion[], ans: Record<number, string>) {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    // Save session completion in background
    if (simulationIdRef.current) {
      const correct = qs.filter(q => ans[q.id] === q.gabarito).length;
      finishTrainingSession.mutate({
        simulationId: simulationIdRef.current,
        correctCount: correct,
        totalTimeSeconds: elapsedRef.current,
      });
      simulationIdRef.current = null;
    }
  }

  function handleReset() {
    setQuestions([]);
    setAnswers({});
    setRevealed({});
    setIdx(0);
    setFinished(false);
    simulationIdRef.current = null;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // Tela de seleção
  if (questions.length === 0) {
    return (
      <div className="space-y-8 py-2">
        <div className="rounded-2xl px-6 py-8" style={{ background: "linear-gradient(135deg, #263238 0%, #009688 100%)", color: "#ffffff" }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold opacity-80">Treino livre</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Pratique sem pressão</h1>
          <p className="text-sm opacity-80">Escolha um tópico, responda e veja o gabarito na hora.</p>
        </div>

        {loadingTopics ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--pr-teal)" }} /></div>
        ) : (
          <div className="space-y-5">
            {/* Tópico */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Tópico</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    border: `1.5px solid ${selectedTopic === null ? "var(--pr-teal)" : "var(--pr-border)"}`,
                    background: selectedTopic === null ? "#E0F2F1" : "var(--card)",
                    color: selectedTopic === null ? "#00695C" : "var(--muted-foreground)",
                  }}
                >
                  Todos os tópicos
                </button>
                {topics?.map((t) => (
                  <button
                    key={t.conteudo}
                    onClick={() => setSelectedTopic(t.conteudo)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      border: `1.5px solid ${selectedTopic === t.conteudo ? "var(--pr-teal)" : "var(--pr-border)"}`,
                      background: selectedTopic === t.conteudo ? "#E0F2F1" : "var(--card)",
                      color: selectedTopic === t.conteudo ? "#00695C" : "var(--muted-foreground)",
                    }}
                  >
                    <span className="block">{t.conteudo}</span>
                    <span className="text-xs opacity-60">{Number(t.total)} questões</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Quantidade</p>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      border: `1.5px solid ${count === n ? "var(--pr-teal)" : "var(--pr-border)"}`,
                      background: count === n ? "#E0F2F1" : "var(--card)",
                      color: count === n ? "#00695C" : "var(--muted-foreground)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={startTraining.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white"
              style={{ background: "#009688" }}
            >
              {startTraining.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <BookOpen className="h-4 w-4" />}
              Começar treino
            </button>
          </div>
        )}
      </div>
    );
  }

  // Tela de resultado final
  if (finished) {
    const correct = questions.filter((q) => answers[q.id] === q.gabarito).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="space-y-6 py-2">
        <div className="rounded-2xl p-6 text-center" style={{ background: pct >= 70 ? "var(--pr-success-bg)" : "var(--pr-danger-bg)", border: `1.5px solid ${pct >= 70 ? "var(--pr-success-border)" : "var(--pr-danger-border)"}` }}>
          <p className="text-4xl font-black mb-1" style={{ color: pct >= 70 ? "#00695C" : "#C62828" }}>{pct}%</p>
          <p className="text-sm font-medium" style={{ color: pct >= 70 ? "#00695C" : "#C62828" }}>
            {correct} de {questions.length} acertos
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Clock className="h-3.5 w-3.5" style={{ color: pct >= 70 ? "#00695C" : "#C62828", opacity: 0.7 }} />
            <p className="text-xs opacity-70" style={{ color: pct >= 70 ? "#00695C" : "#C62828" }}>
              Tempo total: {fmtTime(elapsedSeconds)}
            </p>
          </div>
          <p className="text-xs mt-1 opacity-70" style={{ color: pct >= 70 ? "#00695C" : "#C62828" }}>
            {pct >= 70 ? "Ótimo desempenho!" : pct >= 50 ? "Continue praticando!" : "Revise o conteúdo e tente novamente."}
          </p>
        </div>

        {/* Resumo por questão */}
        <div className="space-y-2">
          {questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.gabarito;
            return (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: isCorrect ? "var(--pr-success-bg)" : "var(--pr-danger-bg)", border: `1px solid ${isCorrect ? "var(--pr-success-border)" : "var(--pr-danger-border)"}` }}>
                <span className="text-xs font-bold w-5 text-center" style={{ color: isCorrect ? "#00695C" : "#C62828" }}>{i + 1}</span>
                <span className="flex-1 text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{q.conteudo_principal}</span>
                <span className="text-xs font-bold" style={{ color: isCorrect ? "#00695C" : "#C62828" }}>
                  {answers[q.id] ?? "—"} → {q.gabarito}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={handleReset} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white" style={{ background: "#009688" }}>
            <RotateCcw className="h-4 w-4" /> Novo treino
          </button>
          <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}>
            <Home className="h-4 w-4" /> Início
          </button>
        </div>
      </div>
    );
  }

  // Tela de questão
  const q = questions[idx];
  const isRevealed = revealed[q.id];

  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: "var(--pr-teal-soft)", border: "1.5px solid var(--pr-teal-border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: "var(--pr-teal)" }}>Treino livre</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal-darker)" }}>{q.nivel_dificuldade}</span>
        </div>
        <span className="text-sm font-mono" style={{ color: "var(--muted-foreground)" }}>{idx + 1}/{questions.length}</span>
      </div>

      {/* Questão */}
      <div className="card">
        <QuestionCard
          order={idx + 1}
          total={questions.length}
          enunciado={q.enunciado}
          url_imagem={q.url_imagem}
          alternativas={q.alternativas}
          selectedAnswer={answers[q.id] ?? null}
          correctAnswer={isRevealed ? q.gabarito : null}
          onAnswer={(alt) => handleAnswer(q.id, alt)}
          disabled={isRevealed}
        />
      </div>

      {/* Resolução */}
      {isRevealed && (q.comentario_resolucao || q.url_video) && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {q.comentario_resolucao && (
              <button
                onClick={() => setOpenResolution(p => ({ ...p, [q.id]: !p[q.id] }))}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all"
                style={{ background: openResolution[q.id] ? "var(--pr-info)" : "var(--pr-info-bg)", color: openResolution[q.id] ? "#fff" : "var(--pr-info)", border: "1px solid var(--pr-info-border)" }}>
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
            <div className="rounded-xl p-4" style={{ background: "var(--pr-info-bg)", border: "1px solid var(--pr-info-border)" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#1D4ED8" }}>Resolução</p>
              <LatexRenderer fontSize="sm">{q.comentario_resolucao}</LatexRenderer>
            </div>
          )}
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="btn-outline flex items-center gap-1" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>

        <span className="text-sm font-semibold tabular-nums px-3 py-2 rounded-xl" style={{ background: "var(--muted)", color: "var(--foreground)" }}>
          {idx + 1} / {questions.length}
        </span>

        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx((i) => i + 1)} className="btn-outline flex items-center gap-1" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={() => handleFinish(questions, answers)} className="btn-primary flex items-center gap-1">
            <CheckSquare className="h-4 w-4" /> Ver resultado
          </button>
        )}
      </div>
    </div>
  );
}
