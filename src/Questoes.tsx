import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { ChevronDown, ChevronUp, Search, Loader2, BookOpen, Dumbbell, LayoutList, BookOpenCheck, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { VideoButton } from "@/YoutubeEmbed";

const TAGS_CONTEUDO = [
  "Análise Combinatória",
  "Áreas de Figuras Planas",
  "Conversão de Unidades",
  "Equações e Inequações",
  "Escala",
  "Estatística",
  "Função do Primeiro Grau",
  "Função Exponencial",
  "Função Logarítmica",
  "Função Quadrática",
  "Funções de 1º e 2º Grau",
  "Geometria Espacial",
  "Geometria Plana",
  "Grandezas Proporcionais",
  "Leitura de Gráficos e Tabelas",
  "Logaritmos",
  "Matemática Financeira",
  "Medidas de Tendência Central",
  "Noções de Lógica Matemática",
  "Operações Básicas",
  "Porcentagem",
  "Potenciação",
  "Probabilidade",
  "Progressão Aritmética",
  "Progressão Geométrica",
  "Razão, Proporção e Regra de Três",
  "Sequências",
  "Trigonometria",
  "Visualização Espacial/Projeção Ortogonal",
];

function FilterDropdown({ filterTag, setFilterTag }: { filterTag: string; setFilterTag: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto transition-all"
        style={{ background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="block w-4 h-0.5 rounded" style={{ background: "currentColor" }} />
          <span className="block w-4 h-0.5 rounded" style={{ background: "currentColor" }} />
          <span className="block w-3 h-0.5 rounded" style={{ background: "currentColor" }} />
        </div>
        {filterTag === "Todas" ? "Filtrar conteúdo" : filterTag}
        {open ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
        {filterTag !== "Todas" && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "#009688", color: "#fff" }}>1</span>
        )}
      </button>

      {open && (
        <div className="mt-2 p-3 rounded-xl flex flex-wrap gap-2" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
          {["Todas", ...TAGS_CONTEUDO].map((tag) => (
            <button key={tag} onClick={() => { setFilterTag(tag); setOpen(false); }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={filterTag === tag
                ? { background: "#009688", color: "#fff" }
                : { background: "var(--muted)", color: "var(--muted-foreground)" }}>
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const FONTE_INFO: Record<string, { titulo: string; subtitulo: string }> = {
  ENEM:    { titulo: "Banco de Questões — ENEM",               subtitulo: "questões de Matemática do ENEM" },
  UNICAMP: { titulo: "Banco de Questões — UNICAMP",            subtitulo: "questões de Matemática da UNICAMP" },
  FUVEST:  { titulo: "Banco de Questões — FUVEST",             subtitulo: "questões de Matemática da FUVEST" },
  UNESP:   { titulo: "Banco de Questões — UNESP",              subtitulo: "questões de Matemática da UNESP" },
  REPVET:  { titulo: "Banco de Questões — Repositório Vetor",  subtitulo: "questões do Repositório Vetor" },
};

export default function Questoes({ fonte }: { fonte?: string }) {
  const initialParams = (() => {
    const params = new URLSearchParams(window.location.search);
    return {
      topic: params.get("topic") ?? "",
      tag: params.get("tag") ?? "",
      c: params.get("c") ?? "",
    };
  })();
  const [search, setSearch] = useState(initialParams.c);
  const [filterTag, setFilterTag] = useState(
    initialParams.tag && TAGS_CONTEUDO.includes(initialParams.tag) ? initialParams.tag : "Todas"
  );
  const [topicFilter, setTopicFilter] = useState(initialParams.topic);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const [openResolution, setOpenResolution] = useState<number | null>(null);
  const [openVideoId, setOpenVideoId] = useState<number | null>(null);

  // Dual-view mode
  const [viewMode, setViewMode] = useState<"lista" | "individual">("lista");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gabaritoRevealed, setGabaritoRevealed] = useState(false);
  const [showResolution, setShowResolution] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const info = fonte ? (FONTE_INFO[fonte] ?? FONTE_INFO["ENEM"]) : FONTE_INFO["ENEM"];

  const sharedQueryParams = {
    conteudo: search || undefined,
    fonte: fonte || undefined,
    tag: filterTag !== "Todas" ? filterTag : undefined,
    topic: topicFilter || undefined,
    activeOnly: true,
    orderBy: "conteudo_principal" as const,
    orderDir: "asc" as const,
  };

  // Query para modo lista (paginado)
  const { data, isLoading } = trpc.questions.list.useQuery({
    ...sharedQueryParams,
    page,
    pageSize: 20,
  });

  // Query para modo individual (todas as questões de uma vez)
  const { data: allData, isLoading: allLoading } = trpc.questions.list.useQuery({
    ...sharedQueryParams,
    page: 1,
    pageSize: 300,
  }, { enabled: viewMode === "individual" });

  const filtered = data?.questions ?? [];
  const allQuestions = allData?.questions ?? [];
  const currentQ = allQuestions[currentIndex] ?? null;

  function switchToIndividual() {
    setViewMode("individual");
    setCurrentIndex(0);
    setGabaritoRevealed(false);
    setShowResolution(false);
    setShowVideo(false);
  }

  function switchToLista() {
    setViewMode("lista");
  }

  function goNext() {
    setCurrentIndex((i) => Math.min(allQuestions.length - 1, i + 1));
    setGabaritoRevealed(false);
    setShowResolution(false);
    setShowVideo(false);
  }

  function goPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setGabaritoRevealed(false);
    setShowResolution(false);
    setShowVideo(false);
  }

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-6 text-white" style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <h1 className="text-xl font-bold">{info.titulo}</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
          {data?.pagination.total ?? "—"} {info.subtitulo}
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
        <input type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); setFilterTag("Todas"); setTopicFilter(""); setCurrentIndex(0); }}
          placeholder="Buscar por conteúdo..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
          onFocus={(e) => (e.target.style.borderColor = "#009688")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
      </div>

      {/* Filtro por tag + Toggle de modo */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <FilterDropdown filterTag={filterTag} setFilterTag={(t) => { setFilterTag(t); setPage(1); setTopicFilter(""); setCurrentIndex(0); }} />
        </div>

        {/* Toggle Lista / Questão a questão */}
        <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1.5px solid var(--border)" }}>
          <button
            onClick={switchToLista}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
            style={viewMode === "lista"
              ? { background: "#009688", color: "#fff" }
              : { background: "var(--muted)", color: "var(--muted-foreground)" }}
            title="Modo lista">
            <LayoutList className="h-3.5 w-3.5" />
            Lista
          </button>
          <button
            onClick={switchToIndividual}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
            style={viewMode === "individual"
              ? { background: "#009688", color: "#fff" }
              : { background: "var(--muted)", color: "var(--muted-foreground)" }}
            title="Questão a questão">
            <BookOpenCheck className="h-3.5 w-3.5" />
            Uma a uma
          </button>
        </div>
      </div>

      {/* Banner do filtro por tópico vindo do Planner / Dashboard */}
      {topicFilter && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "#E0F2F1", border: "1.5px solid #009688" }}>
          <Dumbbell className="h-4 w-4 flex-shrink-0" style={{ color: "#00695C" }} />
          <p className="text-sm font-semibold flex-1" style={{ color: "#00695C" }}>
            Praticando: <span style={{ color: "#004D40" }}>{topicFilter}</span>
          </p>
          <button
            onClick={() => { setTopicFilter(""); setPage(1); setCurrentIndex(0); }}
            className="text-xs font-bold px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#009688", color: "#fff" }}>
            Ver todas
          </button>
        </div>
      )}

      {/* ─── MODO LISTA ─── */}
      {viewMode === "lista" && (
        <>
          {/* Contador */}
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {data?.pagination.total ?? filtered.length} questão(ões){filterTag !== "Todas" ? ` em "${filterTag}"` : ""}
            {topicFilter ? ` sobre "${topicFilter}"` : ""}
            {data && data.pagination.totalPages > 1 ? ` — página ${page} de ${data.pagination.totalPages}` : ""}
          </p>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                {filterTag !== "Todas" ? `Nenhuma questão com a tag "${filterTag}"` : "Nenhuma questão encontrada"}
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {filterTag !== "Todas"
                  ? "Atribua esta tag às questões na área Admin."
                  : "O banco de questões está vazio."}
              </p>
              {filterTag !== "Todas" && (
                <button onClick={() => setFilterTag("Todas")}
                  className="text-sm font-semibold underline underline-offset-2" style={{ color: "#009688" }}>
                  Ver todas as questões
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((q) => {
                const isOpen = openId === q.id;
                const qTags = Array.isArray(q.tags)
                  ? q.tags.filter((t: string) => TAGS_CONTEUDO.includes(t))
                  : [];

                return (
                  <div key={q.id} className="rounded-xl overflow-hidden"
                    style={{ border: "1.5px solid var(--border)", background: "var(--card)" }}>
                    <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                      onClick={() => setOpenId(isOpen ? null : q.id)}>
                      <div className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black"
                        style={{ background: "#E0F2F1", color: "#009688" }}>
                        {q.conteudo_principal.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {q.conteudo_principal}
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {q.fonte} {q.ano ?? ""} · {q.nivel_dificuldade}
                        </p>
                        {qTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {qTags.map((tag: string) => (
                              <button key={tag} onClick={(e) => { e.stopPropagation(); setFilterTag(tag); }}
                                className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors hover:opacity-80"
                                style={{ background: "#E0F2F1", color: "#00695C" }}>
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {isOpen
                        ? <ChevronUp className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--muted-foreground)" }} />
                        : <ChevronDown className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "var(--muted-foreground)" }} />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                        <div className="pt-4">
                          <LatexRenderer fontSize="sm">{q.enunciado}</LatexRenderer>
                        </div>
                        {q.url_imagem && (
                          <img src={q.url_imagem} alt="Imagem da questão" className="max-w-full rounded-lg"
                            style={{ border: "1px solid var(--border)" }} />
                        )}
                        <div className="space-y-1.5">
                          {Object.entries(q.alternativas as Record<string, any>).sort().filter(([, value]) => value !== null && value !== "").map(([id, value]) => {
                            const text = value !== null && typeof value === "object" ? value.text ?? "" : value ?? "";
                            const file = value !== null && typeof value === "object" ? value.file : null;
                            return (
                              <div key={id} className="flex gap-2 px-3 py-2 rounded-lg text-sm"
                                style={{ background: "var(--muted)" }}>
                                <span className="font-bold flex-shrink-0 w-4" style={{ color: "#009688" }}>{id}</span>
                                <div className="flex-1">
                                  {file && <img src={file} alt={`Alt ${id}`} className="max-w-xs rounded mb-1" />}
                                  {text && <LatexRenderer inline>{text}</LatexRenderer>}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Gabarito + Ver resolução */}
                        <div className="pt-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: "#E0F2F1", color: "#00695C" }}>
                              Gabarito: {q.gabarito}
                            </span>
                            {q.comentario_resolucao && (
                              <button
                                onClick={() => setOpenResolution(openResolution === q.id ? null : q.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
                                style={{
                                  background: openResolution === q.id ? "#009688" : "var(--muted)",
                                  color: openResolution === q.id ? "#fff" : "#009688",
                                  border: "1.5px solid #B2DFDB",
                                }}>
                                <BookOpen className="h-3 w-3" />
                                {openResolution === q.id ? "Ocultar resolução" : "Ver resolução"}
                              </button>
                            )}
                            {(q as any).url_video && (
                              <VideoButton
                                url={(q as any).url_video}
                                open={openVideoId === q.id}
                                onToggle={() => setOpenVideoId(openVideoId === q.id ? null : q.id)}
                                size="sm"
                              />
                            )}
                          </div>

                          {openResolution === q.id && q.comentario_resolucao && (
                            <div className="rounded-xl p-4 space-y-1"
                              style={{ background: "var(--card)", borderLeft: "3px solid #1D4ED8", border: "1px solid var(--border)" }}>
                              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1D4ED8" }}>
                                Resolução
                              </p>
                              <LatexRenderer fontSize="sm">{q.comentario_resolucao}</LatexRenderer>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Paginação */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--muted)", color: "var(--foreground)" }}>Anterior</button>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{page} / {data.pagination.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages}
                className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--muted)", color: "var(--foreground)" }}>Próxima</button>
            </div>
          )}
        </>
      )}

      {/* ─── MODO INDIVIDUAL ─── */}
      {viewMode === "individual" && (
        <>
          {allLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
            </div>
          ) : allQuestions.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhuma questão encontrada</p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Tente remover filtros ou buscar por outro conteúdo.</p>
            </div>
          ) : currentQ ? (() => {
            const qTags = Array.isArray(currentQ.tags)
              ? currentQ.tags.filter((t: string) => TAGS_CONTEUDO.includes(t))
              : [];
            return (
              <div className="space-y-4">
                {/* Barra de progresso + contador */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                      Questão <span style={{ color: "#009688", fontWeight: 800 }}>{currentIndex + 1}</span> de {allQuestions.length}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#E0F2F1", color: "#00695C" }}>
                      {currentQ.fonte} {currentQ.ano ?? ""} · {currentQ.nivel_dificuldade}
                    </span>
                  </div>
                  {/* Barra de progresso */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ background: "#009688", width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Card da questão */}
                <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border)", background: "var(--card)" }}>
                  {/* Header do card */}
                  <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {currentQ.conteudo_principal}
                    </p>
                    {qTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {qTags.map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "#E0F2F1", color: "#00695C" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enunciado */}
                  <div className="px-5 py-5 space-y-4">
                    <LatexRenderer fontSize="sm">{currentQ.enunciado}</LatexRenderer>

                    {currentQ.url_imagem && (
                      <img src={currentQ.url_imagem} alt="Imagem da questão" className="max-w-full rounded-lg"
                        style={{ border: "1px solid var(--border)" }} />
                    )}

                    {/* Alternativas */}
                    <div className="space-y-2 pt-1">
                      {Object.entries(currentQ.alternativas as Record<string, any>)
                        .sort()
                        .filter(([, value]) => value !== null && value !== "")
                        .map(([id, value]) => {
                          const text = value !== null && typeof value === "object" ? value.text ?? "" : value ?? "";
                          const file = value !== null && typeof value === "object" ? value.file : null;
                          const isCorrect = gabaritoRevealed && id === currentQ.gabarito;
                          return (
                            <div key={id}
                              className="flex gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
                              style={{
                                background: isCorrect ? "#E0F2F1" : "var(--muted)",
                                border: isCorrect ? "1.5px solid #009688" : "1.5px solid transparent",
                              }}>
                              <span className="font-bold flex-shrink-0 w-4" style={{ color: isCorrect ? "#009688" : "#009688" }}>{id}</span>
                              <div className="flex-1">
                                {file && <img src={file} alt={`Alt ${id}`} className="max-w-xs rounded mb-1" />}
                                {text && <LatexRenderer inline>{text}</LatexRenderer>}
                              </div>
                              {isCorrect && (
                                <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full self-center"
                                  style={{ background: "#009688", color: "#fff" }}>✓</span>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Revelar gabarito + resolução + vídeo */}
                    <div className="pt-2 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setGabaritoRevealed((r) => !r); if (gabaritoRevealed) { setShowResolution(false); } }}
                          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                          style={gabaritoRevealed
                            ? { background: "#009688", color: "#fff" }
                            : { background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}>
                          {gabaritoRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {gabaritoRevealed ? "Ocultar gabarito" : "Revelar gabarito"}
                        </button>

                        {gabaritoRevealed && currentQ.comentario_resolucao && (
                          <button
                            onClick={() => setShowResolution((r) => !r)}
                            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                            style={showResolution
                              ? { background: "#1D4ED8", color: "#fff" }
                              : { background: "var(--muted)", color: "#1D4ED8", border: "1.5px solid #BFDBFE" }}>
                            <BookOpen className="h-4 w-4" />
                            {showResolution ? "Ocultar resolução" : "Ver resolução"}
                          </button>
                        )}

                        {gabaritoRevealed && (currentQ as any).url_video && (
                          <VideoButton
                            url={(currentQ as any).url_video}
                            open={showVideo}
                            onToggle={() => setShowVideo((v) => !v)}
                            size="sm"
                          />
                        )}
                      </div>

                      {/* Gabarito revelado */}
                      {gabaritoRevealed && (
                        <div className="rounded-xl px-4 py-3" style={{ background: "#E0F2F1", border: "1.5px solid #009688" }}>
                          <p className="text-sm font-bold" style={{ color: "#004D40" }}>
                            Gabarito: <span style={{ color: "#009688" }}>{currentQ.gabarito}</span>
                          </p>
                        </div>
                      )}

                      {/* Resolução */}
                      {showResolution && currentQ.comentario_resolucao && (
                        <div className="rounded-xl p-4 space-y-1"
                          style={{ background: "var(--card)", borderLeft: "3px solid #1D4ED8", border: "1px solid var(--border)" }}>
                          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1D4ED8" }}>
                            Resolução
                          </p>
                          <LatexRenderer fontSize="sm">{currentQ.comentario_resolucao}</LatexRenderer>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navegação Anterior / Próxima */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold flex-1 justify-center transition-all disabled:opacity-40"
                    style={{ background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}>
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === allQuestions.length - 1}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold flex-1 justify-center transition-all disabled:opacity-40"
                    style={{ background: "#009688", color: "#fff" }}>
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })() : null}
        </>
      )}
    </div>
  );
}
