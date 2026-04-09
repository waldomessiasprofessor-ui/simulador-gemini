/**
 * seed-matematica-extra.mjs
 * -------------------------
 * Acrescenta fórmulas matemáticas que estavam faltando.
 * Verifica cada fórmula individualmente antes de inserir (evita duplicatas).
 * Uso: node seed-matematica-extra.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const NOVAS_FORMULAS = [

  // ══════════════════════════════════════════════════════════════════════════
  // FUNÇÕES — seção nova (uma das áreas mais cobradas no ENEM)
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Funções", cor: "#C62828", ordem: 1,
    titulo: "Função Afim (1º grau)",
    formula: "$$f(x) = ax + b, \\quad a \\neq 0$$",
    descricao: "Gráfico: reta. Zero da função: $x = -\\dfrac{b}{a}$. Se $a > 0$: crescente; se $a < 0$: decrescente.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 2,
    titulo: "Função Quadrática (2º grau)",
    formula: "$$f(x) = ax^2 + bx + c, \\quad a \\neq 0$$",
    descricao: "Gráfico: parábola. Se $a > 0$: abre para cima; se $a < 0$: abre para baixo.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 3,
    titulo: "Vértice da Parábola",
    formula: "$$x_V = -\\frac{b}{2a} \\qquad y_V = -\\frac{\\Delta}{4a} \\qquad \\Delta = b^2 - 4ac$$",
    descricao: "O vértice é o ponto de máximo (se $a < 0$) ou mínimo (se $a > 0$) da parábola.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 4,
    titulo: "Forma Fatorada da Quadrática",
    formula: "$$f(x) = a(x - x_1)(x - x_2)$$",
    descricao: "Quando a equação tem duas raízes reais $x_1$ e $x_2$. Útil para determinar os intervalos de sinal.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 5,
    titulo: "Função Exponencial",
    formula: "$$f(x) = a^x, \\quad a > 0,\\; a \\neq 1$$",
    descricao: "Se $a > 1$: crescimento. Se $0 < a < 1$: decrescimento. Domínio: $\\mathbb{R}$; Imagem: $(0, +\\infty)$.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 6,
    titulo: "Função Logarítmica",
    formula: "$$f(x) = \\log_a x, \\quad a > 0,\\; a \\neq 1,\\; x > 0$$",
    descricao: "Inversa da exponencial. Se $a > 1$: crescente. Se $0 < a < 1$: decrescente.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 7,
    titulo: "Função Modular",
    formula: "$$f(x) = |x| = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}$$",
    descricao: "Gráfico em formato de V com vértice na origem. $|x| < a \\Rightarrow -a < x < a$; $|x| > a \\Rightarrow x < -a$ ou $x > a$.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 8,
    titulo: "Função Composta",
    formula: "$$(g \\circ f)(x) = g(f(x))$$",
    descricao: "Aplica-se primeiro $f$ e depois $g$. A ordem importa: $(g \\circ f) \\neq (f \\circ g)$ em geral.",
  },
  {
    secao: "Funções", cor: "#C62828", ordem: 9,
    titulo: "Função Inversa",
    formula: "$$f(f^{-1}(x)) = x \\quad \\text{e} \\quad f^{-1}(f(x)) = x$$",
    descricao: "Para obter $f^{-1}$: escreva $y = f(x)$, isole $x$ e troque $x \\leftrightarrow y$.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PROBABILIDADE E ESTATÍSTICA — seção nova (sempre presente no ENEM)
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 1,
    titulo: "Probabilidade Clássica",
    formula: "$$P(A) = \\frac{n(A)}{n(\\Omega)}$$",
    descricao: "$n(A)$ = número de casos favoráveis; $n(\\Omega)$ = total de casos possíveis (igualmente prováveis).",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 2,
    titulo: "Probabilidade Complementar",
    formula: "$$P(\\bar{A}) = 1 - P(A)$$",
    descricao: "A probabilidade de $A$ não ocorrer. Útil quando é mais fácil calcular $P(A)$ e subtrair de 1.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 3,
    titulo: "Regra da Adição",
    formula: "$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$",
    descricao: "Para eventos mutuamente exclusivos ($A \\cap B = \\emptyset$): $P(A \\cup B) = P(A) + P(B)$.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 4,
    titulo: "Regra da Multiplicação",
    formula: "$$P(A \\cap B) = P(A) \\cdot P(B|A)$$",
    descricao: "Para eventos independentes: $P(A \\cap B) = P(A) \\cdot P(B)$.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 5,
    titulo: "Probabilidade Condicional",
    formula: "$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$",
    descricao: "Probabilidade de $A$ dado que $B$ já ocorreu.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 6,
    titulo: "Permutação Simples",
    formula: "$$P_n = n!$$",
    descricao: "Número de formas de arranjar $n$ elementos distintos. Ex: $4! = 4 \\cdot 3 \\cdot 2 \\cdot 1 = 24$.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 7,
    titulo: "Permutação com Repetição",
    formula: "$$P_n^{(a,b,\\ldots)} = \\frac{n!}{a!\\, b!\\, \\cdots}$$",
    descricao: "Quando há elementos repetidos: $a$ de um tipo, $b$ de outro etc. Divide-se por cada fatorial.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 8,
    titulo: "Permutação Circular",
    formula: "$$P_c = (n-1)!$$",
    descricao: "Arranjos em círculo de $n$ elementos distintos. Fixa-se um elemento e permuta-se os demais.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 9,
    titulo: "Média Aritmética",
    formula: "$$\\bar{x} = \\frac{x_1 + x_2 + \\cdots + x_n}{n} = \\frac{\\sum x_i}{n}$$",
    descricao: "Soma de todos os valores dividida pela quantidade de valores.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 10,
    titulo: "Média Ponderada",
    formula: "$$\\bar{x}_p = \\frac{\\sum x_i \\cdot w_i}{\\sum w_i}$$",
    descricao: "Cada valor $x_i$ é multiplicado pelo seu peso $w_i$. Usada em notas com pesos diferentes.",
  },
  {
    secao: "Probabilidade e Estatística", cor: "#558B2F", ordem: 11,
    titulo: "Variância e Desvio Padrão",
    formula: "$$\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n} \\qquad \\sigma = \\sqrt{\\sigma^2}$$",
    descricao: "A variância mede a dispersão. O desvio padrão $\\sigma$ está na mesma unidade dos dados.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ÁLGEBRA — fórmulas faltando
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Álgebra", cor: "#01738d", ordem: 14,
    titulo: "Juros Simples",
    formula: "$$J = C \\cdot i \\cdot t \\qquad M = C(1 + i \\cdot t)$$",
    descricao: "Capital $C$, taxa $i$ (no período), tempo $t$. Os juros crescem linearmente.",
  },
  {
    secao: "Álgebra", cor: "#01738d", ordem: 15,
    titulo: "Produtos Notáveis",
    formula: "$$(a + b)^2 = a^2 + 2ab + b^2$$  $$(a - b)^2 = a^2 - 2ab + b^2$$  $$(a+b)(a-b) = a^2 - b^2$$",
    descricao: "Quadrado da soma, quadrado da diferença e produto da soma pela diferença.",
  },
  {
    secao: "Álgebra", cor: "#01738d", ordem: 16,
    titulo: "Cubo da Soma e da Diferença",
    formula: "$$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$  $$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$",
    descricao: "Fatorações cúbicas — aparecem em equações e simplificações algébricas.",
  },
  {
    secao: "Álgebra", cor: "#01738d", ordem: 17,
    titulo: "Soma de Cubos / Diferença de Cubos",
    formula: "$$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$$  $$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$$",
    descricao: "Fatorações importantes para simplificar expressões e resolver equações.",
  },
  {
    secao: "Álgebra", cor: "#01738d", ordem: 18,
    titulo: "PG infinita — soma (|q| < 1)",
    formula: "$$S_{\\infty} = \\frac{a_1}{1 - q}, \\quad |q| < 1$$",
    descricao: "Soma de uma progressão geométrica infinita convergente. Aparece em problemas de dízimas periódicas.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOMETRIA PLANA — fórmulas faltando
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 9,
    titulo: "Área do Paralelogramo",
    formula: "$$A = b \\cdot h$$",
    descricao: "Base $b$ vezes altura $h$ (distância perpendicular entre as bases paralelas).",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 10,
    titulo: "Área do Losango",
    formula: "$$A = \\frac{D \\cdot d}{2}$$",
    descricao: "Metade do produto das diagonais $D$ (maior) e $d$ (menor). A fórmula também vale para o quadrado.",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 11,
    titulo: "Área do Setor Circular",
    formula: "$$A_{setor} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2$$",
    descricao: "Fatia da área do círculo proporcional ao ângulo central $\\theta$ (em graus).",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 12,
    titulo: "Área do Hexágono Regular",
    formula: "$$A = \\frac{3\\sqrt{3}}{2} \\cdot l^2$$",
    descricao: "Onde $l$ é o lado. No hexágono regular, o raio é igual ao lado: $r = l$.",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 13,
    titulo: "Comprimento da Circunferência",
    formula: "$$C = 2\\pi r = \\pi d$$",
    descricao: "Perímetro do círculo em função do raio $r$ ou diâmetro $d$.",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 14,
    titulo: "Área com Seno (triângulo qualquer)",
    formula: "$$A = \\frac{a \\cdot b \\cdot \\sin C}{2}$$",
    descricao: "Área do triângulo dados dois lados $a$ e $b$ e o ângulo $C$ entre eles.",
  },
  {
    secao: "Geometria Plana", cor: "#7B3FA0", ordem: 15,
    titulo: "Relações no Triângulo Retângulo (projeções)",
    formula: "$$a^2 = b \\cdot c \\qquad m \\cdot a = b^2 \\qquad n \\cdot a = c^2$$",
    descricao: "Onde $a$ = hipotenusa, $b$ e $c$ = catetos, $m$ e $n$ = projeções dos catetos sobre a hipotenusa.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOMETRIA ESPACIAL — superfícies e formas faltando
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 7,
    titulo: "Área do Cilindro",
    formula: "$$A_{lateral} = 2\\pi r h \\qquad A_{total} = 2\\pi r(r + h)$$",
    descricao: "Lateral: retângulo enrolado com dimensões $2\\pi r \\times h$. Total: lateral + 2 tampas.",
  },
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 8,
    titulo: "Área do Cone",
    formula: "$$A_{lateral} = \\pi r g \\qquad A_{total} = \\pi r(r + g) \\qquad g = \\sqrt{r^2 + h^2}$$",
    descricao: "Geratriz $g$ é a distância do vértice ao perímetro da base. $A_{total}$ = lateral + base.",
  },
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 9,
    titulo: "Área da Esfera",
    formula: "$$A = 4\\pi r^2$$",
    descricao: "Superfície total da esfera em função do raio $r$.",
  },
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 10,
    titulo: "Tronco de Cone — Volume",
    formula: "$$V = \\frac{\\pi h}{3}(R^2 + r^2 + Rr)$$",
    descricao: "Onde $R$ = raio da base maior, $r$ = raio da base menor, $h$ = altura do tronco.",
  },
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 11,
    titulo: "Diagonais do Cubo e do Paralelepípedo",
    formula: "$$d_{cubo} = a\\sqrt{3} \\qquad d_{paral} = \\sqrt{a^2 + b^2 + c^2}$$",
    descricao: "Diagonal espacial: atravessa o sólido de um vértice ao oposto.",
  },
  {
    secao: "Geometria Espacial", cor: "#1565C0", ordem: 12,
    titulo: "Prisma — Volume e Área Lateral",
    formula: "$$V = A_b \\cdot h \\qquad A_{lateral} = P_b \\cdot h$$",
    descricao: "Onde $A_b$ = área da base, $P_b$ = perímetro da base, $h$ = altura.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOMETRIA ANALÍTICA — fórmulas faltando
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Geometria Analítica", cor: "#E65100", ordem: 7,
    titulo: "Coeficiente Angular",
    formula: "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan\\theta$$",
    descricao: "Inclinação da reta que passa por $P_1(x_1,y_1)$ e $P_2(x_2,y_2)$. $\\theta$ é o ângulo com o eixo $x$.",
  },
  {
    secao: "Geometria Analítica", cor: "#E65100", ordem: 8,
    titulo: "Retas Paralelas e Perpendiculares",
    formula: "$$\\text{Paralelas: } m_1 = m_2 \\qquad \\text{Perpendiculares: } m_1 \\cdot m_2 = -1$$",
    descricao: "Duas retas são paralelas se têm o mesmo coeficiente angular e perpendiculares se o produto dos coeficientes é $-1$.",
  },
  {
    secao: "Geometria Analítica", cor: "#E65100", ordem: 9,
    titulo: "Equação da Reta por Dois Pontos",
    formula: "$$\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}$$",
    descricao: "Forma direta para encontrar a equação da reta dado dois pontos $P_1$ e $P_2$.",
  },
  {
    secao: "Geometria Analítica", cor: "#E65100", ordem: 10,
    titulo: "Área do Triângulo — Fórmula de Gauss",
    formula: "$$A = \\frac{1}{2}|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$$",
    descricao: "Calcula a área de um triângulo a partir das coordenadas dos três vértices.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRIGONOMETRIA — fórmulas faltando
  // ══════════════════════════════════════════════════════════════════════════
  {
    secao: "Trigonometria", cor: "#2E7D32", ordem: 7,
    titulo: "Valores Notáveis",
    formula: "$$\\begin{array}{c|ccc} \\theta & 30° & 45° & 60° \\\\ \\hline \\sin & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} \\\\ \\cos & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} \\\\ \\tan & \\frac{\\sqrt{3}}{3} & 1 & \\sqrt{3} \\end{array}$$",
    descricao: "Tabela dos ângulos mais usados no ENEM. Memorize ou derive pelo triângulo retângulo.",
  },
  {
    secao: "Trigonometria", cor: "#2E7D32", ordem: 8,
    titulo: "Fórmulas de Duplo Arco",
    formula: "$$\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha$$$$\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = 1 - 2\\sin^2\\alpha$$$$\\tan 2\\alpha = \\frac{2\\tan\\alpha}{1 - \\tan^2\\alpha}$$",
    descricao: "Ângulo duplo — decorrem diretamente das fórmulas de adição.",
  },
  {
    secao: "Trigonometria", cor: "#2E7D32", ordem: 9,
    titulo: "Identidades Derivadas",
    formula: "$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} \\qquad 1 + \\tan^2\\theta = \\sec^2\\theta \\qquad 1 + \\cot^2\\theta = \\csc^2\\theta$$",
    descricao: "Relações entre todas as razões trigonométricas — derivam da identidade fundamental.",
  },
];

// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  const db = await mysql.createConnection(DB_URL);
  console.log("🔌 Conectado ao banco de dados.");

  let inseridos = 0;
  let pulados = 0;

  for (const f of NOVAS_FORMULAS) {
    // Verifica se já existe uma fórmula com o mesmo título e seção
    const [existing] = await db.execute(
      "SELECT id FROM formulas WHERE secao = ? AND titulo = ? LIMIT 1",
      [f.secao, f.titulo]
    );

    if (existing.length > 0) {
      console.log(`⏭️  Já existe: [${f.secao}] ${f.titulo}`);
      pulados++;
      continue;
    }

    await db.execute(
      "INSERT INTO formulas (secao, cor, titulo, formula, descricao, ordem, active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [f.secao, f.cor, f.titulo, f.formula, f.descricao, f.ordem]
    );
    console.log(`✅ Inserido: [${f.secao}] ${f.titulo}`);
    inseridos++;
  }

  console.log(`\n📊 Resultado: ${inseridos} inseridas, ${pulados} já existiam.`);
  await db.end();
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
