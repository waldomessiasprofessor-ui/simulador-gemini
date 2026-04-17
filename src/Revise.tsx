import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import {
  Loader2, BookOpen, ChevronRight, ArrowLeft, Brain, FileText, Download, ExternalLink,
} from "lucide-react";

export default function Revise({ id }: { id?: number }) {
  const [, navigate] = useLocation();

  // — Modo "browse": conteúdo específico por id ————————————————————————————
  const byId = trpc.review.getById.useQuery(
    { id: id! },
    { enabled: id !== undefined, staleTime: 0 }
  );

  // — Modo "daily": conteúdo aleatório do dia ──────────────────────────────
  const daily = trpc.review.getDaily.useQuery(
    undefined,
    { enabled: id === undefined, staleTime: 0 }
  );

  const isLoading = id !== undefined ? byId.isLoading : daily.isLoading;
  const content   = id !== undefined ? byId.data      : daily.data?.content;

  // — Cronômetro de leitura (só para modo "daily", que tem reviewId persistido)
  // Salva o delta ao desmontar OU ao esconder a aba (beforeunload/pagehide).
  // Descarta leituras < 5s (abertura acidental).
  const saveReadTime = trpc.review.saveReadTime.useMutation();
  const startTsRef = useRef<number>(Date.now());
  const reviewId = id === undefined ? daily.data?.review?.id : null;
  useEffect(() => {
    if (!reviewId) return;
    startTsRef.current = Date.now();

    function flush() {
      const elapsed = Math.round((Date.now() - startTsRef.current) / 1000);
      if (elapsed < 5 || !reviewId) return;
      // sendBeacon seria ideal, mas tRPC fetch já é rápido o bastante.
      saveReadTime.mutate({ reviewId, seconds: Math.min(elapsed, 7200) });
      // reinicia para não duplicar caso o usuário volte à aba
      startTsRef.current = Date.now();
    }

    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);
    return () => {
      flush();
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
    };
  }, [reviewId]);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7B3FA0" }} />
    </div>
  );

  if (!content) return (
    <div className="text-center py-20 space-y-3">
      <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "#7B3FA0" }} />
      <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum conteúdo disponível</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        O administrador ainda não cadastrou textos para revisão.
      </p>
      <button onClick={() => navigate("/")} className="btn-outline">Voltar ao início</button>
    </div>
  );

  const c = content as any;
  const hasPdf  = !!c.url_pdf;
  const hasText = !!(c.conteudo?.trim());

  return (
    <div className="space-y-5 py-2">
      <button onClick={() => navigate(id !== undefined ? "/revisao" : "/")}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft className="h-4 w-4" />
        {id !== undefined ? "Voltar à Revisão" : "Início"}
      </button>

      {/* Badge */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: "#F3EAF9", border: "1.5px solid #7B3FA044" }}>
        <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "#7B3FA0" }} />
        <div>
          <p className="font-bold text-sm" style={{ color: "#7B3FA0" }}>
            {id !== undefined ? "Revisão" : "Vamos estudar?"}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {c.topico ?? "Leitura"} · Leia com atenção
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="card space-y-4">
        <h2 className="font-black text-base" style={{ color: "var(--foreground)" }}>
          {c.titulo}
        </h2>

        {/* Texto */}
        {hasText && (
          <LatexRenderer fontSize="base">{c.conteudo}</LatexRenderer>
        )}

        {/* PDF */}
        {hasPdf && (
          <div className="space-y-3">
            {hasText && (
              <hr style={{ borderColor: "var(--border)" }} />
            )}

            {/* Viewer desktop */}
            <div className="hidden sm:block rounded-xl overflow-hidden"
              style={{ height: "68vh", border: "1.5px solid var(--border)" }}>
              <embed src={c.url_pdf} type="application/pdf" className="w-full h-full" />
            </div>

            {/* Fallback mobile */}
            <div className="sm:hidden rounded-xl p-5 text-center space-y-3"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)" }}>
              <FileText className="h-10 w-10 mx-auto" style={{ color: "#7B3FA0" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>PDF disponível</p>
              <a href={c.url_pdf} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: "#7B3FA0" }}>
                <ExternalLink className="h-4 w-4" /> Abrir PDF
              </a>
            </div>

            {/* Botão de download — sempre visível */}
            <a href={c.url_pdf} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}>
              <Download className="h-4 w-4" /> Baixar PDF
            </a>
          </div>
        )}
      </div>

      {/* Mensagem de incentivo */}
      <div className="rounded-2xl p-5 text-center space-y-3"
        style={{ background: "#F3EAF9", border: "1.5px solid #7B3FA044" }}>
        <Brain className="h-8 w-8 mx-auto" style={{ color: "#7B3FA0" }} />
        <p className="font-bold text-sm" style={{ color: "#7B3FA0" }}>
          Quer continuar estudando?
        </p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Acesse o menu <strong>Revisão</strong> e veja outros conteúdos
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate("/revisao")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white"
            style={{ background: "#7B3FA0" }}>
            Ir para Revisão <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => navigate("/")} className="btn-outline text-sm">
            Início
          </button>
        </div>
      </div>
    </div>
  );
}
