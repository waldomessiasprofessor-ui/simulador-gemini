import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Clock, BookOpen, ChevronDown, ChevronUp, X } from "lucide-react";

// ── Constantes ────────────────────────────────────────────────────────────────

const DAYS = [
  { value: 1, short: "Seg", full: "Segunda-feira" },
  { value: 2, short: "Ter", full: "Terça-feira"   },
  { value: 3, short: "Qua", full: "Quarta-feira"  },
  { value: 4, short: "Qui", full: "Quinta-feira"  },
  { value: 5, short: "Sex", full: "Sexta-feira"   },
  { value: 6, short: "Sáb", full: "Sábado"        },
];

const DAY_COLORS: Record<number, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  1: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", badge: "#DBEAFE", badgeText: "#1E40AF" },
  2: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A", badge: "#DCFCE7", badgeText: "#15803D" },
  3: { bg: "#FDF4FF", border: "#E9D5FF", text: "#9333EA", badge: "#F3E8FF", badgeText: "#7E22CE" },
  4: { bg: "#FFF7ED", border: "#FED7AA", text: "#EA580C", badge: "#FFEDD5", badgeText: "#C2410C" },
  5: { bg: "#ECFDF5", border: "#A7F3D0", text: "#059669", badge: "#D1FAE5", badgeText: "#047857" },
  6: { bg: "#FFF1F2", border: "#FECDD3", text: "#E11D48", badge: "#FFE4E6", badgeText: "#BE123C" },
};

const ENEM_TOPICS = [
  "Grandezas Proporcionais", "Geometria Espacial", "Funções", "Estatística",
  "Geometria Plana", "Probabilidades", "Aritmética", "Análise Combinatória",
  "Médias", "Trigonometria", "Noções de Lógica Matemática", "Geometria Analítica",
  "Logarítmos", "Conjuntos Numéricos", "Progressão Aritmética", "Progressão Geométrica",
  "Equações", "Construções Geométricas", "Inequações", "Matrizes",
  "Potenciação", "Sistemas Lineares", "Conjuntos", "Equações polinomiais",
  "Matemática Financeira",
];

// Horas disponíveis (05:00 – 23:30 de 30 em 30 min)
const TIME_OPTIONS: string[] = [];
for (let h = 5; h <= 23; h++) {
  for (const m of [0, 30]) {
    if (h === 23 && m === 30) break;
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

// Hoje (1=Seg … 6=Sáb, 0=Dom → default Seg)
function getTodayDow(): number {
  const d = new Date().getDay(); // 0=Dom
  return d >= 1 && d <= 6 ? d : 1;
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function Agenda() {
  const utils = trpc.useUtils();

  const { data: slots = [], isLoading } = trpc.agenda.getMySchedule.useQuery();
  const { data: topicStats = [] } = trpc.agenda.getTopicStats.useQuery();

  const addSlot    = trpc.agenda.addSlot.useMutation({ onSuccess: () => utils.agenda.getMySchedule.invalidate() });
  const removeSlot = trpc.agenda.removeSlot.useMutation({ onSuccess: () => utils.agenda.getMySchedule.invalidate() });

  // UI state
  const [openDay,       setOpenDay]       = useState<number>(getTodayDow());
  const [startTime,     setStartTime]     = useState("08:00");
  const [endTime,       setEndTime]       = useState("10:00");
  const [topic,         setTopic]         = useState("");
  const [topicSearch,   setTopicSearch]   = useState("");
  const [showPicker,    setShowPicker]    = useState(false);
  const [showSugest,    setShowSugest]    = useState(false);

  const filteredTopics = ENEM_TOPICS.filter((t) =>
    t.toLowerCase().includes(topicSearch.toLowerCase())
  );

  function handleAdd() {
    if (!topic) return;
    if (startTime >= endTime) return;
    addSlot.mutate({ dayOfWeek: openDay, startTime, endTime, topic });
    setTopic("");
    setTopicSearch("");
  }

  const slotsForDay = (day: number) => slots.filter((s) => s.dayOfWeek === day);
  const totalSlots  = slots.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 py-2">

      {/* Header */}
      <div className="rounded-2xl px-6 py-7 text-white"
        style={{ background: "linear-gradient(135deg, #01738d, #015f75)" }}>
        <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Agenda semanal</p>
        <h1 className="text-2xl font-bold mb-1">Meu cronograma</h1>
        <p className="text-sm opacity-80">
          Monte seu plano de estudos semanal do seu jeito
        </p>
        {totalSlots > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <Clock className="h-3.5 w-3.5" />
            {totalSlots} {totalSlots === 1 ? "sessão agendada" : "sessões agendadas"}
          </div>
        )}
      </div>

      {/* Seletor de dias */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d) => {
          const count  = slotsForDay(d.value).length;
          const colors = DAY_COLORS[d.value];
          const active = openDay === d.value;
          return (
            <button key={d.value}
              onClick={() => setOpenDay(d.value)}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={active
                ? { background: colors.text, color: "#fff", border: `2px solid ${colors.text}` }
                : { background: "var(--card)", color: "var(--muted-foreground)", border: "2px solid var(--border)" }
              }>
              {d.short}
              {count > 0 && (
                <span className="text-xs font-semibold rounded-full px-1.5"
                  style={active ? { background: "rgba(255,255,255,0.25)", color: "#fff" } : { background: colors.badge, color: colors.badgeText }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Painel do dia selecionado */}
      {(() => {
        const day    = DAYS.find((d) => d.value === openDay)!;
        const colors = DAY_COLORS[openDay];
        const daySl  = slotsForDay(openDay);

        return (
          <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${colors.border}` }}>

            {/* Título do dia */}
            <div className="px-5 py-4" style={{ background: colors.bg }}>
              <p className="font-bold text-base" style={{ color: colors.text }}>{day.full}</p>
            </div>

            {/* Cards existentes */}
            {isLoading ? (
              <div className="flex justify-center py-8" style={{ background: "var(--card)" }}>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : daySl.length > 0 ? (
              <div className="p-4 grid gap-3 sm:grid-cols-2" style={{ background: "var(--card)" }}>
                {daySl.map((slot) => (
                  <div key={slot.id}
                    className="relative rounded-xl p-4 shadow-sm"
                    style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}>
                    {/* Botão remover */}
                    <button
                      onClick={() => removeSlot.mutate({ id: slot.id })}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                      style={{ color: colors.text }}>
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Horário */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="h-3.5 w-3.5" style={{ color: colors.text }} />
                      <span className="text-xs font-bold" style={{ color: colors.text }}>
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>

                    {/* Tópico */}
                    <p className="text-sm font-semibold pr-6" style={{ color: "var(--foreground)" }}>
                      {slot.topic}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-6 text-center" style={{ background: "var(--card)" }}>
                <p className="text-sm text-muted-foreground">Nenhuma sessão agendada para {day.full.toLowerCase()}</p>
              </div>
            )}

            {/* Formulário — adicionar sessão */}
            <div className="px-5 py-4 space-y-3" style={{ background: "var(--card)", borderTop: `1px solid ${colors.border}` }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                Adicionar sessão
              </p>

              {/* Horários */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-xs text-muted-foreground font-medium">De</span>
                  <select value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 text-sm rounded-lg px-2 py-2 font-medium"
                    style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                    {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-xs text-muted-foreground font-medium">às</span>
                  <select value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 text-sm rounded-lg px-2 py-2 font-medium"
                    style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                    {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Seletor de conteúdo */}
              <div className="relative">
                <button
                  onClick={() => setShowPicker((p) => !p)}
                  className="w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-xl transition-all"
                  style={topic
                    ? { background: colors.bg, border: `1.5px solid ${colors.border}`, color: "var(--foreground)" }
                    : { background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }
                  }>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">{topic || "Selecionar conteúdo..."}</span>
                  </div>
                  {showPicker ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showPicker && (
                  <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl shadow-xl overflow-hidden"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    {/* Busca */}
                    <div className="p-2" style={{ borderBottom: "1px solid var(--border)" }}>
                      <input
                        autoFocus
                        value={topicSearch}
                        onChange={(e) => setTopicSearch(e.target.value)}
                        placeholder="Buscar conteúdo..."
                        className="w-full text-sm px-3 py-1.5 rounded-lg outline-none"
                        style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                      />
                    </div>
                    {/* Lista */}
                    <div className="max-h-52 overflow-y-auto">
                      {filteredTopics.map((t) => (
                        <button key={t}
                          onClick={() => { setTopic(t); setShowPicker(false); setTopicSearch(""); }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
                          style={topic === t
                            ? { background: colors.bg, color: colors.text }
                            : { color: "var(--foreground)" }
                          }>
                          {t}
                        </button>
                      ))}
                      {filteredTopics.length === 0 && (
                        <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão adicionar */}
              <button
                onClick={handleAdd}
                disabled={!topic || startTime >= endTime || addSlot.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                style={{ background: colors.text }}>
                {addSlot.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Plus className="h-4 w-4" />}
                Adicionar sessão
              </button>

              {startTime >= endTime && topic && (
                <p className="text-xs text-center" style={{ color: "#DC2626" }}>
                  O horário de término deve ser após o início
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Visão geral — todos os dias com slots */}
      {totalSlots > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">
            Visão geral da semana
          </p>
          <div className="space-y-2">
            {DAYS.filter((d) => slotsForDay(d.value).length > 0).map((d) => {
              const colors = DAY_COLORS[d.value];
              return (
                <div key={d.value} className="rounded-xl px-4 py-3 flex items-start gap-3"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: colors.bg, color: colors.text }}>
                    {d.short}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {slotsForDay(d.value).map((slot) => (
                      <span key={slot.id} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: colors.badge, color: colors.badgeText }}>
                        <Clock className="h-3 w-3" />
                        {slot.startTime}–{slot.endTime} · {slot.topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sugestões baseadas no desempenho */}
      <div>
        <button
          onClick={() => setShowSugest((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
          <span>💡 Sugestões baseadas no seu desempenho</span>
          {showSugest ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showSugest && (
          <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {topicStats.slice(0, 10).map((item, i) => {
              const statusColor =
                item.status === "fraco"   ? { bg: "#FEF2F2", text: "#DC2626", label: "Prioridade" } :
                item.status === "regular" ? { bg: "#FFFBEB", text: "#D97706", label: "Em progresso" } :
                item.status === "forte"   ? { bg: "#F0FDF4", text: "#16A34A", label: "Dominado" } :
                                            { bg: "#F1F5F9", text: "#64748B", label: "Sem dados" };
              return (
                <div key={item.topic}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < 9 ? "1px solid var(--border)" : "none", background: "var(--card)" }}>
                  <span className="text-xs font-bold w-5 text-center text-muted-foreground">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{item.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.enemPct}% do ENEM
                      {item.userAccuracy !== null ? ` · ${item.userAccuracy}% de acerto` : " · sem histórico"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: statusColor.bg, color: statusColor.text }}>
                    {statusColor.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
