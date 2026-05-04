import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Target, Timer, BarChart2, Brain, BookOpen, Award, Zap } from "@/icons";

/* ────────────────────────────────────────────────────────────────
   Login — Direção A (split editorial).
   Lógica idêntica à versão anterior: zod + react-hook-form + trpc.
   Só o visual mudou: serifa nos headlines com itálico teal-darker
   como ancoragem, eyebrows uppercase, gradient soft no hero,
   card de form clean. Tipografia "Source Serif 4" e "Plus Jakarta
   Sans" carregadas via <link> no index.html.
   ──────────────────────────────────────────────────────────────── */

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});
const registerSchema = z.object({
  name: z.string().min(2, "Nome com pelo menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha com pelo menos 6 caracteres."),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const FEATURES = [
  { icon: Target,    title: "Correção pela TRI",        desc: "Nota calculada pela Teoria de Resposta ao Item — a metodologia real do INEP." },
  { icon: Zap,       title: "Desafio diário",           desc: "3 questões todo dia para manter o ritmo. Missão diária com histórico de progresso." },
  { icon: BookOpen,  title: "Revise",                   desc: "Texto de revisão diário com LaTeX e 3 questões de validação de leitura." },
  { icon: Brain,     title: "Treino cronometrado",      desc: "Escolha tópico e quantidade. Tempo registrado para acompanhar sua velocidade." },
  { icon: Timer,     title: "Temporizador inteligente", desc: "Cronômetro por questão com alerta visual quando o tempo ideal é excedido." },
  { icon: BarChart2, title: "Histórico de evolução",    desc: "Mapa de calor semanal e estatísticas detalhadas de desempenho." },
  { icon: Award,     title: "Ranking & Fórmulas",       desc: "Compare sua nota TRI com outros alunos e consulte todas as fórmulas." },
];

/* ── Tokens locais (espelham o design system Prova Real) ────── */
const C = {
  ink:          "#0F1524",
  inkSoft:      "#263238",
  fg:           "#0F1524",
  muted:        "#334155",
  meta:         "#475569",
  border:       "#E2E8F0",
  borderStrong: "#CBD5E1",
  bgSoft:       "#F8FAFC",
  card:         "#FFFFFF",
  teal:         "#009688",
  tealDark:     "#00695C",
  tealDarker:   "#004D40",
  tealSoft:     "#E0F2F1",
  tealBorder:   "#B2DFDB",
  danger:       "#B91C1C",
  goldSoft:     "#FFF5DC",
};

const FONT_SERIF = `"Source Serif 4", "Source Serif Pro", Charter, Georgia, serif`;
const FONT_SANS  = `"Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif`;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.95rem", borderRadius: "0.75rem",
  border: `2px solid ${C.borderStrong}`, fontSize: "0.95rem", fontWeight: 500,
  fontFamily: FONT_SANS, outline: "none",
  color: C.fg, background: C.card,
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const errorStyle: React.CSSProperties  = { color: C.danger, fontSize: "0.78rem", marginTop: "0.3rem", fontWeight: 600 };
const labelStyle: React.CSSProperties  = { display: "block", fontSize: "0.82rem", fontWeight: 600, color: C.muted, marginBottom: "0.35rem", fontFamily: FONT_SANS };
const eyebrowStyle: React.CSSProperties = { fontFamily: FONT_SANS, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.tealDarker };

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const { register: regLogin, handleSubmit: handleLogin, formState: { errors: loginErrors }, reset: resetLogin } =
    useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const { register: regRegister, handleSubmit: handleRegister, formState: { errors: registerErrors }, reset: resetRegister } =
    useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const login = trpc.auth.login.useMutation({
    onSuccess: () => { window.location.href = "/"; },
    onError: (e) => toast.error(e.message),
  });
  const register = trpc.auth.register.useMutation({
    onSuccess: () => { window.location.href = "/"; },
    onError: (e) => toast.error(e.message),
  });

  const isPending = login.isPending || register.isPending;

  function switchMode(m: "login" | "register") {
    setMode(m); resetLogin(); resetRegister();
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = C.teal;
    e.target.style.boxShadow = "0 0 0 3px rgba(0,150,136,0.14)";
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = C.borderStrong;
    e.target.style.boxShadow = "none";
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bgSoft, fontFamily: FONT_SANS }}>

      {/* ───────────── Hero split: editorial à esquerda + form à direita ───────────── */}
      <div
        style={{
          background: `radial-gradient(circle at 18% 28%, ${C.tealSoft} 0%, transparent 55%),
                       radial-gradient(circle at 82% 78%, ${C.goldSoft} 0%, transparent 50%),
                       ${C.bgSoft}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── Lado esquerdo: branding + headline editorial ───────── */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center" style={{ width: 44, height: 44, background: C.teal, borderRadius: 12 }}>
                <img src="/logo-vetor.png" alt="" style={{ width: 30, height: 30, filter: "brightness(0) invert(1)" }} />
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.14em", color: C.ink }}>VETOR</p>
                <p style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 700, fontSize: "0.95rem", color: C.muted }}>Prova Real</p>
              </div>
            </div>

            <span style={eyebrowStyle}>Etapa 01 · Diagnóstico</span>

            <h1
              style={{
                fontFamily: FONT_SERIF, fontWeight: 900,
                fontSize: "clamp(2.5rem, 5.2vw, 4rem)", lineHeight: 1.05,
                letterSpacing: "-0.035em", color: C.fg,
                margin: "0.85rem 0 1.25rem", textWrap: "balance",
              } as React.CSSProperties}
            >
              A matemática da sua aprovação{" "}
              <em style={{ fontStyle: "italic", fontWeight: 800, color: C.tealDarker }}>calculada com precisão</em>
              .
            </h1>

            <p
              style={{
                fontFamily: FONT_SERIF, fontSize: "1.18rem", fontWeight: 500,
                lineHeight: 1.55, color: C.muted, maxWidth: "52ch",
                marginBottom: "1.75rem",
              } as React.CSSProperties}
            >
              Uma plataforma de alta performance em Matemática pensada para mapear suas lacunas,
              recalcular sua rota de estudos e maximizar sua nota através do{" "}
              <em style={{ fontStyle: "italic", fontWeight: 700, color: C.tealDarker }}>
                sistema TRI oficial
              </em>
              .
            </p>

            {/* Selos editoriais */}
            <div
              className="flex flex-wrap items-center gap-x-7 gap-y-3"
              style={{ color: C.meta, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              <span>Sem cartão</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Diagnóstico em 15 min</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: C.tealDarker }}>Correção TRI · INEP</span>
            </div>
          </div>

          {/* ── Lado direito: card de form ─────────────────────────── */}
          <div className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
            <div
              style={{
                background: C.card, borderRadius: "1.25rem",
                border: `1px solid ${C.border}`,
                boxShadow: "0 18px 50px rgba(15,21,36,0.08), 0 4px 14px rgba(15,21,36,0.04)",
                padding: "2.25rem 2rem",
              }}
            >
              {/* Toggle login / cadastro */}
              <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}>
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m} onClick={() => switchMode(m)} type="button"
                    className="flex-1 py-2.5 transition-all"
                    style={{
                      fontFamily: FONT_SANS, fontSize: "0.85rem", fontWeight: 700,
                      borderRadius: "0.7rem", border: "none", cursor: "pointer",
                      background: mode === m ? C.teal : "transparent",
                      color:      mode === m ? "#fff" : C.meta,
                      boxShadow:  mode === m ? "0 2px 8px rgba(0,150,136,0.30)" : "none",
                    }}
                  >
                    {m === "login" ? "Entrar" : "Criar conta"}
                  </button>
                ))}
              </div>

              {/* Header do form */}
              <div style={{ marginBottom: "1.25rem" }}>
                <span style={eyebrowStyle}>{mode === "login" ? "Entrar" : "Comece grátis · 7 dias"}</span>
                <h2
                  style={{
                    fontFamily: FONT_SERIF, fontWeight: 800,
                    fontSize: "1.85rem", letterSpacing: "-0.025em",
                    lineHeight: 1.1, color: C.fg,
                    margin: "0.5rem 0 0.4rem",
                  } as React.CSSProperties}
                >
                  {mode === "login" ? (
                    <>Bem-vindo, <em style={{ fontStyle: "italic", fontWeight: 800, color: C.tealDarker }}>de volta</em>.</>
                  ) : (
                    <>Crie sua <em style={{ fontStyle: "italic", fontWeight: 800, color: C.tealDarker }}>conta</em>.</>
                  )}
                </h2>
                <p style={{ fontSize: "0.92rem", color: C.muted, margin: 0 }}>
                  {mode === "login"
                    ? "Continue de onde você parou."
                    : "Diagnóstico em 15 min. Sem cartão."}
                </p>
              </div>

              {/* ── Formulário de login ── */}
              {mode === "login" && (
                <form onSubmit={handleLogin((d) => login.mutate(d))} className="space-y-3.5" noValidate>
                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input {...regLogin("email")} type="email" placeholder="aluno@vetor.com.br" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {loginErrors.email && <p style={errorStyle}>⚠ {loginErrors.email.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Senha</label>
                    <input {...regLogin("password")} type="password" placeholder="••••••••" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {loginErrors.password && <p style={errorStyle}>⚠ {loginErrors.password.message}</p>}
                  </div>
                  <button
                    type="submit" disabled={isPending}
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      marginTop: "0.75rem", padding: "0.85rem 1.25rem",
                      borderRadius: "0.85rem", border: "none",
                      background: isPending ? C.tealDark : `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                      color: "#fff", fontFamily: FONT_SANS, fontSize: "1rem", fontWeight: 800,
                      letterSpacing: "-0.005em", cursor: isPending ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 14px rgba(0,150,136,0.35)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                  >
                    {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                    Entrar <span aria-hidden style={{ marginLeft: 4 }}>→</span>
                  </button>
                  <p style={{ textAlign: "center", fontSize: "0.85rem", color: C.muted, marginTop: "0.85rem" }}>
                    Não possui conta?{" "}
                    <button type="button" onClick={() => switchMode("register")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: C.tealDarker, fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Cadastre-se
                    </button>
                  </p>
                </form>
              )}

              {/* ── Formulário de cadastro ── */}
              {mode === "register" && (
                <form onSubmit={handleRegister((d) => register.mutate(d))} className="space-y-3.5" noValidate>
                  <div>
                    <label style={labelStyle}>Nome completo</label>
                    <input {...regRegister("name")} type="text" placeholder="João Silva" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.name && <p style={errorStyle}>⚠ {registerErrors.name.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input {...regRegister("email")} type="email" placeholder="aluno@vetor.com.br" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.email && <p style={errorStyle}>⚠ {registerErrors.email.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Senha</label>
                    <input {...regRegister("password")} type="password" placeholder="Mínimo 6 caracteres" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.password && <p style={errorStyle}>⚠ {registerErrors.password.message}</p>}
                  </div>
                  <button
                    type="submit" disabled={isPending}
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      marginTop: "0.75rem", padding: "0.9rem 1.25rem",
                      borderRadius: "0.85rem", border: "none",
                      background: isPending ? C.tealDark : `linear-gradient(135deg, ${C.inkSoft} 0%, ${C.teal} 100%)`,
                      color: "#fff", fontFamily: FONT_SANS, fontSize: "1rem", fontWeight: 800,
                      letterSpacing: "-0.005em", cursor: isPending ? "not-allowed" : "pointer",
                      boxShadow: "0 6px 20px rgba(0,150,136,0.40)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                  >
                    {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                    Começar diagnóstico <span aria-hidden style={{ marginLeft: 4 }}>→</span>
                  </button>
                  <p style={{ fontSize: "0.72rem", color: C.meta, margin: "0.5rem 0 0", lineHeight: 1.5, textAlign: "center" }}>
                    Ao criar conta você concorda com os{" "}
                    <a href="#" style={{ color: C.tealDarker, fontWeight: 600 }}>Termos</a> e a{" "}
                    <a href="#" style={{ color: C.tealDarker, fontWeight: 600 }}>Privacidade</a>.
                  </p>
                  <p style={{ textAlign: "center", fontSize: "0.85rem", color: C.muted, marginTop: "0.6rem", paddingTop: "0.85rem", borderTop: `1px solid ${C.border}` }}>
                    Já possui conta?{" "}
                    <button type="button" onClick={() => switchMode("login")}
                      style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: C.tealDarker, fontFamily: "inherit", fontSize: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Faça login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── Grid de funcionalidades ───────────── */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div style={{ marginBottom: "2rem" }}>
          <span style={eyebrowStyle}>O método</span>
          <h2
            style={{
              fontFamily: FONT_SERIF, fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.025em",
              lineHeight: 1.15, color: C.fg, margin: "0.5rem 0 0.5rem",
            } as React.CSSProperties}
          >
            Tudo que você precisa{" "}
            <em style={{ fontStyle: "italic", fontWeight: 800, color: C.tealDarker }}>em um único lugar</em>.
          </h2>
          <p style={{ fontSize: "1rem", color: C.muted, margin: 0, maxWidth: "60ch" }}>
            Uma plataforma focada no aluno. Cada ferramenta tem um propósito e um momento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: "1rem", padding: "1.4rem 1.4rem 1.5rem",
                transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.tealBorder;
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,21,36,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center justify-center mb-4" style={{ width: 40, height: 40, background: C.tealSoft, borderRadius: 10 }}>
                <Icon className="h-5 w-5" style={{ color: C.tealDarker }} />
              </div>
              <h3 style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "0.95rem", color: C.fg, margin: "0 0 0.4rem", letterSpacing: "-0.005em" }}>
                {title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.55, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: C.meta, marginTop: "3.5rem", letterSpacing: "0.02em" }}>
          © {new Date().getFullYear()} Escola Vetor · Prova Real · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
