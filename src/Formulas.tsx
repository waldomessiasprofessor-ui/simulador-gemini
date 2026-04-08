import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { LatexRenderer } from "@/LatexRenderer";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface FormulaItem {
  id: number;
  titulo: string;
  formula: string;
  descricao: string;
}

interface Secao {
  nome: string;
  cor: string;
  formulas: FormulaItem[];
}

function SecaoCard({ secao }: { secao: Secao }) {
  const [open, setOpen] = useState(false);
  const [openFormula, setOpenFormula] = useState<number | null>(null);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: secao.cor }} />
          <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{secao.nome}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${secao.cor}22`, color: secao.cor }}>
            {secao.formulas.length} fórmulas
          </span>
          {open
            ? <ChevronUp className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            : <ChevronDown className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />}
        </div>
      </button>

      {open && (
        <div className="divide-y" style={{ borderTop: "1px solid var(--border)" }}>
          {secao.formulas.map((f, i) => (
            <div key={f.id} style={{ background: "var(--card)" }}>
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
                    <p className="text-xs font-semibold mb-1" style={{ color: secao.cor }}>Quando usar?</p>
                    <LatexRenderer fontSize="sm">{f.descricao}</LatexRenderer>
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
  const { data, isLoading } = trpc.formulas.list.useQuery();

  // Converte o objeto agrupado do router em array ordenado
  const secoes: Secao[] = data
    ? Object.entries(data).map(([nome, val]) => ({
        nome,
        cor: (val as any).cor,
        formulas: (val as any).formulas,
      }))
    : [];

  return (
    <div className="space-y-6 py-2">
      <div className="rounded-2xl px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #009688, #00695C)" }}>
        <h1 className="text-2xl font-bold mb-1">Fórmulas</h1>
        <p className="text-sm opacity-80">
          Todas as fórmulas que você precisa para o ENEM, organizadas por área.
        </p>
        {!isLoading && secoes.length > 0 && (
          <p className="text-xs mt-2 opacity-70">
            {secoes.length} seções · {secoes.reduce((acc, s) => acc + s.formulas.length, 0)} fórmulas
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {secoes.map((s) => <SecaoCard key={s.nome} secao={s} />)}
        </div>
      )}
    </div>
  );
}
