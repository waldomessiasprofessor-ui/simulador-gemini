import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { TRILHAS } from "@/trilhas";
import type {
  Trilha as TrilhaType,
  Capitulo,
  Licao,
  Exemplo,
  Exercicio,
} from "@/trilhas/types";
import { LatexRenderer } from "@/LatexRenderer";
import {
  Youtube, Save, Trash2, Check, AlertCircle, Plus, Loader2, BookOpen,
  Pencil, Eye, EyeOff, ChevronDown, ChevronRight, RefreshCw, X,
} from "@/icons";

// =============================================================================
// Tipos internos
// =============================================================================

type Selection =
  | { kind: "meta" }
  | { kind: "cap"; capIdx: number }
  | { kind: "licao"; capIdx: number; licaoIdx: number };

type LicaoTab = "info" | "explicacao" | "exemplos" | "exercicios";

// =============================================================================
// Helpers
// =============================================================================

function makeSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const LETRAS = ["A", "B", "C", "D", "E"] as const;

function newExercicio(n: number): Exercicio {
  return {
    id: `ex-${Date.now()}-${n}`,
    enunciado: "",
    alternativas: LETRAS.map((letra) => ({ letra, texto: "" })),
    gabarito: "A",
    explicacao: "",
  };
}

function newExemplo(): Exemplo {
  return { titulo: "", problema: "", resolucao: "" };
}

function newLicao(n: number): Licao {
  return {
    slug: `licao-${n}`,
    titulo: `Nova lição ${n}`,
    resumo: "",
    duracaoMinutos: 15,
    explicacao: "",
    exemplos: [newExemplo(), newExemplo()],
    exercicios: Array.from({ length: 5 }, (_, i) => newExercicio(i + 1)),
  };
}

function newCapitulo(n: number): Capitulo {
  return {
    slug: `capitulo-${n}`,
    titulo: `Novo capítulo ${n}`,
    licoes: [],
  };
}

// =============================================================================
// Componente raiz
// =============================================================================

export default function AdminTrilhas() {
  const [activeTab, setActiveTab] = useState<"content" | "videos">("content");

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
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Admin — Trilhas</h1>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
          Edite o conteúdo das trilhas ou cadastre URLs de videoaula.
        </p>
      </div>

      {/* Abas */}
      <div
        className="flex gap-1 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {(
          [
            { id: "content" as const, label: "✏️ Conteúdo das trilhas" },
            { id: "videos" as const, label: "▶️ Videoaulas" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === tab.id ? "#009688" : "transparent",
              color:
                activeTab === tab.id
                  ? "#009688"
                  : "var(--muted-foreground)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "videos" ? <VideosTab /> : <ContentTab />}
    </div>
  );
}

// =============================================================================
// ContentTab — editor hierárquico de trilhas
// =============================================================================

function ContentTab() {
  const [trilhaSlug, setTrilhaSlug] = useState<string>(
    TRILHAS[0]?.slug ?? "",
  );
  const [working, setWorking] = useState<TrilhaType | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [selection, setSelection] = useState<Selection>({ kind: "meta" });
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState("");

  // Busca a definição salva no banco para o trilhaSlug selecionado
  const { data: dbDef, isLoading: defLoading } =
    trpc.trilhas.getDefinition.useQuery(
      { slug: trilhaSlug },
      { enabled: !!trilhaSlug, staleTime: 0 },
    );

  // Quando a definição do banco chega (ou trilhaSlug muda), inicializa working
  useEffect(() => {
    if (defLoading) return;
    const staticTrilha = TRILHAS.find((t) => t.slug === trilhaSlug);
    if (!staticTrilha) return;

    if (dbDef) {
      try {
        const capitulos = JSON.parse(dbDef.contentJson);
        setWorking({
          slug:      dbDef.slug,
          titulo:    dbDef.titulo,
          area:      dbDef.area,
          descricao: dbDef.descricao ?? staticTrilha.descricao,
          capitulos,
        });
      } catch {
        setWorking({ ...staticTrilha });
      }
    } else {
      // Nenhum registro no banco — usa cópia do arquivo TS estático
      setWorking(JSON.parse(JSON.stringify(staticTrilha)));
    }
    setIsDirty(false);
    setSelection({ kind: "meta" });
  }, [trilhaSlug, dbDef, defLoading]);

  // Mutation de save
  const saveMutation = trpc.trilhas.saveDefinition.useMutation({
    onSuccess: () => {
      setSaveStatus("saved");
      setIsDirty(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: (err) => {
      setSaveStatus("error");
      setSaveError(err.message ?? "Erro ao salvar");
    },
  });

  // Mutation de delete (reset para TS estático)
  const deleteMutation = trpc.trilhas.deleteDefinition.useMutation({
    onSuccess: () => {
      const staticTrilha = TRILHAS.find((t) => t.slug === trilhaSlug);
      if (staticTrilha) {
        setWorking(JSON.parse(JSON.stringify(staticTrilha)));
      }
      setIsDirty(false);
      setSaveStatus("idle");
    },
  });

  function handleSave() {
    if (!working) return;
    setSaveStatus("saving");
    setSaveError("");
    saveMutation.mutate({
      slug:        working.slug,
      titulo:      working.titulo,
      area:        working.area,
      descricao:   working.descricao,
      contentJson: JSON.stringify(working.capitulos),
    });
  }

  function handleReset() {
    if (!confirm("Remover as edições salvas e voltar ao conteúdo original do código?")) return;
    deleteMutation.mutate({ slug: trilhaSlug });
  }

  function patch(fn: (prev: TrilhaType) => TrilhaType) {
    setWorking((prev) => (prev ? fn(prev) : prev));
    setIsDirty(true);
  }

  return (
    <div className="space-y-4">
      {/* Seletor de trilha + botões */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <label
            className="text-xs font-semibold uppercase tracking-wider block mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Trilha
          </label>
          <select
            value={trilhaSlug}
            onChange={(e) => setTrilhaSlug(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1.5px solid var(--border)",
            }}
          >
            {TRILHAS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 pb-0.5">
          {/* Botão Salvar */}
          <button
            onClick={handleSave}
            disabled={!isDirty || saveStatus === "saving"}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 transition-opacity"
            style={{ background: "#009688", color: "#ffffff" }}
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveStatus === "saved" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveStatus === "saved" ? "Salvo!" : "Salvar alterações"}
          </button>

          {/* Botão reset */}
          {dbDef && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                border: "1.5px solid #FECACA",
              }}
              title="Reverter para o conteúdo original do arquivo TypeScript"
            >
              <RefreshCw className="h-4 w-4" />
              Resetar ao original
            </button>
          )}
        </div>
      </div>

      {/* Indicador de modificações não salvas */}
      {isDirty && saveStatus !== "saved" && (
        <p className="text-xs" style={{ color: "#F59E0B" }}>
          ● Há alterações não salvas
        </p>
      )}
      {saveStatus === "error" && (
        <div
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
          style={{
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1px solid #FECACA",
          }}
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {saveError}
        </div>
      )}

      {/* Corpo: árvore + painel editor */}
      {defLoading || !working ? (
        <div className="flex justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: "#009688" }}
          />
        </div>
      ) : (
        <div className="flex gap-4 items-start">
          {/* Painel esquerdo — árvore */}
          <TrilhaTree
            working={working}
            selection={selection}
            onSelect={setSelection}
            onPatch={patch}
          />

          {/* Painel direito — editor */}
          <div className="flex-1 min-w-0">
            <EditorPanel
              working={working}
              selection={selection}
              onPatch={patch}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Árvore de navegação
// =============================================================================

function TrilhaTree({
  working,
  selection,
  onSelect,
  onPatch,
}: {
  working: TrilhaType;
  selection: Selection;
  onSelect: (s: Selection) => void;
  onPatch: (fn: (prev: TrilhaType) => TrilhaType) => void;
}) {
  const [openCaps, setOpenCaps] = useState<Set<number>>(
    new Set(working.capitulos.map((_, i) => i)),
  );

  function toggleCap(i: number) {
    setOpenCaps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function addCapitulo() {
    const n = working.capitulos.length + 1;
    onPatch((t) => ({ ...t, capitulos: [...t.capitulos, newCapitulo(n)] }));
    setOpenCaps((prev) => new Set([...prev, working.capitulos.length]));
    onSelect({ kind: "cap", capIdx: working.capitulos.length });
  }

  function deleteCapitulo(capIdx: number) {
    if (!confirm(`Remover capítulo "${working.capitulos[capIdx].titulo}" e todas as suas lições?`)) return;
    onPatch((t) => {
      const caps = t.capitulos.filter((_, i) => i !== capIdx);
      return { ...t, capitulos: caps };
    });
    onSelect({ kind: "meta" });
  }

  function addLicao(capIdx: number) {
    const n = working.capitulos[capIdx].licoes.length + 1;
    const licaoIdx = working.capitulos[capIdx].licoes.length;
    onPatch((t) => {
      const caps = [...t.capitulos];
      caps[capIdx] = {
        ...caps[capIdx],
        licoes: [...caps[capIdx].licoes, newLicao(n)],
      };
      return { ...t, capitulos: caps };
    });
    onSelect({ kind: "licao", capIdx, licaoIdx });
  }

  function deleteLicao(capIdx: number, licaoIdx: number) {
    const titulo = working.capitulos[capIdx].licoes[licaoIdx]?.titulo ?? "";
    if (!confirm(`Remover lição "${titulo}"?`)) return;
    onPatch((t) => {
      const caps = [...t.capitulos];
      const licoes = caps[capIdx].licoes.filter((_, i) => i !== licaoIdx);
      caps[capIdx] = { ...caps[capIdx], licoes };
      return { ...t, capitulos: caps };
    });
    onSelect({ kind: "cap", capIdx });
  }

  const isSelected = (s: Selection) => JSON.stringify(s) === JSON.stringify(selection);

  return (
    <div
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: "260px",
        background: "var(--card)",
        border: "1.5px solid var(--border)",
      }}
    >
      {/* Meta da trilha */}
      <button
        onClick={() => onSelect({ kind: "meta" })}
        className="w-full text-left px-4 py-3 text-sm font-bold flex items-center gap-2"
        style={{
          background: isSelected({ kind: "meta" })
            ? "rgba(0,150,136,0.12)"
            : "transparent",
          color: "var(--foreground)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "#009688" }} />
        <span className="truncate">{working.titulo}</span>
      </button>

      {/* Capítulos */}
      <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
        {working.capitulos.map((cap, capIdx) => {
          const capOpen = openCaps.has(capIdx);
          const capSel = isSelected({ kind: "cap", capIdx });
          return (
            <div key={cap.slug || capIdx}>
              {/* Linha do capítulo */}
              <div
                className="flex items-center gap-1 px-3 py-2"
                style={{
                  background: capSel
                    ? "rgba(0,150,136,0.08)"
                    : "rgba(0,0,0,0.02)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {/* Toggle accordion */}
                <button
                  onClick={() => toggleCap(capIdx)}
                  className="flex-shrink-0 p-0.5 rounded"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {capOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Título do capítulo (clicável) */}
                <button
                  onClick={() => onSelect({ kind: "cap", capIdx })}
                  className="flex-1 text-left text-xs font-semibold truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {cap.titulo}
                </button>

                {/* Deletar capítulo */}
                <button
                  onClick={() => deleteCapitulo(capIdx)}
                  className="flex-shrink-0 p-0.5 rounded opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: "#DC2626" }}
                  title="Remover capítulo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Lições do capítulo */}
              {capOpen && (
                <div style={{ background: "var(--background)" }}>
                  {cap.licoes.map((licao, licaoIdx) => {
                    const licSel = isSelected({
                      kind: "licao",
                      capIdx,
                      licaoIdx,
                    });
                    return (
                      <div
                        key={licao.slug || licaoIdx}
                        className="flex items-center gap-1 pl-8 pr-3 py-1.5"
                        style={{
                          background: licSel
                            ? "rgba(0,150,136,0.1)"
                            : "transparent",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <button
                          onClick={() =>
                            onSelect({ kind: "licao", capIdx, licaoIdx })
                          }
                          className="flex-1 text-left text-xs truncate"
                          style={{
                            color: licSel
                              ? "#009688"
                              : "var(--foreground)",
                            fontWeight: licSel ? 600 : 400,
                          }}
                        >
                          {licao.titulo}
                        </button>
                        <button
                          onClick={() => deleteLicao(capIdx, licaoIdx)}
                          className="flex-shrink-0 p-0.5 rounded opacity-30 hover:opacity-100 transition-opacity"
                          style={{ color: "#DC2626" }}
                          title="Remover lição"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Botão nova lição */}
                  <button
                    onClick={() => addLicao(capIdx)}
                    className="w-full flex items-center gap-1.5 pl-8 pr-3 py-1.5 text-xs font-medium"
                    style={{ color: "#009688" }}
                  >
                    <Plus className="h-3 w-3" />
                    Nova lição
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão novo capítulo */}
      <button
        onClick={addCapitulo}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold"
        style={{
          color: "#009688",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        Novo capítulo
      </button>
    </div>
  );
}

// =============================================================================
// Painel editor (direita)
// =============================================================================

function EditorPanel({
  working,
  selection,
  onPatch,
}: {
  working: TrilhaType;
  selection: Selection;
  onPatch: (fn: (prev: TrilhaType) => TrilhaType) => void;
}) {
  if (selection.kind === "meta") {
    return (
      <MetaEditor
        working={working}
        onChange={(patch) =>
          onPatch((t) => ({ ...t, ...patch }))
        }
      />
    );
  }

  if (selection.kind === "cap") {
    const cap = working.capitulos[selection.capIdx];
    if (!cap) return <EmptyState text="Capítulo não encontrado" />;
    return (
      <CapituloEditor
        cap={cap}
        onChange={(patch) =>
          onPatch((t) => {
            const caps = [...t.capitulos];
            caps[selection.capIdx] = { ...caps[selection.capIdx], ...patch };
            return { ...t, capitulos: caps };
          })
        }
      />
    );
  }

  // kind === "licao"
  const cap = working.capitulos[selection.capIdx];
  const licao = cap?.licoes[selection.licaoIdx];
  if (!licao) return <EmptyState text="Lição não encontrada" />;

  return (
    <LicaoFullEditor
      licao={licao}
      onChange={(patch) =>
        onPatch((t) => {
          const caps = [...t.capitulos];
          const licoes = [...caps[selection.capIdx].licoes];
          licoes[selection.licaoIdx] = { ...licoes[selection.licaoIdx], ...patch };
          caps[selection.capIdx] = { ...caps[selection.capIdx], licoes };
          return { ...t, capitulos: caps };
        })
      }
    />
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl p-8 text-center text-sm"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        color: "var(--muted-foreground)",
      }}
    >
      {text}
    </div>
  );
}

// =============================================================================
// MetaEditor — edita título, área, descrição da trilha
// =============================================================================

function MetaEditor({
  working,
  onChange,
}: {
  working: TrilhaType;
  onChange: (patch: Partial<Pick<TrilhaType, "titulo" | "area" | "descricao">>) => void;
}) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
      }}
    >
      <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
        Metadados da trilha
      </h2>

      <div className="space-y-1">
        <Label>Título</Label>
        <Input
          value={working.titulo}
          onChange={(v) => onChange({ titulo: v })}
          placeholder="Ex: Trilha de Matemática Básica"
        />
      </div>

      <div className="space-y-1">
        <Label>Área (deve casar exatamente com conteudo_principal das questões)</Label>
        <Input
          value={working.area}
          onChange={(v) => onChange({ area: v })}
          placeholder="Ex: Matemática Básica"
        />
      </div>

      <div className="space-y-1">
        <Label>Descrição</Label>
        <Textarea
          value={working.descricao}
          onChange={(v) => onChange({ descricao: v })}
          rows={3}
          placeholder="Breve descrição da trilha"
        />
      </div>
    </div>
  );
}

// =============================================================================
// CapituloEditor
// =============================================================================

function CapituloEditor({
  cap,
  onChange,
}: {
  cap: Capitulo;
  onChange: (patch: Partial<Pick<Capitulo, "titulo" | "slug">>) => void;
}) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
      }}
    >
      <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
        Capítulo
      </h2>

      <div className="space-y-1">
        <Label>Título do capítulo</Label>
        <Input
          value={cap.titulo}
          onChange={(v) => {
            onChange({ titulo: v });
          }}
          placeholder="Ex: Operações com frações"
        />
      </div>

      <div className="space-y-1">
        <Label>Slug</Label>
        <div className="flex gap-2">
          <Input
            value={cap.slug}
            onChange={(v) => onChange({ slug: v })}
            placeholder="Ex: operacoes-com-fracoes"
          />
          <button
            onClick={() => onChange({ slug: makeSlug(cap.titulo) })}
            className="px-3 py-1.5 text-xs rounded-lg font-medium flex-shrink-0"
            style={{
              background: "var(--background)",
              border: "1.5px solid var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Auto
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Identificador URL-friendly. Use o botão Auto para gerar a partir do título.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// LicaoFullEditor — editor completo de uma lição (4 abas)
// =============================================================================

function LicaoFullEditor({
  licao,
  onChange,
}: {
  licao: Licao;
  onChange: (patch: Partial<Licao>) => void;
}) {
  const [tab, setTab] = useState<LicaoTab>("info");
  const [previewExplicacao, setPreviewExplicacao] = useState(false);

  const tabs: { id: LicaoTab; label: string }[] = [
    { id: "info",       label: "Informações" },
    { id: "explicacao", label: "Explicação" },
    { id: "exemplos",   label: `Exemplos (${licao.exemplos.length})` },
    { id: "exercicios", label: `Exercícios (${licao.exercicios.length})` },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
      }}
    >
      {/* Abas internas */}
      <div
        className="flex gap-0 overflow-x-auto border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors"
            style={{
              borderColor: tab === t.id ? "#009688" : "transparent",
              color:
                tab === t.id ? "#009688" : "var(--muted-foreground)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* ── Aba Info ─────────────────────────────────────────────── */}
        {tab === "info" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Título da lição</Label>
              <Input
                value={licao.titulo}
                onChange={(v) => onChange({ titulo: v })}
                placeholder="Ex: Adição e subtração de frações"
              />
            </div>

            <div className="space-y-1">
              <Label>Slug</Label>
              <div className="flex gap-2">
                <Input
                  value={licao.slug}
                  onChange={(v) => onChange({ slug: v })}
                  placeholder="Ex: adicao-subtracao-fracoes"
                />
                <button
                  onClick={() => onChange({ slug: makeSlug(licao.titulo) })}
                  className="px-3 py-1.5 text-xs rounded-lg font-medium flex-shrink-0"
                  style={{
                    background: "var(--background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Auto
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Resumo (mostrado no card da lição)</Label>
              <Textarea
                value={licao.resumo}
                onChange={(v) => onChange({ resumo: v })}
                rows={2}
                placeholder="Breve descrição do que o aluno vai aprender"
              />
            </div>

            <div className="space-y-1">
              <Label>Duração estimada (minutos)</Label>
              <input
                type="number"
                min={1}
                max={180}
                value={licao.duracaoMinutos}
                onChange={(e) =>
                  onChange({ duracaoMinutos: Number(e.target.value) || 15 })
                }
                className="rounded-lg px-3 py-2 text-sm outline-none w-28"
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1.5px solid var(--border)",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Aba Explicação ────────────────────────────────────────── */}
        {tab === "explicacao" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Conteúdo explicativo (suporta Markdown + LaTeX)</Label>
              <button
                onClick={() => setPreviewExplicacao((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: "var(--background)",
                  border: "1.5px solid var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                {previewExplicacao ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                {previewExplicacao ? "Editar" : "Preview"}
              </button>
            </div>

            {previewExplicacao ? (
              <div
                className="rounded-lg p-4 min-h-[300px] overflow-auto"
                style={{
                  background: "var(--background)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
                }}
              >
                <LatexRenderer content={licao.explicacao} />
              </div>
            ) : (
              <textarea
                value={licao.explicacao}
                onChange={(e) => onChange({ explicacao: e.target.value })}
                rows={20}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none font-mono resize-y"
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1.5px solid var(--border)",
                  minHeight: "300px",
                }}
                placeholder="Escreva o conteúdo explicativo da lição..."
              />
            )}
          </div>
        )}

        {/* ── Aba Exemplos ──────────────────────────────────────────── */}
        {tab === "exemplos" && (
          <div className="space-y-4">
            {licao.exemplos.map((ex, i) => (
              <ExemploEditor
                key={i}
                index={i}
                ex={ex}
                onChange={(patch) => {
                  const exemplos = licao.exemplos.map((e, j) =>
                    j === i ? { ...e, ...patch } : e,
                  );
                  onChange({ exemplos });
                }}
                onDelete={() => {
                  const exemplos = licao.exemplos.filter((_, j) => j !== i);
                  onChange({ exemplos });
                }}
              />
            ))}

            <button
              onClick={() =>
                onChange({ exemplos: [...licao.exemplos, newExemplo()] })
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
              style={{
                border: "1.5px dashed var(--border)",
                color: "#009688",
              }}
            >
              <Plus className="h-4 w-4" />
              Adicionar exemplo
            </button>
          </div>
        )}

        {/* ── Aba Exercícios ────────────────────────────────────────── */}
        {tab === "exercicios" && (
          <div className="space-y-4">
            {licao.exercicios.map((ex, i) => (
              <ExercicioEditor
                key={ex.id || i}
                index={i}
                ex={ex}
                onChange={(patch) => {
                  const exercicios = licao.exercicios.map((e, j) =>
                    j === i ? { ...e, ...patch } : e,
                  );
                  onChange({ exercicios });
                }}
                onDelete={() => {
                  const exercicios = licao.exercicios.filter(
                    (_, j) => j !== i,
                  );
                  onChange({ exercicios });
                }}
              />
            ))}

            <button
              onClick={() =>
                onChange({
                  exercicios: [
                    ...licao.exercicios,
                    newExercicio(licao.exercicios.length + 1),
                  ],
                })
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
              style={{
                border: "1.5px dashed var(--border)",
                color: "#009688",
              }}
            >
              <Plus className="h-4 w-4" />
              Adicionar exercício
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// ExemploEditor
// =============================================================================

function ExemploEditor({
  index,
  ex,
  onChange,
  onDelete,
}: {
  index: number;
  ex: Exemplo;
  onChange: (patch: Partial<Exemplo>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [previewProb, setPreviewProb] = useState(false);
  const [previewResol, setPreviewResol] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1.5px solid var(--border)" }}
    >
      {/* Cabeçalho acordeão */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
        style={{ background: "var(--background)" }}
        onClick={() => setOpen((v) => !v)}
      >
        <button className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <span className="flex-1 text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
          {ex.titulo || `Exemplo ${index + 1}`}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Remover este exemplo?")) onDelete();
          }}
          className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "#DC2626" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div
          className="px-4 pb-4 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="space-y-1 pt-3">
            <Label>Título do exemplo</Label>
            <Input
              value={ex.titulo}
              onChange={(v) => onChange({ titulo: v })}
              placeholder="Ex: Exemplo 1 — denominadores iguais"
            />
          </div>

          <FieldWithPreview
            label="Problema (LaTeX)"
            value={ex.problema}
            onEdit={(v) => onChange({ problema: v })}
            preview={previewProb}
            onTogglePreview={() => setPreviewProb((v) => !v)}
            rows={4}
            placeholder="Enunciado do problema com LaTeX"
          />

          <FieldWithPreview
            label="Resolução (LaTeX)"
            value={ex.resolucao}
            onEdit={(v) => onChange({ resolucao: v })}
            preview={previewResol}
            onTogglePreview={() => setPreviewResol((v) => !v)}
            rows={6}
            placeholder="Resolução passo a passo"
          />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ExercicioEditor
// =============================================================================

function ExercicioEditor({
  index,
  ex,
  onChange,
  onDelete,
}: {
  index: number;
  ex: Exercicio;
  onChange: (patch: Partial<Exercicio>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [previewEnunc, setPreviewEnunc] = useState(false);
  const [previewExpl, setPreviewExpl] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1.5px solid var(--border)" }}
    >
      {/* Cabeçalho acordeão */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
        style={{ background: "var(--background)" }}
        onClick={() => setOpen((v) => !v)}
      >
        <button className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <span
          className="text-xs font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "#E0F2F1", color: "#00695C" }}
        >
          {index + 1}
        </span>
        <span
          className="flex-1 text-xs truncate"
          style={{ color: "var(--muted-foreground)" }}
        >
          {ex.enunciado
            ? ex.enunciado.replace(/\$[^$]*\$/g, "[LaTeX]").slice(0, 80)
            : "(sem enunciado)"}
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#E0F2F1", color: "#00695C" }}
        >
          {ex.gabarito}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Remover este exercício?")) onDelete();
          }}
          className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "#DC2626" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div
          className="px-4 pb-4 space-y-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Enunciado */}
          <FieldWithPreview
            label="Enunciado"
            value={ex.enunciado}
            onEdit={(v) => onChange({ enunciado: v })}
            preview={previewEnunc}
            onTogglePreview={() => setPreviewEnunc((v) => !v)}
            rows={4}
            placeholder="Enunciado da questão (suporta LaTeX)"
            className="pt-3"
          />

          {/* Alternativas */}
          <div className="space-y-2">
            <Label>Alternativas</Label>
            {LETRAS.map((letra) => {
              const alt = ex.alternativas.find((a) => a.letra === letra);
              return (
                <div key={letra} className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        ex.gabarito === letra ? "#009688" : "var(--background)",
                      color:
                        ex.gabarito === letra ? "#fff" : "var(--muted-foreground)",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    {letra}
                  </span>
                  <Input
                    value={alt?.texto ?? ""}
                    onChange={(v) => {
                      const alternativas = LETRAS.map((l) => {
                        const a = ex.alternativas.find((x) => x.letra === l);
                        return {
                          letra: l,
                          texto: l === letra ? v : (a?.texto ?? ""),
                        };
                      });
                      onChange({ alternativas });
                    }}
                    placeholder={`Alternativa ${letra}`}
                  />
                  <button
                    onClick={() => onChange({ gabarito: letra })}
                    className="text-xs px-2 py-1 rounded-lg font-semibold flex-shrink-0 transition-all"
                    style={{
                      background:
                        ex.gabarito === letra ? "#009688" : "var(--background)",
                      color:
                        ex.gabarito === letra
                          ? "#fff"
                          : "var(--muted-foreground)",
                      border: "1.5px solid var(--border)",
                    }}
                    title="Marcar como gabarito"
                  >
                    ✓
                  </button>
                </div>
              );
            })}
          </div>

          {/* Gabarito atual */}
          <div className="flex items-center gap-2">
            <Label>Gabarito:</Label>
            <span
              className="text-sm font-bold px-3 py-0.5 rounded-full"
              style={{ background: "#009688", color: "#fff" }}
            >
              {ex.gabarito}
            </span>
          </div>

          {/* Explicação */}
          <FieldWithPreview
            label="Explicação (mostrada após responder)"
            value={ex.explicacao}
            onEdit={(v) => onChange({ explicacao: v })}
            preview={previewExpl}
            onTogglePreview={() => setPreviewExpl((v) => !v)}
            rows={4}
            placeholder="Explicação pedagógica da resposta correta"
          />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Componentes de form reutilizáveis
// =============================================================================

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wider"
      style={{ color: "var(--muted-foreground)" }}
    >
      {children}
    </p>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1.5px solid var(--border)",
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1.5px solid var(--border)",
      }}
    />
  );
}

function FieldWithPreview({
  label,
  value,
  onEdit,
  preview,
  onTogglePreview,
  rows,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onEdit: (v: string) => void;
  preview: boolean;
  onTogglePreview: () => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button
          onClick={onTogglePreview}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{
            background: "var(--background)",
            border: "1.5px solid var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          {preview ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
          {preview ? "Editar" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div
          className="rounded-lg p-3 min-h-[80px]"
          style={{
            background: "var(--background)",
            border: "1.5px solid var(--border)",
            fontSize: "0.875rem",
            color: "var(--foreground)",
          }}
        >
          <LatexRenderer content={value} />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onEdit(e.target.value)}
          rows={rows ?? 4}
          placeholder={placeholder}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none font-mono resize-y"
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1.5px solid var(--border)",
          }}
        />
      )}
    </div>
  );
}

// =============================================================================
// VideosTab — gerenciamento de URLs de videoaula (código anterior, inalterado)
// =============================================================================

interface LicaoRow {
  trilhaSlug: string;
  trilhaTitulo: string;
  licaoSlug: string;
  licaoTitulo: string;
}

function VideosTab() {
  const licoes = useMemo<LicaoRow[]>(() => {
    const out: LicaoRow[] = [];
    for (const t of TRILHAS) {
      for (const cap of t.capitulos) {
        for (const l of cap.licoes) {
          out.push({
            trilhaSlug:   t.slug,
            trilhaTitulo: t.titulo,
            licaoSlug:    l.slug,
            licaoTitulo:  l.titulo,
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
    <div className="space-y-3">
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Cole a URL do YouTube de cada lição. O botão de videoaula aparece para os alunos na tela da lição.
      </p>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
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
              <VideoLicaoEditor
                key={`${row.trilhaSlug}:${row.licaoSlug}`}
                row={row}
                existing={existing ?? null}
                onChange={() => refetch()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function VideoLicaoEditor({
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
      licaoSlug:  row.licaoSlug,
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
