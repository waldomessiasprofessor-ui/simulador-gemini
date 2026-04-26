import { trpc } from "@/lib/trpc";
import { Loader2, Trophy, Medal } from "@/icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MEDAL_COLORS = ["#F9A825", "#9E9E9E", "#CD7F32"];

export default function Ranking() {
  const { data: ranking, isLoading } = trpc.simulations.getRanking.useQuery();

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="rounded-2xl px-6 py-8 text-white" style={{ background: "linear-gradient(135deg, #E65100, #BF360C)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5" />
          <span className="text-sm font-semibold opacity-80">Hall da Fama</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Ranking — Simulação Enem</h1>
        <p className="text-sm opacity-80">Melhores notas TRI de todos os tempos.</p>
      </div>

      {!ranking || ranking.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
          <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum aluno completou a Simulação Enem ainda.</p>
          <p className="text-xs mt-1">Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((entry) => {
            const medalColor = entry.position <= 3 ? MEDAL_COLORS[entry.position - 1] : null;
            return (
              <div
                key={entry.userId}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: entry.isMe ? "#E0F2F1" : "var(--card)",
                  border: `1.5px solid ${entry.isMe ? "#B2DFDB" : "var(--border)"}`,
                }}
              >
                {/* Posição */}
                <div className="w-8 flex-shrink-0 text-center">
                  {medalColor ? (
                    <Medal className="h-5 w-5 mx-auto" style={{ color: medalColor }} />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>{entry.position}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: entry.isMe ? "#009688" : "var(--border)", color: entry.isMe ? "#fff" : "var(--muted-foreground)" }}>
                  {entry.userName[0]?.toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>
                    {entry.userName} {entry.isMe && <span className="text-xs font-normal" style={{ color: "#009688" }}>(você)</span>}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {entry.completedAt ? format(new Date(entry.completedAt), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                  </p>
                </div>

                {/* Nota */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black" style={{ color: entry.isMe ? "#009688" : "var(--foreground)" }}>
                    {entry.score != null ? Math.round(entry.score) : "—"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>pts TRI</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
