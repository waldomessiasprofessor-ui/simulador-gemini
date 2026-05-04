// Migração: altera content_json de TEXT para LONGTEXT na tabela trilha_definitions
// TEXT tem limite de 64KB — trilhas grandes estouram esse limite.
//
// Como rodar no Railway:
//   Settings > Deploy > Custom Start Command:
//     node fix-content-json-longtext.mjs
//   Aguarde o log "✅ Coluna alterada com sucesso!"
//   Depois volte o start command para: npm run start

import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

console.log("🔌 Conectando ao banco...");
const pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 1 });

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("🔧 Alterando coluna content_json → LONGTEXT...");
    await conn.execute(`
      ALTER TABLE trilha_definitions
        MODIFY COLUMN content_json LONGTEXT NOT NULL
    `);
    console.log("✅ Coluna alterada com sucesso!");
    console.log("⚠️  Lembre de voltar o start command para: npm run start");
  } catch (err) {
    if (err.code === "ER_BAD_FIELD_ERROR" || err.message?.includes("doesn't exist")) {
      console.log("ℹ️  Tabela ou coluna não encontrada — nada a fazer.");
    } else {
      throw err;
    }
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((e) => { console.error("❌", e.message); process.exit(1); });
