import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, XCircle, Clock, Loader2, TrendingUp,
  AlertTriangle, BookOpen, ChevronDown, ChevronUp
} from "lucide-react";

function formatTime(s: number | null): string {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m${sec > 0 ? ` ${sec}s` : ""}`;
}

// ── Aba: Simulados ────────────────────────────────────────────────────────────
function TabSimulados() {
  const [, navigate] = useLocation();
  const { data: history, isLoading } = trpc.simulations.getHistory.useQuery({ limit: 30 });
  const { data: allHistory } = trpc.simulations.getHistory.useQuery({ limit: 100 });

  const chartData = (allHistory ?? []).slice().reverse().map((sim, idx) => ({
    idx: idx + 1,
    acertos: sim.correctCount ?? 0,
    date: sim.completedAt ? format(new Date(sim.completedAt), "dd/MM", { locale: ptBR }) : "",
  }));

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--pr-teal)" }} /></div>;

  return (
    <div className="space-y-6">
      {chartData.length > 1 && (
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          <p className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <TrendingUp className="h-4 w-4" style={{ color: "var(--pr-teal)" }} /> Evolução de acertos
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.3)" opacity={0.4} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [v, "Acertos"]}
                labelFormatter={(l) => `Data: ${l}`}
              />
              <Line type="monotone" dataKey="acertos" stroke="#009688" strokeWidth={2}
                dot={{ r: 3, fill: "#009688" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!history?.length ? (
        <p className="text-center py-12 text-sm" style={{ color: "var(--muted-foreground)" }}>Nenhum simulado ainda.</p>
      ) : (
        <div className="space-y-2">
          {history.map((sim) => {
            const total = sim.totalQuestions ?? 45;
            const pct = Math.round(((sim.correctCount ?? 0) / total) * 100);
            return (
              <div key={sim.id} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
                onClick={() => navigate(`/resultado/${sim.id}`)}>
                {pct >= 60
                  ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--pr-success)" }} />
                  : <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "var(--pr-danger)" }} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {sim.correctCount ?? 0}/{total} acertos
                    </span>
                    {sim.score != null && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--pr-warn-bg)", color: "var(--pr-warn)" }}>
                        {sim.score.toFixed(0)} pts TRI
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {sim.completedAt ? format(new Date(sim.completedAt), "dd/MM/yyyy, HH:mm", { locale: ptBR }) : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>
                  <Clock className="h-3.5 w-3.5" />{formatTime(sim.totalTimeSeconds ?? null)}
                </div>
                <div className="w-16 hidden sm:block">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 60 ? "var(--pr-success)" : "var(--pr-danger)" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Aba: O que já errei ────────────────────────────────────────────────────────
function TabErros() {
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const LIMIT = 20;

  const { data, isLoading } = trpc.simulations.getWrongAnswers.useQuery(
    { limit: LIMIT, offset: page * LIMIT },
    { staleTime: 0 }
  );

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--pr-danger)" }} /></div>;

  if (!data?.rows.length) return (
    <div className="text-center py-16 space-y-3">
      <CheckCircle2 className="h-12 w-12 mx-auto" style={{ color: "var(--pr-success)", opacity: 0.4 }} />
      <p className="font-semibold" style={{ color: "var(--foreground)" }}>Sem erros registrados</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Você ainda não completou nenhum simulado, ou acertou tudo! 🎉
      </p>
    </div>
  );

  const totalPages = Math.ceil(data.total / LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <AlertTriangle className="h-4 w-4" style={{ color: "var(--pr-warn)" }} />
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {data.total} questão(ões) errada(s) no total
        </p>
      </div>

      <div className="space-y-2">
        {data.rows.map((row, i) => {
          const isOpen = openId === row.answerId;
          const alts = row.alternativas as Record<string, any>;

          return (
            <div key={row.answerId} className="rounded-xl overflow-hidden"
              style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
              <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                onClick={() => setOpenId(isOpen ? null : row.answerId)}>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "var(--pr-danger-bg)" }}>
                  <XCircle className="h-4 w-4" style={{ color: "var(--pr-danger)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {row.conteudo_principal}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Sua resposta: <span className="font-bold" style={{ color: "var(--pr-danger)" }}>{row.selectedAnswer ?? "—"}</span>
                      {" · "}Correta: <span className="font-bold" style={{ color: "var(--pr-success)" }}>{row.gabarito}</span>
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {row.nivel_dificuldade}
                    </span>
                  </div>
                </div>
                {isOpen
                  ? <ChevronUp className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--muted-foreground)" }} />
                  : <ChevronDown className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--muted-foreground)" }} />}
              </button>

              {isOpen && (
                <div className="px-4 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="pt-4">
                    <LatexRenderer fontSize="sm">{row.enunciado}</LatexRenderer>
                  </div>
                  {row.url_imagem && !row.enunciado.includes(row.url_imagem) && (
                    <img src={row.url_imagem} alt="Imagem" className="max-w-full rounded-lg"
                      style={{ border: "1px solid var(--border)" }} />
                  )}
                  <div className="space-y-1.5">
                    {Object.entries(alts).sort().filter(([, value]) => value !== null && value !== "").map(([id, value]) => {
                      const text = value !== null && typeof value === "object" ? value.text ?? "" : value ?? "";
                      const isCorrect = id === row.gabarito;
                      const isSelected = id === row.selectedAnswer;
                      return (
                        <div key={id} className="flex gap-2 px-3 py-2 rounded-lg text-sm"
                          style={{
                            background: isCorrect ? "var(--pr-success-bg)" : isSelected ? "var(--pr-danger-bg)" : "var(--muted)",
                            border: `1px solid ${isCorrect ? "var(--pr-success-border)" : isSelected ? "var(--pr-danger-border)" : "transparent"}`,
                          }}>
                          <span className="font-bold w-4 flex-shrink-0"
                            style={{ color: isCorrect ? "var(--pr-success)" : isSelected ? "var(--pr-danger)" : "var(--muted-foreground)" }}>
                            {id}
                          </span>
                          <LatexRenderer inline fontSize="sm">{String(text)}</LatexRenderer>
                          {isCorrect && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 ml-auto my-auto" style={{ color: "var(--pr-success)" }} />}
                          {isSelected && !isCorrect && <XCircle className="h-3.5 w-3.5 flex-shrink-0 ml-auto my-auto" style={{ color: "var(--pr-danger)" }} />}
                        </div>
                      );
                    })}
                  </div>
                  {row.comentario_resolucao && (
                    <div className="rounded-xl p-3" style={{ background: "var(--pr-info-bg)", border: "1px solid var(--pr-info-border)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--pr-info)" }}>Resolução</p>
                      <LatexRenderer fontSize="sm">{row.comentario_resolucao}</LatexRenderer>
                    </div>
                  )}
                  {row.answeredAt && (
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Respondida em {format(new Date(row.answeredAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}>Anterior</button>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}>Próxima</button>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Historico() {
  const [tab, setTab] = useState<"simulados" | "erros">("simulados");

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Histórico</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>Acompanhe seu progresso ao longo do tempo.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("simulados")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={tab === "simulados"
            ? { background: "var(--pr-teal)", color: "#fff" }
            : { background: "var(--muted)", color: "var(--muted-foreground)" }}>
          <TrendingUp className="h-4 w-4" /> Simulados
        </button>
        <button onClick={() => setTab("erros")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={tab === "erros"
            ? { background: "var(--pr-danger)", color: "#fff" }
            : { background: "var(--muted)", color: "var(--muted-foreground)" }}>
          <AlertTriangle className="h-4 w-4" /> O que já errei?
        </button>
      </div>

      {tab === "simulados" ? <TabSimulados /> : <TabErros />}
    </div>
  );
}
