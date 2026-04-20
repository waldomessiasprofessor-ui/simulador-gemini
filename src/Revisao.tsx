import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, BookOpen, FileText, ChevronRight } from "lucide-react";

export default function Revisao() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.review.listAll.useQuery(undefined, { staleTime: 0 });

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-6"
        style={{ background: "linear-gradient(135deg, #263238 0%, #009688 100%)", color: "#ffffff" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Revisão</h1>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
          Escolha um conteúdo para estudar
        </p>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--pr-teal)" }} />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <BookOpen className="h-12 w-12 mx-auto opacity-30" style={{ color: "var(--pr-teal)" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>
            Nenhum conteúdo disponível ainda
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            O administrador ainda não cadastrou materiais de revisão.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((item) => {
            const hasPdf = !!(item as any).url_pdf;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/revise/${item.id}`)}
                className="w-full text-left rounded-xl transition-all hover:opacity-90"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--pr-teal-soft)" }}>
                    {hasPdf
                      ? <FileText className="h-5 w-5" style={{ color: "var(--pr-teal)" }} />
                      : <BookOpen className="h-5 w-5" style={{ color: "var(--pr-teal)" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                      {item.titulo}
                    </p>
                    {item.topico && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {item.topico}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal)" }}>
                      {hasPdf ? "PDF" : "Texto"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
