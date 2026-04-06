/**
 * Insere questão UNICAMP 2026 — Função Composta
 * node insert-unicamp2026-q1.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const question = {
  fonte: "UNICAMP",
  ano: 2026,
  conteudo_principal: "Função Composta",
  tags: JSON.stringify(["Função Composta", "Leitura de Gráficos e Tabelas"]),
  nivel_dificuldade: "Baixa",
  param_a: 1.0,
  param_b: 0.0,
  param_c: 0.2,
  enunciado:
    "A figura a seguir mostra um trecho do gráfico de $f(g(x))$ em que " +
    "$f(x) = x^3 + 2x^2 + \\alpha x - 1$, $g(x) = 3 - x$ e $\\alpha$ é uma constante real.\n\n" +
    "Qual é o valor da constante $\\alpha$?",
  url_imagem: null,
  alternativas: JSON.stringify({
    A: "$-2$.",
    B: "$-3$.",
    C: "$-4$.",
    D: "$-5$.",
    E: null,
  }),
  gabarito: "D",
  comentario_resolucao:
    "Como $f(g(1)) = 5$, temos que:\n\n" +
    "$$g(1) = 3 - 1 = 2$$\n\n" +
    "$$f(g(1)) = f(2) = 2^3 + 2 \\cdot 2^2 + \\alpha \\cdot 2 - 1 = 5$$\n\n" +
    "$$8 + 8 + 2\\alpha - 1 = 5$$\n\n" +
    "$$2\\alpha = -10$$\n\n" +
    "$$\\therefore \\alpha = -5$$",
};

const db = await mysql.createConnection(DATABASE_URL);

const [result] = await db.execute(
  `INSERT INTO questions
     (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
      param_a, param_b, param_c,
      enunciado, url_imagem, alternativas, gabarito, comentario_resolucao, active)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  [
    question.fonte,
    question.ano,
    question.conteudo_principal,
    question.tags,
    question.nivel_dificuldade,
    question.param_a,
    question.param_b,
    question.param_c,
    question.enunciado,
    question.url_imagem,
    question.alternativas,
    question.gabarito,
    question.comentario_resolucao,
  ]
);

console.log(`✅ Questão inserida com ID ${result.insertId}`);
console.log(`   UNICAMP 2026 · Função Composta · Gabarito D`);
await db.end();
