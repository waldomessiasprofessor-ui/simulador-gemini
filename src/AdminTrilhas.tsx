import { useMemo, useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { TRILHAS } from "@/trilhas";
import { Loader2, Youtube, Save, Trash2, Check, AlertCircle } from "@/icons";

// =============================================================================
// Admin de trilhas — edita URL de videoaula do YouTube por lição.
// =============================================================================
// As trilhas em si são estáticas (src/trilhas/*.ts). Esta tela apenas cadastra
// a URL do YouTube associada a cada lição, armazenada na tabela trilha_videos.
// Quando o aluno abre a lição, o botão de videoaula aparece se houver URL.

interface LicaoRow {
  trilhaSlug: string;
  trilhaTitulo: string;
  licaoSlug: string;
  licaoTitulo: string;
}

export default function AdminTrilhas() {
  // Lista achatada de todas as lições de todas as trilhas (para render)
  const licoes = useMemo<LicaoRow[]>(() => {
    const out: LicaoRow[] = [];
    for (const t of TRILHAS) {
      for (const cap of t.capitulos) {
        for (const l of cap.licoes) {
          out.push({
            trilhaSlug: t.slug,
            trilhaTitulo: t.titulo,
            licaoSlug: l.slug,
            licaoTitulo: l.titulo,
          });
        }
      }
    }
    return out;
  }, []);

  const { data: videos, isLoading, refetch } = trpc.trilhas.listAll.useQuery(
    undefined,
    { staleTime: 0 },
  );

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho */}
      <div
        className="rounded-2xl px-6 py-6"
        style={{
          background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Youtube className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Admin — Videoaulas das Trilhas</h1>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
          Cole a URL do YouTube de cada lição. O botão de videoaula aparece para
          os alunos na tela da lição.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: "#009688" }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {licoes.map((row) => {
            const existing = videos?.find(
              (v) =>
                v.trilhaSlug === row.trilhaSlug &&
                v.licaoSlug === row.licaoSlug,
            );
            return (
              <LicaoEditor
                key={`${row.trilhaSlug}:${row.licaoSlug}`}
                row={row}
                existing={existing ?? null}
                onChange={() => refetch()}
              />
            );
          })}
          {licoes.length === 0 && (
            <p
              className="text-center py-12 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Nenhuma trilha cadastrada no código.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Editor de uma lição — input + botão salvar/remover
// ─────────────────────────────────────────────────────────────────────────────
function LicaoEditor({
  row,
  existing,
  onChange,
}: {
  row: LicaoRow;
  existing: { id: number; urlYoutube: string } | null;
  onChange: () => void;
}) {
  const [url, setUrl] = useState(existing?.urlYoutube ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Sempre que a fonte da verdade mudar (existing), ressincroniza o input
  useEffect(() => {
    setUrl(existing?.urlYoutube ?? "");
  }, [existing?.urlYoutube]);

  const upsert = trpc.trilhas.upsert.useMutation({
    onSuccess: () => {
      setStatus("saved");
      onChange();
      setTimeout(() => setStatus("idle"), 1800);
    },
    onError: (err) => {
      setStatus("error");
      setErrorMsg(err.message ?? "Erro ao salvar");
    },
  });

  const del = trpc.trilhas.delete.useMutation({
    onSuccess: () => {
      setUrl("");
      onChange();
    },
  });

  function handleSave() {
    setErrorMsg("");
    const trimmed = url.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMsg("Cole uma URL antes de salvar");
      return;
    }
    setStatus("saving");
    upsert.mutate({
      trilhaSlug: row.trilhaSlug,
      licaoSlug: row.licaoSlug,
      urlYoutube: trimmed,
    });
  }

  function handleDelete() {
    if (!existing) return;
    if (!confirm(`Remover a URL cadastrada para "${row.licaoTitulo}"?`)) return;
    del.mutate({ id: existing.id });
  }

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
    >
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--muted-foreground)" }}
        >
          {row.trilhaTitulo}
        </p>
        <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
          {row.licaoTitulo}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          type="url"
          inputMode="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="flex-1 min-w-[220px] rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1.5px solid var(--border)",
          }}
        />
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
          style={{ background: "#009688", color: "#ffffff" }}
        >
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "saved" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {status === "saved" ? "Salvo!" : "Salvar"}
        </button>
        {existing && (
          <button
            onClick={handleDelete}
            className="rounded-lg px-3 py-2 text-sm font-semibold flex items-center gap-2"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1.5px solid #FECACA",
            }}
            title="Remover URL cadastrada"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {status === "error" && (
        <div
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
          style={{
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FECACA",
          }}
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
