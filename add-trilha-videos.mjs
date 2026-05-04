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
    console.log("✅ trilha_videos já existe.");
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
    console.log("✅ Tabela trilha_videos criada.");
  }

  // ── 2. Tabela trilha_definitions (LONGTEXT desde o início) ────────────────
  const [tdRows] = await conn.query(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'trilha_definitions'
  `);

  if (tdRows.length === 0) {
    await conn.query(`
      CREATE TABLE trilha_definitions (
        id           INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
        slug         VARCHAR(100) NOT NULL,
        titulo       VARCHAR(255) NOT NULL,
        area         VARCHAR(255) NOT NULL,
        descricao    TEXT         NOT NULL DEFAULT '',
        content_json LONGTEXT     NOT NULL,
        created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_trilha_def_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log("✅ Tabela trilha_definitions criada com LONGTEXT.");
  } else {
    // Tabela existe — garante que content_json é LONGTEXT
    const [colRows] = await conn.query(`
      SELECT COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME   = 'trilha_definitions'
        AND COLUMN_NAME  = 'content_json'
    `);

    const colType = colRows.length > 0 ? String(colRows[0].COLUMN_TYPE).toLowerCase() : "";
    if (colType === "longtext") {
      console.log("✅ content_json já é LONGTEXT.");
    } else {
      await conn.query(`
        ALTER TABLE trilha_definitions
          MODIFY COLUMN content_json LONGTEXT NOT NULL
      `);
      console.log(`✅ content_json: ${colType || "?"} → LONGTEXT.`);
    }
  }

  // ── 3. max_allowed_packet — aumenta para 64MB se possível ─────────────────
  try {
    await conn.query(`SET GLOBAL max_allowed_packet = 67108864`);
    console.log("✅ max_allowed_packet = 64MB.");
  } catch {
    console.log("ℹ️  Não foi possível alterar max_allowed_packet (sem SUPER privilege) — ok.");
  }

} finally {
  await conn.end();
}
