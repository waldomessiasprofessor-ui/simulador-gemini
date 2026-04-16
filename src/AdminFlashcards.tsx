import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, X, Save, Loader2, Eye, EyeOff,
  Layers, ChevronRight, ChevronLeft, Brain, FileText,
} from "lucide-react";

// =============================================================================
// Paleta de cores para baralhos
// =============================================================================
const DECK_COLORS = [
  "#009688", "#00695C", "#1565C0", "#283593",
  "#6A1B9A", "#AD1457", "#C62828", "#E65100",
  "#F57F17", "#2E7D32", "#37474F", "#4527A0",
];

// =============================================================================
// Formulário de deck
// =============================================================================
function DeckForm({
  initial, onSave, onCancel, saving,
}: {
  initial?: { title: string; description: string; color: string };
  onSave:  (d: { title: string; description: string; color: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle]       = useState(initial?.title ?? "");
  const [description, setDesc]  = useState(initial?.description ?? "");
  const [color, setColor]       = useState(initial?.color ?? "#009688");

  return (
    <div className="space-y-4 p-5 rounded-2xl"
      style={{ background: "#fff", border: "1.5px solid #E2D9EE" }}>
      <div>
        <label className="text-xs font-bold block mb-1" style={{ color: "#1A1A2E" }}>Nome do baralho *</label>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{ border: "1.5px solid #E2D9EE", background: "#fff", color: "#1A1A2E" }}
          placeholder="Ex: Trigonometria"
          onFocus={e => (e.target.style.borderColor = "#009688")}
          onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
        />
      </div>
      <div>
        <label className="text-xs font-bold block mb-1" style={{ color: "#1A1A2E" }}>Descrição (opcional)</label>
        <input
          value={description} onChange={e => setDesc(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{ border: "1.5px solid #E2D9EE", background: "#fff", color: "#1A1A2E" }}
          placeholder="Ex: Seno, cosseno, tangente e relações no triângulo"
          onFocus={e => (e.target.style.borderColor = "#009688")}
          onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
        />
      </div>
      <div>
        <label className="text-xs font-bold block mb-2" style={{ color: "#1A1A2E" }}>Cor do baralho</label>
        <div className="flex flex-wrap gap-2">
          {DECK_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: color === c ? "#1A1A2E" : "transparent", outline: color === c ? `3px solid ${c}40` : "none" }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => { if (title.trim()) onSave({ title: title.trim(), description: description.trim(), color }); }}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "#009688" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </button>
        <button onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#F1F5F9", color: "#64748B" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Card de preview LaTeX (frente ou verso)
// =============================================================================
function LatexPreview({ content, label, color }: { content: string; label: string; color: string }) {
  if (!content) return null;
  return (
    <div className="rounded-xl p-3 space-y-1" style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color }}>{label}</p>
      <LatexRenderer fontSize="sm" compact>{content}</LatexRenderer>
    </div>
  );
}

// =============================================================================
// Formulário de card
// =============================================================================
function CardForm({
  initial, deckColor, onSave, onCancel, saving,
}: {
  initial?: { front: string; back: string; frontImage?: string | null; backImage?: string | null };
  deckColor: string;
  onSave:   (d: { front: string; back: string; frontImage: string | null; backImage: string | null }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [front,      setFront]      = useState(initial?.front ?? "");
  const [back,       setBack]       = useState(initial?.back  ?? "");
  const [frontImage, setFrontImage] = useState(initial?.frontImage ?? "");
  const [backImage,  setBackImage]  = useState(initial?.backImage  ?? "");
  const [preview,    setPreview]    = useState(false);

  const inputStyle = { border: "1.5px solid #E2D9EE", background: "#fff", color: "#1A1A2E" };
  const labelStyle: React.CSSProperties = { color: "#1A1A2E", fontSize: "0.75rem", fontWeight: 700, display: "block", marginBottom: 4 };

  return (
    <div className="space-y-4 p-5 rounded-2xl"
      style={{ background: "#fff", border: `1.5px solid ${deckColor}44` }}>

      {/* Toggle preview */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>
          {initial ? "Editar card" : "Novo card"}
        </p>
        <button onClick={() => setPreview(p => !p)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{ background: preview ? deckColor : "#E0F7F4", color: preview ? "#fff" : deckColor }}>
          <Eye className="h-3.5 w-3.5" />
          {preview ? "Ocultar prévia" : "Ver prévia LaTeX"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Frente */}
        <div className="space-y-2">
          <label style={labelStyle}>Frente *</label>
          <textarea rows={5}
            value={front} onChange={e => setFront(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none font-mono resize-vertical"
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Pergunta ou conceito. Use $...$ para inline LaTeX e $$...$$ para bloco."
            onFocus={e => (e.target.style.borderColor = deckColor)}
            onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
          />
          <input value={frontImage} onChange={e => setFrontImage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={inputStyle} placeholder="URL de imagem na frente (opcional)"
            onFocus={e => (e.target.style.borderColor = deckColor)}
            onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
          />
          {preview && <LatexPreview content={front} label="Prévia — Frente" color={deckColor} />}
        </div>

        {/* Verso */}
        <div className="space-y-2">
          <label style={labelStyle}>Verso *</label>
          <textarea rows={5}
            value={back} onChange={e => setBack(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none font-mono resize-vertical"
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Resposta ou desenvolvimento. LaTeX suportado."
            onFocus={e => (e.target.style.borderColor = deckColor)}
            onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
          />
          <input value={backImage} onChange={e => setBackImage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={inputStyle} placeholder="URL de imagem no verso (opcional)"
            onFocus={e => (e.target.style.borderColor = deckColor)}
            onBlur={e  => (e.target.style.borderColor = "#E2D9EE")}
          />
          {preview && <LatexPreview content={back} label="Prévia — Verso" color={deckColor} />}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => {
            if (!front.trim() || !back.trim()) { toast.error("Preencha frente e verso."); return; }
            onSave({ front: front.trim(), back: back.trim(), frontImage: frontImage.trim() || null, backImage: backImage.trim() || null });
          }}
          disabled={saving || !front.trim() || !back.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
          style={{ background: deckColor }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar card
        </button>
        <button onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#F1F5F9", color: "#64748B" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Painel de cards de um baralho
// =============================================================================
function CardsPanel({ deckId, deckColor, onBack }: { deckId: number; deckColor: string; onBack: () => void }) {
  const utils = trpc.useUtils();

  const { data: cards, isLoading } = trpc.flashcards.listCards.useQuery({ deckId });

  const createMutation = trpc.flashcards.createCard.useMutation({
    onSuccess: () => { toast.success("Card criado!"); utils.flashcards.listCards.invalidate(); setShowForm(false); },
    onError: e => toast.error(e.message),
  });
  const updateMutation = trpc.flashcards.updateCard.useMutation({
    onSuccess: () => { toast.success("Card atualizado!"); utils.flashcards.listCards.invalidate(); setEditId(null); },
    onError: e => toast.error(e.message),
  });
  const deleteMutation = trpc.flashcards.deleteCard.useMutation({
    onSuccess: () => { toast.success("Card removido."); utils.flashcards.listCards.invalidate(); setDeleteConfirmId(null); },
    onError: e => toast.error(e.message),
  });
  const toggleMutation = trpc.flashcards.updateCard.useMutation({
    onSuccess: () => utils.flashcards.listCards.invalidate(),
  });

  const [showForm,       setShowForm]       = useState(false);
  const [editId,         setEditId]         = useState<number | null>(null);
  const [expandedId,     setExpandedId]     = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const editingCard = editId !== null ? cards?.find(c => c.id === editId) : null;

  return (
    <div className="space-y-4">

      {/* Botão novo card */}
      {!showForm && editId === null && (
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white w-full justify-center"
          style={{ background: deckColor }}>
          <Plus className="h-4 w-4" /> Novo card
        </button>
      )}

      {/* Formulário novo card */}
      {showForm && (
        <CardForm
          deckColor={deckColor}
          saving={createMutation.isPending}
          onCancel={() => setShowForm(false)}
          onSave={d => createMutation.mutate({ deckId, ...d })}
        />
      )}

      {/* Formulário editar card */}
      {editingCard && (
        <CardForm
          initial={{ front: editingCard.front, back: editingCard.back, frontImage: editingCard.frontImage, backImage: editingCard.backImage }}
          deckColor={deckColor}
          saving={updateMutation.isPending}
          onCancel={() => setEditId(null)}
          onSave={d => updateMutation.mutate({ id: editingCard.id, ...d })}
        />
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: deckColor }} />
        </div>
      ) : !cards || cards.length === 0 ? (
        <div className="text-center py-12 space-y-1">
          <FileText className="h-10 w-10 mx-auto" style={{ color: "#CBD5E1" }} />
          <p className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>Nenhum card ainda</p>
          <p className="text-xs" style={{ color: "#64748B" }}>Clique em "Novo card" para começar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card, i) => {
            const isExpanded = expandedId === card.id;
            return (
              <div key={card.id} className="rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${card.active ? deckColor + "33" : "#E2E8F0"}`, background: card.active ? "#fff" : "#F8FAFC", opacity: card.active ? 1 : 0.55 }}>

                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span className="text-xs font-bold w-6 flex-shrink-0" style={{ color: "#94A3B8" }}>#{i + 1}</span>

                  <button onClick={() => setExpandedId(isExpanded ? null : card.id)}
                    className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#1A1A2E" }}>
                      {card.front.slice(0, 80)}{card.front.length > 80 ? "…" : ""}
                    </p>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => { setEditId(card.id); setShowForm(false); setExpandedId(null); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title="Editar">
                      <Pencil className="h-3.5 w-3.5" style={{ color: deckColor }} />
                    </button>
                    <button onClick={() => toggleMutation.mutate({ id: card.id, active: !card.active })}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title={card.active ? "Desativar" : "Ativar"}>
                      {card.active
                        ? <EyeOff className="h-3.5 w-3.5" style={{ color: "#F57F17" }} />
                        : <Eye    className="h-3.5 w-3.5" style={{ color: "#00897B" }} />}
                    </button>
                    {deleteConfirmId === card.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteMutation.mutate({ id: card.id })}
                          className="px-2 py-0.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: "#E53935" }}>Sim</button>
                        <button onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 rounded-lg text-xs font-bold"
                          style={{ background: "#F1F5F9", color: "#64748B" }}>Não</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(card.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50" title="Excluir">
                        <Trash2 className="h-3.5 w-3.5" style={{ color: "#E53935" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                    style={{ borderTop: `1px solid ${deckColor}22` }}>
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: deckColor }}>FRENTE</p>
                      <LatexRenderer fontSize="sm" compact>{card.front}</LatexRenderer>
                      {card.frontImage && <img src={card.frontImage} alt="" className="max-w-full max-h-32 rounded-lg mt-2 object-contain" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-1" style={{ color: deckColor }}>VERSO</p>
                      <LatexRenderer fontSize="sm" compact>{card.back}</LatexRenderer>
                      {card.backImage && <img src={card.backImage} alt="" className="max-w-full max-h-32 rounded-lg mt-2 object-contain" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Painel de baralhos
// =============================================================================
export default function AdminFlashcards() {
  const utils = trpc.useUtils();
  const { data: decks, isLoading } = trpc.flashcards.listAllDecks.useQuery();

  const createDeck = trpc.flashcards.createDeck.useMutation({
    onSuccess: () => { toast.success("Baralho criado!"); utils.flashcards.listAllDecks.invalidate(); setShowDeckForm(false); },
    onError: e => toast.error(e.message),
  });
  const updateDeck = trpc.flashcards.updateDeck.useMutation({
    onSuccess: () => { toast.success("Baralho atualizado!"); utils.flashcards.listAllDecks.invalidate(); setEditDeckId(null); },
    onError: e => toast.error(e.message),
  });
  const deleteDeck = trpc.flashcards.deleteDeck.useMutation({
    onSuccess: () => { toast.success("Baralho removido."); utils.flashcards.listAllDecks.invalidate(); setActiveDeckId(null); setDeleteDeckId(null); },
    onError: e => toast.error(e.message),
  });

  const [showDeckForm,   setShowDeckForm]   = useState(false);
  const [editDeckId,     setEditDeckId]     = useState<number | null>(null);
  const [activeDeckId,   setActiveDeckId]   = useState<number | null>(null);
  const [deleteDeckId,   setDeleteDeckId]   = useState<number | null>(null);

  const activeDeck = activeDeckId !== null ? decks?.find(d => d.id === activeDeckId) : null;
  const editingDeck = editDeckId  !== null ? decks?.find(d => d.id === editDeckId)   : null;

  return (
    <div className="space-y-6 py-2">

      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <div className="flex items-center gap-3">
          {activeDeck && (
            <button onClick={() => setActiveDeckId(null)}
              className="p-1.5 rounded-xl hover:opacity-70" style={{ background: "rgba(255,255,255,0.15)" }}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <Brain className="h-6 w-6 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold">
              {activeDeck ? activeDeck.title : "Flashcards — Admin"}
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              {activeDeck
                ? `${activeDeck.cardCount ?? 0} cards neste baralho`
                : `${decks?.length ?? 0} baralhos cadastrados`}
            </p>
          </div>
        </div>
        {!activeDeck && (
          <button onClick={() => { setShowDeckForm(true); setEditDeckId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Plus className="h-4 w-4" /> Novo baralho
          </button>
        )}
      </div>

      {/* ── Vista: lista de baralhos ── */}
      {!activeDeck && (
        <>
          {showDeckForm && (
            <DeckForm
              saving={createDeck.isPending}
              onCancel={() => setShowDeckForm(false)}
              onSave={d => createDeck.mutate(d)}
            />
          )}

          {editingDeck && (
            <DeckForm
              initial={{ title: editingDeck.title, description: editingDeck.description ?? "", color: editingDeck.color }}
              saving={updateDeck.isPending}
              onCancel={() => setEditDeckId(null)}
              onSave={d => updateDeck.mutate({ id: editingDeck.id, ...d })}
            />
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
            </div>
          ) : !decks || decks.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Layers className="h-12 w-12 mx-auto" style={{ color: "#CBD5E1" }} />
              <p className="font-semibold" style={{ color: "#1A1A2E" }}>Nenhum baralho criado</p>
              <p className="text-sm" style={{ color: "#64748B" }}>Clique em "Novo baralho" para começar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {decks.map(deck => (
                <div key={deck.id} className="rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid #E2D9EE", background: "#fff" }}>

                  <div className="h-1" style={{ background: deck.color }} />

                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: deck.color + "22" }}>
                      <Layers className="h-4 w-4" style={{ color: deck.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: "#1A1A2E" }}>{deck.title}</p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>
                        {deck.cardCount ?? 0} card(s)
                        {deck.description ? ` · ${deck.description.slice(0, 50)}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setActiveDeckId(deck.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
                        style={{ background: deck.color + "18", color: deck.color }}>
                        Cards <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => { setEditDeckId(deck.id); setShowDeckForm(false); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100" title="Editar">
                        <Pencil className="h-3.5 w-3.5" style={{ color: "#009688" }} />
                      </button>
                      {deleteDeckId === deck.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => deleteDeck.mutate({ id: deck.id })}
                            className="px-2 py-0.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: "#E53935" }}>Sim</button>
                          <button onClick={() => setDeleteDeckId(null)}
                            className="px-2 py-0.5 rounded-lg text-xs font-bold"
                            style={{ background: "#F1F5F9", color: "#64748B" }}>Não</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteDeckId(deck.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50" title="Excluir baralho">
                          <Trash2 className="h-3.5 w-3.5" style={{ color: "#E53935" }} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Vista: cards do baralho selecionado ── */}
      {activeDeck && (
        <CardsPanel
          deckId={activeDeck.id}
          deckColor={activeDeck.color}
          onBack={() => setActiveDeckId(null)}
        />
      )}
    </div>
  );
}
