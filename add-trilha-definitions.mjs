/**
 * Migração: cria a tabela trilha_definitions (se não existir).
 * Usage: node add-trilha-definitions.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}
const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL });

await conn.execute(`
  CREATE TABLE IF NOT EXISTS trilha_definitions (
    id           INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug         VARCHAR(100) NOT NULL,
    titulo       VARCHAR(255) NOT NULL,
    area         VARCHAR(255) NOT NULL,
    descricao    TEXT         NOT NULL DEFAULT '',
    content_json LONGTEXT     NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_trilha_def_slug (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

console.log("✅ Tabela trilha_definitions criada (ou já existia).");
await conn.end();
