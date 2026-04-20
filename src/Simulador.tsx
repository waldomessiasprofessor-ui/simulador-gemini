import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { QuestionCard } from "@/LatexRenderer";
import { toast } from "sonner";
import { Clock, ChevronLeft, ChevronRight, CheckSquare, Loader2, PlayCircle, Pause, RotateCcw, XCircle } from "lucide-react";

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const VESTIBULAR_INFO: Record<string, { label: string; desc: string; total: number }> = {
  ENEM:    { label: "Simulado ENEM",    desc: "45 questões de Matemática com correção pela Teoria de Resposta ao Item — a mesma metodologia usada pelo INEP.", total: 45 },
  UNICAMP: { label: "Simulado UNICAMP", desc: "Questões de Matemática no estilo da 1ª fase da UNICAMP — múltipla escolha, com 4 alternativas.", total: 45 },
  FUVEST:  { label: "Simulado FUVEST",  desc: "Questões de Matemática no estilo da 1ª fase da FUVEST — múltipla escolha.", total: 45 },
  UNESP:   { label: "Simulado UNESP",   desc: "Questões de Matemática no estilo da 1ª fase da UNESP — múltipla escolha.", total: 45 },
  REPVET:  { label: "Repositório Vetor", desc: "Questões do banco Vetor para prática e revisão de conteúdos do vestibular — múltipla escolha.", total: 45 },
};

export default function Simulador({ fonte = "ENEM" }: { fonte?: string }) {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: active, isLoading } = trpc.simulations.getActive.useQuery(undefined, { staleTime: 0 });
  const saveAnswer = trpc.simulations.saveAnswer.useMutation();
  const finish = trpc.simulations.finish.useMutation({
    onSuccess: (d) => {
      utils.simulations.getStats.invalidate();
      utils.simulations.getActive.invalidate();
      utils.simulations.getHistory.invalidate();
      utils.simulations.getTopicStats.invalidate();
      navigate(`/resultado/${d.simulationId}`);
    },
    onError: (e) => toast.error(e.message),
  });
  const abandon = trpc.simulations.abandon.useMutation({
    onSuccess: () => {
      utils.simulations.getActive.invalidate();
      utils.simulations.getStats.invalidate();
      navigate("/");
    },
    onError: (e) => toast.error(e.message),
  });
  const start = trpc.simulations.start.useMutation({
    onSuccess: () => { window.location.reload(); },
    onError: (e) => toast.error(e.message),
  });

  const info = VESTIBULAR_INFO[fonte] ?? VESTIBULAR_INFO["ENEM"];

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [qTime, setQTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const qTimeRef = useRef(0);
  const totalRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const saved: Record<number, string> = {};
    active.questions.forEach((q: any) => { if (q.selectedAnswer) saved[q.id] = q.selectedAnswer; });
    setAnswers(saved);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [active?.simulationId]);

  useEffect(() => {
    const t = setInterval(() => {
      qTimeRef.current++;
      totalRef.current++;
      setQTime(qTimeRef.current);
      setTotalTime(totalRef.current);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { qTimeRef.current = 0; setQTime(0); window.scrollTo({ top: 0, behavior: "instant" }); }, [idx]);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  if (!active) {
    return (
      <div className="space-y-6 py-2">
        <div className="rounded-2xl px-6 py-8 text-white" style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
          <h1 className="text-2xl font-bold mb-2">{info.label}</h1>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>{info.desc}</p>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            {[
              { label: String(info.total), sub: "questões" },
              { label: fonte === "ENEM" ? "TRI" : "Acertos", sub: "correção" },
              { label: "3 min", sub: "por questão" },
            ].map(({ label, sub }) => (
              <div key={label} className="px-4 py-2.5 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.12)" }}>
                <span className="font-black text-lg block">{label}</span>
                <span style={{ color: "rgba(255,255,255,0.75)" }}>{sub}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => start.mutate({ stage: 3, fonte })}
            disabled={start.isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: "#fff", color: "#009688" }}
          >
            {start.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
            Iniciar simulado
          </button>
        </div>
      </div>
    );
  }

  const questions = active.questions;
  const q = questions[idx];
  const overTime = qTime > active.timeLimitPerQuestion;
  const answered = Object.keys(answers).length;

  async function handleAnswer(questionId: number, alt: string) {
    setAnswers((p) => ({ ...p, [questionId]: alt }));
    await saveAnswer.mutateAsync({
      simulationId: active!.simulationId,
      questionId,
      selectedAnswer: alt,
      timeSpentSeconds: qTimeRef.current,
    });
  }

  async function handleFinish() {
    const missing = questions.filter((q: any) => !answers[q.id]).length;
    if (missing > 0 && !confirm(`${missing} questão(ões) sem resposta. Deseja finalizar mesmo assim?`)) return;
    await finish.mutateAsync({ simulationId: active.simulationId, totalTimeSeconds: totalRef.current });
  }

  return (
    <div className="space-y-5 py-2">
      {/* Options overlay */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-2xl p-6 w-80 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <p className="font-black text-base text-center" style={{ color: "var(--foreground)" }}>O que deseja fazer?</p>
            <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
              Seu progresso atual: {answered}/{active.totalQuestions} respondidas
            </p>
            <button
              onClick={() => setShowOptions(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal)", border: "1.5px solid var(--pr-teal-border)" }}>
              <Pause className="h-4 w-4" />
              Pausar — continuar depois
              <span className="ml-auto text-xs opacity-70">salva progresso</span>
            </button>
            <button
              onClick={async () => {
                if (!confirm("Reiniciar descarta TODAS as respostas e começa do zero. Confirmar?")) return;
                setShowOptions(false);
                await abandon.mutateAsync({ simulationId: active.simulationId });
                start.mutate({ stage: 3, fonte });
              }}
              disabled={abandon.isPending || start.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "var(--pr-warn-bg)", color: "var(--pr-warn)", border: "1.5px solid var(--pr-warn-border)" }}>
              <RotateCcw className="h-4 w-4" />
              Reiniciar simulado
              <span className="ml-auto text-xs opacity-70">descarta respostas</span>
            </button>
            <button
              onClick={async () => {
                if (!confirm("Encerrar remove este simulado do histórico. Confirmar?")) return;
                setShowOptions(false);
                await abandon.mutateAsync({ simulationId: active.simulationId });
              }}
              disabled={abandon.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "var(--pr-danger-bg)", color: "var(--pr-danger)", border: "1.5px solid var(--pr-danger-border)" }}>
              <XCircle className="h-4 w-4" />
              Encerrar sem salvar
              <span className="ml-auto text-xs opacity-70">não vai ao histórico</span>
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ background: "var(--pr-teal-soft)", border: "1.5px solid var(--pr-teal-border)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowOptions(true)} className="flex items-center gap-1.5 text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: "var(--pr-teal)" }}>
            <Pause className="h-3.5 w-3.5" />
            Simulado
          </button>
          <div className="progress-bar w-28 hidden sm:block">
            <div className="progress-bar-fill" style={{ width: `${(answered / active.totalQuestions) * 100}%` }} />
          </div>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{answered}/{active.totalQuestions}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`timer ${overTime ? "warn" : "ok"}`}>
            <Clock className="h-3.5 w-3.5" />
            {fmt(qTime)}
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>Total {fmt(totalTime)}</span>
        </div>
      </div>

      <div className="card">
        <QuestionCard
          order={idx + 1}
          total={questions.length}
          enunciado={q.enunciado}
          url_imagem={q.url_imagem}
          alternativas={q.alternativas as Record<string, string>}
          selectedAnswer={answers[q.id] ?? null}
          correctAnswer={null}
          onAnswer={(alt) => handleAnswer(q.id, alt)}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
          className="btn-outline flex items-center gap-1" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>
        <button onClick={() => setShowGrid((v) => !v)}
          className="text-sm font-semibold tabular-nums px-3 py-2 rounded-xl"
          style={{ background: "var(--muted)", color: "var(--foreground)" }}>
          {idx + 1} / {questions.length}
        </button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx((i) => i + 1)} className="btn-outline flex items-center gap-1"
            style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}>
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handleFinish} disabled={finish.isPending} className="btn-primary">
            {finish.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
            Finalizar
          </button>
        )}
      </div>

      {showGrid && (
        <div className="card space-y-3">
          <div className="grid grid-cols-10 gap-1.5">
            {questions.map((q: any, i: number) => (
              <button key={q.id} onClick={() => { setIdx(i); setShowGrid(false); }}
                className="h-8 rounded-lg text-xs font-bold transition-colors"
                style={i === idx
                  ? { background: "var(--pr-teal-soft)", border: "2px solid var(--pr-teal)", color: "var(--pr-teal)" }
                  : answers[q.id]
                  ? { background: "var(--pr-teal)", color: "#fff", border: "2px solid transparent" }
                  : { background: "var(--muted)", color: "var(--muted-foreground)", border: "2px solid var(--border)" }}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={handleFinish} disabled={finish.isPending} className="btn-primary">
              {finish.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
              Finalizar simulado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
