import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Loader2,
  ImageUp, Image as ImageIcon, ChevronDown, ChevronUp, Search,
} from "@/icons";

// ─── ImgBB upload (mesma lógica do AdminQuestoes) ────────────────────────────

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_KEY) throw new Error("Chave ImgBB não configurada (VITE_IMGBB_API_KEY).");
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const body = new FormData();
  body.append("image", base64);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message ?? "Erro no upload ImgBB");
  return data.data.url as string;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Imagem = { posicao: string; descricao: string; url?: string };

const NIVEIS = ["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"] as const;
const FONTES = ["UNICAMP", "FUVEST", "UNESP", "USP", "IME", "ITA", "OUTRO"];

const emptyForm = {
  fonte:              "UNICAMP",
  ano:                new Date().getFullYear(),
  numero_prova:       1,
  conteudo_principal: "",
  tags:               [] as string[],
  nivel_dificuldade:  "Média" as typeof NIVEIS[number],
  enunciado:          "",
  imagens:            [] as Imagem[],
  resolucao:          "",
};

// ─── Upload de imagem para um slot ───────────────────────────────────────────

function ImageSlotUpload({
  imagem, index, onChange,
}: {
  imagem: Imagem;
  index: number;
  onChange: (idx: number, updated: Imagem) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      onChange(index, { ...imagem, url });
      toast.success("Imagem enviada!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2 rounded-xl p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#E0F2F1", color: "#009688" }}>
          [{imagem.posicao}]
        </span>
        <span className="text-xs flex-1" style={{ color: "var(--muted-foreground)" }}>{imagem.descricao}</span>
      </div>

      {/* Editar posição e descrição */}
      <div className="grid grid-cols-2 gap-2">
        <input
          value={imagem.posicao}
          onChange={(e) => onChange(index, { ...imagem, posicao: e.target.value })}
          placeholder="posição (ex: enunciado, item_b)"
          className="px-2 py-1.5 rounded-lg text-xs"
          style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
        />
        <input
          value={imagem.descricao}
          onChange={(e) => onChange(index, { ...imagem, descricao: e.target.value })}
          placeholder="descrição da imagem"
          className="px-2 py-1.5 rounded-lg text-xs"
          style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
        />
      </div>

      {/* URL manual ou upload */}
      <div className="flex items-center gap-2">
        <input
          value={imagem.url ?? ""}
          onChange={(e) => onChange(index, { ...imagem, url: e.target.value || undefined })}
          placeholder="URL da imagem (ou use o botão para fazer upload)"
          className="flex-1 px-2 py-1.5 rounded-lg text-xs font-mono"
          style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
        />
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
          style={{ background: "#E0F2F1", color: "#009688", border: "1.5px solid #B2DFDB" }}
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageUp className="h-3.5 w-3.5" />}
          {uploading ? "Enviando…" : "Upload"}
        </button>
      </div>

      {/* Preview */}
      {imagem.url && (
        <img
          src={imagem.url}
          alt="preview"
          className="max-h-40 rounded-lg object-contain"
          style={{ border: "1px solid var(--border)" }}
        />
      )}
    </div>
  );
}

// ─── Formulário de edição / criação ──────────────────────────────────────────

function QuestionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: typeof emptyForm;
  onSave: (data: typeof emptyForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState("");
  const [tab, setTab] = useState<"form" | "preview">("form");

  const s = (patch: Partial<typeof emptyForm>) => setForm((f) => ({ ...f, ...patch }));

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) s({ tags: [...form.tags, t] });
    setTagInput("");
  }

  function addImagem() {
    s({ imagens: [...form.imagens, { posicao: "enunciado", descricao: "" }] });
  }

  function removeImagem(i: number) {
    s({ imagens: form.imagens.filter((_, idx) => idx !== i) });
  }

  function updateImagem(idx: number, updated: Imagem) {
    const next = [...form.imagens];
    next[idx] = updated;
    s({ imagens: next });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 10,
    border: "1.5px solid var(--border)", background: "var(--card)",
    color: "var(--foreground)", fontSize: 13,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.07em", color: "var(--muted-foreground)", display: "block", marginBottom: 4,
  };

  return (
    <div className="space-y-5">
      {/* Abas form / preview */}
      <div className="flex gap-2">
        {(["form", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold"
            style={tab === t
              ? { background: "#009688", color: "#fff" }
              : { background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            {t === "form" ? "Editar" : "Preview"}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div className="card space-y-4">
          <p className="font-black" style={{ color: "var(--foreground)" }}>
            Q{form.numero_prova} — {form.conteudo_principal}
          </p>
          <LatexRenderer fontSize="sm">{form.enunciado}</LatexRenderer>
          {form.imagens.filter(i => i.url).map((img, i) => (
            <div key={i}>
              <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>[{img.posicao}]</p>
              <img src={img.url} alt="" className="max-w-full rounded-lg" style={{ border: "1px solid var(--border)" }} />
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <p className="text-xs font-bold mb-2" style={{ color: "var(--muted-foreground)" }}>RESOLUÇÃO</p>
            <LatexRenderer fontSize="sm">{form.resolucao}</LatexRenderer>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Linha 1: fonte / ano / número */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label style={labelStyle}>Fonte</label>
              <select value={form.fonte} onChange={(e) => s({ fonte: e.target.value })} style={inputStyle}>
                {FONTES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ano</label>
              <input type="number" value={form.ano} onChange={(e) => s({ ano: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nº questão</label>
              <input type="number" value={form.numero_prova} onChange={(e) => s({ numero_prova: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>

          {/* Conteúdo + dificuldade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Conteúdo principal</label>
              <input value={form.conteudo_principal} onChange={(e) => s({ conteudo_principal: e.target.value })} style={inputStyle} placeholder="ex: Função Quadrática" />
            </div>
            <div>
              <label style={labelStyle}>Dificuldade</label>
              <select value={form.nivel_dificuldade} onChange={(e) => s({ nivel_dificuldade: e.target.value as any })} style={inputStyle}>
                {NIVEIS.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.tags.map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: "#E0F2F1", color: "#009688" }}>
                  {t}
                  <button onClick={() => s({ tags: form.tags.filter((x) => x !== t) })} style={{ color: "#009688" }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Adicionar tag e pressionar Enter"
                style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={addTag}
                className="px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
                style={{ background: "#009688", color: "#fff" }}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <label style={labelStyle}>Enunciado (suporta LaTeX)</label>
            <textarea
              value={form.enunciado}
              onChange={(e) => s({ enunciado: e.target.value })}
              rows={8}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
              placeholder={"Considere $f(x) = x^2$...\n\na) Prove que...\n\nb) Calcule..."}
            />
          </div>

          {/* Imagens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={labelStyle}>Imagens referenciadas no enunciado</label>
              <button type="button" onClick={addImagem}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{ background: "#009688", color: "#fff" }}>
                <Plus className="h-3.5 w-3.5" /> Adicionar imagem
              </button>
            </div>
            {form.imagens.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Nenhuma imagem. Clique em "Adicionar imagem" para incluir fotos da prova.
              </p>
            ) : (
              <div className="space-y-3">
                {form.imagens.map((img, i) => (
                  <div key={i} className="relative">
                    <button
                      type="button"
                      onClick={() => removeImagem(i)}
                      className="absolute top-2 right-2 z-10 p-1 rounded-lg hover:opacity-70"
                      style={{ background: "#FEF2F2", color: "#DC2626" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ImageSlotUpload imagem={img} index={i} onChange={updateImagem} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resolução */}
          <div>
            <label style={labelStyle}>Resolução oficial (suporta LaTeX)</label>
            <textarea
              value={form.resolucao}
              onChange={(e) => s({ resolucao: e.target.value })}
              rows={10}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
              placeholder={"**a)** Seja $x = ...$\n\n$$\\frac{a}{b} = c$$\n\nLogo..."}
            />
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-3 justify-end pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "var(--muted)", color: "var(--foreground)" }}>
          <X className="h-4 w-4" /> Cancelar
        </button>
        <button onClick={() => onSave(form)} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: "#009688", color: "#fff" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar questão
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminSegundaFase() {
  const utils = trpc.useUtils();
  const { data: questions, isLoading } = trpc.segundaFase.adminGetAll.useQuery();

  const createMutation = trpc.segundaFase.adminCreate.useMutation({
    onSuccess: () => { utils.segundaFase.adminGetAll.invalidate(); setMode("list"); toast.success("Questão criada!"); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.segundaFase.adminUpdate.useMutation({
    onSuccess: () => { utils.segundaFase.adminGetAll.invalidate(); setMode("list"); toast.success("Questão atualizada!"); },
    onError: (e) => toast.error(e.message),
  });
  const toggleMutation = trpc.segundaFase.adminToggleActive.useMutation({
    onSuccess: () => utils.segundaFase.adminGetAll.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editQ, setEditQ] = useState<(typeof questions)[0] | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function openEdit(q: (typeof questions)[0]) {
    setEditQ(q);
    setMode("edit");
  }

  function handleSave(data: typeof emptyForm) {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (editQ) {
      updateMutation.mutate({ id: editQ.id, ...data });
    }
  }

  const filtered = (questions ?? []).filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.conteudo_principal.toLowerCase().includes(s) ||
      q.enunciado.toLowerCase().includes(s) ||
      q.fonte.toLowerCase().includes(s)
    );
  });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
    </div>
  );

  // ── Formulário ──
  if (mode === "create" || mode === "edit") {
    const initial = mode === "edit" && editQ
      ? {
          fonte:              editQ.fonte,
          ano:                editQ.ano ?? new Date().getFullYear(),
          numero_prova:       editQ.numero_prova ?? 1,
          conteudo_principal: editQ.conteudo_principal,
          tags:               (editQ.tags as string[]) ?? [],
          nivel_dificuldade:  editQ.nivel_dificuldade as typeof NIVEIS[number],
          enunciado:          editQ.enunciado,
          imagens:            (editQ.imagens as Imagem[]) ?? [],
          resolucao:          editQ.resolucao,
        }
      : emptyForm;

    return (
      <div className="space-y-5 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("list")}
            className="p-2 rounded-xl hover:opacity-70"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}>
            <X className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
            {mode === "create" ? "Nova questão dissertativa" : `Editar Q${editQ?.numero_prova} — ${editQ?.fonte} ${editQ?.ano}`}
          </h1>
        </div>
        <div className="card">
          <QuestionForm
            initial={initial}
            onSave={handleSave}
            onCancel={() => setMode("list")}
            saving={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </div>
    );
  }

  // ── Lista ──
  return (
    <div className="space-y-5 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
            Admin — Segunda Fase
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {questions?.length ?? 0} questões dissertativas cadastradas
          </p>
        </div>
        <button onClick={() => setMode("create")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
          style={{ background: "#009688", color: "#fff" }}>
          <Plus className="h-4 w-4" /> Nova questão
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por conteúdo, fonte ou trecho do enunciado…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
          style={{ border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
        />
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtered.map((q) => {
          const expanded = expandedId === q.id;
          const hasImages = Array.isArray(q.imagens) && (q.imagens as Imagem[]).length > 0;
          const missingImages = hasImages && (q.imagens as Imagem[]).some((img) => !img.url);

          return (
            <div key={q.id} className="card overflow-hidden" style={{ padding: 0, opacity: q.active ? 1 : 0.55 }}>
              {/* Cabeçalho da linha */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: "#009688", color: "#fff" }}>
                  {q.numero_prova}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#E0F2F1", color: "#009688" }}>
                      {q.fonte} {q.ano}
                    </span>
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                      {q.conteudo_principal}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      [{q.nivel_dificuldade}]
                    </span>
                    {missingImages && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#FFFBEB", color: "#B45309" }}>
                        ⚠️ Imagem pendente
                      </span>
                    )}
                    {hasImages && !missingImages && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#DCFCE7", color: "#15803D" }}>
                        ✅ Imagens OK
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(q)}
                    className="p-1.5 rounded-lg hover:opacity-70"
                    style={{ background: "#E0F2F1", color: "#009688" }}
                    title="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => toggleMutation.mutate({ id: q.id, active: !q.active })}
                    disabled={toggleMutation.isPending}
                    className="p-1.5 rounded-lg hover:opacity-70"
                    style={q.active
                      ? { background: "#FEF2F2", color: "#DC2626" }
                      : { background: "#F0FFF4", color: "#16A34A" }}
                    title={q.active ? "Desativar" : "Ativar"}>
                    {q.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => setExpandedId(expanded ? null : q.id)}
                    className="p-1.5 rounded-lg hover:opacity-70"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expansão: preview do enunciado + imagens */}
              {expanded && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="pt-3 text-sm" style={{ color: "var(--foreground)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                      Enunciado
                    </p>
                    <LatexRenderer fontSize="sm">{q.enunciado}</LatexRenderer>
                  </div>

                  {/* Imagens */}
                  {hasImages && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                        Imagens ({(q.imagens as Imagem[]).length})
                      </p>
                      {(q.imagens as Imagem[]).map((img, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl p-3"
                          style={{ background: img.url ? "var(--muted)" : "#FFFBEB", border: `1px solid ${img.url ? "var(--border)" : "#FCD34D"}` }}>
                          <div className="flex-1">
                            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                              [{img.posicao}]
                            </p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{img.descricao}</p>
                            {!img.url && (
                              <p className="text-xs font-bold mt-1" style={{ color: "#B45309" }}>⚠️ Imagem não enviada ainda</p>
                            )}
                          </div>
                          {img.url && (
                            <img src={img.url} alt="" className="h-20 rounded-lg object-contain"
                              style={{ border: "1px solid var(--border)" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={() => openEdit(q)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full justify-center"
                    style={{ background: "#009688", color: "#fff" }}>
                    <Pencil className="h-4 w-4" />
                    {missingImages ? "Adicionar imagens pendentes" : "Editar questão"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
            <p className="text-3xl mb-2">📭</p>
            <p className="font-semibold">Nenhuma questão encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
