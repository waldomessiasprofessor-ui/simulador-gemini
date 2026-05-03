/**
 * Migração: adiciona colunas de diagnóstico na tabela users
 * Uso: set DATABASE_URL=mysql://... && node migrate-diagnosis.mjs
 */
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL não definida"); process.exit(1); }

const conn = await mysql.createConnection(url);

// Extrai nome do banco da URL
const dbName = url.split("/").pop().split("?")[0];

const cols = [
  { name: "city",                   sql: "VARCHAR(100) NULL" },
  { name: "education_level",        sql: "VARCHAR(80) NULL" },
  { name: "diagnosis_level",        sql: "ENUM('iniciante','intermediario','avancado') NULL" },
  { name: "diagnosis_score",        sql: "INT NULL" },
  { name: "diagnosis_completed_at", sql: "TIMESTAMP NULL" },
];

for (const col of cols) {
  // Verifica se a coluna já existe
  const [rows] = await conn.execute(
    `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
    [dbName, col.name]
  );
  const exists = rows[0].cnt > 0;

  if (exists) {
    console.log(`⏭️  ${col.name} (já existe)`);
  } else {
    await conn.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.sql}`);
    console.log(`✅ ${col.name}`);
  }
}

await conn.end();
console.log("\nMigração concluída!");
