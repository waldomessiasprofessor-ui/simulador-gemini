/**
 * Calibração contínua dos parâmetros TRI (param_b — dificuldade).
 *
 * Recalcula param_b de cada questão com base na taxa de acerto real observada:
 *   param_b_real = probit(taxa_de_erro)  =  Φ⁻¹(1 − taxa_de_acerto)
 *
 * Critérios de segurança:
 *   - Só atualiza questões com ≥ MIN_RESPOSTAS respostas (default: 30)
 *   - Limita param_b ao intervalo [-3.5, 3.5]
 *   - Registra no log quantas questões foram atualizadas
 *
 * Uso:
 *   node calibrate-tri.mjs              → roda e atualiza
 *   node calibrate-tri.mjs --dry-run    → só mostra o que mudaria, sem atualizar
 *
 * Como agendar no Railway (mensalmente):
 *   Pre-deploy Command: node add-trilha-videos.mjs && node calibrate-tri.mjs
 *   (rode manualmente na primeira vez; depois agende conforme preferência)
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DRY_RUN      = process.argv.includes("--dry-run");
const MIN_RESPOSTAS = parseInt(process.env.TRI_MIN_RESPOSTAS ?? "30", 10);
const B_MIN        = -3.5;
const B_MAX        =  3.5;

/** Inverso da distribuição normal padrão (probit) — aproximação Beasley-Springer-Moro */
function probit(p) {
  if (p <= 0) return B_MIN;
  if (p >= 1) return B_MAX;
  // Racional aproximado — erro < 4.5e-4 para p em (0,1)
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826,  3.13082909833];
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
             0.0276438810333863, 0.0038405729373609, 0.0003951896511349,
             0.0000321767881768, 0.0000002888167364, 0.0000003960315187];
  const q = p - 0.5;
  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return q * (((a[3]*r+a[2])*r+a[1])*r+a[0]) / ((((b[3]*r+b[2])*r+b[1])*r+b[0])*r+1);
  }
  const r2 = p < 0.5 ? Math.log(-Math.log(p)) : Math.log(-Math.log(1 - p));
  let val = c[0];
  for (let i = 1; i < c.length; i++) val += c[i] * Math.pow(r2, i);
  return p < 0.5 ? -val : val;
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

console.log(`🔬 Calibração TRI${DRY_RUN ? " (DRY RUN)" : ""} — mín. ${MIN_RESPOSTAS} respostas\n`);

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Agrega acertos por questão (apenas respostas salvas, não nulas)
  const [rows] = await conn.query(`
    SELECT
      q.id,
      q.param_b                              AS param_b_atual,
      COUNT(*)                               AS total,
      SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) AS acertos
    FROM simulation_answers sa
    JOIN questions q ON q.id = sa.question_id
    WHERE sa.is_correct IS NOT NULL
    GROUP BY q.id, q.param_b
    HAVING COUNT(*) >= ?
    ORDER BY q.id
  `, [MIN_RESPOSTAS]);

  let atualizadas = 0;
  let ignoradas   = 0;

  for (const row of rows) {
    const taxaAcerto = Number(row.acertos) / Number(row.total);
    // param_b = probit(taxa_de_erro) = probit(1 - taxaAcerto)
    const bNovo = Math.max(B_MIN, Math.min(B_MAX, parseFloat(probit(1 - taxaAcerto).toFixed(4))));
    const bAtual = parseFloat(Number(row.param_b_atual).toFixed(4));
    const delta = Math.abs(bNovo - bAtual);

    // Ignora mudanças menores que 0.05 (ruído estatístico)
    if (delta < 0.05) { ignoradas++; continue; }

    console.log(`  Q${row.id}: b ${bAtual.toFixed(3)} → ${bNovo.toFixed(3)}  (acerto: ${Math.round(taxaAcerto*100)}%, n=${row.total})`);

    if (!DRY_RUN) {
      await conn.query(`UPDATE questions SET param_b = ? WHERE id = ?`, [bNovo, row.id]);
    }
    atualizadas++;
  }

  console.log(`\n✅ ${atualizadas} questão(ões) ${DRY_RUN ? "seriam " : ""}atualizadas, ${ignoradas} ignoradas (delta < 0.05).`);
  if (DRY_RUN) console.log("ℹ️  Execute sem --dry-run para aplicar as mudanças.");
} finally {
  await conn.end();
}
