// Adiciona coluna `auditada` na tabela questions
// Rode no Railway: Settings > Custom Start Command > node add-auditada-column.mjs
// Depois volte para: npm run start

import "dotenv/config";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

const pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 1 });
const conn = await pool.getConnection();

try {
  // Verifica se coluna já existe antes de tentar adicionar
  const [rows] = await conn.execute(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'questions' AND COLUMN_NAME = 'auditada'`
  );
  if (rows[0].cnt > 0) {
    console.log("✅ Coluna 'auditada' já existe — nenhuma ação necessária.");
  } else {
    await conn.execute(`ALTER TABLE questions ADD COLUMN auditada BOOLEAN NOT NULL DEFAULT FALSE`);
    console.log("✅ Coluna 'auditada' adicionada com sucesso.");
  }
} finally {
  conn.release();
  await pool.end();
}
