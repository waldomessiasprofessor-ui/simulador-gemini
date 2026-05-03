/**
 * Cria as tabelas discursive_questions e discursive_progress.
 * node add-segunda-fase-tables.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const db = await mysql.createConnection(DATABASE_URL);

await db.execute(`
  CREATE TABLE IF NOT EXISTS discursive_questions (
    id                  INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fonte               VARCHAR(50)  NOT NULL DEFAULT 'UNICAMP',
    ano                 INT,
    numero_prova        INT,
    conteudo_principal  VARCHAR(100) NOT NULL,
    tags                JSON         NOT NULL DEFAULT ('[]'),
    nivel_dificuldade   ENUM('Muito Baixa','Baixa','Média','Alta','Muito Alta') NOT NULL DEFAULT 'Média',
    enunciado           TEXT         NOT NULL,
    imagens             JSON         NOT NULL DEFAULT ('[]'),
    resolucao           TEXT         NOT NULL,
    active              TINYINT(1)   NOT NULL DEFAULT 1,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disc_fonte    (fonte),
    INDEX idx_disc_conteudo (conteudo_principal)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);
console.log("✅ Tabela discursive_questions criada (ou já existia).");

await db.execute(`
  CREATE TABLE IF NOT EXISTS discursive_progress (
    id          INT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     INT  NOT NULL,
    question_id INT  NOT NULL,
    resultado   ENUM('acertei','quase','errei') NOT NULL,
    xp_earned   INT  NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disc_prog_user_q (user_id, question_id),
    FOREIGN KEY (user_id)     REFERENCES users(id)                 ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES discursive_questions(id)  ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`);
console.log("✅ Tabela discursive_progress criada (ou já existia).");

await db.end();
console.log("\n🎉 Migração concluída. Rode agora:");
console.log("   node insert-unicamp2026-discursivas.mjs");
