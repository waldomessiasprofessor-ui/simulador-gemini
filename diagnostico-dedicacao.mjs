/**
 * Diagnóstico da queda de "Dedicação" no gráfico de performance.
 * node diagnostico-dedicacao.mjs [email]
 *
 * Se o e-mail não for passado, lista os 5 usuários com mais tempo registrado.
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const db = await mysql.createConnection(DATABASE_URL);
const targetEmail = process.argv[2] ?? null;

// ── 1. Resolve userId ─────────────────────────────────────────────────────────
let userId = null;
if (targetEmail) {
  const [rows] = await db.execute(
    "SELECT id, name, email FROM users WHERE email = ? LIMIT 1",
    [targetEmail]
  );
  if (rows.length === 0) { console.error(`Usuário não encontrado: ${targetEmail}`); process.exit(1); }
  userId = rows[0].id;
  console.log(`\n👤 Usuário: ${rows[0].name} (${rows[0].email}) — id=${userId}\n`);
} else {
  console.log("\n(Nenhum e-mail fornecido — listando top 5 por tempo de sessão)\n");
}

// ── 2. Simulados por status ───────────────────────────────────────────────────
const whereUser = userId ? `AND s.user_id = ${userId}` : "";
const [simStats] = await db.execute(`
  SELECT
    s.status,
    s.fonte,
    COUNT(*)                                        AS qtd,
    COALESCE(SUM(s.total_time_seconds), 0)          AS total_segundos,
    ROUND(COALESCE(SUM(s.total_time_seconds),0)/3600,2) AS total_horas,
    MIN(s.created_at)                               AS primeiro,
    MAX(s.created_at)                               AS ultimo
  FROM simulations s
  WHERE 1=1 ${whereUser}
  GROUP BY s.status, s.fonte
  ORDER BY s.status, s.fonte
`);

console.log("── Simulados por status e fonte ──────────────────────────────────");
console.table(simStats);

// ── 3. Tempo total por fonte de dados (mesma lógica do getPerformanceStats) ──
if (userId) {
  // Sessões completas
  const [[simRow]] = await db.execute(`
    SELECT COALESCE(SUM(total_time_seconds),0) AS sim_session_seconds
    FROM simulations
    WHERE user_id = ? AND status = 'completed'
  `, [userId]);

  // Desafios diários completos
  const [[dcRow]] = await db.execute(`
    SELECT COALESCE(SUM(total_time_seconds),0) AS dc_seconds
    FROM daily_challenges
    WHERE user_id = ? AND completed = 1
  `, [userId]);

  // Revise
  const [[drRow]] = await db.execute(`
    SELECT COALESCE(SUM(total_time_seconds),0) AS dr_seconds
    FROM daily_reviews
    WHERE user_id = ?
  `, [userId]);

  // Flashcards
  const fcExists = await db.execute(
    "SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name='flashcard_progress'"
  );
  let fcSeconds = 0;
  if (fcExists[0][0].n > 0) {
    const [[fcRow]] = await db.execute(`
      SELECT COALESCE(SUM(time_spent_seconds),0) AS fc_seconds
      FROM flashcard_progress WHERE user_id = ?
    `, [userId]);
    fcSeconds = Number(fcRow.fc_seconds);
  }

  const simSec = Number(simRow.sim_session_seconds);
  const dcSec  = Number(dcRow.dc_seconds);
  const drSec  = Number(drRow.dr_seconds);
  const total  = simSec + dcSec + drSec + fcSeconds;
  const horas  = total / 3600;
  const META   = 50;

  console.log("\n── Cálculo de Dedicação (mesmo do servidor) ──────────────────────");
  console.log(`  Sessões concluídas (simulações):  ${(simSec/3600).toFixed(2)}h`);
  console.log(`  Desafios diários:                 ${(dcSec/3600).toFixed(2)}h`);
  console.log(`  Revise (leituras):                ${(drSec/3600).toFixed(2)}h`);
  console.log(`  Flashcards:                       ${(fcSeconds/3600).toFixed(2)}h`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  TOTAL:                            ${horas.toFixed(2)}h`);
  console.log(`  Meta:                             ${META}h`);
  console.log(`  Dedicação atual:                  ${Math.min(100, Math.round(horas/META*100))}%`);

  // ── 4. Detalhe dos simulados completed ──────────────────────────────────────
  const [completedSims] = await db.execute(`
    SELECT id, fonte, total_questions, total_time_seconds,
           ROUND(total_time_seconds/60, 1) AS minutos,
           created_at, updated_at
    FROM simulations
    WHERE user_id = ? AND status = 'completed'
    ORDER BY updated_at DESC
    LIMIT 20
  `, [userId]);

  console.log("\n── Últimas simulações COMPLETAS (até 20) ─────────────────────────");
  if (completedSims.length === 0) {
    console.log("  ⚠️  Nenhuma simulação com status=completed encontrada!");
    console.log("  Isso explica a queda: sem completed → sim_session_seconds = 0.");
  } else {
    console.table(completedSims);
  }

  // ── 5. In_progress / abandoned ───────────────────────────────────────────────
  const [otherSims] = await db.execute(`
    SELECT id, fonte, status, total_questions, total_time_seconds, created_at
    FROM simulations
    WHERE user_id = ? AND status != 'completed'
    ORDER BY created_at DESC
    LIMIT 10
  `, [userId]);
  if (otherSims.length > 0) {
    console.log("\n── Simulações NÃO completas (in_progress / abandoned) ────────────");
    console.table(otherSims);
  }
}

await db.end();
console.log("\n✅ Diagnóstico concluído.");
