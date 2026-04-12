import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Target, TrendingUp, TrendingDown, Minus, BookOpen, ChevronRight, CalendarDays, BarChart2 } from "lucide-react";

type Status = "sem_dados" | "fraco" | "regular" | "forte";

const STATUS_CONFIG: Record<Status, { label: string; bg: string; color: string; border: string; icon: React.ElementType }> = {
  sem_dados: { label: "Sem dados",    bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0", icon: Minus },
  fraco:     { label: "Prioridade",   bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", icon: TrendingDown },
  regular:   { label: "Em progresso", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", icon: Minus },
  forte:     { label: "Dominado",     bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", icon: TrendingUp },
};

function AccuracyBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? "#16A34A" : pct >= 40 ? "#D97706" : "#DC2626";
  return (
    <div className="w-full rounded-full h-1.5" style={{ background: "#E2E8F0" }}>
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Agenda() {
  const [, navigate] = useLocation();
  const { data, isLoading, isError, error } = trpc.agenda.getSchedule.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );

  if (isError || !data) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Não foi possível carregar a agenda
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {(error as any)?.message ?? "Erro desconhecido. Tente recarregar a página."}
      </p>
    </div>
  );

  const todayCard = data.schedule.find((d) => d.isToday);
  const isWeekend = !todayCard;

  return (
    <div className="space-y-6 py-2">

      {/* Header */}
      <div className="rounded-2xl px-6 py-8 text-white" style={{ background: "linear-gradient(135deg, #01738d, #015f75)" }}>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-5 w-5 opacity-80" />
          <span className="text-sm font-semibold opacity-80">Agenda de Estudos</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Seu plano personalizado</h1>
        <p className="text-sm opacity-80">
          Tópicos priorizados pelo peso no ENEM e pelo seu desempenho atual
        </p>
        <div className="flex gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{data.practicedTopics}</p>
            <p className="text-xs opacity-70">tópicos praticados</p>
          </div>
          <div className="w-px opacity-30" style={{ background: "#fff" }} />
          <div className="text-center">
            <p className="text-2xl font-bold">{data.totalTopics}</p>
            <p className="text-xs opacity-70">tópicos no ENEM</p>
          </div>
        </div>
      </div>

      {/* Hoje */}
      {isWeekend ? (
        <div className="rounded-2xl p-5 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>É fim de semana! 🎉</p>
          <p className="text-sm text-muted-foreground">Descanse ou revise um tópico à vontade abaixo.</p>
        </div>
      ) : (
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: "#EFF6FF", border: "2px solid #BFDBFE" }}>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4" style={{ color: "#1D4ED8" }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1D4ED8" }}>
              Hoje — {todayCard!.weekday}-feira
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{todayCard!.topic}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full font-semibold" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
              {todayCard!.enemPct}% das questões do ENEM
            </span>
            {todayCard!.userAccuracy !== null ? (
              <span className="px-2 py-1 rounded-full font-semibold"
                style={todayCard!.userAccuracy >= 70
                  ? { background: "#DCFCE7", color: "#16A34A" }
                  : todayCard!.userAccuracy >= 40
                  ? { background: "#FEF3C7", color: "#D97706" }
                  : { background: "#FEE2E2", color: "#DC2626" }}>
                {todayCard!.userAccuracy}% de acerto
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full font-semibold" style={{ background: "#F1F5F9", color: "#64748B" }}>
                Sem histórico ainda
              </span>
            )}
          </div>
          <button
            onClick={() => navigate("/questoes")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
            style={{ background: "#1D4ED8" }}>
            <BookOpen className="h-4 w-4" />
            Praticar {todayCard!.topic}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </button>
        </div>
      )}

      {/* Semana */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
          Esta semana
        </h2>
        <div className="space-y-2">
          {data.schedule.map((day) => {
            const cfg = STATUS_CONFIG[day.status as Status];
            const Icon = cfg.icon;
            const isToday = day.isToday;

            return (
              <div key={day.weekday}
                className="rounded-xl px-4 py-3 flex items-center gap-3 transition-all"
                style={{
                  background: isToday ? "#EFF6FF" : "var(--card)",
                  border: isToday ? "2px solid #BFDBFE" : "1px solid var(--border)",
                }}>

                {/* Dia */}
                <div className="w-14 flex-shrink-0 text-center">
                  <p className="text-xs font-bold" style={{ color: isToday ? "#1D4ED8" : "var(--muted-foreground)" }}>
                    {day.weekday.slice(0, 3).toUpperCase()}
                  </p>
                  {isToday && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#1D4ED8", color: "#fff" }}>hoje</span>
                  )}
                </div>

                {/* Tópico + barra */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {day.topic}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {day.userAccuracy !== null ? (
                      <>
                        <AccuracyBar pct={day.userAccuracy} />
                        <span className="text-xs font-medium flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>
                          {day.userAccuracy}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>sem histórico</span>
                    )}
                  </div>
                </div>

                {/* Badge status */}
                <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  <Icon className="h-3 w-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranking completo de tópicos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            Todos os tópicos — por prioridade
          </h2>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {data.allTopicsRanked.map((item, i) => {
            const cfg = STATUS_CONFIG[item.status as Status];
            return (
              <div key={item.topic}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < data.allTopicsRanked.length - 1 ? "1px solid var(--border)" : "none",
                         background: "var(--card)" }}>
                <span className="text-xs font-bold w-5 flex-shrink-0 text-center" style={{ color: "var(--muted-foreground)" }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{item.topic}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {item.enemPct}% das questões do ENEM
                    {item.userAccuracy !== null ? ` · ${item.userAccuracy}% de acerto` : " · sem histórico"}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
