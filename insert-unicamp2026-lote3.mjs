/**
 * Insere 5 questões UNICAMP 2026 — Lote 3 (questões restantes de múltipla escolha)
 * Questões ja inseridas anteriormente:
 *   - Lote 1: Q2 (id_banco 262593) — Função Composta
 *   - Lote 2: Q3–Q7 (id_banco 262594–262598) — Polinômios, Geo. Analítica, Grandezas, F. Quadrática, Probabilidade
 * Este lote: Q1, Q8, Q9, Q10, Q11 (id_banco 262592, 262599–262602)
 * Q12–Q20 são dissertativas (sem alternativas) — ignoradas no simulado de múltipla escolha.
 *
 * node insert-unicamp2026-lote3.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const questions = [
  // ───────────────────────────────────────────────────────────────────────────
  // Q1 (id_banco 262592) — Matemática Financeira · Proposta 1 vs Proposta 2
  // ───────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Matemática Financeira",
    tags: ["Matemática Financeira", "Porcentagem", "Juros compostos"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Rogério é funcionário de uma fábrica de automóveis. Em dezembro de 2024, seu gestor fez duas propostas de aumento salarial:\n\n" +
      "**Proposta 1:** aumento de 50% do salário a partir de janeiro de 2025, sem nenhum reajuste nos próximos três anos (até dezembro de 2027).\n\n" +
      "**Proposta 2:** aumento de 20% a cada ano, com reajuste em janeiro de 2025, 2026 e 2027.\n\n" +
      "Rogério calculou o montante total que receberia ao longo dos três anos em cada proposta (janeiro de 2025 a dezembro de 2027). " +
      "O total a ser recebido na Proposta 1 é, aproximadamente:",
    url_imagem: null,
    alternativas: {
      A: "3% maior que o total a ser recebido na Proposta 2.",
      B: "1% maior que o total a ser recebido na Proposta 2.",
      C: "3% menor que o total a ser recebido na Proposta 2.",
      D: "1% menor que o total a ser recebido na Proposta 2.",
    },
    gabarito: "A",
    comentario_resolucao:
      "Seja $x$ o salário atual de Rogério.\n\n" +
      "**Proposta 1** — salário fixo de $1{,}5x$ por 3 anos (12 meses cada):\n" +
      "$$T_1 = 1{,}5x + 1{,}5x + 1{,}5x = 4{,}5x$$\n\n" +
      "**Proposta 2** — reajustes anuais de 20% a partir do salário original:\n" +
      "$$T_2 = 1{,}2x + 1{,}44x + 1{,}728x = 4{,}368x$$\n\n" +
      "**Comparação:**\n" +
      "$$\\frac{T_1 - T_2}{T_2} = \\frac{4{,}5x - 4{,}368x}{4{,}368x} = \\frac{0{,}132}{4{,}368} \\approx 0{,}0302 \\approx 3\\%$$\n\n" +
      "Portanto, a Proposta 1 rende aproximadamente **3% a mais** do que a Proposta 2.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q8 (id_banco 262599) — Trigonometria · Triângulo PMQ no quadrado ABCD
  // ───────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Trigonometria",
    tags: ["Trigonometria", "Geometria Plana", "Áreas de figuras planas"],
    nivel_dificuldade: "Média",
    enunciado:
      "$ABCD$ é um quadrado de lado $x$. $M$ é o ponto médio de $AB$. $P$ e $Q$ pertencem ao lado $CD$ " +
      "com $PD = QC$. O ângulo $\\angle PMQ = \\theta$ satisfaz $\\cos(\\theta) = \\dfrac{2}{3}$.\n\n" +
      "A área do triângulo $PMQ$ é:",
    url_imagem: null,
    alternativas: {
      A: "$\\dfrac{\\sqrt{5}\\,x^2}{5}$.",
      B: "$\\dfrac{3x^2}{2}$.",
      C: "$\\dfrac{\\sqrt{2}\\,x^2}{2}$.",
      D: "$\\dfrac{3x^2}{4}$.",
    },
    gabarito: "A",
    comentario_resolucao:
      "Como $\\cos(\\theta) = \\dfrac{2}{3}$, temos $\\sin(\\theta) = \\sqrt{1 - \\frac{4}{9}} = \\dfrac{\\sqrt{5}}{3}$.\n\n" +
      "Seja $y = MP = MQ$ (os lados iguais do triângulo isósceles, pois $PD = QC$ e $M$ é ponto médio de $AB$).\n\n" +
      "A distância vertical de $M$ a $CD$ é $x$ (lado do quadrado), e a metade da base $PQ$ é $d$.\n\n" +
      "Da relação $\\cos\\!\\left(\\dfrac{\\theta}{2}\\right) = \\dfrac{x}{y}$ e usando\n" +
      "$\\cos\\!\\left(\\dfrac{\\theta}{2}\\right) = \\sqrt{\\dfrac{1 + \\cos\\theta}{2}} = \\sqrt{\\dfrac{5}{6}} = \\dfrac{\\sqrt{30}}{6}$:\n" +
      "$$y = \\frac{x}{\\cos(\\theta/2)} = \\frac{6x}{\\sqrt{30}}$$\n\n" +
      "**Área do triângulo:**\n" +
      "$$A = \\frac{1}{2}\\,y^2\\,\\sin(\\theta) = \\frac{1}{2} \\cdot \\frac{36x^2}{30} \\cdot \\frac{\\sqrt{5}}{3} " +
      "= \\frac{36x^2 \\sqrt{5}}{180} = \\frac{\\sqrt{5}\\,x^2}{5}$$",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q9 (id_banco 262600) — Conjuntos Numéricos · Primos em A
  // ───────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Conjuntos Numéricos",
    tags: ["Conjuntos Numéricos", "Função Modular", "Números Primos"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Considere $A = \\{x \\in \\mathbb{N} : |x - 5| \\geq 2 \\text{ e } |x - 11| \\leq 9\\}$.\n\n" +
      "Quantos números primos pertencem ao conjunto $A$?",
    url_imagem: null,
    alternativas: {
      A: "5.",
      B: "6.",
      C: "7.",
      D: "8.",
    },
    gabarito: "C",
    comentario_resolucao:
      "**Condição 1:** $|x - 5| \\geq 2$\n" +
      "$$x - 5 \\leq -2 \\text{ ou } x - 5 \\geq 2 \\implies x \\leq 3 \\text{ ou } x \\geq 7$$\n\n" +
      "**Condição 2:** $|x - 11| \\leq 9$\n" +
      "$$-9 \\leq x - 11 \\leq 9 \\implies 2 \\leq x \\leq 20$$\n\n" +
      "**Intersecção** (lembrando $x \\in \\mathbb{N}$):\n" +
      "$$A = \\{x \\in \\mathbb{N} : (2 \\leq x \\leq 3) \\text{ ou } (7 \\leq x \\leq 20)\\}$$\n\n" +
      "**Números primos em A:** $\\{2,\\ 3,\\ 7,\\ 11,\\ 13,\\ 17,\\ 19\\}$\n\n" +
      "$$\\therefore\\ \\text{Total} = 7 \\text{ primos}$$",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q10 (id_banco 262601) — Sistemas Lineares · Tropa de combatentes
  // ───────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Sistemas lineares",
    tags: ["Sistemas lineares", "Equações do 1º grau"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Em um jogo eletrônico, um jogador deve montar uma tropa de 100 combatentes, " +
      "composta apenas por soldados e estrategistas, de modo que a força total da tropa " +
      "seja igual à astúcia total da tropa.\n\n" +
      "Cada soldado possui 30 pontos de astúcia e 70 pontos de força.\n" +
      "Cada estrategista possui 80 pontos de astúcia e 20 pontos de força.\n\n" +
      "Quantos soldados e quantos estrategistas devem ser escolhidos?",
    url_imagem: null,
    alternativas: {
      A: "70 soldados e 30 estrategistas.",
      B: "60 soldados e 40 estrategistas.",
      C: "50 soldados e 50 estrategistas.",
      D: "40 soldados e 60 estrategistas.",
    },
    gabarito: "B",
    comentario_resolucao:
      "Sejam $s$ = número de soldados e $e$ = número de estrategistas.\n\n" +
      "**Sistema:**\n" +
      "$$\\begin{cases} s + e = 100 \\\\ 70s + 20e = 30s + 80e \\end{cases}$$\n\n" +
      "Da segunda equação:\n" +
      "$$70s + 20e = 30s + 80e \\implies 40s = 60e \\implies s = \\frac{3e}{2}$$\n\n" +
      "Substituindo na primeira:\n" +
      "$$\\frac{3e}{2} + e = 100 \\implies \\frac{5e}{2} = 100 \\implies e = 40$$\n\n" +
      "$$s = 100 - 40 = 60$$\n\n" +
      "**Verificação:** Força $= 70(60) + 20(40) = 4200 + 800 = 5000$. " +
      "Astúcia $= 30(60) + 80(40) = 1800 + 3200 = 5000$. ✓",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q11 (id_banco 262602) — Geometria Plana · Área sombreada no quadrado ABCD
  // ───────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Semelhança de triângulos",
    tags: ["Semelhança de triângulos", "Geometria Plana", "Áreas de figuras planas"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "$ABCD$ é um quadrado com lado 6. Os pontos $P$, $Q$, $R$ e $S$ estão sobre os lados do quadrado, " +
      "com $AS = BQ = 2$, $PB = 3$ e $DR = 1$.\n\n" +
      "O valor da área sombreada é igual a:",
    url_imagem: null,
    alternativas: {
      A: "$\\dfrac{11}{3}$.",
      B: "$\\dfrac{13}{3}$.",
      C: "$\\dfrac{15}{4}$.",
      D: "$\\dfrac{7}{4}$.",
    },
    gabarito: "A",
    comentario_resolucao:
      "Posicionando o quadrado com $A = (0,6)$, $B = (6,6)$, $C = (6,0)$, $D = (0,0)$:\n\n" +
      "- $S$ em $AB$ com $AS = 2$: $S = (2, 6)$\n" +
      "- $P$ em $AB$ com $PB = 3$: $P = (3, 6)$\n" +
      "- $Q$ em $BC$ com $BQ = 2$: $Q = (6, 4)$\n" +
      "- $R$ em $CD$ com $DR = 1$: $R = (1, 0)$\n\n" +
      "A região sombreada é delimitada pelas diagonais $PR$ e $SQ$ e seus segmentos internos. " +
      "Pela semelhança entre os triângulos $PMN$ e $PRS$ (onde $M$ e $N$ são pontos de interseção das diagonais):\n" +
      "$$\\frac{x}{2} = \\frac{2}{6} \\implies x = \\frac{2}{3}$$\n\n" +
      "A área sombreada (trapézio com bases $x$ e a distância lateral):\n" +
      "$$A = \\frac{\\left(\\dfrac{2}{3} + 3\\right) \\cdot 2}{2} = \\frac{11}{3} \\approx 3{,}67$$",
  },
];

// ─── Inserção ─────────────────────────────────────────────────────────────────

const db = await mysql.createConnection(DATABASE_URL);

let inseridas = 0;
for (const q of questions) {
  const [result] = await db.execute(
    `INSERT INTO questions
       (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
        param_a, param_b, param_c,
        enunciado, url_imagem, alternativas, gabarito, comentario_resolucao, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      q.fonte,
      q.ano,
      q.conteudo_principal,
      JSON.stringify(q.tags),
      q.nivel_dificuldade,
      1.0, 0.0, 0.2,
      q.enunciado,
      q.url_imagem,
      JSON.stringify(q.alternativas),
      q.gabarito,
      q.comentario_resolucao,
    ]
  );
  const id = result.insertId;
  console.log(`✅ ID ${id} — ${q.conteudo_principal} · Gabarito: ${q.gabarito} [${q.nivel_dificuldade}]`);
  inseridas++;
}

console.log(`\n✅ ${inseridas} questões inseridas com sucesso.`);
console.log("\n📋 Resumo do banco UNICAMP 2026 (múltipla escolha, 11 questões total):");
console.log("   Lote 1: Função Composta");
console.log("   Lote 2: Polinômios · Geo. Analítica · Grandezas · Função Quadrática · Probabilidade");
console.log("   Lote 3: Matemática Financeira · Trigonometria · Conjuntos Numéricos · Sistemas Lineares · Geo. Plana");
console.log("\n⚠️  Q12–Q20 são dissertativas (sem alternativas) — não importadas no simulado de múltipla escolha.");

await db.end();
