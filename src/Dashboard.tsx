import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Flame, Trophy, CheckCircle2, XCircle, ChevronRight,
  Loader2, Zap, Medal, BookOpen, Dumbbell,
  Clock, Swords, Star, PartyPopper, BarChart2, FlaskConical, Brain
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

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
            <p className="font-bold text-sm" style={{ color: "#009688" }}>Desafio de Hoje</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Resolva três questões escolhidas por nós para manter o cérebro ativo
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "#009688" }}>
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

// ─── StudyCard ("Vamos estudar?") ─────────────────────────────────────────────
function StudyCard() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.getDaily.useQuery(
    undefined, { staleTime: 0, refetchOnWindowFocus: true }
  );

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#1E40AF" }} />
    </div>
  );

  const content = data?.content;

  if (!content) return (
    <div className="rounded-2xl p-4 opacity-60" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#EFF6FF" }}>
          <BookOpen className="h-5 w-5" style={{ color: "#1E40AF" }} />
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
      style={{ background: "#EFF6FF", border: "1.5px solid #1E40AF33" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#1E40AF" }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#1E40AF" }}>Vamos Estudar?</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Selecionamos um tópico para revisar e manter os conteúdos sempre em dia
            </p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: "#1E40AF" }}>
              {content.topico ?? content.titulo}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: "#1E40AF" }} />
      </div>
    </button>
  );
}

// ─── Gráfico circular de taxa de acerto ───────────────────────────────────────
function CircularAccuracy({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 70 ? "#009688" : clamped >= 40 ? "#E65100" : "#C62828";

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

function RadarTopicos() {
  const { data, isLoading } = trpc.simulations.getTopicStats.useQuery(undefined, { staleTime: 0 });

  // Abreviações para conteúdos conhecidos; sem truncar o resto (WrapTick cuida da quebra)
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

  if (isLoading) return (
    <div className="rounded-2xl p-4 flex justify-center items-center" style={{ height: 200, background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  if (!data || data.length < 2) return null; // sem dados suficientes, não exibe

  const chartData = data.map(d => ({ area: shortLabel(d.conteudo), pct: d.pct, total: d.total }));

  const best = [...data].sort((a, b) => b.pct - a.pct)[0];
  const worst = [...data].sort((a, b) => a.pct - b.pct)[0];

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Desempenho por Área</p>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E0F2F1", color: "#00695C" }}>
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
            stroke="#009688"
            fill="#009688"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: "#009688", strokeWidth: 0 }}
          />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            formatter={(v: number, _: string, props: any) => [`${v}% (${props.payload.total} questões)`, "Acerto"]}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Destaques */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="rounded-xl px-3 py-2" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-xs font-semibold" style={{ color: "#15803D" }}>Melhor área</p>
          <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "#166534" }}>{shortLabel(best.conteudo)}</p>
          <p className="text-xs" style={{ color: "#15803D" }}>{best.pct}% de acerto</p>
        </div>
        <div className="rounded-xl px-3 py-2" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <p className="text-xs font-semibold" style={{ color: "#DC2626" }}>Área a reforçar</p>
          <p className="text-sm font-bold mt-0.5 truncate" style={{ color: "#991B1B" }}>{shortLabel(worst.conteudo)}</p>
          <p className="text-xs" style={{ color: "#DC2626" }}>{worst.pct}% de acerto</p>
        </div>
      </div>
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

      {/* ── Desempenho Semanal + Diário de Questões — logo abaixo da saudação ── */}
      {stats && (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Desempenho Semanal</p>
              <button onClick={() => navigate("/ranking")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#009688" }}>
                <Medal className="h-3.5 w-3.5" /> Ranking
              </button>
            </div>
            <div className="space-y-2">
              {[
                { icon: Zap, label: "Questões respondidas", value: String(stats.weeklyQuestions) },
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
              <div className="flex items-center gap-3 pt-1">
                <CircularAccuracy value={stats.weeklyAccuracy} />
                <div className="flex-1">
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Taxa de acerto</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {stats.weeklyAccuracy >= 70 ? "Excelente!" : stats.weeklyAccuracy >= 40 ? "Bom trabalho!" : "Continue praticando!"}
                  </p>
                </div>
              </div>
            </div>
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
                    <Cell key={i} fill={entry.questoes > 0 ? "#009688" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Radar de áreas ── */}
      <RadarTopicos />

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
