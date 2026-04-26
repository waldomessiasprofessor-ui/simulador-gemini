import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Loader2, Target, TrendingUp, TrendingDown, Minus,
  Clock, CheckCircle2, ArrowLeft, Dumbbell,
} from "@/icons";

type TopicStat = {
  conteudo: string;
  total: number;
  correct: number;
  accuracy: number;
  avgTime: number | null;
};

function getLevel(accuracy: number, total: number) {
  if (total < 3) return { label: "Poucos dados", color: "var(--muted-foreground)", bg: "var(--muted)",        bar: "var(--muted-foreground)" };
  if (accuracy >= 75) return { label: "Dominado",    color: "#16A34A",     bg: "#F0FDF4", bar: "#16A34A" };
  if (accuracy >= 50) return { label: "Em progresso",color: "#B45309",        bg: "#FFFBEB",    bar: "#B45309" };
  return { label: "Prioridade",                        color: "#DC2626",      bg: "#FEF2F2",  bar: "#DC2626" };
}

function TopicCard({ topic, navigate }: { topic: TopicStat; navigate: (p: string) => void }) {
  const { label, color, bg, bar } = getLevel(topic.accuracy, topic.total);
  const hasData = topic.total >= 3;

  return (
    <div className="rounded-xl p-4 space-y-2"
      style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug flex-1" style={{ color: "var(--foreground)" }}>
          {topic.conteudo}
        </p>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: bg, color }}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: hasData ? `${topic.accuracy}%` : "0%", background: bar }} />
        </div>
        <span className="text-sm font-black w-10 text-right flex-shrink-0" style={{ color }}>
          {hasData ? `${topic.accuracy}%` : "—"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <CheckCircle2 className="h-3 w-3" />
            {topic.correct}/{topic.total} acertos
          </span>
          {topic.avgTime && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
              <Clock className="h-3 w-3" />
              ~{topic.avgTime}s/questão
            </span>
          )}
        </div>
        {hasData && topic.accuracy < 75 && (
          <button
            onClick={() => navigate(`/treino?conteudo=${encodeURIComponent(topic.conteudo)}`)}
            className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors"
            style={{ background: bg, color }}>
            <Dumbbell className="h-3 w-3" /> Treinar
          </button>
        )}
      </div>
    </div>
  );
}

export default function Desempenho() {
  const [, navigate] = useLocation();
  const { data: topics, isLoading } = trpc.simulations.getTopicStats.useQuery(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  const hasData = topics && topics.length > 0;
  const totalAnswered = topics?.reduce((s, t) => s + t.total, 0) ?? 0;
  const totalCorrect  = topics?.reduce((s, t) => s + t.correct, 0) ?? 0;
  const overallAccuracy = totalAnswered > 0
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  const withData = (topics ?? []).filter((t) => t.total >= 3);
  const weak   = [...withData].filter((t) => t.accuracy < 50).sort((a, b) => a.accuracy - b.accuracy);
  const mid    = [...withData].filter((t) => t.accuracy >= 50 && t.accuracy < 75).sort((a, b) => a.accuracy - b.accuracy);
  const strong = [...withData].filter((t) => t.accuracy >= 75).sort((a, b) => b.accuracy - a.accuracy);
  const fewData = (topics ?? []).filter((t) => t.total < 3);

  return (
    <div className="space-y-6 py-2">

      {/* Voltar */}
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft className="h-4 w-4" /> Início
      </button>

      {/* Header */}
      <div className="rounded-2xl px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <h1 className="text-2xl font-black mb-1">Desempenho por Tema</h1>
        <p className="text-sm opacity-80">Veja onde você é forte e onde precisa melhorar.</p>
        {hasData && (
          <div className="flex gap-6 mt-5">
            <div>
              <p className="text-2xl font-black">{overallAccuracy}%</p>
              <p className="text-xs opacity-70">acerto geral</p>
            </div>
            <div>
              <p className="text-2xl font-black">{totalAnswered}</p>
              <p className="text-xs opacity-70">questões respondidas</p>
            </div>
            <div>
              <p className="text-2xl font-black">{withData.length}</p>
              <p className="text-xs opacity-70">temas avaliados</p>
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="text-center py-16 space-y-3 card">
          <Target className="h-12 w-12 mx-auto opacity-30" style={{ color: "#009688" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum dado ainda</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Complete simulados ou treinos para ver sua análise por tema.
          </p>
          <button onClick={() => navigate("/treino")} className="btn-primary">
            Começar treino
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {weak.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TrendingDown className="h-4 w-4" style={{ color: "#DC2626" }} />
                <h2 className="font-bold text-sm" style={{ color: "#DC2626" }}>
                  Prioridade — estude esses primeiro
                </h2>
              </div>
              {weak.map((t) => <TopicCard key={t.conteudo} topic={t} navigate={navigate} />)}
            </section>
          )}

          {mid.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Minus className="h-4 w-4" style={{ color: "#B45309" }} />
                <h2 className="font-bold text-sm" style={{ color: "#B45309" }}>
                  Em progresso — continue praticando
                </h2>
              </div>
              {mid.map((t) => <TopicCard key={t.conteudo} topic={t} navigate={navigate} />)}
            </section>
          )}

          {strong.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TrendingUp className="h-4 w-4" style={{ color: "#16A34A" }} />
                <h2 className="font-bold text-sm" style={{ color: "#16A34A" }}>
                  Dominado — bom trabalho!
                </h2>
              </div>
              {strong.map((t) => <TopicCard key={t.conteudo} topic={t} navigate={navigate} />)}
            </section>
          )}

          {fewData.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-bold text-sm px-1" style={{ color: "var(--muted-foreground)" }}>
                Poucos dados — responda mais questões desses temas
              </h2>
              {fewData.map((t) => <TopicCard key={t.conteudo} topic={t} navigate={navigate} />)}
            </section>
          )}

        </div>
      )}
    </div>
  );
}
