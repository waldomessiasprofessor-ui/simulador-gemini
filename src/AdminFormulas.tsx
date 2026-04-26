import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  Loader2, X, Save, FlaskConical, Eye, EyeOff
} from "@/icons";

const SECOES_PADRAO = [
  "Álgebra", "Geometria Plana", "Geometria Analítica",
  "Geometria Espacial", "Trigonometria", "Estatística",
  "Matemática Financeira", "Probabilidade",
];

const CORES_PADRAO = [
  { label: "Teal", value: "#009688" },
  { label: "Roxo", value: "#6B2FA0" },
  { label: "Laranja", value: "#E65100" },
  { label: "Verde", value: "#2E7D32" },
  { label: "Azul", value: "#1565C0" },
];

const emptyForm = {
  secao: "",
  secaoCustom: "",
  cor: "#009688",
  titulo: "",
  formula: "",
  descricao: "",
  ordem: 0,
};

type Form = typeof emptyForm;

export default function AdminFormulas() {
  const [showForm, setShowForm] = useState(false);
  const formRef = typeof window !== 'undefined' ? { current: null as HTMLDivElement | null } : { current: null };
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [openId, setOpenId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);

  const utils = trpc.useUtils();

  const { data: rows, isLoading } = trpc.formulas.listAll.useQuery();

  const createMutation = trpc.formulas.create.useMutation({
    onSuccess: () => { toast.success("Fórmula criada!"); resetForm(); utils.formulas.listAll.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.formulas.update.useMutation({
    onSuccess: () => { toast.success("Fórmula atualizada!"); resetForm(); utils.formulas.listAll.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.formulas.delete.useMutation({
    onSuccess: () => { toast.success("Fórmula removida."); utils.formulas.listAll.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const toggleMutation = trpc.formulas.update.useMutation({
    onSuccess: () => utils.formulas.listAll.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setPreview(false);
  }

  function startEdit(f: any) {
    setForm({
      secao: SECOES_PADRAO.includes(f.secao) ? f.secao : "custom",
      secaoCustom: SECOES_PADRAO.includes(f.secao) ? "" : f.secao,
      cor: f.cor,
      titulo: f.titulo,
      formula: f.formula,
      descricao: f.descricao,
      ordem: f.ordem,
    });
    setEditId(f.id);
    setShowForm(true);
    setOpenId(null);
    // Rola para o topo onde fica o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("formula-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleSubmit() {
    const secao = form.secao === "custom" ? form.secaoCustom : form.secao;
    if (!secao.trim()) { toast.error("Selecione ou escreva uma seção."); return; }
    if (!form.titulo.trim()) { toast.error("Preencha o título."); return; }
    if (!form.formula.trim()) { toast.error("Preencha a fórmula (LaTeX)."); return; }
    if (!form.descricao.trim()) { toast.error("Preencha a descrição."); return; }

    const payload = { secao, cor: form.cor, titulo: form.titulo, formula: form.formula, descricao: form.descricao, ordem: form.ordem };
    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.85rem", borderRadius: "0.75rem",
    border: "1.5px solid var(--border)", fontSize: "0.875rem",
    outline: "none", color: "var(--foreground)", background: "var(--card)",
  };
  const labelStyle: React.CSSProperties = {
    color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 600,
    display: "block", marginBottom: 4,
  };

  // Agrupa por seção para exibição
  const grouped: Record<string, any[]> = {};
  for (const f of (rows ?? [])) {
    if (!grouped[f.secao]) grouped[f.secao] = [];
    grouped[f.secao].push(f);
  }

  return (
    <div className="space-y-6 py-2">

      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #2E7D32, #009688)" }}>
        <div>
          <h1 className="text-xl font-bold">Banco de Fórmulas</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            {rows?.length ?? 0} fórmula(s) cadastrada(s)
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Plus className="h-4 w-4" /> Nova fórmula
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div id="formula-form" className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--card)", border: `2px solid ${editId ? "#E65100" : "var(--border)"}` }}>

          {/* Banner de edição */}
          {editId && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D" }}>
              <Pencil className="h-4 w-4 flex-shrink-0" style={{ color: "#B45309" }} />
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#B45309" }}>
                  Modo edição — fórmula #{editId}
                </p>
                <p className="text-xs" style={{ color: "#B45309" }}>
                  Altere os campos abaixo e clique em "Salvar alterações"
                </p>
              </div>
              <button onClick={resetForm} className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#B45309", color: "#fff" }}>
                Cancelar
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
              {editId ? `Editar fórmula #${editId}` : "Nova fórmula"}
            </h2>
            {!editId && (
              <button onClick={resetForm}>
                <X className="h-5 w-5" style={{ color: "var(--muted-foreground)" }} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Seção */}
            <div>
              <label style={labelStyle}>Seção</label>
              <select style={inputStyle} value={form.secao}
                onChange={(e) => setForm({ ...form, secao: e.target.value, secaoCustom: "" })}>
                <option value="">Selecione...</option>
                {SECOES_PADRAO.map((s) => <option key={s} value={s}>{s}</option>)}
                <option value="custom">+ Outra seção...</option>
              </select>
            </div>

            {form.secao === "custom" && (
              <div>
                <label style={labelStyle}>Nome da nova seção</label>
                <input style={inputStyle} value={form.secaoCustom}
                  onChange={(e) => setForm({ ...form, secaoCustom: e.target.value })}
                  placeholder="Ex: Análise Combinatória" />
              </div>
            )}

            {/* Cor */}
            <div>
              <label style={labelStyle}>Cor da seção</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {CORES_PADRAO.map(({ label, value }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, cor: value })}
                    className="h-7 w-7 rounded-full border-2 transition-all"
                    style={{ background: value, borderColor: form.cor === value ? "var(--foreground)" : "transparent" }}
                    title={label} />
                ))}
                <input type="color" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })}
                  className="h-7 w-7 rounded-full cursor-pointer border-0" title="Cor personalizada" />
              </div>
            </div>

            {/* Ordem */}
            <div>
              <label style={labelStyle}>Ordem dentro da seção</label>
              <input type="number" style={inputStyle} value={form.ordem}
                onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} />
            </div>
          </div>

          {/* Título */}
          <div>
            <label style={labelStyle}>Título da fórmula</label>
            <input style={inputStyle} value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex: Fórmula de Bhaskara" />
          </div>

          {/* Fórmula LaTeX */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label style={labelStyle}>Fórmula (LaTeX — use $$...$$)</label>
              <button onClick={() => setPreview((v) => !v)}
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: "#009688" }}>
                <FlaskConical className="h-3.5 w-3.5" />
                {preview ? "Editar" : "Pré-visualizar"}
              </button>
            </div>
            {preview && form.formula ? (
              <div className="p-4 rounded-xl text-center"
                style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}>
                <LatexRenderer>{form.formula}</LatexRenderer>
              </div>
            ) : (
              <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3}
                value={form.formula}
                onChange={(e) => setForm({ ...form, formula: e.target.value })}
                placeholder="$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$" />
            )}
          </div>

          {/* Descrição */}
          <div>
            <label style={labelStyle}>Descrição / explicação</label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Explique quando usar esta fórmula..." />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: "#009688" }}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editId ? "Salvar alterações" : "Criar fórmula"}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista agrupada por seção */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
          <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhuma fórmula ainda</p>
          <p className="text-sm mt-1">Clique em "Nova fórmula" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([secao, fList]) => (
            <div key={secao}>
              <h2 className="text-sm font-bold mb-2 px-1" style={{ color: fList[0].cor }}>{secao}</h2>
              <div className="space-y-2">
                {fList.map((f) => {
                  const isOpen = openId === f.id;
                  return (
                    <div key={f.id} className="rounded-xl overflow-hidden"
                      style={{
                        border: "1.5px solid var(--border)",
                        background: "var(--card)",
                        opacity: f.active ? 1 : 0.55,
                      }}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button onClick={() => setOpenId(isOpen ? null : f.id)}
                          className="flex-1 flex items-center gap-3 text-left">
                          <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: f.cor }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{f.titulo}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                              Seção: {f.secao} · Ordem: {f.ordem}
                            </p>
                          </div>
                          {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                            : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />}
                        </button>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => startEdit(f)} className="p-1.5 rounded-lg hover:opacity-70" title="Editar">
                            <Pencil className="h-3.5 w-3.5" style={{ color: "#009688" }} />
                          </button>
                          <button onClick={() => toggleMutation.mutate({ id: f.id, active: !f.active })}
                            className="p-1.5 rounded-lg hover:opacity-70" title={f.active ? "Desativar" : "Ativar"}>
                            {f.active
                              ? <EyeOff className="h-3.5 w-3.5" style={{ color: "#B45309" }} />
                              : <Eye className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />}
                          </button>
                          <button onClick={() => { if (confirm("Excluir esta fórmula?")) deleteMutation.mutate({ id: f.id }); }}
                            className="p-1.5 rounded-lg hover:opacity-70" title="Excluir">
                            <Trash2 className="h-3.5 w-3.5" style={{ color: "#DC2626" }} />
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="px-4 pb-4 space-y-3"
                          style={{ borderTop: "1px solid var(--border)" }}>
                          <div className="pt-3 text-center rounded-xl p-3"
                            style={{ background: "var(--muted)" }}>
                            <LatexRenderer>{f.formula}</LatexRenderer>
                          </div>
                          <p className="text-sm" style={{ color: "var(--foreground)" }}>{f.descricao}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
