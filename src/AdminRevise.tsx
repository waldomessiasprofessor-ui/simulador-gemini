import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X,
  BookOpen, ChevronDown, ChevronUp, Check
} from "lucide-react";

const LETTERS = ["A", "B", "C", "D"];

type Questao = { enunciado: string; opcoes: string[]; correta: number };
type FormData = {
  titulo: string;
  conteudo: string;
  topico: string;
  questoes: Questao[];
  active: boolean;
};

const emptyQuestao = (): Questao => ({ enunciado: "", opcoes: ["", "", "", ""], correta: 0 });
const emptyForm = (): FormData => ({
  titulo: "", conteudo: "", topico: "",
  questoes: [emptyQuestao(), emptyQuestao(), emptyQuestao()],
  active: true,
});

function InputStyle({ label, value, onChange, placeholder, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: "100%", borderRadius: "0.75rem", padding: "0.6rem 0.8rem",
    border: "1.5px solid var(--border)", background: "var(--card)",
    color: "var(--foreground)", fontSize: "0.875rem", outline: "none",
    resize: multiline ? "vertical" : undefined,
  };
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={{ ...shared, minHeight: 120 }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} />
      }
    </div>
  );
}

function FormModal({ initial, onSave, onClose }: {
  initial?: FormData & { id?: number };
  onSave: (data: FormData & { id?: number }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial ?? emptyForm());
  const [preview, setPreview] = useState(false);

  function setQ(i: number, update: Partial<Questao>) {
    setForm(f => {
      const qs = [...f.questoes];
      qs[i] = { ...qs[i], ...update };
      return { ...f, questoes: qs };
    });
  }

  function validate(): string | null {
    if (!form.titulo.trim()) return "Título obrigatório.";
    if (!form.conteudo.trim()) return "Conteúdo obrigatório.";
    for (let i = 0; i < 3; i++) {
      const q = form.questoes[i];
      if (!q.enunciado.trim()) return `Enunciado da questão ${i + 1} obrigatório.`;
      if (q.opcoes.some(o => !o.trim())) return `Todas as opções da questão ${i + 1} são obrigatórias.`;
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-2xl rounded-2xl space-y-5 my-6" style={{ background: "var(--card)", padding: "1.5rem" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base" style={{ color: "var(--foreground)" }}>
            {initial?.id ? "Editar texto" : "Novo texto"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <InputStyle label="Título" value={form.titulo} onChange={v => setForm(f => ({ ...f, titulo: v }))} placeholder="Ex: Funções do 2º grau" />
        <InputStyle label="Tópico (opcional)" value={form.topico} onChange={v => setForm(f => ({ ...f, topico: v }))} placeholder="Ex: Álgebra" />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Conteúdo (suporta LaTeX com $..$ e $$..$$)
            </label>
            <button onClick={() => setPreview(!preview)}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {preview ? "Editar" : "Preview"}
            </button>
          </div>
          {preview
            ? <div className="rounded-xl p-4 min-h-[120px]" style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}>
                <LatexRenderer fontSize="sm">{form.conteudo}</LatexRenderer>
              </div>
            : <textarea value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))}
                placeholder="Digite o texto de revisão. Use $formula$ para LaTeX inline e $$formula$$ para bloco."
                style={{ width: "100%", borderRadius: "0.75rem", padding: "0.6rem 0.8rem", border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: "0.875rem", outline: "none", resize: "vertical", minHeight: 150 }} />
          }
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>3 Questões de validação</p>
          {form.questoes.map((q, qi) => (
            <div key={qi} className="rounded-xl p-4 space-y-3" style={{ background: "var(--muted)", border: "1.5px solid var(--border)" }}>
              <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Questão {qi + 1}</p>
              <InputStyle label="Enunciado" value={q.enunciado} onChange={v => setQ(qi, { enunciado: v })} placeholder="Pergunta sobre o texto..." />
              <div className="grid grid-cols-2 gap-2">
                {q.opcoes.map((op, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <button onClick={() => setQ(qi, { correta: oi })}
                      className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all"
                      style={{
                        background: q.correta === oi ? "#7B3FA0" : "transparent",
                        borderColor: q.correta === oi ? "#7B3FA0" : "var(--border)",
                        color: q.correta === oi ? "#fff" : "var(--muted-foreground)",
                      }}>
                      {q.correta === oi ? <Check className="h-3 w-3" /> : LETTERS[oi]}
                    </button>
                    <input value={op} onChange={e => {
                      const newOps = [...q.opcoes]; newOps[oi] = e.target.value;
                      setQ(qi, { opcoes: newOps });
                    }} placeholder={`Opção ${LETTERS[oi]}`}
                      style={{ flex: 1, padding: "0.4rem 0.6rem", borderRadius: "0.5rem", border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: "0.8rem", outline: "none" }} />
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Clique na letra para marcar como correta · Atual: {LETTERS[q.correta]}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="active-check" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
          <label htmlFor="active-check" className="text-sm" style={{ color: "var(--foreground)" }}>Ativo (visível para alunos)</label>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">Cancelar</button>
          <button onClick={() => {
            const err = validate();
            if (err) { toast.error(err); return; }
            onSave({ ...form, id: initial?.id });
          }} className="btn-primary flex-1 justify-center">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRevise() {
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandId, setExpandId] = useState<number | null>(null);

  const { data, isLoading, refetch } = trpc.review.adminList.useQuery({ page, pageSize: 20 });
  const create = trpc.review.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Criado!"); } });
  const update = trpc.review.update.useMutation({ onSuccess: () => { refetch(); setEditItem(null); toast.success("Atualizado!"); } });
  const toggle = trpc.review.toggleActive.useMutation({ onSuccess: () => refetch() });
  const del = trpc.review.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Removido!"); } });

  function handleSave(data: any) {
    if (data.id) update.mutate(data);
    else create.mutate(data);
  }

  return (
    <div className="space-y-6 py-2">
      <div className="rounded-2xl px-6 py-6 text-white" style={{ background: "linear-gradient(135deg, #7B3FA0, #4A235A)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Gerenciar Revise
            </h1>
            <p className="text-sm mt-1 opacity-80">Textos diários de revisão com questões</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            <Plus className="h-4 w-4" /> Novo texto
          </button>
        </div>
      </div>

      {isLoading
        ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7B3FA0" }} /></div>
        : !data?.items.length
        ? <div className="text-center py-16 space-y-2">
            <BookOpen className="h-10 w-10 mx-auto opacity-30" style={{ color: "#7B3FA0" }} />
            <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum texto cadastrado</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Crie o primeiro texto de revisão.</p>
          </div>
        : <div className="space-y-2">
            {data.items.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden"
                style={{ border: "1.5px solid var(--border)", background: "var(--card)" }}>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  onClick={() => setExpandId(expandId === item.id ? null : item.id)}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.active ? "#F3EAF9" : "var(--muted)" }}>
                    <BookOpen className="h-4 w-4" style={{ color: item.active ? "#7B3FA0" : "var(--muted-foreground)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{item.titulo}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {item.topico ?? "Sem tópico"} · {(item.questoes as any[]).length} questões
                      {!item.active && <span className="ml-2 text-orange-500">· Inativo</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={e => { e.stopPropagation(); toggle.mutate({ id: item.id, active: !item.active }); }}
                      className="p-1.5 rounded-lg hover:opacity-70" title={item.active ? "Desativar" : "Ativar"}
                      style={{ color: item.active ? "#7B3FA0" : "var(--muted-foreground)" }}>
                      {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); setEditItem(item); }}
                      className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); if (confirm("Remover este texto?")) del.mutate({ id: item.id }); }}
                      className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "#E53935" }}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandId === item.id ? <ChevronUp className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} /> : <ChevronDown className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />}
                  </div>
                </button>

                {expandId === item.id && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="pt-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Preview do conteúdo</p>
                      <div className="rounded-xl p-3" style={{ background: "var(--muted)" }}>
                        <LatexRenderer fontSize="sm">{(item.conteudo as string).slice(0, 300) + (item.conteudo.length > 300 ? "..." : "")}</LatexRenderer>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Questões</p>
                      {(item.questoes as any[]).map((q, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ background: "var(--muted)" }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>{i + 1}. {q.enunciado}</p>
                          <p className="text-xs" style={{ color: "#7B3FA0" }}>Correta: {LETTERS[q.correta]} — {q.opcoes[q.correta]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {data.total > 20 && (
              <div className="flex justify-center gap-2 pt-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
                  style={{ background: "var(--muted)", color: "var(--foreground)" }}>Anterior</button>
                <span className="text-sm px-3 py-2" style={{ color: "var(--muted-foreground)" }}>{page} / {Math.ceil(data.total / 20)}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 20)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
                  style={{ background: "var(--muted)", color: "var(--foreground)" }}>Próxima</button>
              </div>
            )}
          </div>
      }

      {(showForm || editItem) && (
        <FormModal
          initial={editItem ? { ...editItem } : undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}
