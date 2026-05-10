/**
 * Migration: adiciona coluna concurso na tabela questions
 * Uso: node add-concurso-column.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await conn.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'questions'
      AND COLUMN_NAME  = 'concurso'
  `);

  if (rows.length > 0) {
    console.log("✅ Coluna concurso já existe — nada a fazer.");
  } else {
    await conn.query(`
      ALTER TABLE questions
      ADD COLUMN concurso VARCHAR(200) NULL
      AFTER fonte
    `);
    console.log("✅ Coluna concurso adicionada com sucesso.");
  }
} finally {
  await conn.end();
}
