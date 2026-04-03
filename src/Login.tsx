import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Target, Timer, BarChart2, Brain, BookOpen, Award, Zap } from "lucide-react";

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
  { icon: Zap,       title: "Desafio diário",            desc: "3 questões todo dia para manter o ritmo. Missão diária com histórico de progresso." },
  { icon: BookOpen,  title: "Revise",                    desc: "Texto de revisão diário com LaTeX e 3 questões de validação de leitura." },
  { icon: Brain,     title: "Treino cronometrado",       desc: "Escolha tópico e quantidade. Tempo registrado para acompanhar sua velocidade." },
  { icon: Timer,     title: "Temporizador inteligente",  desc: "Cronômetro por questão com alerta visual quando o tempo ideal é excedido." },
  { icon: BarChart2, title: "Histórico de evolução",     desc: "Mapa de calor semanal e estatísticas detalhadas de desempenho." },
  { icon: Award,     title: "Ranking & Fórmulas",        desc: "Compare sua nota TRI com outros alunos e consulte todas as fórmulas." },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.75rem",
  border: "2px solid #D1D5DB", fontSize: "0.9rem", outline: "none",
  color: "#1E293B", background: "#FFFFFF", transition: "border-color 0.15s",
};
const errorStyle: React.CSSProperties = { color: "#DC2626", fontSize: "0.75rem", marginTop: "0.25rem" };

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

  function focusBorder(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#4A148C"; }
  function blurBorder(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "#D1D5DB"; }

  return (
    <div className="min-h-screen" style={{ background: "#f4f4f4" }}>
      {/* Hero + formulário */}
      <div style={{ background: "linear-gradient(135deg, #4A148C 0%, #00838F 100%)" }}>
        <div className="container mx-auto px-4 max-w-5xl py-12 flex flex-col lg:flex-row items-center gap-10">

          {/* Branding */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-vetor.png" alt="Prova Real" className="h-14 w-14 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
              <div>
                <p className="font-black text-2xl leading-none tracking-wider">PROVA REAL</p>
                <p className="text-sm opacity-70">Escola Vetor · Simulados para vestibulares</p>
              </div>
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3">
              Prepare-se para o ENEM<br />com precisão real
            </h1>
            <p className="text-base mb-6 opacity-85 max-w-md">
              Simulados com correção pela Teoria de Resposta ao Item — a mesma metodologia usada pelo INEP.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {[{ value: "TRI", label: "correção real" }, { value: "ENEM", label: "questões reais" }, { value: "0%", label: "chute detectado" }].map(({ value, label }) => (
                <div key={value} className="px-4 py-2 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <p className="font-black text-xl">{value}</p>
                  <p className="text-xs opacity-75">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card login/cadastro */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              <div className="flex rounded-xl overflow-hidden" style={{ background: "#F1F5F9" }}>
                {(["login", "register"] as const).map((m) => (
                  <button key={m} onClick={() => switchMode(m)}
                    className="flex-1 py-2.5 text-sm font-bold transition-colors rounded-xl"
                    style={mode === m ? { background: "#4A148C", color: "#fff" } : { background: "transparent", color: "#64748B" }}>
                    {m === "login" ? "Entrar" : "Criar conta"}
                  </button>
                ))}
              </div>

              {mode === "login" && (
                <form onSubmit={handleLogin((d) => login.mutate(d))} className="space-y-3" noValidate>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1E293B" }}>E-mail</label>
                    <input {...regLogin("email")} type="email" placeholder="seu@email.com" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {loginErrors.email && <p style={errorStyle}>{loginErrors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1E293B" }}>Senha</label>
                    <input {...regLogin("password")} type="password" placeholder="Sua senha" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {loginErrors.password && <p style={errorStyle}>{loginErrors.password.message}</p>}
                  </div>
                  <button type="submit" disabled={isPending} className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                    style={{ background: isPending ? "#6a1ea8" : "#4A148C", color: "#fff", border: "none", cursor: isPending ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
                    {isPending && <Loader2 className="h-5 w-5 animate-spin" />} Entrar na conta
                  </button>
                  <p className="text-center text-sm" style={{ color: "#64748B" }}>
                    Não possui conta?{" "}
                    <button type="button" onClick={() => switchMode("register")} className="font-bold underline" style={{ color: "#4A148C" }}>Cadastre-se</button>
                  </p>
                </form>
              )}

              {mode === "register" && (
                <form onSubmit={handleRegister((d) => register.mutate(d))} className="space-y-3" noValidate>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1E293B" }}>Nome completo</label>
                    <input {...regRegister("name")} type="text" placeholder="Seu nome" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.name && <p style={errorStyle}>{registerErrors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1E293B" }}>E-mail</label>
                    <input {...regRegister("email")} type="email" placeholder="seu@email.com" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.email && <p style={errorStyle}>{registerErrors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#1E293B" }}>Senha</label>
                    <input {...regRegister("password")} type="password" placeholder="Mínimo 6 caracteres" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                    {registerErrors.password && <p style={errorStyle}>{registerErrors.password.message}</p>}
                  </div>
                  <button type="submit" disabled={isPending} className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                    style={{ background: isPending ? "#6a1ea8" : "#4A148C", color: "#fff", border: "none", cursor: isPending ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
                    {isPending && <Loader2 className="h-5 w-5 animate-spin" />} Criar minha conta
                  </button>
                  <p className="text-center text-sm" style={{ color: "#64748B" }}>
                    Já possui conta?{" "}
                    <button type="button" onClick={() => switchMode("login")} className="font-bold underline" style={{ color: "#4A148C" }}>Faça login</button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades da plataforma */}
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <h2 className="text-xl font-bold mb-2" style={{ color: "#1A1A2E" }}>Tudo que você precisa para o ENEM</h2>
        <p className="text-sm mb-6" style={{ color: "#64748B" }}>Uma plataforma completa, focada em resultado.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl p-5" style={{ background: "#fff", border: "1.5px solid #E2D9EE" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#E0F7F4" }}>
                <Icon className="h-5 w-5" style={{ color: "#4A148C" }} />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "#1A1A2E" }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-10" style={{ color: "#94A3B8" }}>
          © {new Date().getFullYear()} Escola Prova Real · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
