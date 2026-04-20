import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame, Trophy, CheckCircle2, XCircle, ChevronRight,
  Loader2, Zap, Medal, BookOpen, Dumbbell,
  Clock, Swords, Star, PartyPopper, BarChart2, FlaskConical, Brain, TrendingUp,
  CalendarDays, Sparkles
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { getTrilhaByArea } from "@/trilhas";
import { getTrilhaStats } from "@/trilhas/stats";

const VESTIBULARES = [
  { id: "ENEM",    label: "ENEM",        sub: "45 questões · TRI",        badge: "Nacional", color: "#009688", comingSoon: false },
  { id: "FUVEST",  label: "FUVEST",      sub: "90 questões · 1ª fase",    badge: "USP",      color: "#00695C", comingSoon: true },
  { id: "UNICAMP", label: "UNICAMP",     sub: "72 questões · 1ª fase",    badge: "Paulista", color: "#00695C", comingSoon: false },
  { id: "UNESP",   label: "UNESP",       sub: "90 questões · 1ª fase",    badge: "Paulista", color: "#00695C", comingSoon: true },
  { id: "REPVET",  label: "Rep. Vetor",  sub: "banco de questões Vetor",  badge: "Vetor",    color: "#1565C0", comingSoon: false },
];

// ─── DailyCard ────────────────────────────────────────────────────────────────
function DailyCard() {
  const [, navigate] = useLocation();
  const { data: daily, isLoading } = trpc.simulations.getDailyChallenge.useQuery(
    undefined, { staleTime: 0, refetchOnWindowFocus: true }
  );

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--pr-teal)" }} />
    </div>
  );
  if (!daily) return null;

  const questions = daily.questions as any[];
  const answers = daily.answers as Record<string, string>;
  const answered = questions.filter(q => answers[q.id]).length;

  if (daily.completed) {
    const correct = daily.correctCount ?? 0;
    return (
      <div className="rounded-2xl p-4" style={{ background: "var(--pr-teal-soft)", border: "1.5px solid var(--pr-teal-border)" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal)" }}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--pr-teal)" }}>Desafio do dia — concluído!</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{correct}/{questions.length} acertos</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {questions.map((q, i) => {
              const ok = answers[q.id] === q.gabarito;
              return (
                <div key={i} className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ background: ok ? "var(--pr-teal)" : "var(--pr-danger)" }}>
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
      style={{ background: "var(--pr-teal-soft)", border: "1.5px solid var(--pr-teal-border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal)" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--pr-teal)" }}>Desafio de Hoje</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Resolva três questões escolhidas por nós para manter o cérebro ativo
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--pr-teal)" }}>
              {answered}/{questions.length} respondidas · Toque para começar
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "var(--pr-teal)" }} />
      </div>
      <div className="flex gap-1.5 mt-3">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: answers[questions[i].id] ? "var(--pr-teal)" : "var(--border)" }} />
        ))}
      </div>
    </button>
  );
}

// ─── StudyCard ("Vamos estudar?") ─────────────────────────────────────────────
function StudyCard() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.getDaily.useQuery(
    undefined, { staleTime: 0, refetchOnWindowFocus: true }
  );

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--pr-info)" }} />
    </div>
  );

  const content = data?.content;

  if (!content) return (
    <div className="rounded-2xl p-4 opacity-60" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--pr-info-bg)" }}>
          <BookOpen className="h-5 w-5" style={{ color: "var(--pr-info)" }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Vamos estudar?</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Nenhum conteúdo disponível ainda</p>
        </div>
      </div>
    </div>
  );

  return (
    <button onClick={() => navigate("/revise")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
      style={{ background: "var(--pr-info-bg)", border: "1.5px solid var(--pr-info-border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--pr-info)" }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--pr-info)" }}>Vamos Estudar?</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Selecionamos um tópico para revisar e manter os conteúdos sempre em dia
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--pr-info)" }}>
              {content.topico ?? content.titulo}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "var(--pr-info)" }} />
      </div>
    </button>
  );
}

// ─── Card com abas Semanal / Geral ────────────────────────────────────────────
function StatsCard({ stats, navigate }: { stats: any; navigate: (to: string) => void }) {
  const [tab, setTab] = useState<"semanal" | "geral">("semanal");

  const isSemanal = tab === "semanal";
  const accuracy  = isSemanal ? stats.weeklyAccuracy   : stats.totalAccuracy;
  const questions = isSemanal ? stats.weeklyQuestions  : stats.totalQuestions;
  const label     = isSemanal ? "esta semana"          : "no total";
  const msg       = accuracy >= 70 ? "Excelente!" : accuracy >= 40 ? "Bom trabalho!" : "Continue praticando!";

  return (
    <div className="space-y-3">
      {/* Header com abas */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "var(--muted)" }}>
          {(["semanal", "geral"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1 rounded-md text-xs font-bold transition-all"
              style={tab === t
                ? { background: "var(--card)", color: "var(--pr-teal)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                : { color: "var(--muted-foreground)" }}>
              {t === "semanal" ? "Semanal" : "Geral"}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/ranking")}
          className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--pr-teal)" }}>
          <Medal className="h-3.5 w-3.5" /> Ranking
        </button>
      </div>

      {/* Itens */}
      <div className="space-y-2">
        {[
          { icon: Zap,       label: "Questões respondidas", value: String(questions) },
          { icon: Star,      label: "Simulados completos",  value: String(stats.totalSimulations ?? 0) },
        ].map(({ icon: Icon, label: lbl, value }) => (
          <div key={lbl} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal-soft)" }}>
              <Icon className="h-3.5 w-3.5" style={{ color: "var(--pr-teal)" }} />
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{lbl}</p>
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                {value}
                <span className="text-xs font-normal ml-1" style={{ color: "var(--muted-foreground)" }}>{label}</span>
              </p>
            </div>
          </div>
        ))}

        {/* Taxa de acerto */}
        <div className="flex items-center gap-3 pt-1">
          <CircularAccuracy value={accuracy} />
          <div className="flex-1">
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Taxa de acerto <span className="font-semibold">{label}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gráfico circular de taxa de acerto ───────────────────────────────────────
function CircularAccuracy({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 70 ? "var(--pr-teal)" : clamped >= 40 ? "var(--pr-warn)" : "var(--pr-danger)";

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="7" />
      <circle
        cx="40" cy="40" r={radius} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="40" y="44" textAnchor="middle" fontSize="13" fontWeight="700"
        fill={color}>
        {clamped}%
      </text>
    </svg>
  );
}

// ─── MissaoCumprida ───────────────────────────────────────────────────────────
function MissaoCumprida() {
  const { data: daily } = trpc.simulations.getDailyChallenge.useQuery(undefined, { staleTime: 0 });
  if (!daily?.completed) return null;
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.2)" }}>
        <PartyPopper className="h-6 w-6 text-white" />
      </div>
      <div className="text-white">
        <p className="font-black text-base">Desafio de hoje: Concluído ✅</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
          Continue praticando — você está à frente de muitos!
        </p>
      </div>
    </div>
  );
}

// ─── Radar de Tópicos ─────────────────────────────────────────────────────────
// Abreviações de conteúdos para o gráfico radar (fora do componente — função pura)
function shortLabel(s: string): string {
  const map: Record<string, string> = {
    "Probabilidade e Estatística": "Prob. e Estatística",
    "Geometria Analítica": "Geo. Analítica",
    "Matemática Básica": "Mat. Básica",
    "Geometria Espacial": "Geo. Espacial",
    "Geometria Plana": "Geo. Plana",
    "Trigonometria": "Trigonometria",
    "Funções": "Funções",
    "Álgebra": "Álgebra",
  };
  return map[s] ?? s;
}

// Tick customizado para PolarAngleAxis — quebra labels longos em múltiplas linhas
function WrapTick({ x, y, payload, textAnchor }: any) {
  const text: string = payload?.value ?? "";
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (current && candidate.length > 13) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  const lineH = 12;
  const offsetY = -((lines.length - 1) * lineH) / 2;

  return (
    <text x={x} y={y} textAnchor={textAnchor} fill="var(--muted-foreground)" fontSize={10} fontWeight={500}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? offsetY : lineH}>{line}</tspan>
      ))}
    </text>
  );
}

// ─── Toggle Radar de Áreas ⇄ Radar de Performance ───────────────────────────
function RadarTabs() {
  const [tab, setTab] = useState<"area" | "performance">("area");
  return (
    <div className="space-y-2">
      {/* Alternador estilo segmented control */}
      <div className="rounded-xl p-1 flex gap-1"
        style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}>
        {[
          { key: "area",        label: "Por Área" },
          { key: "performance", label: "Performance" },
        ].map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "area" | "performance")}
              className="flex-1 py-1.5 rounded-lg font-bold text-xs transition-all"
              style={{
                background: active ? "var(--pr-teal)" : "transparent",
                color: active ? "#fff" : "var(--muted-foreground)",
                boxShadow: active ? "0 1px 4px rgba(0,150,136,0.35)" : "none",
              }}>
              {t.label}
            </button>
          );
        })}
      </div>
      {tab === "area" ? <RadarTopicos /> : <RadarPerformance />}
    </div>
  );
}

// ─── Radar de Performance ─────────────────────────────────────────────────────
// 5 eixos: Velocidade, Questões, Estudos, Fixação, Dedicação — cada um 0–100%.
// Diferente do radar por área (que mede acerto), este mede hábito/volume.
function RadarPerformance() {
  const { data: rawData, isLoading, dataUpdatedAt } = trpc.simulations.getPerformanceStats.useQuery(undefined, {
    staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true, refetchInterval: 60_000,
  });

  // Incorpora estatísticas das trilhas (localStorage) nos eixos Dedicação e
  // Questões — servidor ainda não conhece as trilhas, então fazemos no cliente.
  const data = useMemo(() => {
    if (!rawData) return rawData;
    const t = getTrilhaStats();
    const extraHoras = t.totalTimeSec / 3600;
    const extraQuestoes = t.totalExercises;
    if (extraHoras === 0 && extraQuestoes === 0) return rawData;
    return rawData.map((d) => {
      if (d.eixo === "Dedicação") {
        const baseRaw = Number(d.raw ?? 0);
        const newRaw = baseRaw + extraHoras;
        const newPct = Math.min(100, Math.round((newRaw / d.meta) * 100));
        return { ...d, pct: newPct, raw: Math.round(newRaw * 10) / 10 };
      }
      if (d.eixo === "Questões") {
        const baseRaw = Number(d.raw ?? 0);
        const newRaw = baseRaw + extraQuestoes;
        const newPct = Math.min(100, Math.round((newRaw / d.meta) * 100));
        return { ...d, pct: newPct, raw: newRaw };
      }
      return d;
    });
  }, [rawData, dataUpdatedAt]);

  const [animated, setAnimated] = useState<{ eixo: string; pct: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!data) return;
    const target = data.map(d => ({ eixo: d.eixo, pct: d.pct }));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const DURATION = 1100;
    const startTs = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTs) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(target.map(d => ({ ...d, pct: Math.round(d.pct * eased) })));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    setAnimated(target.map(d => ({ ...d, pct: 0 })));
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dataUpdatedAt]);

  if (isLoading || !data) {
    return (
      <div className="rounded-2xl p-4 flex justify-center items-center"
        style={{ height: 200, background: "var(--card)", border: "1.5px solid var(--border)" }}>
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--pr-teal)" }} />
      </div>
    );
  }

  const chartData = animated.length ? animated : data.map(d => ({ eixo: d.eixo, pct: d.pct }));

  type PerfAxis = { eixo: string; pct: number; raw: number | null; meta: number; unidade: string };

  // Formata o valor "raw" para tooltip/legenda humana
  function formatRaw(d: PerfAxis): string {
    if (d.eixo === "Velocidade") {
      if (d.raw == null) return "sem questões cronometradas";
      const min = Math.floor((d.raw as number) / 60);
      const sec = (d.raw as number) % 60;
      return `${min}min${sec > 0 ? ` ${sec}s` : ""}/questão`;
    }
    if (d.eixo === "Dedicação") return `${d.raw}h de ${d.meta}h`;
    return `${d.raw} de ${d.meta} ${d.unidade}`;
  }

  const best = [...data].sort((a, b) => b.pct - a.pct)[0];
  const weak = [...data].sort((a, b) => a.pct - b.pct)[0];

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Performance</p>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal-dark)" }}>5 eixos</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="eixo"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]}
            tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
            tickCount={4} axisLine={false} />
          <Radar dataKey="pct" stroke="var(--pr-teal)" fill="var(--pr-teal)" fillOpacity={0.35}
            strokeWidth={2} dot={{ r: 3, fill: "var(--pr-teal)" }} />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            formatter={(v: number, _name: string, props: any) => {
              const eixo = props?.payload?.eixo;
              const match = data.find(d => d.eixo === eixo);
              return [`${v}%${match ? ` (${formatRaw(match)})` : ""}`, eixo];
            }} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legenda com os valores brutos de cada eixo */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {data.map((d) => (
          <div key={d.eixo} className="rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2"
            style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
            <span className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{d.eixo}</span>
            <span className="text-xs font-black flex-shrink-0"
              style={{ color: d.pct >= 70 ? "var(--pr-success)" : d.pct >= 40 ? "var(--pr-warn)" : "var(--pr-danger)" }}>{d.pct}%</span>
          </div>
        ))}
      </div>

      {/* Destaques */}
      {(best.pct > 0 || weak.pct < 100) && (
        <div className="space-y-2 pt-1">
          {best.pct > 0 && (
            <div className="rounded-xl px-3 py-2 flex items-center gap-3"
              style={{ background: "var(--pr-success-bg)", border: "1px solid var(--pr-success-border)" }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: "var(--pr-success)" }}>Destaque</p>
                <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "var(--pr-success)" }}>
                  {best.eixo} — {formatRaw(best)}
                </p>
              </div>
              <span className="text-sm font-black flex-shrink-0" style={{ color: "var(--pr-success)" }}>{best.pct}%</span>
            </div>
          )}
          {weak.pct < 70 && (
            <div className="rounded-xl px-3 py-2"
              style={{ background: "var(--pr-danger-bg)", border: "1px solid var(--pr-danger-border)" }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--pr-danger)" }}>A melhorar</p>
              <p className="text-sm font-bold truncate" style={{ color: "var(--pr-danger)" }}>
                {weak.eixo} — {formatRaw(weak)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RadarTopicos() {
  // ── Todos os hooks ANTES de qualquer return condicional ──────────────
  const [, navigate] = useLocation();
  const { data, isLoading, dataUpdatedAt } = trpc.simulations.getTopicStats.useQuery(undefined, { staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true, refetchInterval: 60_000 });
  const [showInfo, setShowInfo] = useState(false);
  const [animatedData, setAnimatedData] = useState<{ area: string; pct: number; total: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  // Radar precisa de 3+ eixos E pelo menos 2 com pct > 0 — caso contrário
  // colapsa no centro e vira visualmente um "espeto" (uma reta do centro a
  // um único ponto com valor), o que é o que o usuário reportou.
  // Com 2 nonzero o polígono ainda é um triângulo fino, mas legível.
  const nonZeroCount = (data ?? []).filter((d) => d.pct > 0).length;
  const canRenderRadar = Boolean(data && data.length >= 3 && nonZeroCount >= 2);

  // Animação manual: interpola de 0 até os valores reais com ease-out cúbico
  useEffect(() => {
    if (!data || !canRenderRadar) return;
    const target = data.map(d => ({ area: shortLabel(d.conteudo), pct: d.pct, total: d.total }));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const DURATION = 1100;
    const startTs = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTs) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedData(target.map(d => ({ ...d, pct: Math.round(d.pct * eased) })));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    setAnimatedData(target.map(d => ({ ...d, pct: 0 })));
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dataUpdatedAt]); // dispara sempre que chega nova resposta do servidor

  // ── Returns condicionais SÓ depois de todos os hooks ────────────────
  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center items-center" style={{ height: 200, background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--pr-teal)" }} />
    </div>
  );

  if (!canRenderRadar) {
    // Sem dados suficientes para um radar legível (precisa de 3+ tópicos com
    // pelo menos 3 deles com pct > 0). Mostra lista ranqueada — mais útil do
    // que um gráfico degenerado em forma de reta.
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) => b.pct - a.pct);
    const faltamAreas = Math.max(0, 3 - data.length);
    const faltamAcertos = Math.max(0, 2 - nonZeroCount);
    const msg =
      faltamAreas > 0
        ? `Responda questões de pelo menos 3 áreas diferentes para liberar o gráfico radar.`
        : faltamAcertos > 0
        ? `Acerte ao menos uma questão em mais ${faltamAcertos} ${faltamAcertos === 1 ? "área" : "áreas"} para liberar o gráfico radar.`
        : "Responda mais questões para ver seu desempenho no gráfico radar.";
    return (
      <div className="rounded-2xl p-4 space-y-2" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
        <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Desempenho por Área</p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{msg}</p>
        <div className="space-y-1 pt-1">
          {sorted.map((d) => (
            <div key={d.conteudo} className="flex items-center gap-2">
              <span className="text-xs font-semibold flex-1 min-w-0 truncate" style={{ color: "var(--foreground)" }}>
                {shortLabel(d.conteudo)}
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {d.correct}/{d.total}
              </span>
              <span className="text-xs font-black w-10 text-right" style={{ color: d.pct >= 70 ? "var(--pr-success)" : d.pct >= 40 ? "var(--pr-warn)" : "var(--pr-danger)" }}>
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = animatedData.length ? animatedData : data.map(d => ({ area: shortLabel(d.conteudo), pct: d.pct, total: d.total }));

  const best = [...data].sort((a, b) => b.pct - a.pct)[0];

  // Lista de áreas fracas: prioriza as com pct < 70% (até 5); se não houver nenhuma
  // abaixo disso, mostra as 3 piores de qualquer jeito, para sempre haver orientação.
  const belowThreshold = [...data].filter(d => d.pct < 70).sort((a, b) => a.pct - b.pct);
  const weakList = belowThreshold.length > 0
    ? belowThreshold.slice(0, 5)
    : [...data].sort((a, b) => a.pct - b.pct).slice(0, 3);

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Desempenho por Área</p>
          <div className="relative">
            <button
              onClick={() => setShowInfo(v => !v)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 17, height: 17, background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 10, fontWeight: 700, border: "1px solid var(--border)", lineHeight: 1 }}
            >i</button>
            {showInfo && (
              <div
                className="absolute z-20 rounded-xl p-3 space-y-1.5 text-xs"
                style={{ top: 22, left: 0, width: 240, background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", color: "var(--foreground)" }}
              >
                <p className="font-semibold" style={{ color: "var(--foreground)" }}>Como ler este gráfico</p>
                <p style={{ color: "var(--muted-foreground)" }}>Cada ponta representa uma área da Matemática. Quanto mais o polígono se estende em direção à ponta, maior é o seu percentual de acerto naquele conteúdo.</p>
                <p style={{ color: "var(--muted-foreground)" }}>Um polígono grande e simétrico indica desempenho equilibrado. Pontas "afundadas" indicam onde concentrar os estudos.</p>
                <button onClick={() => setShowInfo(false)} className="text-xs font-semibold mt-1" style={{ color: "var(--pr-teal)" }}>Fechar</button>
              </div>
            )}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal-dark)" }}>
          {data.length} áreas
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="area"
            tick={<WrapTick />}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
            tickCount={4}
            axisLine={false}
          />
          <Radar
            dataKey="pct"
            stroke="var(--pr-teal)"
            fill="var(--pr-teal)"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--pr-teal)", strokeWidth: 0 }}
            isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            formatter={(v: number, _: string, props: any) => [`${v}% (${props.payload.total} questões)`, "Acerto"]}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Destaques */}
      <div className="space-y-2 pt-1">
        {/* Melhor área */}
        <div className="rounded-xl px-3 py-2 flex items-center gap-3" style={{ background: "var(--pr-success-bg)", border: "1px solid var(--pr-success-border)" }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: "var(--pr-success)" }}>Melhor área</p>
            <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "var(--pr-success)" }}>{shortLabel(best.conteudo)}</p>
          </div>
          <span className="text-sm font-black flex-shrink-0" style={{ color: "var(--pr-success)" }}>{best.pct}%</span>
        </div>

        {/* Pontos a melhorar — lista das áreas mais fracas */}
        <div className="rounded-xl px-3 py-2" style={{ background: "var(--pr-danger-bg)", border: "1px solid var(--pr-danger-border)" }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--pr-danger)" }}>
            {belowThreshold.length > 0 ? "Pontos a melhorar" : "Áreas com menor acerto"}
          </p>
          {weakList.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--pr-danger)" }}>Sem dados suficientes.</p>
          ) : (
            <div className="space-y-1.5">
              {weakList.map((w) => {
                const trilha = getTrilhaByArea(w.conteudo);
                const label = shortLabel(w.conteudo);
                return (
                  <div
                    key={w.conteudo}
                    className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold flex-1 min-w-0 truncate" style={{ color: "var(--pr-danger)" }}>
                      {label}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--pr-danger)", opacity: 0.7 }}>
                      {w.correct}/{w.total}
                    </span>
                    <span className="text-xs font-black flex-shrink-0 w-10 text-right" style={{ color: "var(--pr-danger)" }}>
                      {w.pct}%
                    </span>
                    {trilha && (
                      <button
                        onClick={() => navigate(`/trilha/${trilha.slug}`)}
                        title={`Abrir trilha: ${trilha.titulo}`}
                        className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-transform hover:scale-105"
                        style={{
                          backgroundColor: "#009688",
                          backgroundImage: "linear-gradient(135deg, #009688 0%, #00695C 100%)",
                          color: "#ffffff",
                          border: "none",
                          boxShadow: "0 2px 6px rgba(0,150,136,0.35)",
                        }}>
                        <Sparkles className="h-3 w-3" /> Trilha
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {/* Dica quando há trilha */}
          {weakList.some((w) => getTrilhaByArea(w.conteudo)) && (
            <p className="text-xs mt-2 pt-2 border-t flex items-center gap-1"
              style={{ color: "var(--pr-danger)", opacity: 0.8, borderColor: "var(--pr-danger-border)" }}>
              <Sparkles className="h-3 w-3" /> Clique em <strong>Trilha</strong> para treinar essa área guiado passo a passo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Card da Agenda na Dashboard ─────────────────────────────────────────────

// Paletas de dia da semana — usam tokens semânticos quando disponíveis,
// para responder a light/dark automaticamente. Quando não há token equivalente
// (roxo/laranja/rosa), usamos color-mix contra o background/foreground atual
// para manter contraste em ambos os temas.
const DAY_COLORS: Record<number, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  1: { bg: "var(--pr-info-bg)",    border: "var(--pr-info-border)",    text: "var(--pr-info)",    badge: "var(--pr-info-bg)",    badgeText: "var(--pr-info)" },
  2: { bg: "var(--pr-success-bg)", border: "var(--pr-success-border)", text: "var(--pr-success)", badge: "var(--pr-success-bg)", badgeText: "var(--pr-success)" },
  3: { bg: "color-mix(in srgb, var(--pr-teal) 12%, var(--card))", border: "color-mix(in srgb, var(--pr-teal) 30%, var(--card))", text: "var(--pr-teal)", badge: "color-mix(in srgb, var(--pr-teal) 12%, var(--card))", badgeText: "var(--pr-teal)" },
  4: { bg: "var(--pr-warn-bg)",    border: "var(--pr-warn-border)",    text: "var(--pr-warn)",    badge: "var(--pr-warn-bg)",    badgeText: "var(--pr-warn)" },
  5: { bg: "var(--pr-success-bg)", border: "var(--pr-success-border)", text: "var(--pr-success)", badge: "var(--pr-success-bg)", badgeText: "var(--pr-success)" },
  6: { bg: "var(--pr-danger-bg)",  border: "var(--pr-danger-border)",  text: "var(--pr-danger)",  badge: "var(--pr-danger-bg)",  badgeText: "var(--pr-danger)" },
};

const DAYS_SHORT: Record<number, string> = { 1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb" };

function parseTopics(raw: string): string[] {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [raw];
  } catch { return raw ? [raw] : []; }
}

function AgendaCard({ navigate }: { navigate: (to: string) => void }) {
  const { data: slots = [], isLoading } = trpc.agenda.getMySchedule.useQuery(undefined, { staleTime: 60_000 });

  const todayDow = new Date().getDay(); // 0=Dom … 6=Sáb
  const todayIdx = todayDow >= 1 && todayDow <= 6 ? todayDow : null;

  const todaySlots = todayIdx ? slots.filter((s) => s.dayOfWeek === todayIdx) : [];
  const hasAnySlot = slots.length > 0;
  const colors     = todayIdx ? DAY_COLORS[todayIdx] : DAY_COLORS[1];

  // Agrupa slots por dia para a visão semanal (apenas dias com sessão)
  const byDay = [1,2,3,4,5,6].map((d) => ({
    day: d,
    slots: slots.filter((s) => s.dayOfWeek === d),
  })).filter((d) => d.slots.length > 0);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, var(--pr-teal-dark), var(--pr-teal-darker))" }}>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white opacity-80" />
          <p className="font-bold text-sm text-white">Planner de Estudos</p>
        </div>
        <button onClick={() => navigate("/agenda")}
          className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
          Ver tudo →
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : !hasAnySlot ? (
        /* Sem sessões cadastradas */
        <div className="px-5 py-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Você ainda não montou seu cronograma.</p>
          <button onClick={() => navigate("/agenda")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
            style={{ background: "var(--pr-teal-dark)" }}>
            <CalendarDays className="h-4 w-4" /> Criar meu planner
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">

          {/* Hoje */}
          {todayIdx && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.text }}>
                Hoje — {DAYS_SHORT[todayIdx]}-feira
              </p>
              {todaySlots.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma sessão agendada para hoje.</p>
              ) : (
                <div className="space-y-2">
                  {todaySlots.map((slot) => {
                    const topics = parseTopics(slot.topic);
                    return (
                      <div key={slot.id} className="rounded-xl px-3 py-2.5 space-y-1.5"
                        style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 flex-shrink-0" style={{ color: colors.text }} />
                          <span className="text-xs font-bold" style={{ color: colors.text }}>
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topics.map((t) => (
                            <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: colors.badge, color: colors.badgeText }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        {/* Botões Praticar */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {topics.map((t) => (
                            <button key={t}
                              onClick={() => navigate(`/questoes?topic=${encodeURIComponent(t)}`)}
                              className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg text-white"
                              style={{ background: colors.text }}>
                              <Dumbbell className="h-3 w-3" />
                              Praticar
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Semana resumida */}
          {byDay.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                Esta semana
              </p>
              <div className="space-y-1.5">
                {byDay.map(({ day, slots: ds }) => {
                  const c = DAY_COLORS[day];
                  const isToday = day === todayIdx;
                  const allTopics = ds.flatMap((s) => parseTopics(s.topic));
                  const unique = [...new Set(allTopics)];
                  return (
                    <div key={day} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: isToday ? c.bg : "var(--muted)",
                        border: isToday ? `1.5px solid ${c.border}` : "1px solid var(--border)",
                      }}>
                      <span className="text-xs font-bold w-7 flex-shrink-0"
                        style={{ color: isToday ? c.text : "var(--muted-foreground)" }}>
                        {DAYS_SHORT[day]}
                      </span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {unique.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: c.badge, color: c.badgeText }}>
                            {t}
                          </span>
                        ))}
                        {unique.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium text-muted-foreground"
                            style={{ background: "var(--muted)" }}>
                            +{unique.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const vestibularSelecionado = "ENEM";

  const { data: session } = trpc.auth.me.useQuery(undefined, { staleTime: 30_000 });
  const { data: stats } = trpc.simulations.getStats.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true });
  const { data: active } = trpc.simulations.getActive.useQuery(undefined, { staleTime: 0, refetchOnWindowFocus: true });
  const { data: qData } = trpc.questions.list.useQuery({ page: 1, pageSize: 1, activeOnly: true, orderBy: "id", orderDir: "desc" });
  const totalQuestions = qData?.pagination.total ?? 0;

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

        {/* Vestibulares — visual apenas */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {VESTIBULARES.map(v => (
            <div key={v.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{
                padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: "rgba(255,255,255,0.15)", color: "#fff",
                opacity: v.comingSoon ? 0.5 : 1,
              }}>
                {v.label}
              </span>
              {v.comingSoon
                ? <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.05em" }}>Em breve!</span>
                : <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{v.sub}</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Desempenho Semanal + Geral + Diário de Questões ── */}
      {stats && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>

            {/* Abas Semanal / Geral */}
            <StatsCard stats={stats} navigate={navigate} />
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <p className="font-bold text-sm mb-3" style={{ color: "var(--foreground)" }}>Diário de Questões</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={stats.dailyData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [v, "Questões"]} />
                <Bar dataKey="questoes" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {stats.dailyData.map((entry, i) => (
                    <Cell key={i} fill={entry.questoes > 0 ? "var(--pr-teal)" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Radares (Por Área ⇄ Performance) ── */}
      <RadarTabs />

      {/* ── Agenda de estudos ── */}
      <AgendaCard navigate={navigate} />

      {/* ── Missão cumprida ── */}
      <MissaoCumprida />

      {/* ── Missão do dia ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>Missão do dia</p>
        <DailyCard />
        <StudyCard />
      </section>

      {/* ── Treine agora ── */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--muted-foreground)" }}>Treine agora</p>

        <button onClick={() => navigate("/treino")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal-soft)" }}>
                <Dumbbell className="h-5 w-5" style={{ color: "var(--pr-teal)" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Treino Livre</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Selecione a quantidade de questões e o tempo para aumentar a sua performance na resolução de questões
                </p>
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
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal-soft)" }}>
                <BarChart2 className="h-5 w-5" style={{ color: "var(--pr-teal)" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Banco de Questões</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Navegue à vontade, sem pressão, analisando enunciados e resoluções das questões
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
          </div>
        </button>

        <button onClick={() => navigate("/formulas")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pr-teal-soft)" }}>
                <FlaskConical className="h-5 w-5" style={{ color: "var(--pr-teal)" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Fórmulas</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  As fórmulas mais importantes de Matemática e Física a um clique de distância
                </p>
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
          onClick={() => navigate(active ? "/simulado" : `/simulado/${vestibularSelecionado.toLowerCase()}`)}
          className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #263238, #009688)", border: "none" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Swords className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-white">Valendo! ⚡</p>
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, padding: "1px 8px", borderRadius: 20, fontWeight: 600 }}>
                    {vestibularSelecionado === "ENEM" ? "TRI" : "Acertos"}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                  {active ? "Simulado em andamento — continuar" : "Simule o ENEM com 45 questões de Matemática e correção com TRI"}
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
