/**
 * Migration: cria a tabela trilha_videos (URLs de videoaula por lição).
 * Uso: node add-trilha-videos.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await conn.query(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'trilha_videos'
  `);

  if (rows.length > 0) {
    console.log("✅ Tabela trilha_videos já existe — nada a fazer.");
  } else {
    await conn.query(`
      CREATE TABLE trilha_videos (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        trilha_slug VARCHAR(100) NOT NULL,
        licao_slug  VARCHAR(100) NOT NULL DEFAULT '',
        url_youtube VARCHAR(512) NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_trilha_licao (trilha_slug, licao_slug)
      )
    `);
    console.log("✅ Tabela trilha_videos criada com sucesso.");
  }
} finally {
  await conn.end();
}
