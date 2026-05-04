/**
 * Migration: cria tabelas auxiliares e aplica correções de schema.
 * Uso: node add-trilha-videos.mjs
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // ── 1. Tabela trilha_videos ───────────────────────────────────────────────
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

  // ── 2. Tabela trilha_definitions — content_json precisa ser LONGTEXT ──────
  // MySQL TEXT tem limite de 64KB; trilhas extensas estouram esse limite.
  const [colRows] = await conn.query(`
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'trilha_definitions'
      AND COLUMN_NAME  = 'content_json'
  `);

  if (colRows.length === 0) {
    console.log("ℹ️  Coluna content_json não encontrada — tabela ainda não existe, ok.");
  } else {
    const colType = String(colRows[0].COLUMN_TYPE).toLowerCase();
    if (colType === "longtext") {
      console.log("✅ content_json já é LONGTEXT — nada a fazer.");
    } else {
      await conn.query(`
        ALTER TABLE trilha_definitions
          MODIFY COLUMN content_json LONGTEXT NOT NULL
      `);
      console.log(`✅ content_json alterado de ${colType.toUpperCase()} → LONGTEXT.`);
    }
  }
} finally {
  await conn.end();
}
