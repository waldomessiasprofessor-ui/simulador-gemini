import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "form" | "quiz" | "result";

interface Question {
  id: number;
  enunciado: string;
  alternativas: Record<string, any>;
  url_imagem?: string | null;
  conteudo_principal: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EDUCATION_OPTIONS = [
  { value: "Ensino Fundamental", emoji: "📚", label: "Ensino Fundamental" },
  { value: "Ensino Médio — 1º ano", emoji: "🏫", label: "1º ano do Ensino Médio" },
  { value: "Ensino Médio — 2º ano", emoji: "🏫", label: "2º ano do Ensino Médio" },
  { value: "Ensino Médio — 3º ano", emoji: "🎯", label: "3º ano do Ensino Médio" },
  { value: "Concluído / Vestibulando", emoji: "🎓", label: "Já concluí / Vestibulando" },
  { value: "Ensino Superior", emoji: "🏛️", label: "Ensino Superior" },
];

const LEVEL_INFO = {
  iniciante: {
    emoji: "🌱",
    label: "Iniciante",
    color: "#16A34A",
    bg: "#DCFCE7",
    border: "#86EFAC",
    msg: "Ótimo começo! Cada grande matemático começou do zero. Vamos construir sua base juntos, passo a passo.",
    advice: "Comece pelas Trilhas de Matemática Básica e use o Tutor IA sempre que travar.",
  },
  intermediario: {
    emoji: "⚡",
    label: "Intermediário",
    color: "#D97706",
    bg: "#FEF9C3",
    border: "#FDE047",
    msg: "Você já tem uma base sólida! Com foco nas suas lacunas, o ENEM está ao seu alcance.",
    advice: "Foque nas Trilhas das áreas com menor desempenho e pratique com simulados.",
  },
  avancado: {
    emoji: "🚀",
    label: "Avançado",
    color: "#7C3AED",
    bg: "#F3E8FF",
    border: "#C4B5FD",
    msg: "Impressionante! Você domina o conteúdo de matemática em nível avançado.",
    advice: "Faça os simulados com TRI para afinar sua nota e alcance os 900+ pontos.",
  },
};

const LETTERS = ["A", "B", "C", "D", "E"];

// ─── Mascote com fala ─────────────────────────────────────────────────────────

function Mascot({ speech, animate = false }: { speech: string; animate?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* Boneco */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0,150,136,0.35)",
        animation: animate ? "mascotBounce 0.6s ease" : "none",
        flexShrink: 0,
      }}>
        <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="11" r="6" fill="white" fillOpacity="0.95" />
          <rect x="9" y="19" width="14" height="9" rx="4" fill="white" fillOpacity="0.95" />
          <circle cx="13.5" cy="10.5" r="1" fill="#009688" />
          <circle cx="18.5" cy="10.5" r="1" fill="#009688" />
          <path d="M13 13.5 Q16 15.5 19 13.5" stroke="#009688" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      {/* Balão de fala */}
      <div style={{
        background: "var(--card)",
        border: "2px solid var(--border)",
        borderRadius: 16,
        padding: "12px 16px",
        maxWidth: 300,
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--foreground)",
        position: "relative",
      }}>
        {/* Triângulo apontando para cima */}
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "10px solid var(--border)",
        }} />
        <div style={{
          position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderBottom: "9px solid var(--card)",
        }} />
        {speech}
      </div>
    </div>
  );
}

// ─── Tela de boas-vindas ──────────────────────────────────────────────────────

function WelcomeScreen({ name, onStart, onSkip }: { name: string; onStart: () => void; onSkip?: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 32, padding: "40px 24px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <Mascot speech={`Olá, ${name.split(" ")[0]}! 👋 Sou o Tutor Vetor. Vou te ajudar a descobrir seu nível de matemática para personalizar seus estudos.`} animate />

      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", margin: "0 0 8px" }}>
          Diagnóstico inicial
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0, maxWidth: 300 }}>
          São <strong>20 questões</strong> de múltipla escolha com dificuldade crescente.
          Leva cerca de <strong>15 minutos</strong>.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }}>
        {[
          { icon: "🎯", text: "Questões do banco oficial ENEM" },
          { icon: "📈", text: "Dificuldade aumenta gradualmente" },
          { icon: "🏅", text: "Você será classificado em um nível" },
          { icon: "🤖", text: "O Tutor usará isso para te ajudar melhor" },
        ].map((item) => (
          <div key={item.text} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 12,
            background: "var(--card)", border: "1.5px solid var(--border)",
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: "var(--foreground)" }}>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }}>
        <button
          onClick={onStart}
          style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
            color: "#fff", fontSize: 16, fontWeight: 800,
            boxShadow: "0 4px 16px rgba(0,150,136,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,150,136,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,150,136,0.4)"; }}
        >
          Começar diagnóstico 🚀
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            style={{
              width: "100%", padding: "12px", borderRadius: 14, cursor: "pointer",
              background: "transparent", border: "1.5px solid var(--border)",
              color: "var(--muted-foreground)", fontSize: 13, fontWeight: 600,
            }}>
            Pular por agora
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Formulário de perfil ─────────────────────────────────────────────────────

function ProfileForm({ onNext }: { onNext: (city: string, edu: string) => void }) {
  const [city, setCity] = useState("");
  const [edu, setEdu] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 28, padding: "40px 24px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      <Mascot speech="Antes de começar, me conta um pouco sobre você! 😊" />

      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Cidade */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--foreground)" }}>
            📍 De qual cidade você é?
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: São Paulo"
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14,
              border: "2px solid var(--border)", background: "var(--card)",
              color: "var(--foreground)", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#009688"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </div>

        {/* Escolaridade */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--foreground)" }}>
            🎓 Qual é sua escolaridade?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EDUCATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEdu(opt.value)}
                style={{
                  padding: "12px 14px", borderRadius: 12, border: "2px solid",
                  borderColor: edu === opt.value ? "#009688" : "var(--border)",
                  background: edu === opt.value ? "#E0F2F1" : "var(--card)",
                  color: edu === opt.value ? "#00695C" : "var(--foreground)",
                  fontSize: 13, fontWeight: edu === opt.value ? 700 : 500,
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s",
                }}>
                <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                <span>{opt.label}</span>
                {edu === opt.value && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext(city, edu)}
        disabled={!city.trim() || !edu}
        style={{
          width: "100%", maxWidth: 360,
          padding: "15px", borderRadius: 16, border: "none",
          cursor: city.trim() && edu ? "pointer" : "default",
          background: city.trim() && edu
            ? "linear-gradient(135deg, #263238 0%, #009688 100%)"
            : "var(--muted)",
          color: city.trim() && edu ? "#fff" : "var(--muted-foreground)",
          fontSize: 15, fontWeight: 800,
          transition: "all 0.15s",
          boxShadow: city.trim() && edu ? "0 4px 16px rgba(0,150,136,0.35)" : "none",
        }}>
        Avançar →
      </button>
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

type AnswerState = "idle" | "correct" | "wrong";

function QuizScreen({
  questions,
  onFinish,
}: {
  questions: Question[];
  onFinish: (answers: Record<string, string>) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>("idle");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = questions[current];
  const total = questions.length;
  const progress = current / total;

  // Gabarito não está disponível no frontend — feedback só acontece quando o servidor
  // retorna o resultado. Para a UX "Duolingo" simularemos avançar sem reveal de correto/errado.
  // O feedback real é na tela de resultado. Aqui apenas registramos e avançamos.

  function choose(letter: string) {
    if (state !== "idle") return;
    setSelected(letter);
    setState("correct"); // avança sem julgamento visual (gabarito não exposto)
    setAnswers((prev) => ({ ...prev, [String(q.id)]: letter }));

    timerRef.current = setTimeout(() => {
      if (current + 1 >= total) {
        onFinish({ ...answers, [String(q.id)]: letter });
      } else {
        setExiting(true);
        setTimeout(() => {
          setCurrent((c) => c + 1);
          setSelected(null);
          setState("idle");
          setExiting(false);
        }, 300);
      }
    }, 800);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const alts = q.alternativas as Record<string, { texto?: string; label?: string }>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 0 24px" }}>
      {/* Barra de progresso */}
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)" }}>
            {current + 1} / {total}
          </span>
          <div style={{ flex: 1, height: 10, borderRadius: 8, background: "var(--muted)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 8,
              background: "linear-gradient(90deg, #009688, #4DB6AC)",
              width: `${progress * 100}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
          <span style={{ fontSize: 18 }}>🧮</span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < current ? "#009688" : i === current ? "#B2DFDB" : "var(--muted)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Questão */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 20px",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateX(-20px)" : "translateX(0)",
        transition: "opacity 0.25s, transform 0.25s",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "#009688", marginBottom: 10,
        }}>
          {q.conteudo_principal}
        </div>

        <div style={{ marginBottom: 16 }}>
          <LatexRenderer fontSize="sm">{q.enunciado}</LatexRenderer>
        </div>

        {q.url_imagem && (
          <img src={q.url_imagem} alt="Figura da questão"
            style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 16, border: "1px solid var(--border)" }} />
        )}

        {/* Alternativas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LETTERS.filter((l) => alts[l]).map((letter) => {
            const alt = alts[letter];
            const text = typeof alt === "string" ? alt : (alt?.texto ?? alt?.label ?? "");
            const isSelected = selected === letter;

            let bg = "var(--card)";
            let border = "var(--border)";
            let color = "var(--foreground)";

            if (isSelected && state === "correct") {
              bg = "#E0F2F1"; border = "#009688"; color = "#00695C";
            }

            return (
              <button
                key={letter}
                onClick={() => choose(letter)}
                disabled={state !== "idle"}
                style={{
                  padding: "14px 16px", borderRadius: 14,
                  border: `2px solid ${border}`,
                  background: bg, color, cursor: state === "idle" ? "pointer" : "default",
                  textAlign: "left", fontSize: 14, lineHeight: 1.45,
                  display: "flex", alignItems: "flex-start", gap: 12,
                  transition: "all 0.15s",
                  transform: isSelected ? "scale(0.99)" : "scale(1)",
                  boxShadow: isSelected ? "0 0 0 3px rgba(0,150,136,0.2)" : "none",
                }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800,
                  background: isSelected ? "#009688" : "var(--muted)",
                  color: isSelected ? "#fff" : "var(--muted-foreground)",
                  transition: "all 0.15s",
                }}>
                  {letter}
                </span>
                <span style={{ paddingTop: 4, flex: 1 }}>
                  <LatexRenderer fontSize="sm">{text}</LatexRenderer>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tela de resultado ────────────────────────────────────────────────────────

function ResultScreen({
  level,
  correct,
  total,
  name,
  onDone,
}: {
  level: keyof typeof LEVEL_INFO;
  correct: number;
  total: number;
  name: string;
  onDone: () => void;
}) {
  const info = LEVEL_INFO[level];
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ x: number; color: string; delay: number; dur: number }>>([]);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    // Gera confete
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      color: ["#009688", "#4DB6AC", "#FCD34D", "#F87171", "#818CF8"][i % 5],
      delay: Math.random() * 1.5,
      dur: 1.5 + Math.random() * 1.5,
    }));
    setConfetti(pieces);
  }, []);

  const pct = Math.round((correct / total) * 100);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 24, padding: "40px 24px", textAlign: "center",
      opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.95)",
      transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      position: "relative",
    }}>
      {/* Confete CSS */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {confetti.map((c, i) => (
          <div key={i} style={{
            position: "absolute", top: "-10px", left: `${c.x}%`,
            width: 8, height: 8, borderRadius: 2,
            background: c.color,
            animation: `confettiFall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      {/* Badge de nível */}
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        background: info.bg, border: `4px solid ${info.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48,
        animation: "mascotBounce 0.8s ease",
        boxShadow: `0 8px 32px ${info.color}30`,
      }}>
        {info.emoji}
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
          Seu nível
        </p>
        <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0, color: info.color }}>
          {info.label}
        </h2>
      </div>

      {/* Score */}
      <div style={{
        display: "flex", gap: 16, width: "100%", maxWidth: 320,
      }}>
        <div style={{
          flex: 1, padding: "16px", borderRadius: 16,
          background: "var(--card)", border: "2px solid var(--border)",
        }}>
          <p style={{ fontSize: 28, fontWeight: 900, margin: 0, color: info.color }}>{correct}/{total}</p>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0" }}>questões corretas</p>
        </div>
        <div style={{
          flex: 1, padding: "16px", borderRadius: 16,
          background: "var(--card)", border: "2px solid var(--border)",
        }}>
          <p style={{ fontSize: 28, fontWeight: 900, margin: 0, color: info.color }}>{pct}%</p>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0" }}>aproveitamento</p>
        </div>
      </div>

      {/* Mensagem */}
      <div style={{
        padding: "16px", borderRadius: 16, maxWidth: 320, width: "100%",
        background: info.bg, border: `2px solid ${info.border}`,
      }}>
        <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 8px", color: info.color, fontWeight: 600 }}>
          {info.msg}
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, color: "var(--muted-foreground)" }}>
          💡 {info.advice}
        </p>
      </div>

      <button
        onClick={onDone}
        style={{
          width: "100%", maxWidth: 320, padding: "16px", borderRadius: 16,
          border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
          color: "#fff", fontSize: 16, fontWeight: 800,
          boxShadow: "0 4px 16px rgba(0,150,136,0.4)",
        }}>
        Ir para o início 🎉
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Diagnostico({ session, onComplete, onSkip }: {
  session: { name: string };
  onComplete: () => void;
  onSkip?: () => void;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [city, setCity] = useState("");
  const [edu, setEdu] = useState("");
  const [result, setResult] = useState<{ level: keyof typeof LEVEL_INFO; correct: number; total: number } | null>(null);

  const { data: questions, isLoading } = trpc.users.getDiagnosticQuestions.useQuery();
  const completeMutation = trpc.users.completeDiagnosis.useMutation({
    onSuccess: (data) => {
      setResult({ level: data.level as keyof typeof LEVEL_INFO, correct: data.correct, total: data.total });
      setStep("result");
    },
  });

  function handleFormNext(c: string, e: string) {
    setCity(c);
    setEdu(e);
    setStep("quiz");
  }

  function handleQuizFinish(answers: Record<string, string>) {
    completeMutation.mutate({ city, educationLevel: edu, answers });
  }

  return (
    <>
      <style>{`
        @keyframes mascotBounce {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Overlay fullscreen */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "var(--background)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header mínimo */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "var(--background)",
          borderBottom: step === "quiz" ? "1px solid var(--border)" : "none",
          padding: step === "quiz" ? "0" : "16px 20px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {step !== "welcome" && step !== "result" && (
            <>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #263238, #009688)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="11" r="6" fill="white" fillOpacity="0.95" />
                  <rect x="9" y="19" width="14" height="9" rx="4" fill="white" fillOpacity="0.95" />
                </svg>
              </div>
              {step !== "quiz" && (
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  Tutor Vetor — Diagnóstico
                </span>
              )}
            </>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{ flex: 1, maxWidth: 480, margin: "0 auto", width: "100%" }}>
          {step === "welcome" && (
            <WelcomeScreen name={session.name} onStart={() => setStep("form")} onSkip={onSkip} />
          )}

          {step === "form" && (
            <ProfileForm onNext={handleFormNext} />
          )}

          {step === "quiz" && (
            isLoading || !questions ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "3px solid #009688", borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }} />
              </div>
            ) : (
              <QuizScreen questions={questions} onFinish={handleQuizFinish} />
            )
          )}

          {step === "quiz" && completeMutation.isPending && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.5)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "4px solid #4DB6AC", borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Analisando seu desempenho…</p>
            </div>
          )}

          {step === "result" && result && (
            <ResultScreen
              level={result.level}
              correct={result.correct}
              total={result.total}
              name={session.name}
              onDone={onComplete}
            />
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
