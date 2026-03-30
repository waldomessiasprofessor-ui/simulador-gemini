/**
 * seed-formulas.mjs
 * -----------------
 * Insere todas as fórmulas hardcoded no banco de dados.
 * Uso: node seed-formulas.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const FORMULAS = [
  // ── Álgebra ──────────────────────────────────────────────────────────────
  { secao: "Álgebra", cor: "#01738d", ordem: 1,  titulo: "Fórmula de Bhaskara",                    formula: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",                                                                                                                                          descricao: "Resolve equações de 2º grau $ax^2 + bx + c = 0$. O discriminante $\\Delta = b^2 - 4ac$ determina o número de raízes reais." },
  { secao: "Álgebra", cor: "#01738d", ordem: 2,  titulo: "Discriminante",                           formula: "$$\\Delta = b^2 - 4ac$$",                                                                                                                                                                  descricao: "Se $\\Delta > 0$: duas raízes reais distintas. Se $\\Delta = 0$: uma raiz real dupla. Se $\\Delta < 0$: sem raízes reais." },
  { secao: "Álgebra", cor: "#01738d", ordem: 3,  titulo: "Soma e produto das raízes",               formula: "$$x_1 + x_2 = -\\frac{b}{a} \\qquad x_1 \\cdot x_2 = \\frac{c}{a}$$",                                                                                                                   descricao: "Relações de Girard: permitem encontrar soma e produto das raízes sem calculá-las individualmente." },
  { secao: "Álgebra", cor: "#01738d", ordem: 4,  titulo: "PA — termo geral",                        formula: "$$a_n = a_1 + (n-1) \\cdot r$$",                                                                                                                                                          descricao: "Onde $a_1$ é o primeiro termo e $r$ é a razão. Cada termo difere do anterior por $r$." },
  { secao: "Álgebra", cor: "#01738d", ordem: 5,  titulo: "PA — soma",                               formula: "$$S_n = \\frac{n(a_1 + a_n)}{2}$$",                                                                                                                                                       descricao: "Soma dos $n$ primeiros termos de uma PA." },
  { secao: "Álgebra", cor: "#01738d", ordem: 6,  titulo: "PG — termo geral",                        formula: "$$a_n = a_1 \\cdot q^{n-1}$$",                                                                                                                                                            descricao: "Onde $q$ é a razão. Cada termo é multiplicado por $q$ em relação ao anterior." },
  { secao: "Álgebra", cor: "#01738d", ordem: 7,  titulo: "PG — soma finita",                        formula: "$$S_n = a_1 \\cdot \\frac{q^n - 1}{q - 1}, \\quad q \\neq 1$$",                                                                                                                          descricao: "Soma dos $n$ primeiros termos de uma PG com razão $q \\neq 1$." },
  { secao: "Álgebra", cor: "#01738d", ordem: 8,  titulo: "Juros compostos",                         formula: "$$M = C \\cdot (1 + i)^t$$",                                                                                                                                                              descricao: "Montante $M$, capital $C$, taxa $i$ e tempo $t$. Base de toda matemática financeira do ENEM." },
  { secao: "Álgebra", cor: "#01738d", ordem: 9,  titulo: "Logaritmo — definição",                   formula: "$$\\log_a b = x \\iff a^x = b$$",                                                                                                                                                         descricao: "O logaritmo responde: a que potência elevar $a$ para obter $b$? Válido para $a > 0$, $a \\neq 1$, $b > 0$." },
  { secao: "Álgebra", cor: "#01738d", ordem: 10, titulo: "Propriedades dos logaritmos",             formula: "$$\\log(a \\cdot b) = \\log a + \\log b \\qquad \\log\\left(\\frac{a}{b}\\right) = \\log a - \\log b \\qquad \\log a^n = n \\log a$$",                                                 descricao: "Produto vira soma, divisão vira subtração, potência vira multiplicação." },
  { secao: "Álgebra", cor: "#01738d", ordem: 11, titulo: "Mudança de base",                         formula: "$$\\log_a b = \\frac{\\log_c b}{\\log_c a}$$",                                                                                                                                             descricao: "Converte qualquer logaritmo para a base $c$." },
  { secao: "Álgebra", cor: "#01738d", ordem: 12, titulo: "Combinação",                              formula: "$$C_{n,k} = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$",                                                                                                                                    descricao: "Número de maneiras de escolher $k$ elementos de $n$ sem importar a ordem." },
  { secao: "Álgebra", cor: "#01738d", ordem: 13, titulo: "Arranjo",                                 formula: "$$A_{n,k} = \\frac{n!}{(n-k)!}$$",                                                                                                                                                       descricao: "Número de maneiras de escolher $k$ elementos de $n$ com a ordem importando." },

  // ── Geometria Plana ───────────────────────────────────────────────────────
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 1, titulo: "Área do triângulo",               formula: "$$A = \\frac{b \\cdot h}{2}$$",                                                                                                                                                            descricao: "Base $b$ vezes altura $h$ dividido por 2." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 2, titulo: "Fórmula de Heron",                formula: "$$A = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s = \\frac{a+b+c}{2}$$",                                                                                                                          descricao: "Calcula a área com apenas os três lados. $s$ é o semiperímetro." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 3, titulo: "Área do trapézio",                formula: "$$A = \\frac{(B + b) \\cdot h}{2}$$",                                                                                                                                                     descricao: "Média das bases paralelas $B$ e $b$ multiplicada pela altura $h$." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 4, titulo: "Área do círculo",                 formula: "$$A = \\pi r^2$$",                                                                                                                                                                         descricao: "Área em função do raio $r$. Comprimento da circunferência: $C = 2\\pi r$." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 5, titulo: "Comprimento de arco",             formula: "$$\\ell = \\frac{\\theta}{360°} \\cdot 2\\pi r$$",                                                                                                                                        descricao: "Arco de uma circunferência com raio $r$ e ângulo central $\\theta$ em graus." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 6, titulo: "Teorema de Pitágoras",            formula: "$$a^2 = b^2 + c^2$$",                                                                                                                                                                     descricao: "Em um triângulo retângulo, o quadrado da hipotenusa $a$ é igual à soma dos quadrados dos catetos." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 7, titulo: "Triângulo 30°–60°–90°",           formula: "$$\\text{lados: } x, \\; x\\sqrt{3}, \\; 2x$$",                                                                                                                                          descricao: "Se o menor cateto é $x$, o maior cateto é $x\\sqrt{3}$ e a hipotenusa é $2x$." },
  { secao: "Geometria Plana", cor: "#7B3FA0", ordem: 8, titulo: "Triângulo 45°–45°–90°",           formula: "$$\\text{lados: } x, \\; x, \\; x\\sqrt{2}$$",                                                                                                                                           descricao: "Isósceles retângulo: catetos iguais a $x$, hipotenusa $x\\sqrt{2}$." },

  // ── Geometria Analítica ───────────────────────────────────────────────────
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 1, titulo: "Distância entre dois pontos", formula: "$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$",                                                                                                                                        descricao: "Distância euclidiana entre $P_1(x_1, y_1)$ e $P_2(x_2, y_2)$." },
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 2, titulo: "Ponto médio",                 formula: "$$M = \\left(\\frac{x_1 + x_2}{2},\\; \\frac{y_1 + y_2}{2}\\right)$$",                                                                                                                  descricao: "Coordenadas do ponto que divide o segmento $P_1P_2$ ao meio." },
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 3, titulo: "Equação da reta — geral",     formula: "$$ax + by + c = 0$$",                                                                                                                                                                     descricao: "Equação implícita de uma reta no plano." },
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 4, titulo: "Equação da reta — angular",   formula: "$$y = mx + n, \\quad m = \\tan\\theta$$",                                                                                                                                                 descricao: "$m$ é o coeficiente angular e $n$ é o coeficiente linear." },
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 5, titulo: "Distância de ponto à reta",   formula: "$$d = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$$",                                                                                                                                  descricao: "Distância do ponto $(x_0, y_0)$ à reta $ax + by + c = 0$." },
  { secao: "Geometria Analítica", cor: "#E65100", ordem: 6, titulo: "Equação da circunferência",   formula: "$$(x - a)^2 + (y - b)^2 = r^2$$",                                                                                                                                                        descricao: "Centro $(a, b)$ e raio $r$." },

  // ── Geometria Espacial ────────────────────────────────────────────────────
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 1, titulo: "Volume do cubo",               formula: "$$V = a^3$$",                                                                                                                                                                             descricao: "Onde $a$ é a medida da aresta. Diagonal do cubo: $d = a\\sqrt{3}$." },
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 2, titulo: "Volume do paralelepípedo",     formula: "$$V = a \\cdot b \\cdot c$$",                                                                                                                                                             descricao: "Produto das três dimensões: comprimento, largura e altura." },
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 3, titulo: "Volume do cilindro",           formula: "$$V = \\pi r^2 h$$",                                                                                                                                                                      descricao: "Área da base circular $\\pi r^2$ multiplicada pela altura $h$." },
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 4, titulo: "Volume do cone",               formula: "$$V = \\frac{1}{3} \\pi r^2 h$$",                                                                                                                                                        descricao: "Um terço do volume do cilindro de mesma base e altura." },
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 5, titulo: "Volume da esfera",             formula: "$$V = \\frac{4}{3} \\pi r^3$$",                                                                                                                                                          descricao: "Área da superfície esférica: $S = 4\\pi r^2$." },
  { secao: "Geometria Espacial", cor: "#1565C0", ordem: 6, titulo: "Volume da pirâmide",           formula: "$$V = \\frac{1}{3} A_b \\cdot h$$",                                                                                                                                                      descricao: "Um terço da área da base $A_b$ vezes a altura $h$." },

  // ── Trigonometria ─────────────────────────────────────────────────────────
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 1, titulo: "Razões trigonométricas",            formula: "$$\\sin\\theta = \\frac{\\text{cateto oposto}}{\\text{hipotenusa}} \\qquad \\cos\\theta = \\frac{\\text{cateto adjacente}}{\\text{hipotenusa}} \\qquad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$$", descricao: "Definições básicas para ângulo $\\theta$ em um triângulo retângulo." },
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 2, titulo: "Identidade fundamental",            formula: "$$\\sin^2\\theta + \\cos^2\\theta = 1$$",                                                                                                                                                descricao: "Decorre do Teorema de Pitágoras." },
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 3, titulo: "Lei dos senos",                     formula: "$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$",                                                                                                                descricao: "Relaciona lados e ângulos opostos de qualquer triângulo." },
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 4, titulo: "Lei dos cossenos",                  formula: "$$a^2 = b^2 + c^2 - 2bc\\cos A$$",                                                                                                                                                      descricao: "Generalização do Teorema de Pitágoras para qualquer triângulo." },
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 5, titulo: "Fórmulas de adição",                formula: "$$\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B$$$$\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B$$",                                                               descricao: "Permitem calcular o seno e cosseno da soma ou diferença de ângulos." },
  { secao: "Trigonometria", cor: "#2E7D32", ordem: 6, titulo: "Conversão graus ↔ radianos",        formula: "$$\\theta_{\\text{rad}} = \\theta_{\\text{graus}} \\cdot \\frac{\\pi}{180}$$",                                                                                                         descricao: "180° = $\\pi$ rad." },
];

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);

  // Verifica se já existem fórmulas no banco
  const [existing] = await db.execute("SELECT COUNT(*) as total FROM formulas");
  const total = existing[0].total;

  if (total > 0) {
    console.log(`⚠️  Já existem ${total} fórmula(s) no banco.`);
    console.log("   Para evitar duplicatas, o script não vai inserir novamente.");
    console.log("   Se quiser recriar tudo, apague as fórmulas pelo painel admin primeiro.");
    await db.end();
    return;
  }

  console.log(`📥 Inserindo ${FORMULAS.length} fórmulas...`);

  for (const f of FORMULAS) {
    await db.execute(
      "INSERT INTO formulas (secao, cor, titulo, formula, descricao, ordem, active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [f.secao, f.cor, f.titulo, f.formula, f.descricao, f.ordem]
    );
    process.stdout.write(".");
  }

  console.log(`\n✅ ${FORMULAS.length} fórmulas inseridas com sucesso!`);
  await db.end();
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
