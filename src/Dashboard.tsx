import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame, Trophy, CheckCircle2, XCircle, ChevronRight,
  Loader2, Zap, Medal, BookOpen, Dumbbell,
  Clock, Swords, Star, PartyPopper, BarChart2, FlaskConical, Brain, TrendingUp,
  CalendarDays, Sparkles
} from "@/icons";
import { NextStepCard, StatNumber } from "@/components/ds";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { getTrilhaByArea } from "@/trilhas";
import { getTrilhaStats } from "@/trilhas/stats";
import LevelBadge, { type DiagnosisLevel } from "@/LevelBadge";


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
      <div className="rounded-2xl p-4" style={{ background: "#E0F2F1", border: "2px solid #009688" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#00695C" }}>Desafio do dia — concluído!</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{correct}/{questions.length} acertos</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {questions.map((q, i) => {
              const ok = answers[q.id] === q.gabarito;
              return (
                <div key={i} className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ background: ok ? "#009688" : "#EF4444" }}>
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
      style={{ background: "#E0F2F1", border: "2px solid #009688" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#009688" }}>
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#00695C" }}>Desafio de Hoje</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Resolva três questões escolhidas por nós para manter o cérebro ativo
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "#00695C" }}>
              {answered}/{questions.length} respondidas · Toque para começar
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#00695C" }} />
      </div>
      <div className="flex gap-1.5 mt-3">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full"
            style={{ background: answers[questions[i].id] ? "#009688" : "rgba(128,128,128,0.25)" }} />
        ))}
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
                ? { background: "var(--card)", color: "#009688", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                : { color: "var(--muted-foreground)" }}>
              {t === "semanal" ? "Semanal" : "Geral"}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/ranking")}
          className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#009688" }}>
          <Medal className="h-3.5 w-3.5" /> Ranking
        </button>
      </div>

      {/* Itens */}
      <div className="space-y-2">
        {/* Questões respondidas */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
            <Zap className="h-3.5 w-3.5" style={{ color: "#009688" }} />
          </div>
          <StatNumber
            value={questions}
            label={`questões respondidas ${label}`}
            color="#009688"
          />
        </div>
        {/* Simulados completos */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
            <Star className="h-3.5 w-3.5" style={{ color: "#009688" }} />
          </div>
          <StatNumber
            value={stats.totalSimulations ?? 0}
            label="simulados completos"
            color="#009688"
          />
        </div>

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
  // Hex direto: CSS var() em atributos SVG stroke/fill não resolve de forma confiável em todos os navegadores.
  const color = clamped >= 70 ? "#009688" : clamped >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(128,128,128,0.25)" strokeWidth="7" />
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
              className="flex-1 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                background: active ? "#009688" : "transparent",
                color: active ? "#fff" : "var(--muted-foreground)",
                boxShadow: active ? "0 1px 4px rgba(0,150,136,0.35)" : "none",
                minHeight: "44px",
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
    const extraHoras     = t.totalTimeSec / 3600;
    const extraQuestoes  = t.totalExercises;
    const extraLeituras  = t.totalLeituras;
    // Cada lição concluída na trilha equivale a +0,5h de dedicação
    // (complementa o tempo real já somado via totalTimeSec).
    const licoesBonusHoras = t.lessonsCompleted * 0.5;
    if (extraHoras === 0 && extraQuestoes === 0 && extraLeituras === 0 && licoesBonusHoras === 0) return rawData;
    return rawData.map((d) => {
      if (d.eixo === "Dedicação") {
        const baseRaw = Number(d.raw ?? 0);
        const newRaw = baseRaw + extraHoras + licoesBonusHoras;
        const newPct = Math.min(100, Math.round((newRaw / d.meta) * 100));
        return { ...d, pct: newPct, raw: Math.round(newRaw * 10) / 10 };
      }
      if (d.eixo === "Resoluções") {
        const baseRaw = Number(d.raw ?? 0);
        const newRaw = baseRaw + extraQuestoes;
        const newPct = Math.min(100, Math.round((newRaw / d.meta) * 100));
        return { ...d, pct: newPct, raw: newRaw };
      }
      if (d.eixo === "Estudos" && extraLeituras > 0) {
        const baseRaw = Number(d.raw ?? 0);
        const newRaw = baseRaw + extraLeituras;
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
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#009688" }} />
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
          style={{ background: "#E0F2F1", color: "#00695C" }}>5 eixos</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="rgba(128,128,128,0.3)" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="eixo"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]}
            tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
            tickCount={4} axisLine={false} />
          <Radar dataKey="pct" stroke="#009688" fill="#009688" fillOpacity={0.35}
            strokeWidth={2} dot={{ r: 3, fill: "#009688" }} />
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
              style={{ color: d.pct >= 70 ? "#16A34A" : d.pct >= 40 ? "#B45309" : "#DC2626" }}>{d.pct}%</span>
          </div>
        ))}
      </div>

      {/* Destaques */}
      {(best.pct > 0 || weak.pct < 100) && (
        <div className="space-y-2 pt-1">
          {best.pct > 0 && (
            <div className="rounded-xl px-3 py-2 flex items-center gap-3"
              style={{ background: "#F0FDF4", border: "1px solid #A7F3D0" }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: "#16A34A" }}>Destaque</p>
                <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "#16A34A" }}>
                  {best.eixo} — {formatRaw(best)}
                </p>
              </div>
              <span className="text-sm font-black flex-shrink-0" style={{ color: "#16A34A" }}>{best.pct}%</span>
            </div>
          )}
          {weak.pct < 70 && (
            <div className="rounded-xl px-3 py-2"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#DC2626" }}>A melhorar</p>
              <p className="text-sm font-bold truncate" style={{ color: "#DC2626" }}>
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
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#009688" }} />
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
              <span className="text-xs font-black w-10 text-right" style={{ color: d.pct >= 70 ? "#16A34A" : d.pct >= 40 ? "#B45309" : "#DC2626" }}>
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
                <button onClick={() => setShowInfo(false)} className="text-xs font-semibold mt-1" style={{ color: "#009688" }}>Fechar</button>
              </div>
            )}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E0F2F1", color: "#00695C" }}>
          {data.length} áreas
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="rgba(128,128,128,0.3)" strokeDasharray="3 3" />
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
            stroke="#009688"
            fill="#009688"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: "#009688", strokeWidth: 0 }}
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
        <div className="rounded-xl px-3 py-2 flex items-center gap-3" style={{ background: "rgba(0,105,92,0.15)", border: "1.5px solid #A7F3D0" }}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: "#16A34A" }}>Melhor área</p>
            <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "#16A34A" }}>{shortLabel(best.conteudo)}</p>
          </div>
          <span className="text-sm font-black flex-shrink-0" style={{ color: "#16A34A" }}>{best.pct}%</span>
        </div>

        {/* Pontos a melhorar — lista das áreas mais fracas */}
        <div className="rounded-xl px-3 py-2" style={{ background: "rgba(185,28,28,0.12)", border: "1.5px solid #FECACA" }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#DC2626" }}>
            {belowThreshold.length > 0 ? "Pontos a melhorar" : "Áreas com menor acerto"}
          </p>
          {weakList.length === 0 ? (
            <p className="text-xs" style={{ color: "#DC2626" }}>Sem dados suficientes.</p>
          ) : (
            <div className="space-y-1.5">
              {weakList.map((w) => {
                const trilha = getTrilhaByArea(w.conteudo);
                const label = shortLabel(w.conteudo);
                return (
                  <div
                    key={w.conteudo}
                    className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold flex-1 min-w-0 truncate" style={{ color: "#DC2626" }}>
                      {label}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: "#DC2626", opacity: 0.7 }}>
                      {w.correct}/{w.total}
                    </span>
                    <span className="text-xs font-black flex-shrink-0 w-10 text-right" style={{ color: "#DC2626" }}>
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
            <p className="text-xs mt-2 pt-2 border-t leading-relaxed"
              style={{ color: "#DC2626", opacity: 0.8, borderColor: "#FECACA" }}>
              <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
              Clique em <strong>Trilha</strong> para treinar essa área guiado passo a passo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mini-Calendário ─────────────────────────────────────────────────────────

const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DOW_FULL    = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
const DOW_SHORT   = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];

const CAL_COLORS: Record<number, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  0: { bg: "#F5F0FF", border: "#DDD6FE", text: "#6D28D9", badge: "#EDE9FE", badgeText: "#6D28D9" },
  1: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", badge: "#DBEAFE", badgeText: "#1D4ED8" },
  2: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", badge: "#DCFCE7", badgeText: "#15803D" },
  3: { bg: "#F5F3FF", border: "#DDD6FE", text: "#7C3AED", badge: "#EDE9FE", badgeText: "#7C3AED" },
  4: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", badge: "#FEF3C7", badgeText: "#B45309" },
  5: { bg: "#E0F2F1", border: "#B2DFDB", text: "#00695C", badge: "#CCFBF1", badgeText: "#00695C" },
  6: { bg: "#FFF1F2", border: "#FECDD3", text: "#B91C1C", badge: "#FFE4E6", badgeText: "#B91C1C" },
};

function parseTops(raw: string): string[] {
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [raw]; } catch { return raw ? [raw] : []; }
}

function calDots(act: { correct: number; wrong: number } | undefined, isSched: boolean) {
  const dots: string[] = [];
  if (act) {
    const g = act.correct > 0 ? (act.correct >= 10 ? 3 : act.correct >= 5 ? 2 : 1) : 0;
    for (let i = 0; i < g; i++) dots.push("#4CAF50");
    if (act.wrong > 0) dots.push("#EF4444");
  }
  if (isSched) dots.push("#42A5F5");
  return dots;
}

function DayDetail({ dateStr, act, slots, navigate, onClose }: {
  dateStr: string;
  act: { correct: number; wrong: number } | undefined;
  slots: any[];
  navigate: (to: string) => void;
  onClose: () => void;
}) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow  = new Date(y, m - 1, d).getDay();
  const cols = CAL_COLORS[dow];
  const daySlots = slots.filter((s) => s.dayOfWeek === dow);
  const allTopics = [...new Set(daySlots.flatMap((s) => parseTops(s.topic)))];
  const todayStr  = new Date().toISOString().slice(0, 10);
  const isToday   = dateStr === todayStr;

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "14px 14px 10px" }}>
      {/* Header do detalhe */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: "var(--foreground)", margin: 0 }}>
            {isToday ? "Hoje — " : ""}{DOW_FULL[dow]}, {d} de {MONTH_NAMES[m - 1]}
          </p>
        </div>
        <button onClick={onClose}
          style={{ background: "var(--muted)", border: "none", borderRadius: 8, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-foreground)", fontSize: 14 }}>
          ×
        </button>
      </div>

      {/* Atividade do dia */}
      {act ? (
        <div style={{ borderRadius: 10, padding: "10px 12px", marginBottom: 10, background: act.correct > 0 ? "#F0FDF4" : "#FFF1F2", border: `1px solid ${act.correct > 0 ? "#BBF7D0" : "#FECDD3"}` }}>
          <p style={{ fontWeight: 700, fontSize: 12, color: act.correct > 0 ? "#15803D" : "#B91C1C", margin: "0 0 2px" }}>
            {act.correct > 0 ? "✓ Estudou neste dia" : "✗ Sem acertos registrados"}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>
            {act.correct} acerto{act.correct !== 1 ? "s" : ""} · {act.wrong} erro{act.wrong !== 1 ? "s" : ""}
          </p>
        </div>
      ) : (
        <div style={{ borderRadius: 10, padding: "10px 12px", marginBottom: 10, background: "var(--muted)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>Sem atividade registrada neste dia.</p>
        </div>
      )}

      {/* Sessões agendadas */}
      {allTopics.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>
            Programação do dia
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {daySlots.map((slot) => {
              const topics = parseTops(slot.topic);
              return (
                <div key={slot.id} style={{ borderRadius: 10, padding: "8px 10px", background: cols.bg, border: `1px solid ${cols.border}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: cols.text, margin: "0 0 4px" }}>
                    {slot.startTime} – {slot.endTime}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {topics.map((t) => (
                      <button key={t} onClick={() => navigate(`/questoes?topic=${encodeURIComponent(t)}`)}
                        style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: cols.badge, color: cols.badgeText, border: "none", cursor: "pointer" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão Praticar hoje */}
      {isToday && allTopics.length > 0 && (
        <button onClick={() => navigate(`/questoes?topic=${encodeURIComponent(allTopics[0])}`)}
          style={{ marginTop: 10, width: "100%", padding: "9px 0", borderRadius: 10, background: "#009688", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          Praticar agora →
        </button>
      )}
    </div>
  );
}

function ExpandedAgenda({ activity, slots, navigate, onClose }: {
  activity: { date: string; correct: number; wrong: number }[];
  slots: any[];
  navigate: (to: string) => void;
  onClose: () => void;
}) {
  // Gera lista dos últimos 30 dias
  const days = useMemo(() => {
    const list: string[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      list.push(d.toISOString().slice(0, 10));
    }
    return list;
  }, []);

  const actMap = useMemo(() => {
    const m = new Map<string, { correct: number; wrong: number }>();
    for (const r of activity) m.set(r.date, { correct: r.correct, wrong: r.wrong });
    return m;
  }, [activity]);

  const scheduledDows = useMemo(() => new Set(slots.map((s: any) => s.dayOfWeek)), [slots]);

  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#1C2833", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "5px 10px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          ← Voltar
        </button>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>Agenda de Estudos</p>
        <button onClick={() => navigate("/agenda")}
          style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, padding: "5px 10px", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
          Editar →
        </button>
      </div>

      {/* Lista de dias */}
      <div style={{ maxHeight: 420, overflowY: "auto", overscrollBehavior: "contain" }}>
        {days.map((dateStr) => {
          const [y, m, d] = dateStr.split("-").map(Number);
          const dow  = new Date(y, m - 1, d).getDay();
          const act  = actMap.get(dateStr);
          const isSched = scheduledDows.has(dow);
          const dots = calDots(act, isSched);
          const cols = CAL_COLORS[dow];
          const daySlots = slots.filter((s: any) => s.dayOfWeek === dow);
          const allTopics = [...new Set(daySlots.flatMap((s: any) => parseTops(s.topic)))];
          const isToday = dateStr === new Date().toISOString().slice(0, 10);

          return (
            <div key={dateStr} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Data */}
                <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
                  <p style={{ fontSize: 18, fontWeight: isToday ? 800 : 600, color: isToday ? "#009688" : "var(--foreground)", margin: 0, lineHeight: 1 }}>{d}</p>
                  <p style={{ fontSize: 9, fontWeight: 600, color: "var(--muted-foreground)", margin: "2px 0 0", textTransform: "uppercase" }}>{DOW_SHORT[dow]}</p>
                </div>

                {/* Dots */}
                <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0 }}>
                  {dots.slice(0, 4).map((c, di) => (
                    <div key={di} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                  ))}
                  {dots.length > 4 && <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>+{dots.length - 4}</span>}
                  {dots.length === 0 && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--muted)" }} />}
                </div>

                {/* Resumo de atividade */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {act ? (
                    <p style={{ fontSize: 11, color: act.correct > 0 ? "#15803D" : "#B91C1C", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {act.correct}✓ {act.wrong}✗
                      {allTopics.length > 0 ? ` · ${allTopics.slice(0, 2).join(", ")}` : ""}
                    </p>
                  ) : isSched ? (
                    <p style={{ fontSize: 11, color: cols.text, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      📅 {allTopics.slice(0, 2).join(", ") || "Sessão agendada"}
                    </p>
                  ) : (
                    <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>Sem atividade</p>
                  )}
                </div>

                {/* Praticar se for hoje */}
                {isToday && allTopics.length > 0 && (
                  <button onClick={() => navigate(`/questoes?topic=${encodeURIComponent(allTopics[0])}`)}
                    style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 8, background: "#009688", color: "#fff", border: "none", cursor: "pointer" }}>
                    Praticar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé */}
      <div style={{ padding: "10px 14px" }}>
        <button onClick={() => navigate("/agenda")}
          style={{ width: "100%", padding: "10px 0", borderRadius: 12, background: "#263238", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          Gerenciar meu planner →
        </button>
      </div>
    </div>
  );
}

function MiniCalendarCard({ navigate }: { navigate: (to: string) => void }) {
  const today = new Date();
  const [viewDate, setViewDate]     = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded]     = useState(false);

  const { data: activity = [] } = trpc.simulations.getActivityCalendar.useQuery(undefined, { staleTime: 60_000 });
  const { data: slots = [] }    = trpc.agenda.getMySchedule.useQuery(undefined, { staleTime: 60_000 });

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow    = new Date(year, month, 1).getDay();

  const todayStr = today.toISOString().slice(0, 10);

  const scheduledDows = useMemo(() => new Set(slots.map((s) => s.dayOfWeek)), [slots]);
  const actMap = useMemo(() => {
    const m = new Map<string, { correct: number; wrong: number }>();
    for (const r of activity) m.set(r.date, { correct: r.correct, wrong: r.wrong });
    return m;
  }, [activity]);

  const prevMonth = useCallback(() => { setViewDate(new Date(year, month - 1, 1)); setSelected(null); }, [year, month]);
  const nextMonth = useCallback(() => { setViewDate(new Date(year, month + 1, 1)); setSelected(null); }, [year, month]);

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  if (expanded) {
    return <ExpandedAgenda activity={activity} slots={slots} navigate={navigate} onClose={() => setExpanded(false)} />;
  }

  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>

      {/* ── Header escuro ── */}
      <div style={{ background: "#1C2833", padding: "14px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <button onClick={prevMonth}
            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ‹
          </button>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>
              {MONTH_NAMES[month]} {year}
            </p>
            {month === today.getMonth() && year === today.getFullYear() && (
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, margin: "2px 0 0" }}>Hoje</p>
            )}
          </div>
          <button onClick={nextMonth}
            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ›
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: 8 }}>
          {DOW_SHORT.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* ── Grade de dias ── */}
      <div style={{ padding: "6px 10px 4px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} style={{ padding: "4px 0" }} />;

            const dateStr  = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday  = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const act      = actMap.get(dateStr);
            const isSched  = scheduledDows.has(new Date(year, month, day).getDay());
            const dots     = calDots(act, isSched);
            const visible  = dots.slice(0, 3);
            const overflow = dots.length - visible.length;

            return (
              <button key={i} onClick={() => setSelected(isSelected ? null : dateStr)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0", background: "transparent", border: "none", cursor: "pointer", borderRadius: 8, outline: isSelected ? "2px solid #009688" : "none" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isToday ? "#009688" : isSelected ? "#E0F2F1" : "transparent",
                  fontWeight: isToday || isSelected ? 700 : 400,
                  fontSize: 12,
                  color: isToday ? "#fff" : isSelected ? "#009688" : "var(--foreground)",
                }}>
                  {day}
                </div>
                <div style={{ display: "flex", gap: 2, minHeight: 7, marginTop: 2, alignItems: "center" }}>
                  {visible.map((c, di) => (
                    <div key={di} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
                  ))}
                  {overflow > 0 && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: "var(--muted-foreground)", lineHeight: 1 }}>+{overflow}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detalhe do dia selecionado ── */}
      {selectedDate && (
        <DayDetail
          dateStr={selectedDate}
          act={actMap.get(selectedDate)}
          slots={slots}
          navigate={navigate}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Botões ── */}
      <div style={{ padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/desafio")}
            style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "#263238", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
            + Registrar
          </button>
          <button onClick={() => navigate("/agenda")}
            style={{ flex: 1, padding: "10px 0", borderRadius: 12, background: "var(--muted)", color: "var(--foreground)", fontWeight: 600, fontSize: 13, border: "1.5px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <CalendarDays className="h-4 w-4" /> Agendar
          </button>
        </div>
        <button onClick={() => setExpanded(true)}
          style={{ width: "100%", padding: "9px 0", borderRadius: 12, background: "var(--muted)", color: "var(--muted-foreground)", fontWeight: 600, fontSize: 12, border: "1.5px solid var(--border)", cursor: "pointer" }}>
          ⤢ Abrir agenda expandida
        </button>
      </div>
    </div>
  );
}

// ─── Card da Agenda na Dashboard ─────────────────────────────────────────────

// Paletas de dia da semana — usam tokens semânticos quando disponíveis,
// para responder a light/dark automaticamente. Quando não há token equivalente
// (roxo/laranja/rosa), usamos color-mix contra o background/foreground atual
// para manter contraste em ambos os temas.
// Hex direto — color-mix()+var() não funciona em Safari mobile.
const DAY_COLORS: Record<number, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  0: { bg: "#F5F0FF", border: "#DDD6FE", text: "#6D28D9", badge: "#EDE9FE", badgeText: "#6D28D9" }, // violeta (domingo)
  1: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", badge: "#DBEAFE", badgeText: "#1D4ED8" }, // azul
  2: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", badge: "#DCFCE7", badgeText: "#15803D" }, // verde
  3: { bg: "#F5F3FF", border: "#DDD6FE", text: "#7C3AED", badge: "#EDE9FE", badgeText: "#7C3AED" }, // roxo
  4: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", badge: "#FEF3C7", badgeText: "#B45309" }, // âmbar
  5: { bg: "#E0F2F1", border: "#B2DFDB", text: "#00695C", badge: "#CCFBF1", badgeText: "#00695C" }, // teal
  6: { bg: "#FFF1F2", border: "#FECDD3", text: "#B91C1C", badge: "#FFE4E6", badgeText: "#B91C1C" }, // vermelho
};

const DAYS_FULL_NAME: Record<number, string> = {
  0: "Domingo", 1: "Segunda-feira", 2: "Terça-feira",
  3: "Quarta-feira", 4: "Quinta-feira", 5: "Sexta-feira", 6: "Sábado",
};
const DAYS_SHORT: Record<number, string> = { 0: "Dom", 1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb" };

function parseTopics(raw: string): string[] {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [raw];
  } catch { return raw ? [raw] : []; }
}

function AgendaCard({ navigate }: { navigate: (to: string) => void }) {
  const { data: slots = [], isLoading } = trpc.agenda.getMySchedule.useQuery(undefined, { staleTime: 60_000 });

  const todayDow = new Date().getDay(); // 0=Dom … 6=Sáb
  const todayIdx = todayDow; // 0–6, domingo incluído

  const todaySlots = slots.filter((s) => s.dayOfWeek === todayIdx);
  const hasAnySlot = slots.length > 0;
  const colors     = DAY_COLORS[todayIdx] ?? DAY_COLORS[1];

  // Agrupa slots por dia para a visão semanal (apenas dias com sessão)
  // Ordem: Seg→Sáb→Dom
  const byDay = [1,2,3,4,5,6,0].map((d) => ({
    day: d,
    slots: slots.filter((s) => s.dayOfWeek === d),
  })).filter((d) => d.slots.length > 0);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #00695C 0%, #004D40 100%)" }}>
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
            style={{ background: "#00695C" }}>
            <CalendarDays className="h-4 w-4" /> Criar meu planner
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">

          {/* Hoje */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.text }}>
              Hoje — {DAYS_FULL_NAME[todayIdx]}
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
                          <button key={t}
                            onClick={() => navigate(`/questoes?topic=${encodeURIComponent(t)}`)}
                            className="text-xs px-2 py-0.5 rounded-full font-medium transition-opacity hover:opacity-80"
                            style={{ background: c.badge, color: c.badgeText }}>
                            {t}
                          </button>
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

  // Toast de conquista ao chegar no dashboard pela primeira vez após diagnóstico
  useEffect(() => {
    const key = "diagnosis_toast_shown";
    const level = (session as any)?.diagnosisLevel;
    const shown = sessionStorage.getItem(key);
    if (level && !shown) {
      sessionStorage.setItem(key, "1");
      const labels: Record<string, string> = { iniciante: "🌱 Iniciante", intermediario: "⚡ Intermediário", avancado: "🚀 Avançado" };
      toast.success(`Conquista desbloqueada: Nível ${labels[level] ?? level}!`, {
        description: "Seu diagnóstico foi registrado. O Tutor Vetor já sabe seu nível.",
        duration: 5000,
      });
    }
  }, [session]);

  const firstName = (session?.name as string)?.split(" ")[0] ?? "Aluno";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // NextStepCard logic: determina a ação mais relevante para o momento
  const { data: daily } = trpc.simulations.getDailyChallenge.useQuery(
    undefined, { staleTime: 0 }
  );
  const nextStep = active
    ? {
        stage: "Simulado em andamento",
        title: "Continue de onde parou",
        context: "Você tem um simulado em aberto. Retome agora e termine para ver sua pontuação TRI.",
        primaryLabel: "Continuar simulado",
        onPrimary: () => navigate("/simulado"),
      }
    : !daily?.completed
    ? {
        stage: "Missão diária · 3 questões",
        title: "Desafio do dia esperando por você",
        context: "Resolva as três questões selecionadas para hoje e mantenha sua sequência de estudos!",
        primaryLabel: "Ir ao desafio",
        onPrimary: () => navigate("/desafio"),
      }
    : {
        stage: "Simulado completo · 45 questões",
        title: "Pronto para testar seu nível?",
        context: "Simule o ENEM com 45 questões de Matemática e veja sua pontuação estimada com TRI.",
        primaryLabel: "Iniciar simulado",
        onPrimary: () => navigate(`/simulado/${vestibularSelecionado.toLowerCase()}`),
      };

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
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
          {totalQuestions > 0
            ? <><span style={{ fontWeight: 700, color: "#fff" }}>{totalQuestions.toLocaleString("pt-BR")}</span> questões do ENEM e outros Vestibulares.</>
            : "Carregando questões…"}
        </p>
      </div>

      {/* ── Card de diagnóstico ── */}
      {(session as any)?.diagnosisLevel && (() => {
        const level = (session as any).diagnosisLevel as DiagnosisLevel;
        const score = (session as any).diagnosisScore ?? 0;
        const INFO = {
          iniciante:     { advice: "Comece pelas Trilhas de Matemática Básica.", next: "Álgebra e Funções" },
          intermediario: { advice: "Foque nos simulados e nas áreas mais fracas.", next: "Geometria e Trigonometria" },
          avancado:      { advice: "Afine sua nota com simulados TRI completos.", next: "Questões difíceis ENEM" },
        };
        const info = INFO[level];
        return (
          <div style={{
            borderRadius: 20, overflow: "hidden",
            border: "1.5px solid var(--border)",
            background: "var(--card)",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
              padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>
                  {{ iniciante: "🌱", intermediario: "⚡", avancado: "🚀" }[level]}
                </span>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Seu nível</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0 }}>
                    {{ iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" }[level]}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>{score}/20</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>no diagnóstico</p>
              </div>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "0 0 2px" }}>{info.advice}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#009688", margin: 0 }}>Próximo foco: {info.next}</p>
            </div>
          </div>
        );
      })()}

      {/* ── Próximo passo ── */}
      <NextStepCard
        stage={nextStep.stage}
        title={nextStep.title}
        context={nextStep.context}
        primaryLabel={nextStep.primaryLabel}
        onPrimary={nextStep.onPrimary}
      />

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
                    <Cell key={i} fill={entry.questoes > 0 ? "#009688" : "rgba(128,128,128,0.25)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Radares (Por Área ⇄ Performance) ── */}
      <RadarTabs />

      {/* ── Mini-Calendário ── */}
      <MiniCalendarCard navigate={navigate} />

      {/* ── Missão cumprida ── */}
      <MissaoCumprida />

      {/* ── Missão do dia ── */}
      <section className="space-y-2">
        <p className="pr-eyebrow" style={{ paddingLeft: 4 }}>Missão do dia</p>
        <DailyCard />
      </section>

      {/* ── Treine agora ── */}
      <section className="space-y-2">
        <p className="pr-eyebrow" style={{ paddingLeft: 4 }}>Treine agora</p>

        <button onClick={() => navigate("/treino")} className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <Dumbbell className="h-5 w-5" style={{ color: "#009688" }} />
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
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <BarChart2 className="h-5 w-5" style={{ color: "#009688" }} />
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
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E0F2F1" }}>
                <FlaskConical className="h-5 w-5" style={{ color: "#009688" }} />
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
        <p className="pr-eyebrow" style={{ paddingLeft: 4, marginBottom: 8 }}>Simulado completo</p>
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
