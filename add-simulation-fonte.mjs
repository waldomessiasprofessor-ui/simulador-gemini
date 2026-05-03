/**
 * Adiciona coluna `fonte` na tabela simulations.
 * node add-simulation-fonte.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const db = await mysql.createConnection(DATABASE_URL);

// Adiciona coluna apenas se ainda não existir
const [cols] = await db.execute(`
  SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'simulations' AND COLUMN_NAME = 'fonte'
`);

if (cols.length === 0) {
  await db.execute(`
    ALTER TABLE simulations
    ADD COLUMN fonte VARCHAR(50) NOT NULL DEFAULT 'ENEM' AFTER stage
  `);
  console.log("✅ Coluna 'fonte' adicionada à tabela simulations.");
} else {
  console.log("ℹ️  Coluna 'fonte' já existe — nenhuma alteração necessária.");
}

await db.end();
