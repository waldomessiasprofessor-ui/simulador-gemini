import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { ChevronDown, ChevronUp, Loader2, BookOpen } from "lucide-react";

function SecaoCard({ titulo, cor, formulas }: { titulo: string; cor: string; formulas: any[] }) {
  const [open, setOpen] = useState(false);
  const [openFormula, setOpenFormula] = useState<number | null>(null);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid var(--border)` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: cor }} />
          <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{titulo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${cor}22`, color: cor }}>
            {formulas.length} fórmulas
          </span>
          {open
            ? <ChevronUp className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            : <ChevronDown className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />}
        </div>
      </button>

      {open && (
        <div className="divide-y" style={{ borderTop: `1px solid var(--border)` }}>
          {formulas.map((f, i) => (
            <div key={f.id ?? i} style={{ background: "var(--card)" }}>
              <button
                onClick={() => setOpenFormula(openFormula === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
              >
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{f.titulo}</span>
                {openFormula === i
                  ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                  : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />}
              </button>

              {openFormula === i && (
                <div className="px-5 pb-4 space-y-3">
                  <div className="rounded-xl px-4 py-3 overflow-x-auto"
                    style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                    <LatexRenderer fontSize="base">{f.formula}</LatexRenderer>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: cor }}>Quando usar?</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      <LatexRenderer fontSize="sm">{f.descricao}</LatexRenderer>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Formulas() {
  const { data: grouped, isLoading } = trpc.formulas.list.useQuery(undefined, { staleTime: 60_000 });

  return (
    <div className="space-y-6 py-2">
      <div className="rounded-2xl px-6 py-8 text-white" style={{ background: "linear-gradient(135deg, #01738d, #004d61)" }}>
        <h1 className="text-2xl font-bold mb-1">Fórmulas</h1>
        <p className="text-sm opacity-80">Todas as fórmulas que você precisa para o ENEM, organizadas por área.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#01738d" }} />
        </div>
      ) : !grouped || Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <BookOpen className="h-10 w-10 mx-auto opacity-30" style={{ color: "#01738d" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Nenhuma fórmula disponível</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            O administrador ainda não cadastrou fórmulas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([titulo, { cor, formulas }]) => (
            <SecaoCard key={titulo} titulo={titulo} cor={cor} formulas={formulas} />
          ))}
        </div>
      )}
    </div>
  );
}
