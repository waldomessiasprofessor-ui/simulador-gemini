/**
 * Adiciona coluna `url_youtube` na tabela discursive_questions.
 * node add-youtube-discursive.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const db = await mysql.createConnection(DATABASE_URL);

const [cols] = await db.execute(`
  SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'discursive_questions'
    AND COLUMN_NAME  = 'url_youtube'
`);

if (cols.length === 0) {
  await db.execute(`
    ALTER TABLE discursive_questions
    ADD COLUMN url_youtube VARCHAR(500) NULL AFTER resolucao
  `);
  console.log("✅ Coluna 'url_youtube' adicionada à tabela discursive_questions.");
} else {
  console.log("ℹ️  Coluna 'url_youtube' já existe — nenhuma alteração necessária.");
}

await db.end();
