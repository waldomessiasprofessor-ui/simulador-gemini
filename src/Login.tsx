import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Target, Timer, BarChart2, Brain, BookOpen, Award, Zap } from "@/icons";

// ─── Schemas ──────────────────────────────────────────────────────────────────

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

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Target,    title: "Correção pela TRI",        desc: "Nota calculada pela Teoria de Resposta ao Item — a metodologia real do INEP." },
  { icon: Zap,       title: "Desafio diário",            desc: "3 questões todo dia para manter o ritmo. Missão diária com histórico de progresso." },
  { icon: Brain,     title: "Tutor IA",                  desc: "Tutor personalizado com IA que analisa seu desempenho e responde dúvidas com LaTeX." },
  { icon: BookOpen,  title: "Treino cronometrado",       desc: "Escolha tópico e quantidade. Tempo registrado para acompanhar sua velocidade." },
  { icon: Timer,     title: "Temporizador inteligente",  desc: "Cronômetro por questão com alerta visual quando o tempo ideal é excedido." },
  { icon: BarChart2, title: "Histórico de evolução",     desc: "Mapa de calor semanal e estatísticas detalhadas de desempenho." },
  { icon: Award,     title: "Ranking & Fórmulas",        desc: "Compare sua nota TRI com outros alunos e consulte todas as fórmulas." },
];

// ─── Tipografia — Manrope + Noto Serif (estilo satisfied.gg) ─────────────────

const F_SANS  = "'Manrope', sans-serif";
const F_SERIF = "'Noto Serif', Georgia, serif";

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

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

  return (
    <div style={{ fontFamily: F_SANS, minHeight: "100vh", background: "var(--background)" }}>

      {/* ── Seção hero + formulário ────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #263238 0%, #004D40 60%, #009688 100%)" }}>
        <div
          className="mx-auto px-5 flex flex-col lg:flex-row items-center gap-12"
          style={{ maxWidth: 1080, paddingTop: 64, paddingBottom: 72 }}
        >

          {/* ── Branding / copy ────────────────────────────────────────────── */}
          <div className="flex-1 text-white">

            {/* Logo + nome */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/logo-vetor.png"
                alt="Prova Real"
                style={{ height: 48, width: 48, objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
              <div>
                <p style={{
                  fontFamily: F_SANS,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  color: "#fff",
                }}>
                  Prova Real
                </p>
                <p style={{
                  fontFamily: F_SANS,
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 2,
                }}>
                  Escola Vetor · Simulados para vestibulares
                </p>
              </div>
            </div>

            {/* Título editorial — Noto Serif */}
            <h1 style={{
              fontFamily: F_SERIF,
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#fff",
              marginBottom: "1rem",
            }}>
              Prepare-se para o ENEM<br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>com precisão real</em>
            </h1>

            <p style={{
              fontFamily: F_SANS,
              fontWeight: 400,
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 400,
              marginBottom: "2rem",
            }}>
              Simulados com correção pela Teoria de Resposta ao Item —
              a mesma metodologia usada pelo INEP.
            </p>

            {/* Badges de destaque */}
            <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
              {[
                { value: "TRI",  label: "correção real" },
                { value: "ENEM", label: "questões reais" },
                { value: "100%", label: "dedicação" },
              ].map(({ value, label }) => (
                <div
                  key={value}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: "1.2rem", color: "#fff", lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ fontFamily: F_SANS, fontWeight: 500, fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", marginTop: 3, letterSpacing: "0.04em" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Card do formulário ─────────────────────────────────────────── */}
          <div style={{ width: "100%", maxWidth: 400, flexShrink: 0 }}>
            <div style={{
              background: "var(--card)",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 24px 64px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)",
            }}>

              {/* Título do card */}
              <p style={{
                fontFamily: F_SERIF,
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--foreground)",
                marginBottom: 20,
                letterSpacing: "-0.01em",
              }}>
                {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
              </p>

              {/* Tab login / cadastro */}
              <div style={{
                display: "flex",
                background: "var(--muted)",
                borderRadius: 12,
                padding: 4,
                marginBottom: 22,
              }}>
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: F_SANS,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.01em",
                      transition: "background 0.15s, color 0.15s",
                      background: mode === m ? "#009688" : "transparent",
                      color: mode === m ? "#fff" : "var(--muted-foreground)",
                    }}
                  >
                    {m === "login" ? "Entrar" : "Criar conta"}
                  </button>
                ))}
              </div>

              {/* Formulário */}
              {mode === "login" ? (
                <LoginFormContent
                  reg={regLogin}
                  errors={loginErrors}
                  onSubmit={handleLogin((d) => login.mutate(d))}
                  isPending={isPending}
                  onSwitch={() => switchMode("register")}
                />
              ) : (
                <RegisterFormContent
                  reg={regRegister}
                  errors={registerErrors}
                  onSubmit={handleRegister((d) => register.mutate(d))}
                  isPending={isPending}
                  onSwitch={() => switchMode("login")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Funcionalidades ────────────────────────────────────────────────── */}
      <div className="mx-auto px-5" style={{ maxWidth: 1080, paddingTop: 64, paddingBottom: 80 }}>
        <h2 style={{
          fontFamily: F_SERIF,
          fontWeight: 700,
          fontSize: "1.6rem",
          color: "var(--foreground)",
          marginBottom: 6,
          letterSpacing: "-0.01em",
        }}>
          Tudo que você precisa para o ENEM
        </h2>
        <p style={{
          fontFamily: F_SANS,
          fontWeight: 400,
          fontSize: "0.9rem",
          color: "var(--muted-foreground)",
          marginBottom: 36,
        }}>
          Uma plataforma completa, focada em resultado.
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 16 }}
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                borderRadius: 16,
                padding: "20px 22px",
                background: "var(--card)",
                border: "1.5px solid #B2DFDB",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{
                height: 40,
                width: 40,
                borderRadius: 12,
                background: "#E0F2F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}>
                <Icon className="h-5 w-5" style={{ color: "#009688" }} />
              </div>
              <h3 style={{
                fontFamily: F_SANS,
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--foreground)",
                marginBottom: 5,
                letterSpacing: "0.005em",
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: F_SANS,
                fontWeight: 400,
                fontSize: "0.8rem",
                lineHeight: 1.65,
                color: "var(--muted-foreground)",
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: F_SANS,
          fontWeight: 400,
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
          textAlign: "center",
          marginTop: 56,
          letterSpacing: "0.02em",
        }}>
          © {new Date().getFullYear()} Escola Prova Real · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

// ─── Sub-componentes de formulário ────────────────────────────────────────────

const F_SANS_LOCAL = "'Manrope', sans-serif";

function Field({
  label, error, children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block",
        fontFamily: F_SANS_LOCAL,
        fontWeight: 600,
        fontSize: "0.75rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--muted-foreground)",
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{
          fontFamily: F_SANS_LOCAL,
          fontWeight: 500,
          fontSize: "0.72rem",
          color: "#DC2626",
          marginTop: 4,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: "100%",
        padding: "11px 14px",
        borderRadius: 12,
        border: `2px solid ${focused ? "#009688" : "var(--border)"}`,
        background: "var(--card)",
        color: "var(--foreground)",
        fontFamily: F_SANS_LOCAL,
        fontWeight: 400,
        fontSize: "0.9rem",
        outline: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
      }}
    />
  );
}

function SubmitButton({ isPending, children }: { isPending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      style={{
        width: "100%",
        padding: "13px 0",
        borderRadius: 12,
        border: "none",
        background: isPending ? "#00695C" : "#009688",
        color: "#fff",
        fontFamily: F_SANS_LOCAL,
        fontWeight: 700,
        fontSize: "0.9rem",
        letterSpacing: "0.02em",
        cursor: isPending ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 6,
        transition: "background 0.15s",
      }}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function SwitchLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <p style={{
      fontFamily: F_SANS_LOCAL,
      fontWeight: 400,
      fontSize: "0.82rem",
      color: "var(--muted-foreground)",
      textAlign: "center",
      marginTop: 16,
    }}>
      {children}
      <button
        type="button"
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: F_SANS_LOCAL,
          fontWeight: 700,
          fontSize: "0.82rem",
          color: "#009688",
          textDecoration: "underline",
          textUnderlineOffset: 3,
          marginLeft: 4,
        }}
      >
        {/* text is provided as part of children pattern below */}
      </button>
    </p>
  );
}

function LoginFormContent({
  reg, errors, onSubmit, isPending, onSwitch,
}: {
  reg: ReturnType<typeof useForm<LoginForm>>["register"];
  errors: ReturnType<typeof useForm<LoginForm>>["formState"]["errors"];
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  onSwitch: () => void;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Field label="E-mail" error={errors.email?.message}>
        <Input {...reg("email")} type="email" placeholder="seu@email.com" />
      </Field>
      <Field label="Senha" error={errors.password?.message}>
        <Input {...reg("password")} type="password" placeholder="Sua senha" />
      </Field>
      <SubmitButton isPending={isPending}>Entrar na conta</SubmitButton>
      <p style={{
        fontFamily: F_SANS_LOCAL,
        fontWeight: 400,
        fontSize: "0.82rem",
        color: "var(--muted-foreground)",
        textAlign: "center",
        marginTop: 16,
      }}>
        Não possui conta?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: F_SANS_LOCAL, fontWeight: 700, fontSize: "0.82rem",
            color: "#009688", textDecoration: "underline", textUnderlineOffset: 3,
          }}
        >
          Cadastre-se
        </button>
      </p>
    </form>
  );
}

function RegisterFormContent({
  reg, errors, onSubmit, isPending, onSwitch,
}: {
  reg: ReturnType<typeof useForm<RegisterForm>>["register"];
  errors: ReturnType<typeof useForm<RegisterForm>>["formState"]["errors"];
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  onSwitch: () => void;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Field label="Nome completo" error={errors.name?.message}>
        <Input {...reg("name")} type="text" placeholder="Seu nome" />
      </Field>
      <Field label="E-mail" error={errors.email?.message}>
        <Input {...reg("email")} type="email" placeholder="seu@email.com" />
      </Field>
      <Field label="Senha" error={errors.password?.message}>
        <Input {...reg("password")} type="password" placeholder="Mínimo 6 caracteres" />
      </Field>
      <SubmitButton isPending={isPending}>Criar minha conta</SubmitButton>
      <p style={{
        fontFamily: F_SANS_LOCAL,
        fontWeight: 400,
        fontSize: "0.82rem",
        color: "var(--muted-foreground)",
        textAlign: "center",
        marginTop: 16,
      }}>
        Já possui conta?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: F_SANS_LOCAL, fontWeight: 700, fontSize: "0.82rem",
            color: "#009688", textDecoration: "underline", textUnderlineOffset: 3,
          }}
        >
          Faça login
        </button>
      </p>
    </form>
  );
}
