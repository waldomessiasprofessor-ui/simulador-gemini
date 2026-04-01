import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  PlayCircle, Clock, Target, Loader2, Flame, Zap,
  Timer, CheckCircle2, XCircle, ChevronRight, Medal,
  Dumbbell, BookOpen, Brain, TrendingDown, TrendingUp, Minus,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function DailyCard() {
  const [, navigate] = useLocation();
  const { data: daily, isLoading } = trpc.simulations.getDailyChallenge.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true });

  if (isLoading) return (
    <div className="flex justify-center py-6">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#01738d" }} />
    </div>
  );
  if (!daily) return null;

  const questions = daily.questions as any[];
  const answers = daily.answers as Record<string, string>;
  const answered = questions.filter((q: any) => answers[q.id]).length;

  if (daily.completed) {
    const correct = daily.correctCount ?? 0;
    const total = questions.length;
    const color = correct === total ? "#00695C" : correct >= 2 ? "#E65100" : "#C62828";
    const bg = correct === total ? "var(--secondary)" : correct >= 2 ? "#FFF8E1" : "#FFEBEE";
    const border = correct === total ? "#00BFA5" : correct >= 2 ? "#F9A825" : "#E53935";
    return (
      <div className="rounded-2xl p-4 flex items-center justify-between gap-4"
        style={{ background: bg, border: `1.5px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: color }}>
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color }}>Desafio concluído hoje!</p>
            <p className="text-xs mt-0.5" style={{ color }}>{correct}/{total} acertos</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {questions.map((q: any, i: number) => {
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
    );
  }

  return (
    <button onClick={() => navigate("/desafio")}
      className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
      style={{ background: "var(--teal-soft)", border: "1.5px solid #01738d44" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#01738d" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>3 Questões do dia</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Resolva 3 questões selecionadas todo dia e mantenha sua sequência de estudos ativa.
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "#01738d" }}>
              {answered}/{questions.length} respondidas · Toque para começar
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#01738d" }} />
      </div>
      <div className="flex gap-1.5 mt-3">
        {questions.map((_: any, i: number) => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: answers[questions[i].id] ? "#01738d" : "var(--border)" }} />
        ))}
      </div>
    </button>
  );
}

function ReviseCard() {
  const [, navigate] = useLocation();
  const { data: revise, isLoading: reviseLoading } = trpc.review.getDaily.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true, refetchInterval: 30_000 });

  if (reviseLoading) return null;

  return (
    <button onClick={() => navigate("/revise")}
      className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
      style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--muted)" }}>
            <BookOpen className="h-5 w-5" style={{ color: "var(--foreground)" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Revise</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Leia um conteúdo teórico e responda 3 questões sobre o tema. Ideal para fixar o que o ENEM cobra.
            </p>
            {revise && (
              <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--foreground)" }}>
                Tema de hoje: {revise.titulo}
              </p>
            )}
          </div>
        </div>
        {revise && <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />}
      </div>
    </button>
  );
}

function StudyMapCard() {
  const [, navigate] = useLocation();
  const { data: topics } = trpc.simulations.getTopicStats.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // Temas com dados suficientes, ordenados do mais fraco ao mais forte
  const ranked = (topics ?? [])
    .filter((t) => t.total >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (!ranked.length) return null;

  const priorities = ranked.slice(0, 3);

  function Icon({ accuracy }: { accuracy: number }) {
    if (accuracy >= 75) return <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#16A34A" }} />;
    if (accuracy >= 50) return <Minus className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#D97706" }} />;
    return <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#DC2626" }} />;
  }

  function barColor(accuracy: number) {
    if (accuracy >= 75) return "#22C55E";
    if (accuracy >= 50) return "#F59E0B";
    return "#EF4444";
  }

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" style={{ color: "#01738d" }} />
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Mapa de estudo</p>
        </div>
        <button onClick={() => navigate("/desempenho")}
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: "#01738d" }}>
          Ver tudo <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {priorities.map((t) => (
          <div key={t.conteudo} className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon accuracy={t.accuracy} />
                <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {t.conteudo}
                </p>
              </div>
              <span className="text-xs font-black flex-shrink-0"
                style={{ color: barColor(t.accuracy) }}>
                {t.accuracy}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${t.accuracy}%`, background: barColor(t.accuracy) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { data: session } = trpc.auth.me.useQuery(undefined, { staleTime: 30_000 });
  const { data: active } = trpc.simulations.getActive.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true, refetchInterval: 15_000 });
  const { data: stats } = trpc.simulations.getStats.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true, refetchInterval: 30_000 });
  const { data: qData } = trpc.questions.list.useQuery({ page: 1, pageSize: 1, activeOnly: true, orderBy: "id", orderDir: "desc" }, { staleTime: 60_000 });
  const totalQuestions = qData?.pagination.total ?? 0;

  const startMutation = trpc.simulations.start.useMutation({
    onSuccess: () => navigate("/simulado"),
    onError: (e) => toast.error(e.message),
  });

  // Saudação por hora do dia
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const name = (session?.name as string)?.split(" ")[0] ?? "";

  return (
    <div className="space-y-4 py-2">

      {/* Saudação */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{greeting}, {name}!</p>
          <h1 className="text-xl font-black mt-0.5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Brain className="h-5 w-5 flex-shrink-0" style={{ color: "#01738d" }} />
            Faça seu treinamento diário
          </h1>
          {totalQuestions > 0 && (
            <p className="text-xs mt-1 font-semibold" style={{ color: "#01738d" }}>
              {totalQuestions} questões disponíveis no banco
            </p>
          )}
        </div>
        {stats && (
          <div className="flex-shrink-0 rounded-xl px-4 py-3 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
            <p className="stat-number flex items-center gap-1 justify-center" style={{ color: "#E65100" }}>
              <Flame className="h-5 w-5" /> {stats.streak}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>dias streak</p>
          </div>
        )}
      </div>

      {/* Stats semanais + gráfico — logo após saudação */}
      {stats && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl p-4 space-y-3"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Semana atual</h2>
              <button onClick={() => navigate("/ranking")}
                className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#01738d" }}>
                <Medal className="h-3.5 w-3.5" /> Ranking
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: Zap, label: "Questões respondidas", value: String(stats.weeklyQuestions) },
                { icon: Target, label: "Taxa de acerto", value: `${stats.weeklyAccuracy}%` },
                { icon: Flame, label: "Streak atual", value: `${stats.streak} ${stats.streak === 1 ? "dia" : "dias"}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--teal-soft)" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: "#01738d" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                    <p className="font-black text-base" style={{ color: "var(--foreground)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>Questões por dia</h2>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={stats.dailyData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [v, "Questões"]} />
                <Bar dataKey="questoes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {stats.dailyData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.questoes > 0 ? "#01738d" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Simulado em andamento */}
      {active && (
        <div className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
          style={{ background: "#FFF8E1", border: "1.5px solid #F9A825" }}
          onClick={() => navigate("/simulado")}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: "#F9A825" }}>
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#795548" }}>Simulado em andamento</p>
              <p className="text-xs" style={{ color: "#A1887F" }}>Você tem um simulado aberto — continue de onde parou!</p>
              <p className="text-xs font-bold" style={{ color: "#795548" }}>{active.answeredCount}/{active.totalQuestions} respondidas</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4" style={{ color: "#A1887F" }} />
        </div>
      )}

      {/* Mapa de estudo */}
      <StudyMapCard />

      {/* Cards de ação */}
      <section className="space-y-3">
        {/* Desafio diário */}
        <DailyCard />

        {/* Revise */}
        <ReviseCard />

        {/* Treino livre */}
        <button onClick={() => navigate("/treino")}
          className="w-full text-left rounded-2xl p-4 card-interactive"
          style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#E0F0FF" }}>
                <Dumbbell className="h-5 w-5" style={{ color: "#1565C0" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Treino livre</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Escolha o tópico e a quantidade de questões e treine com cronômetro. Foco total no que você quer praticar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Timer className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
              <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>
        </button>

        {/* Valendo! — simulado completo TRI */}
        <button
          onClick={() => active ? navigate("/simulado") : startMutation.mutate({ stage: 3 })}
          disabled={startMutation.isPending}
          className="w-full text-left rounded-2xl p-4 card-interactive disabled:opacity-60"
          style={{ background: "#0F172A", border: "2px solid #E65100", boxShadow: "0 4px 20px rgba(230,81,0,0.25)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#E65100" }}>
                {startMutation.isPending
                  ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                  : <PlayCircle className="h-5 w-5 text-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-white">Valendo!</p>
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{ background: "#E65100", color: "#fff" }}>TRI</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                  45 questões com correção TRI — a mesma metodologia do ENEM. Descubra sua nota real.
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 flex-shrink-0 text-white opacity-70" />
          </div>
        </button>
      </section>
    </div>
  );
}
