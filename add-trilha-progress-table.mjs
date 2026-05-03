/**
 * Cria a tabela trilha_progress no banco.
 * node add-trilha-progress-table.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const db = await mysql.createConnection(DATABASE_URL);

await db.execute(`
  CREATE TABLE IF NOT EXISTS trilha_progress (
    id                INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id           INT          NOT NULL,
    trilha_slug       VARCHAR(100) NOT NULL,
    licao_slug        VARCHAR(100) NOT NULL,
    finished_at       TIMESTAMP    NULL,
    last_score_pct    INT          NULL,
    total_time_sec    INT          NOT NULL DEFAULT 0,
    leitura_concluida TINYINT(1)   NOT NULL DEFAULT 0,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_trilha_user_licao (user_id, trilha_slug, licao_slug),
    KEY idx_trilha_prog_user (user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

console.log("✅ Tabela trilha_progress criada (ou já existia).");
await db.end();
