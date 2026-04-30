import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { X, Plus, Brain } from "@/icons";

// ── Tipos ──────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ── Ícone do botão flutuante ───────────────────────────────────────────────────

function TutorIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Antena */}
      <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="2" r="1.5" fill="white" />
      {/* Cabeça */}
      <rect x="6" y="6" width="20" height="14" rx="4" fill="white" fillOpacity="0.95" />
      {/* Olhos */}
      <rect x="10" y="11" width="4" height="4" rx="1" fill="#009688" />
      <rect x="18" y="11" width="4" height="4" rx="1" fill="#009688" />
      {/* Boca */}
      <rect x="11" y="17" width="10" height="1.5" rx="0.75" fill="#009688" fillOpacity="0.5" />
      {/* Corpo */}
      <rect x="9" y="21" width="14" height="8" rx="3" fill="white" fillOpacity="0.85" />
      {/* Botão central */}
      <circle cx="16" cy="25" r="1.5" fill="#009688" fillOpacity="0.6" />
    </svg>
  );
}

// ── Bolha de mensagem ──────────────────────────────────────────────────────────

function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    }}>
      {/* Avatar do tutor */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #263238, #009688)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Brain size={14} style={{ color: "#fff" }} />
        </div>
      )}

      {/* Balão */}
      <div style={{
        maxWidth: "82%",
        padding: "10px 13px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "#009688" : "var(--card)",
        border: isUser ? "none" : "1.5px solid var(--border)",
        color: isUser ? "#fff" : "var(--foreground)",
        fontSize: 13,
        lineHeight: 1.55,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}>
        {isUser ? (
          <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
        ) : (
          <LatexRenderer fontSize="sm">{msg.content}</LatexRenderer>
        )}
      </div>
    </div>
  );
}

// ── Indicador "digitando…" ─────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #263238, #009688)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Brain size={14} style={{ color: "#fff" }} />
      </div>
      <div style={{
        padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
        background: "var(--card)", border: "1.5px solid var(--border)",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "#009688",
            animation: "tutorBounce 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Sugestões rápidas ──────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Explica o que é logaritmo",
  "Como calcular porcentagem?",
  "O que é função do 2º grau?",
  "Dica para probabilidade no ENEM",
];

// ── Ícone de diagnóstico ───────────────────────────────────────────────────────

function DiagnosticIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

// ── Widget principal ───────────────────────────────────────────────────────────

export default function TutorChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [hasNew, setHasNew]     = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const isFirst    = messages.length === 0;

  // XP: concede 3 XP na primeira mensagem de cada sessão do tutor
  const addXpMutation = trpc.users.addXp.useMutation();
  const xpGivenRef = useRef(false);

  const chatMutation = trpc.tutor.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      if (!open) setHasNew(true);
    },
    onError: (e) => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠️ ${e.message}`,
      }]);
    },
  });

  const diagnoseMutation = trpc.tutor.diagnose.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      if (!open) setHasNew(true);
    },
    onError: (e) => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠️ ${e.message}`,
      }]);
    },
  });

  const isPending = chatMutation.isPending || diagnoseMutation.isPending;

  function requestDiagnosis() {
    if (isPending) return;
    const userMsg: Message = {
      role: "user",
      content: "📊 Quero ver meu diagnóstico personalizado de desempenho.",
    };
    setMessages((prev) => [...prev, userMsg]);
    diagnoseMutation.mutate();
  }

  // Auto-scroll para a última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  // Foca o input quando abre
  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Abre pelo menu lateral (evento customizado disparado pelo Navbar)
  useEffect(() => {
    function handleOpenTutor() { setOpen(true); }
    window.addEventListener("open-tutor", handleOpenTutor);
    return () => window.removeEventListener("open-tutor", handleOpenTutor);
  }, []);

  const send = useCallback((text: string) => {
    const content = text.trim();
    if (!content || isPending) return;
    const newMsg: Message = { role: "user", content };
    const next = [...messages, newMsg];
    setMessages(next);
    setInput("");
    // Concede XP uma vez por sessão ao usar o tutor
    if (!xpGivenRef.current) {
      xpGivenRef.current = true;
      addXpMutation.mutate({ source: "tutor", amount: 3 });
    }
    chatMutation.mutate({ messages: next });
  }, [messages, chatMutation, isPending]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function clear() {
    setMessages([]);
    setInput("");
  }

  return (
    <>
      {/* ── Animação dos dots ── */}
      <style>{`
        @keyframes tutorBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes tutorPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,150,136,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(0,150,136,0); }
        }
      `}</style>

      {/* ── Botão flutuante ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir tutor IA"
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 60,
            width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,150,136,0.45)",
            animation: hasNew ? "tutorPulse 1.5s infinite" : "none",
          }}>
          <TutorIcon size={26} />
          {hasNew && (
            <span style={{
              position: "absolute", top: 2, right: 2,
              width: 12, height: 12, borderRadius: "50%",
              background: "#EF4444", border: "2px solid #fff",
            }} />
          )}
        </button>
      )}

      {/* ── Drawer de chat ── */}
      {open && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 58, background: "rgba(0,0,0,0.3)" }}
          />

          {/* Painel */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 59,
            maxWidth: 480, margin: "0 auto",
            height: "82dvh",
            background: "var(--background)",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>

            {/* ── Header ── */}
            <div style={{
              background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
              flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TutorIcon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>Tutor Vetor</p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: 0 }}>
                  {isPending ? "Digitando…" : "Pronto para ajudar"}
                </p>
              </div>
              {messages.length > 0 && (
                <button onClick={clear}
                  style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "5px 10px", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  Nova conversa
                </button>
              )}
              <button onClick={() => setOpen(false)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.8)" }}>
                <X size={14} />
              </button>
            </div>

            {/* ── Área de mensagens ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px", overscrollBehavior: "contain" }}>

              {/* Estado inicial */}
              {isFirst && (
                <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 12px",
                    background: "linear-gradient(135deg, #263238, #009688)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <TutorIcon size={32} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "var(--foreground)", margin: "0 0 4px" }}>
                    Olá! Sou o Tutor Vetor 👋
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 20px" }}>
                    Pode me perguntar sobre qualquer conteúdo de matemática do ENEM.
                  </p>
                  {/* Botão diagnóstico */}
                  <button
                    onClick={requestDiagnosis}
                    disabled={isPending}
                    style={{
                      padding: "12px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                      background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
                      border: "none", color: "#fff", cursor: isPending ? "default" : "pointer",
                      textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                      opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s",
                      boxShadow: "0 2px 8px rgba(0,150,136,0.3)",
                      marginBottom: 4,
                    }}>
                    <DiagnosticIcon size={18} />
                    <div>
                      <div>📊 Ver meu diagnóstico personalizado</div>
                      <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 2 }}>
                        Análise das suas notas, áreas fortes e o que estudar
                      </div>
                    </div>
                  </button>

                  {/* Divisor */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>ou pergunte algo</span>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>

                  {/* Sugestões */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => send(s)}
                        style={{
                          padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500,
                          background: "var(--card)", border: "1.5px solid var(--border)",
                          color: "var(--foreground)", cursor: "pointer", textAlign: "left",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#009688")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagens */}
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
              ))}

              {/* Indicador digitando */}
              {isPending && <TypingIndicator />}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div style={{
              padding: "10px 12px 14px",
              borderTop: "1px solid var(--border)",
              background: "var(--card)",
              flexShrink: 0,
            }}>
              <div style={{
                display: "flex", gap: 8, alignItems: "flex-end",
                background: "var(--background)",
                border: "1.5px solid var(--border)",
                borderRadius: 16, padding: "8px 8px 8px 14px",
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-altura
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKey}
                  placeholder="Pergunte algo… (Enter para enviar)"
                  rows={1}
                  disabled={isPending}
                  style={{
                    flex: 1, border: "none", outline: "none", resize: "none",
                    background: "transparent", color: "var(--foreground)",
                    fontSize: 13, lineHeight: 1.5, minHeight: 24, maxHeight: 120,
                    fontFamily: "inherit",
                  }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || isPending}
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
                    background: input.trim() && !isPending ? "#009688" : "var(--muted)",
                    color: input.trim() && !isPending ? "#fff" : "var(--muted-foreground)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background 0.15s",
                  }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", textAlign: "center", margin: "6px 0 0" }}>
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
