import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame, Trophy, CheckCircle2, XCircle, ChevronRight,
  Loader2, Zap, Target, Medal, BookOpen, Dumbbell,
  Clock, Swords, Star, PartyPopper, BarChart2, FlaskConical
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const VESTIBULARES = [
  { id: "ENEM",    label: "ENEM",    sub: "45 questões · TRI",          badge: "Nacional", color: "#009688", comingSoon: false },
  { id: "FUVEST",  label: "FUVEST",  sub: "90 questões · 1ª fase",    badge: "USP",      color: "#00695C", comingSoon: true },
  { id: "UNICAMP", label: "UNICAMP", sub: "72 questões · 1ª fase",    badge: "Paulista", color: "#00695C", comingSoon: false },
  { id: "UNESP",   label: "UNESP",   sub: "90 questões · 1ª fase",    badge: "Paulista", color: "#00695C", comingSoon: true },
];

// ─── DailyCard ────────────────────────────────────────────────────────────────
function DailyCard() {
  const [, navigate] = useLocation();
  const { data: daily, isLoading } = trpc.simulations.getDailyChallenge.useQuery(
    undefined, { staleTime: 0, refetchOnWindowFocus: true }
  );

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#009688" }} />
    </div>
  );
  if (!daily) return null;

  const questions = daily.questions as any[];
  const answers = daily.answers as Record<string, string>;
  const answered = questions.filter(q => answers[q.id]).length;

  if (daily.completed) {
    const correct = daily.correctCount ?? 0;
    return (
      <div className="rounded-2xl p-4" style={{ background: "var(--pr-purple-soft, #E0F2F1)", border: "1.5px solid #00968844" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#009688" }}>Desafio do dia — concluído!</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{correct}/{questions.length} acertos</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {questions.map((q, i) => {
              const ok = answers[q.id] === q.gabarito;
              return (
                <div key={i} className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ background: ok ? "#009688" : "#E53935" }}>
                  {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <XCircle className="h-3.5 w-3.5 text-white" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => navigate("/desafio")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
      style={{ background: "var(--pr-purple-soft, #E0F2F1)", border: "1.5px solid #00968844" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#009688" }}>3 questões do dia</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {answered}/{questions.length} respondidas · Toque para começar
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#009688" }} />
      </div>
      <div className="flex gap-1.5 mt-3">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: answers[questions[i].id] ? "#009688" : "var(--border)" }} />
        ))}
      </div>
    </button>
  );
}

// ─── ReviseCard ───────────────────────────────────────────────────────────────
function ReviseCard() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.getDaily.useQuery(
    undefined, { staleTime: 0, refetchOnWindowFocus: true }
  );

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  const review = data?.review;
  const content = data?.content;

  if (!content) return (
    <div className="rounded-2xl p-4 opacity-60" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-cyan-soft, #E0F2F1)" }}>
          <BookOpen className="h-5 w-5" style={{ color: "#009688" }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Revise</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Nenhum conteúdo disponível ainda</p>
        </div>
      </div>
    </div>
  );

  if (review?.completed) return (
    <div className="rounded-2xl p-4" style={{ background: "var(--pr-cyan-soft, #E0F2F1)", border: "1.5px solid #00968844" }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "#009688" }}>Revise — concluído!</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{review.correctCount}/3 acertos · {content.topico ?? content.titulo}</p>
        </div>
      </div>
    </div>
  );

  return (
    <button onClick={() => navigate("/revise")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
      style={{ background: "var(--pr-cyan-soft, #E0F2F1)", border: "1.5px solid #00968844" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#009688" }}>Revise</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{content.topico ?? content.titulo}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#009688" }} />
      </div>
    </button>
  );
}

// ─── MissaoCumprida ───────────────────────────────────────────────────────────
function MissaoCumprida() {
  const { data: daily } = trpc.simulations.getDailyChallenge.useQuery(undefined, { staleTime: 0 });
  const { data: review } = trpc.review.getDaily.useQuery(undefined, { staleTime: 0 });
  if (!daily?.completed || !review?.review?.completed) return null;
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.2)" }}>
        <PartyPopper className="h-6 w-6 text-white" />
      </div>
      <div className="text-white">
        <p className="font-black text-base">Missão cumprida hoje! 🔥</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
          Desafio e Revise completos. Você está à frente de muitos!
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [vestibularSelecionado, setVestibularSelecionado] = useState("ENEM");

  const { data: session } = trpc.auth.me.useQuery(undefined, { staleTime: 30_000 });
  const { data: stats } = trpc.simulations.getStats.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true });
  const { data: active } = trpc.simulations.getActive.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true });
  const { data: qData } = trpc.questions.list.useQuery({ page: 1, pageSize: 1, activeOnly: true, orderBy: "id", orderDir: "desc" });
  const totalQuestions = qData?.pagination.total ?? 0;

  const startMutation = trpc.simulations.start.useMutation({
    onSuccess: () => navigate("/simulado"),
    onError: (e) => toast.error(e.message),
  });
  const utils = trpc.useUtils();
  const abandon = trpc.simulations.abandon?.useMutation?.({
    onSuccess: () => { utils.simulations.getActive.invalidate(); navigate("/simulado"); },
  });

  const firstName = (session?.name as string)?.split(" ")[0] ?? "Aluno";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-4 py-2">

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #263238 0%, #009688 100%)", borderRadius: 20, padding: "24px 20px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, background: "#009688", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>P</span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Prova Real</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Escola Vetor</p>
            </div>
          </div>
          {stats && (
            <button onClick={() => navigate("/ranking")}
              style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer" }}>
              <Flame style={{ width: 16, height: 16, color: "#FFB300" }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{stats.streak}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>dias</span>
            </button>
          )}
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{greeting}, {firstName}! 👋</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Escolha o vestibular e comece a treinar.</p>

        {/* Seletor de vestibular */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {VESTIBULARES.map(v => (
            <div key={v.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <button onClick={() => !v.comingSoon && setVestibularSelecionado(v.id)}
                style={{
                  padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none",
                  cursor: v.comingSoon ? "default" : "pointer",
                  background: vestibularSelecionado === v.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                  color: vestibularSelecionado === v.id ? "#263238" : "#fff",
                  opacity: v.comingSoon ? 0.6 : 1,
                  transition: "all 0.15s",
                }}>
                {v.label}
              </button>
              {v.comingSoon && (
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.05em" }}>Em breve!</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Missão cumprida ── */}
      <MissaoCumprida />

      {/* ── Missão do dia ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>Missão do dia</p>
        <DailyCard />
        <ReviseCard />
      </section>

      {/* ── Treine agora ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>Treine agora</p>

        <button onClick={() => navigate("/treino")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <Dumbbell className="h-5 w-5" style={{ color: "#009688" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Treino livre</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Tópico, quantidade e vestibular · com cronômetro
                </p>
                {totalQuestions > 0 && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: "#009688" }}>{totalQuestions} questões disponíveis</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Clock className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
              <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>
        </button>

        <button onClick={() => navigate("/questoes")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <BarChart2 className="h-5 w-5" style={{ color: "#009688" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Banco de questões</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Filtre por vestibular, tópico e dificuldade</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
          </div>
        </button>

        <button onClick={() => navigate("/formulas")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <FlaskConical className="h-5 w-5" style={{ color: "#009688" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Fórmulas</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Álgebra, Geometria, Trigonometria e mais</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
          </div>
        </button>
      </section>

      {/* ── Valendo! ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider px-1 mb-2" style={{ color: "var(--muted-foreground)" }}>Simulado completo</p>
        <button
          onClick={() => active ? navigate("/simulado") : startMutation.mutate({ stage: 3, fonte: vestibularSelecionado })}
          disabled={startMutation.isPending}
          className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #263238, #009688)", border: "none" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                {startMutation.isPending
                  ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                  : <Swords className="h-5 w-5 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-white">Valendo! ⚡</p>
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, padding: "1px 8px", borderRadius: 20, fontWeight: 600 }}>
                    {vestibularSelecionado === "ENEM" ? "TRI" : "Acertos"}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                  {active ? "Simulado em andamento — continuar" : `${vestibularSelecionado} · ${VESTIBULARES.find(v => v.id === vestibularSelecionado)?.sub}`}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-white opacity-70" />
          </div>
        </button>
      </section>

      {/* ── Stats semanais ── */}
      {stats && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Semana atual</p>
              <button onClick={() => navigate("/ranking")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#009688" }}>
                <Medal className="h-3.5 w-3.5" /> Ranking
              </button>
            </div>
            <div className="space-y-2">
              {[
                { icon: Zap, label: "Questões respondidas", value: String(stats.weeklyQuestions) },
                { icon: Target, label: "Taxa de acerto", value: `${stats.weeklyAccuracy}%` },
                { icon: Star, label: "Simulados completos", value: String(stats.totalSimulations ?? 0) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: "#009688" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                    <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <p className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>Questões por dia</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={stats.dailyData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [v, "Questões"]} />
                <Bar dataKey="questoes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {stats.dailyData.map((entry, i) => (
                    <Cell key={i} fill={entry.questoes > 0 ? "#009688" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
