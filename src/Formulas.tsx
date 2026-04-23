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

interface Grupo {
  nome: string;
  cor: string;
  subsecoes: Secao[];
}

function SecaoCard({ secao }: { secao: Secao }) {
  const [open, setOpen] = useState(false);
  const [openFormula, setOpenFormula] = useState<number | null>(null);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: secao.cor }} />
          <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{secao.nome}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${secao.cor}22`, color: secao.cor }}>
            {secao.formulas.length}
          </span>
          {open
            ? <ChevronUp className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />
            : <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--muted-foreground)" }} />}
        </div>
      </button>

      {open && (
        <div className="divide-y" style={{ borderTop: "1px solid var(--border)" }}>
          {secao.formulas.map((f, i) => (
            <div key={f.id} style={{ background: "var(--card)" }}>
              <button
                onClick={() => setOpenFormula(openFormula === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
              >
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{f.titulo}</span>
                {openFormula === i
                  ? <ChevronUp className="h-3 w-3 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                  : <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />}
              </button>

              {openFormula === i && (
                <div className="px-4 pb-4 space-y-3">
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

function GrupoCard({ grupo }: { grupo: Grupo }) {
  const [open, setOpen] = useState(true);
  const totalFormulas = grupo.subsecoes.reduce((acc, s) => acc + s.formulas.length, 0);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${grupo.cor}44` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: `${grupo.cor}11` }}
      >
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ background: grupo.cor }} />
          <span className="font-black text-base" style={{ color: grupo.cor }}>{grupo.nome}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${grupo.cor}22`, color: grupo.cor }}>
            {grupo.subsecoes.length} tópicos · {totalFormulas} fórmulas
          </span>
          {open
            ? <ChevronUp className="h-4 w-4" style={{ color: grupo.cor }} />
            : <ChevronDown className="h-4 w-4" style={{ color: grupo.cor }} />}
        </div>
      </button>

      {open && (
        <div className="p-3 space-y-2" style={{ background: "var(--background)" }}>
          {grupo.subsecoes.map((s) => (
            <SecaoCard key={s.nome} secao={s} />
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

  // Separa em dois grandes grupos: Física e Matemática
  const grupos: Grupo[] = (() => {
    const fisica: Secao[] = [];
    const matematica: Secao[] = [];

    for (const s of secoes) {
      if (s.nome.startsWith("Física — ")) {
        fisica.push({ ...s, nome: s.nome.replace("Física — ", "") });
      } else {
        matematica.push(s);
      }
    }

    const result: Grupo[] = [];
    if (matematica.length > 0) {
      result.push({ nome: "Matemática", cor: "#1E40AF", subsecoes: matematica });
    }
    if (fisica.length > 0) {
      result.push({ nome: "Física", cor: "#7B1FA2", subsecoes: fisica });
    }
    return result;
  })();

  const totalFormulas = secoes.reduce((acc, s) => acc + s.formulas.length, 0);

  return (
    <div className="space-y-6 py-2">
      <div className="rounded-2xl px-6 py-8 text-white"
        style={{ background: "linear-gradient(135deg, #009688, #00695C)" }}>
        <h1 className="text-2xl font-bold mb-1">Fórmulas</h1>
        <p className="text-sm opacity-80">
          Todas as fórmulas que você precisa para o ENEM, organizadas por área.
        </p>
        {!isLoading && grupos.length > 0 && (
          <p className="text-xs mt-2 opacity-70">
            {grupos.length} áreas · {secoes.length} tópicos · {totalFormulas} fórmulas
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#009688" }} />
        </div>
      ) : (
        <div className="space-y-4">
          {grupos.map((g) => <GrupoCard key={g.nome} grupo={g} />)}
        </div>
      )}
    </div>
  );
}
