import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const CONCURSO = "Caixa - Técnico Bancário - 2024";
const TAG = "Caixa - Técnico Bancário - 2024";

const db = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await db.query(
  "SELECT id, tags FROM questions WHERE fonte = 'CONCURSO' AND ano = 2024"
);

console.log(`${rows.length} questão(ões) encontrada(s)\n`);

for (const q of rows) {
  const tags = Array.isArray(q.tags) ? q.tags : JSON.parse(q.tags || "[]");
  if (!tags.includes(TAG)) tags.push(TAG);
  await db.execute(
    "UPDATE questions SET tags = ?, concurso = ? WHERE id = ?",
    [JSON.stringify(tags), CONCURSO, q.id]
  );
  console.log(`  ✅ #${q.id} → concurso + tag aplicados`);
}

await db.end();
console.log("\n🎉 Concluído.");
