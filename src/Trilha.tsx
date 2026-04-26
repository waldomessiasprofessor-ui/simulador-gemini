import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { LatexRenderer } from "@/LatexRenderer";
import { getTrilhaBySlug, TRILHAS } from "@/trilhas";
import type { Licao, Trilha as TrilhaType } from "@/trilhas/types";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, BookOpen, Sparkles, Clock, Target, ChevronRight, CheckCircle2,
  XCircle, Trophy, RotateCcw, Home, Lightbulb,
} from "@/icons";
import { VideoButton } from "@/YoutubeEmbed";

// =============================================================================
// Botão de vídeo do YouTube — só aparece se o admin tiver cadastrado uma URL
// para a lição em /admin/trilhas. Usa o mesmo VideoButton das resoluções.
// =============================================================================
function VideoAulaBotao({ trilhaSlug, licaoSlug }: { trilhaSlug: string; licaoSlug: string }) {
  const [open, setOpen] = useState(false);
  const { data } = trpc.trilhas.get.useQuery(
    { trilhaSlug, licaoSlug },
    { staleTime: 60_000 },
  );
  if (!data?.urlYoutube) return null;
  return (
    <VideoButton
      url={data.urlYoutube}
      open={open}
      onToggle={() => setOpen((o) => !o)}
    />
  );
}

// =============================================================================
// Persistência local (localStorage) — v1 sem alteração de schema
// =============================================================================
// Key format: trilha:<trilhaSlug>:<licaoSlug>
// Value: { answers: {qId: letra}, finishedAt?: number, lastScorePct?: number, totalTimeSec?: number }

interface LicaoProgress {
  answers: Record<string, "A" | "B" | "C" | "D" | "E">;
  finishedAt?: number;
  lastScorePct?: number;
  totalTimeSec?: number;
}

function loadProgress(trilhaSlug: string, licaoSlug: string): LicaoProgress {
  try {
    const raw = localStorage.getItem(`trilha:${trilhaSlug}:${licaoSlug}`);
    return raw ? JSON.parse(raw) : { answers: {} };
  } catch {
    return { answers: {} };
  }
}

function saveProgress(trilhaSlug: string, licaoSlug: string, progress: LicaoProgress) {
  try {
    localStorage.setItem(`trilha:${trilhaSlug}:${licaoSlug}`, JSON.stringify(progress));
  } catch {
    // quota exceeded ou navegação privada — ignora silenciosamente
  }
}

function clearProgress(trilhaSlug: string, licaoSlug: string) {
  try {
    localStorage.removeItem(`trilha:${trilhaSlug}:${licaoSlug}`);
  } catch { /* ignora */ }
}

// =============================================================================
// Componente principal
// =============================================================================

export default function Trilha({ areaSlug, licaoSlug }: { areaSlug?: string; licaoSlug?: string }) {
  const [, navigate] = useLocation();
  const trilha = areaSlug ? getTrilhaBySlug(areaSlug) : undefined;

  // Sem slug → index de todas as trilhas disponíveis
  if (!areaSlug) {
    return (
      <div className="space-y-6 py-2">
        <div className="rounded-2xl px-6 py-8" style={{ background: "linear-gradient(135deg, #263238 0%, #009688 100%)", color: "#ffffff" }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold opacity-80">Aprendizado estruturado</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Trilhas</h1>
          <p className="text-sm opacity-80">Siga um caminho guiado, do básico ao avançado.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRILHAS.map((t) => {
            const totalLicoes = t.capitulos.reduce((acc, c) => acc + c.licoes.length, 0);
            return (
              <button
                key={t.slug}
                onClick={() => navigate(`/trilha/${t.slug}`)}
                className="text-left p-5 rounded-2xl transition-all hover:opacity-90"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
              >
                <p className="font-bold text-base mb-1" style={{ color: "var(--foreground)" }}>{t.title}</p>
                <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{t.area}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E0F2F1", color: "#00695C" }}>
                    {t.capitulos.length} capítulos
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E0F2F1", color: "#00695C" }}>
                    {totalLicoes} lições
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Slug inválido
  if (!trilha) {
    return (
      <div className="text-center py-20 space-y-3">
        <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "#009688" }} />
        <p className="font-semibold" style={{ color: "var(--foreground)" }}>Trilha não encontrada</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Essa área ainda não tem uma trilha de desenvolvimento.</p>
        <button onClick={() => navigate("/trilhas")} className="btn-outline">Ver todas as trilhas</button>
      </div>
    );
  }

  // Se tem licaoSlug, renderiza a lição
  if (licaoSlug) {
    const licao = trilha.capitulos
      .flatMap((c) => c.licoes)
      .find((l) => l.slug === licaoSlug);

    if (!licao) {
      return (
        <div className="text-center py-20 space-y-3">
          <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "#009688" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Lição não encontrada</p>
          <button onClick={() => navigate(`/trilha/${trilha.slug}`)} className="btn-outline">
            Voltar à trilha
          </button>
        </div>
      );
    }

    return <LicaoView trilha={trilha} licao={licao} />;
  }

  // Caso contrário, lista os capítulos e lições da trilha
  return <TrilhaIndex trilha={trilha} />;
}

// =============================================================================
// Tela 1: Índice da trilha (capítulos + lições)
// =============================================================================

function TrilhaIndex({ trilha }: { trilha: TrilhaType }) {
  const [, navigate] = useLocation();

  return (
    <div className="space-y-5 py-2">
      {/* Voltar */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft className="h-4 w-4" /> Voltar ao início
      </button>

      {/* Cabeçalho da trilha */}
      <div className="rounded-2xl px-6 py-6"
        style={{
          background: "linear-gradient(135deg, #263238 0%, #009688 100%)",
          color: "#ffffff",
        }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.22)" }}>
            <Sparkles className="h-5 w-5" style={{ color: "#ffffff" }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.85)" }}>Trilha</p>
            <h1 className="text-xl font-black" style={{ color: "#ffffff" }}>{trilha.titulo}</h1>
          </div>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>
          {trilha.descricao}
        </p>
      </div>

      {/* Capítulos e lições */}
      {trilha.capitulos.map((cap) => (
        <div key={cap.slug} className="space-y-2">
          <h2 className="pr-eyebrow">{cap.titulo}</h2>
          <div className="space-y-2">
            {cap.licoes.map((licao) => {
              const prog = loadProgress(trilha.slug, licao.slug);
              const concluida = prog.finishedAt !== undefined;
              return (
                <button
                  key={licao.slug}
                  onClick={() => navigate(`/trilha/${trilha.slug}/${licao.slug}`)}
                  className="w-full text-left rounded-xl transition-all hover:shadow-sm"
                  style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: concluida ? "#F0FDF4" : "#E0F2F1",
                        border: `1.5px solid ${concluida ? "#A7F3D0" : "#B2DFDB"}`,
                      }}>
                      {concluida
                        ? <CheckCircle2 className="h-5 w-5" style={{ color: "#16A34A" }} />
                        : <BookOpen className="h-5 w-5" style={{ color: "#00695C" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                        {licao.titulo}
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                        <LatexRenderer inline>{licao.resumo}</LatexRenderer>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                          <Clock className="h-3 w-3" /> {licao.duracaoMinutos} min
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                          <Target className="h-3 w-3" /> {licao.exercicios.length} exercícios
                        </span>
                        {concluida && prog.lastScorePct !== undefined && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold"
                            style={{ color: "#16A34A" }}>
                            <CheckCircle2 className="h-3 w-3" /> {prog.lastScorePct}%
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Tela 2: Lição (explicação → exemplos → exercícios → resumo)
// =============================================================================

type FaseLicao = "conteudo" | "exercicios" | "resumo";

function LicaoView({ trilha, licao }: { trilha: TrilhaType; licao: Licao }) {
  const [, navigate] = useLocation();

  const [fase, setFase] = useState<FaseLicao>("conteudo");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D" | "E">>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [leituraFeita, setLeituraFeita] = useState(false);
  const startRef = useRef<number>(Date.now());

  const total = licao.exercicios.length;
  const currentEx = licao.exercicios[idx];

  // Scroll ao topo ao mudar de fase/questão
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fase, idx]);

  // Marca início do cronômetro ao entrar em "exercícios"
  useEffect(() => {
    if (fase === "exercicios" && idx === 0) startRef.current = Date.now();
  }, [fase, idx]);

  function handleSelect(letra: "A" | "B" | "C" | "D" | "E") {
    if (revealed[currentEx.id]) return;
    setAnswers((prev) => ({ ...prev, [currentEx.id]: letra }));
    setRevealed((prev) => ({ ...prev, [currentEx.id]: true }));
  }

  function handleNext() {
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      // Terminou — calcula resultado e salva
      const correct = licao.exercicios.filter((e) => answers[e.id] === e.gabarito).length;
      const pct = Math.round((correct / total) * 100);
      const elapsed = Math.round((Date.now() - startRef.current) / 1000);
      saveProgress(trilha.slug, licao.slug, {
        answers,
        finishedAt: Date.now(),
        lastScorePct: pct,
        totalTimeSec: elapsed,
      });
      setFase("resumo");
    }
  }

  function handleRestart() {
    clearProgress(trilha.slug, licao.slug);
    setFase("conteudo");
    setIdx(0);
    setAnswers({});
    setRevealed({});
    startRef.current = Date.now();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FASE: conteúdo (explicação + exemplos + CTA "agora é sua vez")
  // ───────────────────────────────────────────────────────────────────────────
  if (fase === "conteudo") {
    return (
      <div className="space-y-5 py-2">
        {/* Voltar */}
        <button
          onClick={() => navigate(`/trilha/${trilha.slug}`)}
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft className="h-4 w-4" /> Voltar à trilha
        </button>

        {/* Título da lição */}
        <div className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: "#E0F2F1", border: "1.5px solid #B2DFDB" }}>
          <BookOpen className="h-5 w-5 flex-shrink-0" style={{ color: "#00695C" }} />
          <div className="flex-1 min-w-0">
            <p className="pr-eyebrow">Lição</p>
            <h1 className="font-black text-base" style={{ color: "#004D40" }}>
              {licao.titulo}
            </h1>
          </div>
        </div>

        {/* Videoaula (se admin tiver cadastrado uma URL) */}
        <VideoAulaBotao trilhaSlug={trilha.slug} licaoSlug={licao.slug} />

        {/* Explicação */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" style={{ color: "#00695C" }} />
            <h2 className="pr-eyebrow">O conceito</h2>
          </div>
          <LatexRenderer fontSize="base">{licao.explicacao}</LatexRenderer>
        </div>

        {/* Exemplos resolvidos */}
        {licao.exemplos.map((ex, i) => (
          <div key={i} className="card space-y-3"
            style={{ background: "var(--pr-bg-alt)" }}>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" style={{ color: "#00695C" }} />
              <h3 className="pr-eyebrow"><LatexRenderer inline>{ex.titulo}</LatexRenderer></h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Problema
              </p>
              <LatexRenderer fontSize="base">{ex.problema}</LatexRenderer>
            </div>
            <hr style={{ borderColor: "var(--border)" }} />
            <div className="space-y-2">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Resolução
              </p>
              <LatexRenderer fontSize="base">{ex.resolucao}</LatexRenderer>
            </div>
          </div>
        ))}

        {/* Concluir Leitura */}
        <button
          onClick={() => {
            if (leituraFeita) return;
            setLeituraFeita(true);
            try {
              const prev = parseInt(localStorage.getItem("trilha:leituras") || "0", 10) || 0;
              localStorage.setItem("trilha:leituras", String(prev + 1));
            } catch { /* ignora */ }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
          style={{
            background: leituraFeita ? "#F0FDF4" : "#EFF6FF",
            border: `1.5px solid ${leituraFeita ? "#86EFAC" : "#BFDBFE"}`,
            color: leituraFeita ? "#15803D" : "#1D4ED8",
          }}>
          <CheckCircle2 className="h-4 w-4" />
          {leituraFeita ? "Leitura concluída ✓" : "Concluir Leitura"}
        </button>

        {/* CTA — Agora é sua vez */}
        <div className="rounded-2xl p-5 text-center space-y-3"
          style={{ background: "#E0F2F1", border: "1.5px solid #B2DFDB" }}>
          <Sparkles className="h-8 w-8 mx-auto" style={{ color: "#00695C" }} />
          <p className="font-black" style={{ color: "#004D40" }}>
            Agora é sua vez!
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {total} exercícios progressivos — do simples ao mais desafiador. Você verá a explicação
            de cada questão logo após responder.
          </p>
          <button
            onClick={() => setFase("exercicios")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
            style={{
              backgroundColor: "#009688",
              backgroundImage: "linear-gradient(135deg, #009688 0%, #00695C 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 14px rgba(0,150,136,0.4)",
            }}>
            Começar exercícios <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FASE: exercícios (um por vez, com feedback imediato)
  // ───────────────────────────────────────────────────────────────────────────
  if (fase === "exercicios") {
    const selected = answers[currentEx.id];
    const isRevealed = !!revealed[currentEx.id];
    const isCorrect = isRevealed && selected === currentEx.gabarito;

    return (
      <div className="space-y-5 py-2">
        {/* Header — progresso */}
        <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: "#E0F2F1", border: "1.5px solid #B2DFDB" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold" style={{ color: "#004D40" }}>
              {licao.titulo}
            </span>
          </div>
          <span className="text-sm font-mono font-bold flex-shrink-0" style={{ color: "#00695C" }}>
            {idx + 1}/{total}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${((idx + (isRevealed ? 1 : 0)) / total) * 100}%` }} />
        </div>

        {/* Questão */}
        <div className="card space-y-4">
          <div>
            <span className="pr-eyebrow">Exercício {idx + 1}</span>
            <div className="mt-2">
              <LatexRenderer fontSize="base">{currentEx.enunciado}</LatexRenderer>
            </div>
          </div>

          <div className="space-y-2">
            {currentEx.alternativas.map((alt) => {
              const isThis = selected === alt.letra;
              const isCorrectAlt = alt.letra === currentEx.gabarito;
              let cls = "alternative";
              if (isRevealed) {
                if (isCorrectAlt) cls += " correct";
                else if (isThis) cls += " wrong";
              } else if (isThis) {
                cls += " selected";
              }
              return (
                <button
                  key={alt.letra}
                  onClick={() => handleSelect(alt.letra)}
                  disabled={isRevealed}
                  className={cls}>
                  <span className="alt-badge">{alt.letra}</span>
                  <span className="flex-1">
                    <LatexRenderer inline>{alt.texto}</LatexRenderer>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback imediato após responder */}
          {isRevealed && (
            <div className="rounded-xl p-4 space-y-2"
              style={{
                background: isCorrect ? "#F0FDF4" : "#FEF2F2",
                border: `1.5px solid ${isCorrect ? "#A7F3D0" : "#FECACA"}`,
              }}>
              <div className="flex items-center gap-2">
                {isCorrect
                  ? <CheckCircle2 className="h-5 w-5" style={{ color: "#16A34A" }} />
                  : <XCircle className="h-5 w-5" style={{ color: "#DC2626" }} />}
                <p className="font-bold text-sm"
                  style={{ color: isCorrect ? "#16A34A" : "#DC2626" }}>
                  {isCorrect ? "Correto!" : `Resposta correta: ${currentEx.gabarito}`}
                </p>
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                <LatexRenderer fontSize="sm">{currentEx.explicacao}</LatexRenderer>
              </div>
            </div>
          )}
        </div>

        {/* Botão avançar — solid teal, bulletproof (sem depender de CSS vars) */}
        {isRevealed && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base"
            style={{
              backgroundColor: "#009688",
              backgroundImage: "linear-gradient(135deg, #009688 0%, #00695C 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 14px rgba(0,150,136,0.4)",
              letterSpacing: "0.01em",
            }}>
            {idx < total - 1 ? "Próximo exercício" : "Ver resultado"}
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FASE: resumo final
  // ───────────────────────────────────────────────────────────────────────────
  return <ResumoLicao trilha={trilha} licao={licao} answers={answers} onRestart={handleRestart} />;
}

// =============================================================================
// Tela 3: Resumo (após terminar todos os exercícios)
// =============================================================================

function ResumoLicao({
  trilha, licao, answers, onRestart,
}: {
  trilha: TrilhaType;
  licao: Licao;
  answers: Record<string, "A" | "B" | "C" | "D" | "E">;
  onRestart: () => void;
}) {
  const [, navigate] = useLocation();

  const { correct, pct, elapsed } = useMemo(() => {
    const correctCount = licao.exercicios.filter((e) => answers[e.id] === e.gabarito).length;
    const pctCalc = Math.round((correctCount / licao.exercicios.length) * 100);
    const prog = loadProgress(trilha.slug, licao.slug);
    return { correct: correctCount, pct: pctCalc, elapsed: prog.totalTimeSec ?? 0 };
  }, [answers, licao, trilha.slug]);

  const bom = pct >= 70;
  const ok  = pct >= 50 && pct < 70;

  const cor = bom ? "#16A34A"  : ok ? "#B45309"    : "#DC2626";
  const bg  = bom ? "#F0FDF4" : ok ? "#FFFBEB" : "#FEF2F2";
  const bd  = bom ? "#A7F3D0" : ok ? "#FCD34D" : "#FECACA";

  const mensagem = bom
    ? "Excelente! Você dominou este conteúdo."
    : ok
      ? "Bom trabalho. Vale revisar os erros e praticar mais."
      : "Hora de revisar o conceito e tentar de novo — é parte do processo.";

  const minutos = Math.floor(elapsed / 60);
  const segundos = elapsed % 60;

  return (
    <div className="space-y-5 py-2">
      {/* Cartão de resultado */}
      <div className="rounded-2xl p-6 text-center space-y-3"
        style={{ background: bg, border: `1.5px solid ${bd}` }}>
        <Trophy className="h-10 w-10 mx-auto" style={{ color: cor }} />
        <p className="pr-stat text-5xl" style={{ color: cor }}>{pct}%</p>
        <p className="text-sm font-bold" style={{ color: cor }}>
          {correct} de {licao.exercicios.length} acertos
        </p>
        {elapsed > 0 && (
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Clock className="inline h-3 w-3 mr-1" />
            Tempo: {minutos > 0 ? `${minutos} min ` : ""}{segundos}s
          </p>
        )}
        <p className="text-sm pt-2" style={{ color: "var(--foreground)" }}>{mensagem}</p>
      </div>

      {/* Revisão questão por questão */}
      <div className="space-y-2">
        <h2 className="pr-eyebrow">Revisão</h2>
        {licao.exercicios.map((ex, i) => {
          const selected = answers[ex.id];
          const acertou = selected === ex.gabarito;
          return (
            <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: acertou ? "#F0FDF4" : "#FEF2F2",
                border: `1px solid ${acertou ? "#A7F3D0" : "#FECACA"}`,
              }}>
              <span className="text-xs font-bold w-6 text-center flex-shrink-0"
                style={{ color: acertou ? "#16A34A" : "#DC2626" }}>
                {i + 1}
              </span>
              <span className="flex-1 text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                Exercício {i + 1}
              </span>
              <span className="text-xs font-bold flex-shrink-0"
                style={{ color: acertou ? "#16A34A" : "#DC2626" }}>
                {selected ?? "—"} → {ex.gabarito}
              </span>
              {acertou
                ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#16A34A" }} />
                : <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#DC2626" }} />}
            </div>
          );
        })}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
          style={{
            backgroundColor: "#009688",
            backgroundImage: "linear-gradient(135deg, #009688 0%, #00695C 100%)",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 14px rgba(0,150,136,0.4)",
          }}>
          <RotateCcw className="h-4 w-4" /> Refazer a lição
        </button>
        <button
          onClick={() => navigate(`/trilha/${trilha.slug}`)}
          className="btn-outline justify-center">
          <BookOpen className="h-4 w-4" /> Voltar à trilha
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
          style={{ background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}>
          <Home className="h-4 w-4" /> Início
        </button>
      </div>
    </div>
  );
}
