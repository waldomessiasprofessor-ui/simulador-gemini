import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { Loader2, BookOpen, ArrowLeft } from "lucide-react";

export default function Revise() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.getDaily.useQuery(undefined, { staleTime: 0 });

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#7B3FA0" }} />
    </div>
  );

  if (!data?.content) return (
    <div className="text-center py-20 space-y-3">
      <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "#7B3FA0" }} />
      <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhum conteúdo disponível</p>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        O administrador ainda não cadastrou textos para revisão.
      </p>
      <button onClick={() => navigate("/")}
        className="px-4 py-2 rounded-xl text-sm font-bold"
        style={{ background: "#7B3FA0", color: "#fff" }}>
        Voltar ao início
      </button>
    </div>
  );

  const { content } = data;

  return (
    <div className="space-y-5 py-2">
      {/* Voltar */}
      <button onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft className="h-4 w-4" /> Início
      </button>

      {/* Badge */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: "#F3EAF9", border: "1.5px solid #7B3FA044" }}>
        <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "#7B3FA0" }} />
        <div>
          <p className="font-bold text-sm" style={{ color: "#7B3FA0" }}>Revise</p>
          {content.topico && (
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{content.topico}</p>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
        <h2 className="font-black text-lg" style={{ color: "var(--foreground)" }}>
          {content.titulo}
        </h2>
        <div style={{ color: "var(--foreground)" }}>
          <LatexRenderer fontSize="base">{content.conteudo}</LatexRenderer>
        </div>
      </div>

      {/* Botão voltar */}
      <button onClick={() => navigate("/")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
        style={{ background: "#F3EAF9", color: "#7B3FA0", border: "1.5px solid #7B3FA044" }}>
        <ArrowLeft className="h-4 w-4" /> Voltar ao início
      </button>
    </div>
  );
}
