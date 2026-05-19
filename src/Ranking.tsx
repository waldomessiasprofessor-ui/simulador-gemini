import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Trophy, Medal, Star, TrendingUp, BarChart2, Zap } from "@/icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Cores de medalha ──────────────────────────────────────────────────────────
const MEDAL_COLORS = ["#F9A825", "#9E9E9E", "#CD7F32"];

// ── Tipos de aba ──────────────────────────────────────────────────────────────
type Tab = "xp" | "tri" | "perf";

const TABS: { id: Tab; label: string; icon: JSX.Element; desc: string }[] = [
  {
    id: "xp",
    label: "XP",
    icon: <Star className="h-4 w-4" />,
    desc: "Pontos de experiência acumulados em trilhas, tutor e simulados.",
  },
  {
    id: "tri",
    label: "Nota TRI",
    icon: <Trophy className="h-4 w-4" />,
    desc: "Melhor pontuação TRI obtida no Simulado ENEM.",
  },
  {
    id: "perf",
    label: "Aproveitamento",
    icon: <BarChart2 className="h-4 w-4" />,
    desc: "Percentual médio de acertos em todos os simulados concluídos.",
  },
];

// ── Posição numérica / medalha ────────────────────────────────────────────────
function PositionBadge({ pos }: { pos: number }) {
  if (pos <= 3) {
    return <Medal className="h-5 w-5 mx-auto" style={{ color: MEDAL_COLORS[pos - 1] }} />;
  }
  return (
    <span className="text-sm font-bold tabular-nums" style={{ color: "var(--muted-foreground)" }}>
      {pos}
    </span>
  );
}

// ── Avatar inicial ────────────────────────────────────────────────────────────
function Avatar({ name, isMe }: { name: string; isMe: boolean }) {
  return (
    <div
      className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
      style={{
        background: isMe
          ? "linear-gradient(135deg, #009688 0%, #00695C 100%)"
          : "var(--border)",
        color: isMe ? "#fff" : "var(--muted-foreground)",
        boxShadow: isMe ? "0 2px 8px rgba(0,150,136,0.4)" : "none",
      }}
    >
      {name[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

// ── Card de linha do ranking ──────────────────────────────────────────────────
function RankRow({
  pos,
  name,
  isMe,
  primary,
  primaryLabel,
  secondary,
}: {
  pos: number;
  name: string;
  isMe: boolean;
  primary: string;
  primaryLabel: string;
  secondary?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        background: isMe
          ? "linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)"
          : pos <= 3
          ? "var(--card)"
          : "var(--card)",
        border: isMe
          ? "1.5px solid #4DB6AC"
          : pos === 1
          ? "1.5px solid #F9A82540"
          : pos === 2
          ? "1.5px solid #9E9E9E40"
          : pos === 3
          ? "1.5px solid #CD7F3240"
          : "1.5px solid var(--border)",
        boxShadow: pos <= 3 ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Posição */}
      <div className="w-8 flex-shrink-0 text-center">
        <PositionBadge pos={pos} />
      </div>

      {/* Avatar */}
      <Avatar name={name} isMe={isMe} />

      {/* Nome */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>
          {name}{" "}
          {isMe && (
            <span className="text-xs font-normal" style={{ color: "#009688" }}>
              (você)
            </span>
          )}
        </p>
        {secondary && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {secondary}
          </p>
        )}
      </div>

      {/* Métrica principal */}
      <div className="text-right flex-shrink-0">
        <p
          className="text-xl font-black tabular-nums"
          style={{ color: isMe ? "#009688" : pos === 1 ? "#F9A825" : "var(--foreground)" }}
        >
          {primary}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          {primaryLabel}
        </p>
      </div>
    </div>
  );
}

// ── Card "você fora do top-20" ────────────────────────────────────────────────
function MyOutOfTopRow({
  pos,
  primary,
  primaryLabel,
  userName,
}: {
  pos: number;
  primary: string;
  primaryLabel: string;
  userName: string;
}) {
  return (
    <>
      <div className="flex justify-center py-1">
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>· · ·</span>
      </div>
      <RankRow
        pos={pos}
        name={userName}
        isMe
        primary={primary}
        primaryLabel={primaryLabel}
        secondary={`Posição #${pos} no ranking`}
      />
    </>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Ranking() {
  const [tab, setTab] = useState<Tab>("xp");
  const { data, isLoading } = trpc.users.getLeaderboard.useQuery();
  const { data: me } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
      </div>
    );
  }

  const xpRanking  = data?.xpRanking  ?? [];
  const triRanking = data?.triRanking  ?? [];
  const perfRanking = data?.perfRanking ?? [];
  const totalRanked = data?.totalRanked ?? 0;
  const myXpRank   = data?.myXpRank    ?? null;
  const myTriPct   = data?.myTriPercentile ?? null;
  const myName     = me?.name ?? "Você";

  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="space-y-4 py-2">
      {/* ── Header ── */}
      <div
        className="rounded-2xl px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #00897B 0%, #004D40 100%)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-5 w-5 opacity-80" />
          <span className="text-sm font-semibold opacity-80">Leaderboard</span>
        </div>
        <h1 className="text-2xl font-black mb-1">Ranking Geral</h1>
        <p className="text-sm opacity-75">
          Veja onde você está em XP, nota TRI e aproveitamento.
        </p>

        {/* Percentil TRI */}
        {myTriPct !== null && (
          <div
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}
          >
            <TrendingUp className="h-4 w-4" />
            Você supera {myTriPct}% dos alunos no TRI · {totalRanked} rankeados
          </div>
        )}
      </div>

      {/* ── Abas ── */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-bold transition-all"
            style={{
              background: tab === t.id
                ? "linear-gradient(135deg, #009688 0%, #00695C 100%)"
                : "transparent",
              color: tab === t.id ? "#fff" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 2px 8px rgba(0,150,136,0.3)" : "none",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Descrição da aba */}
      <p className="text-xs px-1" style={{ color: "var(--muted-foreground)" }}>
        {activeTab.desc}
      </p>

      {/* ── Lista XP ── */}
      {tab === "xp" && (
        <div className="space-y-2">
          {xpRanking.length === 0 ? (
            <EmptyState icon={<Star className="h-10 w-10 mx-auto mb-3 opacity-30" />} msg="Nenhum aluno com XP ainda." />
          ) : (
            <>
              {xpRanking.map(r => (
                <RankRow
                  key={r.userId}
                  pos={r.position}
                  name={r.userName}
                  isMe={r.isMe}
                  primary={r.xp.toLocaleString("pt-BR")}
                  primaryLabel="XP"
                />
              ))}
              {myXpRank && (
                <MyOutOfTopRow
                  pos={myXpRank.position}
                  primary={myXpRank.xp.toLocaleString("pt-BR")}
                  primaryLabel="XP"
                  userName={myName}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ── Lista TRI ── */}
      {tab === "tri" && (
        <div className="space-y-2">
          {triRanking.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />}
              msg="Nenhum aluno completou o Simulado ENEM ainda."
              sub="Seja o primeiro!"
            />
          ) : (
            triRanking.map(r => (
              <RankRow
                key={r.userId}
                pos={r.position}
                name={r.userName}
                isMe={r.isMe}
                primary={r.score != null ? Math.round(r.score).toString() : "—"}
                primaryLabel="pts TRI"
                secondary={
                  r.completedAt
                    ? `${r.simCount} simulado${r.simCount !== 1 ? "s" : ""} · ${format(new Date(r.completedAt), "dd/MM/yy", { locale: ptBR })}`
                    : `${r.simCount} simulado${r.simCount !== 1 ? "s" : ""}`
                }
              />
            ))
          )}
        </div>
      )}

      {/* ── Lista Aproveitamento ── */}
      {tab === "perf" && (
        <div className="space-y-2">
          {perfRanking.length === 0 ? (
            <EmptyState
              icon={<BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-30" />}
              msg="Nenhum simulado concluído ainda."
            />
          ) : (
            perfRanking.map(r => (
              <RankRow
                key={r.userId}
                pos={r.position}
                name={r.userName}
                isMe={r.isMe}
                primary={`${r.avgPct}%`}
                primaryLabel="acertos"
                secondary={`${r.simCount} simulado${r.simCount !== 1 ? "s" : ""} · melhor TRI: ${r.bestScore != null ? Math.round(r.bestScore) : "—"}`}
              />
            ))
          )}
        </div>
      )}

      {/* Legenda XP */}
      {tab === "xp" && (
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
        >
          <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
            <Zap className="inline h-3.5 w-3.5 mr-1" style={{ color: "#F59E0B" }} />
            Como ganhar XP
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {[
              ["Trilha concluída", "+20 XP"],
              ["Simulado ENEM", "+30–100 XP"],
              ["Desafio diário", "+15 XP"],
              ["Tutor IA", "+3 XP/sessão"],
            ].map(([label, pts]) => (
              <div key={label} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                style={{ background: "var(--background)" }}>
                <span>{label}</span>
                <span className="font-black" style={{ color: "#F59E0B" }}>{pts}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, msg, sub }: { icon: JSX.Element; msg: string; sub?: string }) {
  return (
    <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
      {icon}
      <p className="text-sm">{msg}</p>
      {sub && <p className="text-xs mt-1">{sub}</p>}
    </div>
  );
}
