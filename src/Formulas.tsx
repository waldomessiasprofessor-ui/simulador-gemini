import { useState } from "react";
import { LatexRenderer } from "@/LatexRenderer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Formula {
  titulo: string;
  formula: string;
  descricao: string;
}

interface Secao {
  id: string;
  titulo: string;
  cor: string;
  formulas: Formula[];
}

const SECOES: Secao[] = [
  {
    id: "algebra",
    titulo: "Álgebra",
    cor: "#009688",
    formulas: [
      { titulo: "Fórmula de Bhaskara", formula: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$", descricao: "Resolve equações de 2º grau $ax^2 + bx + c = 0$. O discriminante $\\Delta = b^2 - 4ac$ determina o número de raízes reais." },
      { titulo: "Discriminante", formula: "$$\\Delta = b^2 - 4ac$$", descricao: "Se $\\Delta > 0$: duas raízes reais distintas. Se $\\Delta = 0$: uma raiz real dupla. Se $\\Delta < 0$: sem raízes reais." },
      { titulo: "Soma e produto das raízes", formula: "$$x_1 + x_2 = -\\frac{b}{a} \\qquad x_1 \\cdot x_2 = \\frac{c}{a}$$", descricao: "Relações de Girard: permitem encontrar soma e produto das raízes sem calculá-las individualmente." },
      { titulo: "Progressão aritmética — termo geral", formula: "$$a_n = a_1 + (n-1) \\cdot r$$", descricao: "Onde $a_1$ é o primeiro termo e $r$ é a razão. Cada termo difere do anterior por $r$." },
      { titulo: "Progressão aritmética — soma", formula: "$$S_n = \\frac{n(a_1 + a_n)}{2}$$", descricao: "Soma dos $n$ primeiros termos de uma PA." },
      { titulo: "Progressão geométrica — termo geral", formula: "$$a_n = a_1 \\cdot q^{n-1}$$", descricao: "Onde $q$ é a razão. Cada termo é multiplicado por $q$ em relação ao anterior." },
      { titulo: "Progressão geométrica — soma finita", formula: "$$S_n = a_1 \\cdot \\frac{q^n - 1}{q - 1}, \\quad q \\neq 1$$", descricao: "Soma dos $n$ primeiros termos de uma PG com razão $q \\neq 1$." },
      { titulo: "Juros compostos", formula: "$$M = C \\cdot (1 + i)^t$$", descricao: "Montante $M$, capital $C$, taxa $i$ e tempo $t$. Base de toda matemática financeira do ENEM." },
      { titulo: "Logaritmo — definição", formula: "$$\\log_a b = x \\iff a^x = b$$", descricao: "O logaritmo responde: a que potência elevar $a$ para obter $b$? Válido para $a > 0$, $a \\neq 1$, $b > 0$." },
      { titulo: "Propriedades dos logaritmos", formula: "$$\\log(a \\cdot b) = \\log a + \\log b \\qquad \\log\\left(\\frac{a}{b}\\right) = \\log a - \\log b \\qquad \\log a^n = n \\log a$$", descricao: "Produto vira soma, divisão vira subtração, potência vira multiplicação." },
      { titulo: "Mudança de base", formula: "$$\\log_a b = \\frac{\\log_c b}{\\log_c a}$$", descricao: "Converte qualquer logaritmo para a base $c$." },
      { titulo: "Análise combinatória — combinação", formula: "$$C_{n,k} = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$", descricao: "Número de maneiras de escolher $k$ elementos de $n$ sem importar a ordem." },
      { titulo: "Análise combinatória — arranjo", formula: "$$A_{n,k} = \\frac{n!}{(n-k)!}$$", descricao: "Número de maneiras de escolher $k$ elementos de $n$ com a ordem importando." },
    ],
  },
  {
    id: "geo-plana",
    titulo: "Geometria Plana",
    cor: "#7B3FA0",
    formulas: [
      { titulo: "Área do triângulo", formula: "$$A = \\frac{b \\cdot h}{2}$$", descricao: "Base $b$ vezes altura $h$ dividido por 2." },
      { titulo: "Triângulo — fórmula de Heron", formula: "$$A = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s = \\frac{a+b+c}{2}$$", descricao: "Calcula a área com apenas os três lados. $s$ é o semiperímetro." },
      { titulo: "Área do trapézio", formula: "$$A = \\frac{(B + b) \\cdot h}{2}$$", descricao: "Média das bases paralelas $B$ e $b$ multiplicada pela altura $h$." },
      { titulo: "Área do círculo", formula: "$$A = \\pi r^2$$", descricao: "Área em função do raio $r$. Comprimento da circunferência: $C = 2\\pi r$." },
      { titulo: "Comprimento de arco", formula: "$$\\ell = \\frac{\\theta}{360°} \\cdot 2\\pi r$$", descricao: "Arco de uma circunferência com raio $r$ e ângulo central $\\theta$ em graus." },
      { titulo: "Teorema de Pitágoras", formula: "$$a^2 = b^2 + c^2$$", descricao: "Em um triângulo retângulo, o quadrado da hipotenusa $a$ é igual à soma dos quadrados dos catetos." },
      { titulo: "Triângulos notáveis — 30°–60°–90°", formula: "$$\\text{lados: } x, \\; x\\sqrt{3}, \\; 2x$$", descricao: "Se o menor cateto é $x$, o maior cateto é $x\\sqrt{3}$ e a hipotenusa é $2x$." },
      { titulo: "Triângulos notáveis — 45°–45°–90°", formula: "$$\\text{lados: } x, \\; x, \\; x\\sqrt{2}$$", descricao: "Isósceles retângulo: catetos iguais a $x$, hipotenusa $x\\sqrt{2}$." },
    ],
  },
  {
    id: "geo-analitica",
    titulo: "Geometria Analítica",
    cor: "#E65100",
    formulas: [
      { titulo: "Distância entre dois pontos", formula: "$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$", descricao: "Distância euclidiana entre $P_1(x_1, y_1)$ e $P_2(x_2, y_2)$." },
      { titulo: "Ponto médio", formula: "$$M = \\left(\\frac{x_1 + x_2}{2},\\; \\frac{y_1 + y_2}{2}\\right)$$", descricao: "Coordenadas do ponto que divide o segmento $P_1P_2$ ao meio." },
      { titulo: "Equação da reta — forma geral", formula: "$$ax + by + c = 0$$", descricao: "Equação implícita de uma reta no plano." },
      { titulo: "Equação da reta — coeficiente angular", formula: "$$y = mx + n, \\quad m = \\tan\\theta$$", descricao: "$m$ é o coeficiente angular e $n$ é o coeficiente linear." },
      { titulo: "Distância de ponto à reta", formula: "$$d = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$$", descricao: "Distância do ponto $(x_0, y_0)$ à reta $ax + by + c = 0$." },
      { titulo: "Equação da circunferência", formula: "$$(x - a)^2 + (y - b)^2 = r^2$$", descricao: "Centro $(a, b)$ e raio $r$." },
    ],
  },
  {
    id: "geo-espacial",
    titulo: "Geometria Espacial",
    cor: "#1565C0",
    formulas: [
      { titulo: "Volume do cubo", formula: "$$V = a^3$$", descricao: "Onde $a$ é a medida da aresta. Diagonal do cubo: $d = a\\sqrt{3}$." },
      { titulo: "Volume do paralelepípedo", formula: "$$V = a \\cdot b \\cdot c$$", descricao: "Produto das três dimensões: comprimento, largura e altura." },
      { titulo: "Volume do cilindro", formula: "$$V = \\pi r^2 h$$", descricao: "Área da base circular $\\pi r^2$ multiplicada pela altura $h$." },
      { titulo: "Volume do cone", formula: "$$V = \\frac{1}{3} \\pi r^2 h$$", descricao: "Um terço do volume do cilindro de mesma base e altura." },
      { titulo: "Volume da esfera", formula: "$$V = \\frac{4}{3} \\pi r^3$$", descricao: "Área da superfície esférica: $S = 4\\pi r^2$." },
      { titulo: "Volume da pirâmide", formula: "$$V = \\frac{1}{3} A_b \\cdot h$$", descricao: "Um terço da área da base $A_b$ vezes a altura $h$." },
    ],
  },
  {
    id: "trigonometria",
    titulo: "Trigonometria",
    cor: "#2E7D32",
    formulas: [
      { titulo: "Razões trigonométricas", formula: "$$\\sin\\theta = \\frac{\\text{cateto oposto}}{\\text{hipotenusa}} \\qquad \\cos\\theta = \\frac{\\text{cateto adjacente}}{\\text{hipotenusa}} \\qquad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$$", descricao: "Definições básicas para ângulo $\\theta$ em um triângulo retângulo." },
      { titulo: "Identidade fundamental", formula: "$$\\sin^2\\theta + \\cos^2\\theta = 1$$", descricao: "Decorre do Teorema de Pitágoras." },
      { titulo: "Lei dos senos", formula: "$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$", descricao: "Relaciona lados e ângulos opostos de qualquer triângulo." },
      { titulo: "Lei dos cossenos", formula: "$$a^2 = b^2 + c^2 - 2bc\\cos A$$", descricao: "Generalização do Teorema de Pitágoras para qualquer triângulo." },
      { titulo: "Fórmulas de adição", formula: "$$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$$$$\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$$", descricao: "Permitem calcular o seno e cosseno da soma ou diferença de ângulos." },
      { titulo: "Conversão graus ↔ radianos", formula: "$$\\theta_{\\text{rad}} = \\theta_{\\text{graus}} \\cdot \\frac{\\pi}{180}$$", descricao: "180° = $\\pi$ rad." },
    ],
  },
];

function SecaoCard({ secao }: { secao: Secao }) {
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
          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: secao.cor }} />
          <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>{secao.titulo}</span>
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
        <div className="divide-y" style={{ borderTop: `1px solid var(--border)` }}>
          {secao.formulas.map((f, i) => (
            <div key={i} style={{ background: "var(--card)" }}>
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
  return (
    <div className="space-y-6 py-2">
      <div className="rounded-2xl px-6 py-8 text-white" style={{ background: "linear-gradient(135deg, #009688, #00695C)" }}>
        <h1 className="text-2xl font-bold mb-1">Fórmulas</h1>
        <p className="text-sm opacity-80">Todas as fórmulas que você precisa para o ENEM, organizadas por área.</p>
      </div>
      <div className="space-y-3">
        {SECOES.map((s) => <SecaoCard key={s.id} secao={s} />)}
      </div>
    </div>
  );
}
