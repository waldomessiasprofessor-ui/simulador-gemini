// Execute UMA VEZ para criar/atualizar as tabelas no banco
// No Railway: Settings > Custom Start Command > node setup-db.mjs
// Depois volte o start command para: npm run start

import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

console.log("🔌 Conectando ao banco...");
const pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 1 });

async function run() {
  const conn = await pool.getConnection();
  console.log("✅ Conectado!\n📦 Criando/atualizando tabelas...\n");

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student','admin') NOT NULL DEFAULT 'student',
        active BOOLEAN NOT NULL DEFAULT true,
        subscription_expires_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ users");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fonte VARCHAR(50) NOT NULL DEFAULT 'ENEM',
        ano INT,
        conteudo_principal VARCHAR(100) NOT NULL,
        tags JSON NOT NULL,
        nivel_dificuldade ENUM('Muito Baixa','Baixa','Média','Alta','Muito Alta') NOT NULL DEFAULT 'Média',
        param_a FLOAT NOT NULL DEFAULT 1.0,
        param_b FLOAT NOT NULL DEFAULT 0.0,
        param_c FLOAT NOT NULL DEFAULT 0.2,
        enunciado TEXT NOT NULL,
        url_imagem VARCHAR(512),
        alternativas JSON NOT NULL,
        gabarito VARCHAR(1) NOT NULL,
        comentario_resolucao TEXT,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_conteudo_principal (conteudo_principal),
        INDEX idx_active (active)
      )
    `);
    console.log("✅ questions");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS simulations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        stage INT NOT NULL DEFAULT 1,
        score FLOAT,
        tri_theta FLOAT,
        correct_count INT,
        total_questions INT,
        total_time_seconds INT,
        status ENUM('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_user_id (user_id),
        INDEX idx_user_stage (user_id, stage)
      )
    `);
    console.log("✅ simulations");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS simulation_answers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        simulation_id INT NOT NULL,
        question_id INT NOT NULL,
        selected_answer VARCHAR(1),
        is_correct BOOLEAN,
        time_spent_seconds INT,
        question_order INT NOT NULL,
        answered_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT,
        INDEX idx_simulation_id (simulation_id)
      )
    `);
    console.log("✅ simulation_answers");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS daily_challenges (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        challenge_date VARCHAR(10) NOT NULL,
        question_ids JSON NOT NULL,
        answers JSON NOT NULL DEFAULT ('{}'),
        completed BOOLEAN NOT NULL DEFAULT false,
        correct_count INT,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_user_date (user_id, challenge_date)
      )
    `);
    console.log("✅ daily_challenges");

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS revise_contents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(200) NOT NULL,
        conteudo TEXT NOT NULL,
        questoes JSON NOT NULL DEFAULT ('[]'),
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ revise_contents");

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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log("✅ trilha_definitions");

    console.log("\n🎉 Banco configurado com sucesso!");
    console.log("⚠️  Lembre de voltar o start command para: npm run start");
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((e) => { console.error("❌", e.message); process.exit(1); });
