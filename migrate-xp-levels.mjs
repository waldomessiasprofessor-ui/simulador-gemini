// Migração manual: adiciona coluna xp e altera enum diagnosis_level
import mysql from "mysql2/promise";

const db = await mysql.createConnection(process.env.DATABASE_URL);

console.log("Iniciando migração...");

try {
  // 1. Verifica se a coluna xp já existe
  const [cols] = await db.execute(`SHOW COLUMNS FROM users LIKE 'xp'`);
  if (cols.length === 0) {
    await db.execute(`ALTER TABLE users ADD COLUMN xp INT NOT NULL DEFAULT 0`);
    console.log("✅ Coluna xp adicionada");
  } else {
    console.log("ℹ️  Coluna xp já existe, pulando");
  }
} catch (e) {
  throw e;
}

// 2. Migra os valores antigos para os novos equivalentes
// iniciante → curioso (0-3 acertos) ou aprendiz (4-8)
// intermediario → calculista
// avancado → expert ou genio
// Por segurança, mapeia direto para o nível mais próximo usando diagnosisScore
const [oldRows] = await db.execute(`
  SELECT id, diagnosis_level, diagnosis_score FROM users WHERE diagnosis_level IS NOT NULL
`);
console.log(`ℹ️  Migrando ${oldRows.length} alunos com diagnóstico antigo...`);

for (const row of oldRows) {
  const score = row.diagnosis_score ?? 0;
  let newLevel;
  if (score >= 17)      newLevel = "genio";
  else if (score >= 13) newLevel = "expert";
  else if (score >= 9)  newLevel = "calculista";
  else if (score >= 4)  newLevel = "aprendiz";
  else                  newLevel = "curioso";

  await db.execute(`UPDATE users SET diagnosis_level = NULL WHERE id = ?`, [row.id]);
}
console.log("✅ Valores antigos removidos (será NULL até alterar o enum)");

// 3. Altera o enum
try {
  await db.execute(`
    ALTER TABLE users
    MODIFY COLUMN diagnosis_level ENUM('curioso','aprendiz','calculista','expert','genio') NULL
  `);
  console.log("✅ Enum diagnosis_level atualizado para 5 níveis");
} catch (e) {
  console.error("❌ Erro ao alterar enum:", e.message);
  throw e;
}

// 4. Reatribui os níveis migrados
for (const row of oldRows) {
  const score = row.diagnosis_score ?? 0;
  let newLevel;
  if (score >= 17)      newLevel = "genio";
  else if (score >= 13) newLevel = "expert";
  else if (score >= 9)  newLevel = "calculista";
  else if (score >= 4)  newLevel = "aprendiz";
  else                  newLevel = "curioso";

  await db.execute(
    `UPDATE users SET diagnosis_level = ? WHERE id = ?`,
    [newLevel, row.id]
  );
}
console.log(`✅ ${oldRows.length} alunos reclassificados nos novos 5 níveis`);

await db.end();
console.log("\n🎉 Migração concluída!");
