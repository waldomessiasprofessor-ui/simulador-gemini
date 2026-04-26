import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import {
  Loader2, BookOpen, RotateCcw, ChevronRight, Trophy,
  Brain, Layers, CheckCircle2, Clock, ArrowLeft,
} from "@/icons";

// =============================================================================
// Estilos da animação de virar card (3D flip)
// =============================================================================
const FLIP_CONTAINER: React.CSSProperties = {
  perspective: "1200px",
  cursor: "pointer",
  userSelect: "none",
};
const flipInner = (flipped: boolean): React.CSSProperties => ({
  position: "relative",
  width: "100%",
  minHeight: 280,
  transformStyle: "preserve-3d",
  transition: "transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
});
const FACE_BASE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: "1.25rem",
  padding: "2rem 1.75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  overflow: "auto",
};
const FACE_BACK: React.CSSProperties = {
  ...FACE_BASE,
  transform: "rotateY(180deg)",
};

// =============================================================================
// Cores de qualidade
// =============================================================================
const QUALITY_OPTS = [
  { quality: 1 as const, label: "Não lembrei",  emoji: "😕", bg: "#FEF2F2",  color: "#DC2626",  border: "#FECACA" },
  { quality: 3 as const, label: "Difícil",       emoji: "😐", bg: "#FFFBEB",    color: "#B45309",    border: "#FCD34D" },
  { quality: 5 as const, label: "Fácil!",        emoji: "😄", bg: "#F0FDF4", color: "#16A34A", border: "#A7F3D0" },
] as const;

// =============================================================================
// Tela de estudo (sessão de um baralho)
// =============================================================================
function StudySession({ deckId, onBack }: { deckId: number; onBack: () => void }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.flashcards.getStudySession.useQuery({ deckId, limit: 20 });
  const recordReview = trpc.flashcards.recordReview.useMutation({
    onSuccess: () => utils.flashcards.listDecks.invalidate(),
  });

  const [idx, setIdx]     = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [results, setResults]   = useState<{ quality: 1 | 3 | 5 }[]>([]);
  const [done, setDone]   = useState(false);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");

  // Cronômetro por card: marca quando o card aparece, mede até a avaliação.
  const cardStartRef = useRef<number>(Date.now());
  useEffect(() => { cardStartRef.current = Date.now(); }, [idx, data?.cards?.[0]?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#009688" }} />
      </div>
    );
  }

  if (!data || data.cards.length === 0) {
    const next = data?.nextScheduled ? new Date(data.nextScheduled) : null;
    return (
      <div className="flex flex-col items-center py-20 gap-5 text-center">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: "#E0F2F1" }}>
          🎉
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Nada para revisar hoje!</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {next
              ? `Próxima revisão agendada para ${next.toLocaleDateString("pt-BR")}`
              : "Todos os cards estão em dia."}
          </p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "#E0F2F1", color: "#009688" }}>
          <ArrowLeft className="h-4 w-4" /> Voltar aos baralhos
        </button>
      </div>
    );
  }

  // ── Tela de resultado ─────────────────────────────────────────────────────
  if (done) {
    const total   = results.length;
    const forgot  = results.filter(r => r.quality === 1).length;
    const hard    = results.filter(r => r.quality === 3).length;
    const easy    = results.filter(r => r.quality === 5).length;
    const pct     = total > 0 ? Math.round(((hard + easy) / total) * 100) : 0;

    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center max-w-sm mx-auto">
        <div className="h-20 w-20 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
          <Trophy className="h-9 w-9 text-white" />
        </div>
        <div>
          <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Sessão concluída!</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{total} card(s) revisado(s)</p>
        </div>

        <div className="w-full rounded-2xl p-5 space-y-3" style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Taxa de acerto</span>
            <span className="text-xl font-black" style={{ color: pct >= 70 ? "#16A34A" : "#B45309" }}>{pct}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "var(--border)" }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 70 ? "#009688" : "#B45309" }} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: "Não lembrei", n: forgot, color: "#DC2626",  bg: "#FEF2F2" },
              { label: "Difícil",     n: hard,   color: "#B45309",    bg: "#FFFBEB" },
              { label: "Fácil",       n: easy,   color: "#16A34A", bg: "#F0FDF4" },
            ].map(({ label, n, color, bg }) => (
              <div key={label} className="rounded-xl p-2 text-center" style={{ background: bg }}>
                <p className="text-lg font-black" style={{ color }}>{n}</p>
                <p className="text-xs font-semibold" style={{ color }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => { setIdx(0); setFlipped(false); setResults([]); setDone(false); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            style={{ background: "#E0F2F1", color: "#009688" }}>
            <RotateCcw className="h-4 w-4" /> Repetir
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
            <ArrowLeft className="h-4 w-4" /> Baralhos
          </button>
        </div>
      </div>
    );
  }

  // ── Sessão ────────────────────────────────────────────────────────────────
  const cards   = data.cards;
  const card    = cards[idx];
  const progress = ((idx) / cards.length) * 100;

  function handleRate(quality: 1 | 3 | 5) {
    const elapsed = Math.min(600, Math.max(0, Math.round((Date.now() - cardStartRef.current) / 1000)));
    recordReview.mutate({ cardId: card.id, quality, timeSpentSeconds: elapsed });
    setResults(r => [...r, { quality }]);

    if (idx + 1 >= cards.length) {
      setDone(true);
    } else {
      setFlipped(false);
      setTimeout(() => setIdx(i => i + 1), 120);
    }
  }

  const deckColor = data.deck?.color ?? "#009688";

  return (
    <div className="space-y-5 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>{data.deck?.title}</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Card {idx + 1} de {cards.length}
            {data.dueCount > 0 && ` · ${data.dueCount} para revisão`}
            {data.newCount > 0 && ` · ${data.newCount} novos`}
          </p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
        <div className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: deckColor }} />
      </div>

      {/* Card flip */}
      <div style={FLIP_CONTAINER} onClick={() => setFlipped(f => !f)}>
        <div style={{ ...flipInner(flipped), minHeight: 280 }}>

          {/* Frente */}
          <div style={{ ...FACE_BASE, background: "var(--card)", color: "var(--foreground)", border: `2px solid ${deckColor}30`, boxShadow: "0 4px 24px #00000012" }}>
            <span className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: deckColor, opacity: 0.7 }}>Frente</span>
            <div className="w-full text-center">
              <LatexRenderer fontSize="base" compact>{card.front}</LatexRenderer>
            </div>
            {card.frontImage && (
              <img src={card.frontImage} alt="" className="max-w-full max-h-40 rounded-xl object-contain"
                style={{ border: "1px solid var(--border)" }} />
            )}
            {!flipped && (
              <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>Toque para revelar</p>
            )}
          </div>

          {/* Verso */}
          <div style={{ ...FACE_BACK, background: "#E0F2F1", color: "var(--foreground)", border: `2px solid ${deckColor}60`, boxShadow: "0 4px 24px #00000012" }}>
            <span className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: deckColor, opacity: 0.7 }}>Resposta</span>
            <div className="w-full text-center">
              <LatexRenderer fontSize="base" compact>{card.back}</LatexRenderer>
            </div>
            {card.backImage && (
              <img src={card.backImage} alt="" className="max-w-full max-h-40 rounded-xl object-contain"
                style={{ border: "1px solid #B2DFDB" }} />
            )}
          </div>
        </div>
      </div>

      {/* Botões de avaliação — só aparecem depois de virar */}
      <div className={`transition-all duration-300 ${flipped ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}>
        <p className="text-xs font-semibold text-center mb-3" style={{ color: "var(--muted-foreground)" }}>
          Como foi?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTS.map(({ quality, label, emoji, bg, color, border }) => (
            <button key={quality}
              onClick={(e) => { e.stopPropagation(); handleRate(quality); }}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: bg, color, border: `2px solid ${border}` } as React.CSSProperties}>
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// =============================================================================
// Tela de seleção de baralho
// =============================================================================
function DeckList({ onSelect }: { onSelect: (deckId: number) => void }) {
  const { data: decks, isLoading } = trpc.flashcards.listDecks.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#009688" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-6 text-white"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Flashcards</h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              Repetição espaçada para memorização eficiente
            </p>
          </div>
        </div>
      </div>

      {/* Baralhos */}
      {!decks || decks.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <Layers className="h-12 w-12 mx-auto" style={{ color: "var(--muted-foreground)" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum baralho disponível</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>O admin ainda não criou baralhos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => {
            const color      = deck.color ?? "#009688";
            const hasDue     = (deck.dueCount ?? 0) > 0;
            const hasNew     = (deck.newCount ?? 0) > 0;
            const studyable  = deck.studyableCount ?? 0;
            const mastered   = deck.masteredCount ?? 0;
            const total      = deck.totalCards ?? 0;
            const pct        = total > 0 ? Math.round((mastered / total) * 100) : 0;

            return (
              <div key={deck.id} className="rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid var(--border)", background: "var(--card)" }}>

                <div className="h-1.5" style={{ background: color, opacity: 0.7 }} />

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base" style={{ color: "var(--foreground)" }}>{deck.title}</p>
                      {deck.description && (
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{deck.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => studyable > 0 ? onSelect(deck.id) : undefined}
                      disabled={studyable === 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-default"
                      style={{ background: studyable > 0 ? color : "var(--muted)", color: studyable > 0 ? "#fff" : "var(--muted-foreground)" }}>
                      {studyable > 0 ? (
                        <><BookOpen className="h-3.5 w-3.5" /> Estudar</>
                      ) : (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Em dia</>
                      )}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2">
                    {hasDue && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "#FEF2F2", color: "#DC2626" }}>
                        <Clock className="h-3 w-3" /> {deck.dueCount} para revisar
                      </span>
                    )}
                    {hasNew && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "#EFF6FF", color: "#1D4ED8" }}>
                        ✨ {deck.newCount} novos
                      </span>
                    )}
                    {mastered > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "#F0FDF4", color: "#16A34A" }}>
                        <CheckCircle2 className="h-3 w-3" /> {mastered} dominados
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {total} cards no total
                    </span>
                  </div>

                  {/* Barra de progresso de domínio */}
                  {total > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Domínio</span>
                        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
                        <div className="h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Export principal
// =============================================================================
export default function Flashcards({ deckId }: { deckId?: number }) {
  const [, navigate] = useLocation();
  const [activeDeckId, setActiveDeckId] = useState<number | null>(deckId ?? null);

  if (activeDeckId !== null) {
    return (
      <StudySession
        deckId={activeDeckId}
        onBack={() => {
          setActiveDeckId(null);
          navigate("/flashcards");
        }}
      />
    );
  }

  return (
    <DeckList
      onSelect={(id) => {
        setActiveDeckId(id);
        navigate(`/flashcards/${id}`);
      }}
    />
  );
}
