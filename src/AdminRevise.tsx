import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X,
  BookOpen, ChevronDown, ChevronUp, FileText, ExternalLink,
} from "lucide-react";

type FormData = {
  titulo: string;
  conteudo: string;
  url_pdf?: string | null;
  topico: string;
  active: boolean;
};

const emptyForm = (): FormData => ({ titulo: "", conteudo: "", url_pdf: null, topico: "", active: true });

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: "0.75rem", padding: "0.6rem 0.8rem",
  border: "1.5px solid var(--border)", background: "var(--card)",
  color: "var(--foreground)", fontSize: "0.875rem", outline: "none",
};

function Field({ label, value, onChange, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </label>
      {rows
        ? <textarea value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={rows}
            style={{ ...inputStyle, resize: "vertical" }} />
        : <input value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} style={inputStyle} />
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

  function validate(): string | null {
    if (!form.titulo.trim()) return "Título obrigatório.";
    if (!form.conteudo.trim() && !form.url_pdf) return "Preencha o texto ou adicione um link de PDF.";
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-2xl rounded-2xl space-y-5 my-6"
        style={{ background: "var(--card)", padding: "1.5rem" }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
            {initial?.id ? "Editar conteúdo" : "Novo conteúdo"}
          </h2>
          <button onClick={onClose}><X className="h-5 w-5" style={{ color: "var(--muted-foreground)" }} /></button>
        </div>

        <Field label="Título" value={form.titulo}
          onChange={v => setForm(f => ({ ...f, titulo: v }))}
          placeholder="Ex: Funções do 2º grau" />

        <Field label="Tópico (opcional)" value={form.topico}
          onChange={v => setForm(f => ({ ...f, topico: v }))}
          placeholder="Ex: Álgebra" />

        {/* ── Texto / LaTeX ── */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            Texto / LaTeX <span className="font-normal">(opcional)</span>
          </label>
          <Field label="" value={form.conteudo}
            onChange={v => setForm(f => ({ ...f, conteudo: v }))}
            placeholder="Conteúdo em texto... (suporta LaTeX com $...$)" rows={8} />
          <button onClick={() => setPreview(p => !p)}
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: "#A78BFA" }}>
            {preview ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {preview ? "Ocultar preview" : "Ver preview LaTeX"}
          </button>
          {preview && form.conteudo && (
            <div className="p-4 rounded-xl" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Preview</p>
              <LatexRenderer fontSize="base">{form.conteudo}</LatexRenderer>
            </div>
          )}
        </div>

        {/* ── PDF ── */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            PDF para download <span className="font-normal">(opcional)</span>
          </label>

          {/* Instrução */}
          <div className="rounded-xl p-3 text-xs space-y-1"
            style={{ background: "color-mix(in srgb, #A78BFA 14%, var(--card))", border: "1.5px solid color-mix(in srgb, #A78BFA 35%, transparent)" }}>
            <p className="font-semibold" style={{ color: "#A78BFA" }}>Como obter o link do PDF</p>
            <p style={{ color: "var(--muted-foreground)" }}>
              <strong>Google Drive:</strong> Compartilhar → "Qualquer pessoa" → copiar link → substituir <code>/view</code> por <code>/preview</code>
            </p>
            <p style={{ color: "var(--muted-foreground)" }}>
              <strong>Dropbox:</strong> Copiar link → trocar <code>?dl=0</code> por <code>?raw=1</code>
            </p>
          </div>

          {/* URL input */}
          <input
            type="url"
            value={form.url_pdf ?? ""}
            onChange={e => setForm(f => ({ ...f, url_pdf: e.target.value || null }))}
            placeholder="https://drive.google.com/file/d/.../preview"
            style={inputStyle}
          />

          {/* Preview do link */}
          {form.url_pdf && (
            <div className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "color-mix(in srgb, #A78BFA 14%, var(--card))", border: "1.5px solid color-mix(in srgb, #A78BFA 40%, transparent)" }}>
              <FileText className="h-5 w-5 flex-shrink-0" style={{ color: "#A78BFA" }} />
              <p className="text-xs flex-1 truncate" style={{ color: "#A78BFA" }}>{form.url_pdf}</p>
              <a href={form.url_pdf} target="_blank" rel="noopener noreferrer" title="Testar link">
                <ExternalLink className="h-4 w-4" style={{ color: "#A78BFA" }} />
              </a>
              <button onClick={() => setForm(f => ({ ...f, url_pdf: null }))} title="Remover">
                <X className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="active-check" checked={form.active}
            onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            className="h-4 w-4 accent-purple-700" />
          <label htmlFor="active-check" className="text-sm" style={{ color: "var(--foreground)" }}>
            Visível para alunos
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              const err = validate();
              if (err) { toast.error(err); return; }
              onSave({ ...form, id: initial?.id });
            }}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "#A78BFA" }}>
            {initial?.id ? "Salvar alterações" : "Criar conteúdo"}
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl font-bold text-sm"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRevise() {
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<(FormData & { id?: number }) | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.review.adminList.useQuery({ page, pageSize: 20 });

  const createMutation = trpc.review.create.useMutation({
    onSuccess: () => { toast.success("Conteúdo criado!"); setModalData(null); utils.review.adminList.invalidate(); },
    onError: e => toast.error(e.message),
  });

  const updateMutation = trpc.review.update.useMutation({
    onSuccess: () => { toast.success("Conteúdo atualizado!"); setModalData(null); utils.review.adminList.invalidate(); },
    onError: e => toast.error(e.message),
  });

  const toggleMutation = trpc.review.toggleActive.useMutation({
    onSuccess: () => utils.review.adminList.invalidate(),
    onError: e => toast.error(e.message),
  });

  const deleteMutation = trpc.review.delete.useMutation({
    onSuccess: () => { toast.success("Conteúdo excluído."); utils.review.adminList.invalidate(); },
    onError: e => toast.error(e.message),
  });

  function handleSave(form: FormData & { id?: number }) {
    const payload = {
      titulo: form.titulo,
      conteudo: form.conteudo,
      url_pdf: form.url_pdf ?? null,
      topico: form.topico,
      active: form.active,
      questoes: [],
    };
    if (form.id) {
      updateMutation.mutate({ id: form.id, ...payload });
    } else {
      createMutation.mutate(payload as any);
    }
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="rounded-2xl px-6 py-5 text-white flex items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <div>
          <h1 className="text-xl font-bold">Conteúdos — Revise</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            {data?.total ?? 0} textos cadastrados
          </p>
        </div>
        <button onClick={() => setModalData(emptyForm())}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
          <Plus className="h-4 w-4" /> Novo conteúdo
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#A78BFA" }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="h-10 w-10 mx-auto opacity-30" style={{ color: "#A78BFA" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum conteúdo cadastrado ainda</p>
          <button onClick={() => setModalData(emptyForm())}
            className="px-4 py-2 rounded-xl font-bold text-sm text-white"
            style={{ background: "#A78BFA" }}>
            Criar primeiro conteúdo
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => {
            const isOpen = openId === item.id;
            const hasPdf = !!item.url_pdf;
            const hasText = !!(item.conteudo?.trim());
            return (
              <div key={item.id} className="rounded-xl overflow-hidden"
                style={{ border: "1.5px solid var(--border)", background: item.active ? "var(--card)" : "var(--secondary)", opacity: item.active ? 1 : 0.65 }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex-1 flex items-start gap-3 text-left">
                    <div className="flex gap-1 flex-shrink-0 mt-0.5">
                      {hasText && <BookOpen className="h-4 w-4" style={{ color: "var(--pr-teal)" }} />}
                      {hasPdf  && <FileText  className="h-4 w-4" style={{ color: "#A78BFA" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                        {item.titulo}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {item.topico ? `${item.topico} · ` : ""}
                        {[hasText && "Texto", hasPdf && "PDF"].filter(Boolean).join(" + ")} ·{" "}
                        {item.active ? "Visível" : "Oculto"}
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
                      : <ChevronDown className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />}
                  </button>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setModalData({ ...item })}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title="Editar">
                      <Pencil className="h-3.5 w-3.5" style={{ color: "var(--pr-teal)" }} />
                    </button>
                    <button onClick={() => toggleMutation.mutate({ id: item.id, active: !item.active })}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title={item.active ? "Ocultar" : "Mostrar"}>
                      {item.active
                        ? <EyeOff className="h-3.5 w-3.5" style={{ color: "var(--pr-warn)" }} />
                        : <Eye  className="h-3.5 w-3.5" style={{ color: "var(--pr-success)" }} />}
                    </button>
                    <button onClick={() => { if (confirm("Excluir permanentemente?")) deleteMutation.mutate({ id: item.id }); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100" title="Excluir">
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--pr-danger)" }} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                    {hasText && (
                      <>
                        <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Preview do texto:</p>
                        <div className="rounded-xl p-4" style={{ background: "var(--secondary)" }}>
                          <LatexRenderer fontSize="sm">{item.conteudo}</LatexRenderer>
                        </div>
                      </>
                    )}
                    {hasPdf && (
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "color-mix(in srgb, #A78BFA 14%, var(--card))" }}>
                        <FileText className="h-5 w-5 flex-shrink-0" style={{ color: "#A78BFA" }} />
                        <p className="text-xs flex-1 truncate" style={{ color: "#A78BFA" }}>{item.url_pdf}</p>
                        <a href={item.url_pdf} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-bold flex-shrink-0 px-3 py-1.5 rounded-lg"
                          style={{ background: "#A78BFA", color: "#fff" }}>
                          <ExternalLink className="h-3 w-3" /> Abrir
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {data && data.total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}>Anterior</button>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {page} / {Math.ceil(data.total / 20)}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 20)}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}>Próxima</button>
        </div>
      )}

      {/* Modal */}
      {modalData !== null && (
        <FormModal
          initial={modalData.titulo ? modalData : undefined}
          onSave={handleSave}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
