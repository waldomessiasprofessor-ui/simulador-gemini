/**
 * Migração: adiciona colunas de diagnóstico na tabela users
 * Uso: DATABASE_URL=mysql://... node migrate-diagnosis.mjs
 */
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL não definida"); process.exit(1); }

const conn = await mysql.createConnection(url);

const cols = [
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS education_level VARCHAR(80) NULL",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS diagnosis_level ENUM('iniciante','intermediario','avancado') NULL",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS diagnosis_score INT NULL",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS diagnosis_completed_at TIMESTAMP NULL",
];

for (const sql of cols) {
  try {
    await conn.execute(sql);
    console.log("✅", sql.split(" ADD COLUMN ")[1]?.split(" ")[0] ?? sql);
  } catch (e) {
    console.log("⚠️  já existe ou erro:", e.message);
  }
}

await conn.end();
console.log("\nMigração concluída!");
