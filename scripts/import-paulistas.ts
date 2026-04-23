/**
 * Script de importação de questões das paulistas (UNICAMP, FUVEST, UNESP)
 * Rodar: railway run npx tsx scripts/import-paulistas.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../server/schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida");

const pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 3 });
const db = drizzle(pool, { schema, mode: "default" });

const questoes = [
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Porcentagem",
    tags: ["Porcentagem", "Matemática Financeira"],
    nivel_dificuldade: "Baixa" as const,
    param_a: 0.8,
    param_b: -1.5,
    param_c: 0.2,
    enunciado: `Rogério é funcionário de uma fábrica de automóveis. Em dezembro de 2024, seu gestor fez duas propostas de aumento salarial:

- a proposta 1 consistia em um aumento de 50% do seu salário, a partir do salário a ser recebido em janeiro de 2025, mas sem nenhum tipo de reajuste nos próximos três anos, ou seja, até dezembro de 2027;

- a proposta 2 consistia em um aumento de 20% a cada ano; o reajuste ocorreria no salário de janeiro de cada um dos próximos três anos, a partir de 2025.

Para decidir a qual proposta aderir, Rogério calculou o montante total que receberia ao longo dos três anos em cada proposta, isto é, de janeiro de 2025 a dezembro de 2027. Ele concluiu que o total a ser recebido na proposta 1 é, aproximadamente,`,
    url_imagem: null,
    alternativas: {
      A: "3% maior que o total a ser recebido na proposta 2.",
      B: "1% maior que o total a ser recebido na proposta 2.",
      C: "3% menor que o total a ser recebido na proposta 2.",
      D: "1% menor que o total a ser recebido na proposta 2.",
    },
    gabarito: "A",
    comentario_resolucao: `Sendo $x$ o valor do salário inicial, temos:

**Proposta 1** — aumento de 50% aplicado uma única vez, mantido por 3 anos:

$$1{,}5x + 1{,}5x + 1{,}5x = 4{,}5x$$

**Proposta 2** — aumento de 20% ao ano, composto nos 3 anos:

$$1{,}2x + 1{,}2^2 x + 1{,}2^3 x = 1{,}2x + 1{,}44x + 1{,}728x = 4{,}368x$$

**Variação percentual** da proposta 1 em relação à proposta 2:

$$\\frac{4{,}5x - 4{,}368x}{4{,}368x} \\cdot 100\\% = \\frac{0{,}132x}{4{,}368x} \\cdot 100\\% \\approx 3\\%$$

Como o resultado é positivo, a proposta 1 rende **3% a mais** que a proposta 2.`,
    active: true,
  },
];

async function main() {
  console.log(`Importando ${questoes.length} questão(ões)...`);
  let ok = 0;
  for (const q of questoes) {
    try {
      await db.insert(schema.questions).values(q as any);
      ok++;
      console.log(`  ✅ ${q.fonte} ${q.ano} — ${q.conteudo_principal}`);
    } catch (err: any) {
      console.error(`  ❌ Erro: ${err.message}`);
    }
  }
  console.log(`\nConcluído: ${ok}/${questoes.length} inserida(s).`);
  process.exit(0);
}

main();
