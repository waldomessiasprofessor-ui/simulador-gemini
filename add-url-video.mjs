/**
 * Migration: adiciona coluna url_video na tabela questions
 * Uso: node add-url-video.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Verifica se a coluna já existe antes de adicionar
  const [rows] = await conn.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'questions'
      AND COLUMN_NAME  = 'url_video'
  `);

  if (rows.length > 0) {
    console.log("✅ Coluna url_video já existe — nada a fazer.");
  } else {
    await conn.query(`
      ALTER TABLE questions
      ADD COLUMN url_video VARCHAR(512) NULL
      AFTER comentario_resolucao
    `);
    console.log("✅ Coluna url_video adicionada com sucesso.");
  }
} finally {
  await conn.end();
}
