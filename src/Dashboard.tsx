import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame, Trophy, CheckCircle2, XCircle, ChevronRight,
  Loader2, Zap, Target, Medal, BookOpen, Dumbbell,
  Clock, Swords, Star, PartyPopper, Brain
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

// ─── DailyCard ───────────────────────────────────────────────────────────────

function DailyCard() {
  const [, navigate] = useLocation();
  const { data: daily, isLoading } = trpc.simulations.getDailyChallenge.useQuery();

  if (isLoading) return (
    <div className="rounded-2xl p-5 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#01738d" }} />
    </div>
  );
  if (!daily) return null;

  const questions = daily.questions as any[];
  const answers = daily.answers as Record<string, string>;
  const answered = questions.filter(q => answers[q.id]).length;

  if (daily.completed) {
    const correct = daily.correctCount ?? 0;
    const total = questions.length;
    const all = correct === total;
    return (
      <div className="rounded-2xl p-5" style={{
        background: all ? "var(--secondary)" : "var(--card)",
        border: `1.5px solid ${all ? "#00BFA5" : "var(--border)"}`,
      }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: all ? "#00BFA5" : "#01738d" }}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Desafio do dia — concluído!</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{correct}/{total} acertos hoje</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {questions.map((q, i) => {
              const ok = answers[q.id] === q.gabarito;
              return (
                <div key={i} className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ background: ok ? "#00BFA5" : "#E53935" }}>
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
    <button onClick={() => navigate("/desafio")} className="w-full text-left rounded-2xl p-5 transition-all hover:opacity-90"
      style={{ background: "var(--teal-soft)", border: "1.5px solid #01738d44" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#01738d" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#01738d" }}>3 Questões do dia</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {answered}/{questions.length} respondidas · Toque para começar
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#01738d" }} />
      </div>
      <div className="flex gap-1.5 mt-3">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: answers[questions[i].id] ? "#01738d" : "var(--border)" }} />
        ))}
      </div>
    </button>
  );
}

// ─── ReviseCard ──────────────────────────────────────────────────────────────

function ReviseCard() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.getDaily.useQuery();

  if (isLoading) return (
    <div className="rounded-2xl p-5 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#7B3FA0" }} />
    </div>
  );

  const review = data?.review;
  const content = data?.content;

  if (!content) {
    return (
      <div className="rounded-2xl p-5 opacity-60" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <BookOpen className="h-5 w-5" style={{ color: "var(--purple)" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Revise</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Nenhum conteúdo disponível ainda</p>
          </div>
        </div>
      </div>
    );
  }

  if (review?.completed) {
    const correct = review.correctCount ?? 0;
    return (
      <div className="rounded-2xl p-5" style={{ background: "var(--accent)", border: "1.5px solid var(--purple-soft)" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--purple)" }}>
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--accent-foreground)" }}>Revise — concluído!</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {correct}/3 acertos · {content.topico ?? content.titulo}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => navigate("/revise")} className="w-full text-left rounded-2xl p-5 transition-all hover:opacity-90"
      style={{ background: "var(--accent)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--purple)" }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--accent-foreground)" }}>Revise</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {content.topico ?? content.titulo} · Leitura + 3 questões
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "var(--purple)" }} />
      </div>
    </button>
  );
}

// ─── TreinoCard ──────────────────────────────────────────────────────────────

function TreinoCard() {
  const [, navigate] = useLocation();
  return (
    <button onClick={() => navigate("/treino")} className="w-full text-left rounded-2xl p-5 transition-all hover:opacity-90"
      style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--muted)" }}>
            <Dumbbell className="h-5 w-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Treino livre</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Escolha o tópico, quantidade e treine com tempo registrado
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
          <ChevronRight className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </div>
    </button>
  );
}

// ─── SimuladoCard "Valendo" ───────────────────────────────────────────────────

function SimuladoCard() {
  const [, navigate] = useLocation();
  const { data: active } = trpc.simulations.getActive.useQuery();
  const startMutation = trpc.simulations.start.useMutation({
    onSuccess: () => navigate("/simulado"),
    onError: (e) => toast.error(e.message),
  });

  return (
    <button
      onClick={() => active ? navigate("/simulado") : startMutation.mutate({ stage: 3 })}
      disabled={startMutation.isPending}
      className="w-full text-left rounded-2xl p-5 transition-all hover:opacity-90"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", border: "1.5px solid #F97316" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#F97316" }}>
            {startMutation.isPending
              ? <Loader2 className="h-5 w-5 text-white animate-spin" />
              : <Swords className="h-5 w-5 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-white">Valendo!</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "#F97316", color: "#fff" }}>TRI</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
              {active ? "Simulado em andamento — continuar" : "45 questões · Nota real do ENEM"}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-orange-400" />
      </div>
    </button>
  );
}

// ─── MissaoCumprida ───────────────────────────────────────────────────────────

function MissaoCumprida() {
  const { data: daily } = trpc.simulations.getDailyChallenge.useQuery();
  const { data: review } = trpc.review.getDaily.useQuery();

  const desafioOk = daily?.completed === true;
  const reviseOk = review?.review?.completed === true;

  if (!desafioOk || !reviseOk) return null;

  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "linear-gradient(135deg, #01738d 0%, #004d61 100%)" }}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.2)" }}>
        <PartyPopper className="h-6 w-6 text-white" />
      </div>
      <div className="text-white">
        <p className="font-black text-base">Missão cumprida hoje! 🔥</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
          Você completou o desafio e o Revise. Continue assim — você está à frente de muitos!
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { data: stats } = trpc.simulations.getStats.useQuery();
  const { data: session } = trpc.auth.me.useQuery();

  const firstName = (session?.name as string)?.split(" ")[0] ?? "Aluno";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-4 py-2">

      {/* Saudação + streak */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {greeting}, {firstName}!
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Brain className="h-6 w-6 flex-shrink-0" style={{ color: "#01738d" }} />
            <p className="text-2xl font-black leading-tight" style={{ color: "var(--foreground)" }}>
              Pronto para treinar hoje?
            </p>
          </div>
        </div>
        {stats && (
          <button onClick={() => navigate("/ranking")}
            className="flex flex-col items-center px-4 py-2.5 rounded-2xl gap-0.5"
            style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4" style={{ color: "#F97316" }} />
              <span className="font-black text-xl" style={{ color: "var(--foreground)" }}>{stats.streak}</span>
            </div>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>dias streak</span>
          </button>
        )}
      </div>

      {/* Missão cumprida (só aparece quando ambos concluídos) */}
      <MissaoCumprida />

      {/* Cards principais */}
      <section className="space-y-3">
        <DailyCard />
        <ReviseCard />
        <TreinoCard />
        <SimuladoCard />
      </section>

      {/* Stats semanais + gráfico */}
      {stats && (
        <section className="grid gap-3 sm:grid-cols-2 pt-2">
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Semana atual</p>
              <button onClick={() => navigate("/ranking")} className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: "#01738d" }}>
                <Medal className="h-3.5 w-3.5" /> Ranking
              </button>
            </div>
            <div className="space-y-2">
              {[
                { icon: Zap, label: "Questões respondidas", value: String(stats.weeklyQuestions) },
                { icon: Target, label: "Taxa de acerto", value: `${stats.weeklyAccuracy}%` },
                { icon: Star, label: "Simulados completos", value: String(stats.totalSimulations) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--teal-soft)" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: "#01738d" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                    <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
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
                    <Cell key={i} fill={entry.questoes > 0 ? "#01738d" : "var(--border)"} />
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
