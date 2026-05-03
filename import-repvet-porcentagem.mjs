/**
 * import-repvet-porcentagem.mjs
 * -----------------------------
 * Importa 10 questões REPVET de Porcentagem (Matemática Básica).
 * Correções aplicadas:
 *   - Q5: gabarito corrigido de "B" para "C" (R$ 96,00 — cálculo da resolução)
 *   - Q7: gabarito corrigido de "C" para "D" (26,5% — a resolução diz explicitamente)
 *   - Q8: active = false (matemática inconsistente: conta dá ~67.391, alts 124k–140k)
 * Uso: node import-repvet-porcentagem.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const QUESTIONS = [
  // ── Q1 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Operações Básicas"]),
    nivel_dificuldade: "Baixa",
    param_a: 0.8,
    param_b: -1.2,
    param_c: 0.2,
    enunciado: "Uma escola pública de Goiânia realizou uma gincana solidária e arrecadou 400 kg de alimentos. Desse total, 35% foram doados para uma creche do bairro. Quantos quilogramas de alimentos foram doados para a creche?",
    alternativas: JSON.stringify({ A: "120 kg", B: "140 kg", C: "150 kg", D: "160 kg", E: "175 kg" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Identificar o que se pede. Queremos calcular 35% de 400 kg.\n\nPasso 2: Transformar a porcentagem em fração ou decimal. Temos $35\\% = \\frac{35}{100} = 0{,}35$.\n\nPasso 3: Multiplicar pelo total. $$0{,}35 \\cdot 400 = 140 \\text{ kg}$$\n\nPasso 4: Interpretação. Dos 400 kg arrecadados, 140 kg foram destinados à creche.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q2 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Operações Básicas"]),
    nivel_dificuldade: "Baixa",
    param_a: 0.9,
    param_b: -1.0,
    param_c: 0.2,
    enunciado: "Segundo o IBGE (2023), o Brasil possui aproximadamente 215 milhões de habitantes. Pesquisas indicam que cerca de 60% da população brasileira tem acesso à internet banda larga em casa. Quantos milhões de brasileiros têm esse acesso?",
    alternativas: JSON.stringify({ A: "112 milhões", B: "120 milhões", C: "129 milhões", D: "132 milhões", E: "155 milhões" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Identificar os dados. Total = 215 milhões de habitantes. Percentual com acesso = $60\\%$.\n\nPasso 2: Transformar o percentual. $60\\% = 0{,}60$.\n\nPasso 3: Calcular. $$0{,}60 \\cdot 215 = 129 \\text{ milhões}$$\n\nPasso 4: Verificar. $0{,}60 \\cdot 200 = 120$ e $0{,}60 \\cdot 15 = 9$, portanto $120 + 9 = 129$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q3 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Média",
    param_a: 1.2,
    param_b: -0.3,
    param_c: 0.2,
    enunciado: "Uma loja de eletrodomésticos anunciou uma promoção: um televisor que custava R$ 2.400,00 foi colocado em oferta com 15% de desconto. No entanto, ao calcular o valor final, o vendedor aplicou erroneamente um desconto de 20% sobre o preço original. Qual é a diferença, em reais, entre o valor correto com desconto e o valor cobrado pelo vendedor?",
    alternativas: JSON.stringify({ A: "R$ 60,00", B: "R$ 80,00", C: "R$ 100,00", D: "R$ 120,00", E: "R$ 144,00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Calcular o desconto correto de 15%. $$0{,}15 \\cdot 2400 = 360 \\text{ reais}$$ Valor correto: $2400 - 360 = $ R$ 2.040,00.\n\nPasso 2: Calcular o desconto errado de 20%. $$0{,}20 \\cdot 2400 = 480 \\text{ reais}$$ Valor cobrado: $2400 - 480 = $ R$ 1.920,00.\n\nPasso 3: Calcular a diferença. $$2040 - 1920 = 120 \\text{ reais}$$\n\nPasso 4: Interpretação. O vendedor cobrou R$ 120,00 a menos do que deveria. A diferença entre os dois valores é R$ 120,00.\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q4 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Leitura de Gráficos e Tabelas"]),
    nivel_dificuldade: "Média",
    param_a: 1.3,
    param_b: -0.2,
    param_c: 0.2,
    enunciado: "Em uma turma com 80 alunos do ensino médio, uma pesquisa sobre preferências musicais revelou os seguintes dados: 40% preferem funk, 25% preferem sertanejo, 20% preferem pop e os demais preferem outros estilos. Quantos alunos preferem estilos classificados como outros?",
    alternativas: JSON.stringify({ A: "10 alunos", B: "12 alunos", C: "15 alunos", D: "16 alunos", E: "20 alunos" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Somar os percentuais conhecidos. $$40\\% + 25\\% + 20\\% = 85\\%$$\n\nPasso 2: Calcular o percentual restante. $$100\\% - 85\\% = 15\\%$$\n\nPasso 3: Calcular quantos alunos representam 15% de 80. $$0{,}15 \\cdot 80 = 12 \\text{ alunos}$$\n\nPasso 4: Verificar. $0{,}40 \\cdot 80 = 32$; $0{,}25 \\cdot 80 = 20$; $0{,}20 \\cdot 80 = 16$; $32 + 20 + 16 + 12 = 80$. Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q5 ── gabarito corrigido "B" → "C" (resolução calcula R$ 96,00 = alt. C)
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Média",
    param_a: 1.4,
    param_b: 0.1,
    param_c: 0.2,
    enunciado: "Um produto teve seu preço aumentado em 20% em janeiro. Em fevereiro, o novo preço sofreu uma redução de 20%. Um consumidor afirmou que o preço voltou ao valor original. Essa afirmação está correta? Considerando que o preço inicial era R$ 100,00, qual é o preço final após as duas variações?",
    alternativas: JSON.stringify({
      A: "R$ 100,00, pois os percentuais se cancelam",
      B: "R$ 98,00, pois o aumento e a redução não se cancelam",
      C: "R$ 96,00, pois o aumento é maior que a redução",
      D: "R$ 104,00, pois o aumento supera a redução",
      E: "R$ 102,00, pois há uma variação residual positiva",
    }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Aplicar o aumento de 20% sobre R$ 100,00. $$100 \\cdot 1{,}20 = 120 \\text{ reais}$$\n\nPasso 2: Aplicar a redução de 20% sobre o novo valor (R$ 120,00, não sobre R$ 100,00!). $$120 \\cdot 0{,}80 = 96 \\text{ reais}$$\n\nO preço final é R$ 96,00.\n\nPasso 3: Fórmula geral. O fator combinado é: $$1{,}20 \\cdot 0{,}80 = 0{,}96$$\n\nIsso representa uma redução de 4% em relação ao preço original, pois $100 \\cdot 0{,}96 = 96$.\n\nPasso 4: Conclusão. O consumidor está errado. Percentuais sucessivos não se cancelam porque são calculados sobre bases diferentes. O preço final é R$ 96,00, uma redução líquida de 4%.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q6 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Estatística"]),
    nivel_dificuldade: "Média",
    param_a: 1.3,
    param_b: 0.3,
    param_c: 0.2,
    enunciado: "Segundo dados do Ministério da Saúde (2023), em um município brasileiro foram registrados 3.200 casos de dengue durante o verão. Desses, 12,5% necessitaram de internação hospitalar. Quantos pacientes foram internados?",
    alternativas: JSON.stringify({ A: "320 pacientes", B: "380 pacientes", C: "400 pacientes", D: "450 pacientes", E: "500 pacientes" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Identificar os dados. Total de casos = 3.200. Percentual internado = $12{,}5\\%$.\n\nPasso 2: Converter o percentual. $12{,}5\\% = \\frac{12{,}5}{100} = 0{,}125$.\n\nPasso 3: Calcular. $$0{,}125 \\cdot 3200 = 400 \\text{ pacientes}$$\n\nDica de cálculo: $12{,}5\\% = \\frac{1}{8}$, portanto $\\frac{3200}{8} = 400$. Muito mais rápido!\n\nPasso 4: Interpretar. 400 dos 3.200 pacientes com dengue precisaram de internação.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q7 ── gabarito corrigido "C" → "D" (1,15 × 1,10 = 1,265 = 26,5%)
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5,
    param_b: 0.8,
    param_c: 0.2,
    enunciado: "Uma empresa de tecnologia concedeu reajuste salarial a seus funcionários em dois momentos do ano: no primeiro semestre, um aumento de 15%; no segundo semestre, um aumento de 10% sobre o salário já reajustado. Um funcionário que recebia R$ 3.200,00 antes dos reajustes deseja saber qual teria sido o percentual de aumento total equivalente, caso o reajuste fosse aplicado de uma única vez.",
    alternativas: JSON.stringify({ A: "23,5%", B: "24,5%", C: "25,0%", D: "26,5%", E: "27,0%" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Calcular o fator de reajuste combinado. O primeiro aumento de 15% corresponde ao fator $1{,}15$ e o segundo aumento de 10% corresponde ao fator $1{,}10$.\n\nPasso 2: O fator total é o produto dos dois fatores. $$1{,}15 \\cdot 1{,}10 = 1{,}265$$\n\nPasso 3: Interpretar o fator total. Um fator de $1{,}265$ significa um aumento de $26{,}5\\%$.\n\nPasso 4: Verificar com o salário real. $3200 \\cdot 1{,}15 = 3680$. Depois: $3680 \\cdot 1{,}10 = 4048$. Aumento total: $4048 - 3200 = 848$. Percentual: $$\\frac{848}{3200} \\cdot 100 = 26{,}5\\%$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q8 ── active: false (matemática inconsistente: 62.000 ÷ 0,92 ≈ 67.391, não bate com as alternativas 124k–140k)
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6,
    param_b: 1.0,
    param_c: 0.2,
    enunciado: "Em uma eleição municipal, três candidatos disputaram o cargo de prefeito. O candidato A obteve 45% dos votos válidos, o candidato B obteve 35% e o candidato C obteve os demais. Sabe-se que o candidato C recebeu 12.400 votos. Além dos votos válidos, houve 5% de votos brancos e 3% de votos nulos em relação ao total de eleitores que compareceram. Quantos eleitores compareceram à eleição?",
    alternativas: JSON.stringify({ A: "124.000 eleitores", B: "130.000 eleitores", C: "134.000 eleitores", D: "136.000 eleitores", E: "140.000 eleitores" }),
    gabarito: "B",
    comentario_resolucao: "ATENÇÃO — esta questão está desativada para revisão. O cálculo correto é: candidato C = 20% dos votos válidos → votos válidos = 12.400 ÷ 0,20 = 62.000. Como votos válidos representam 92% do total (100% − 5% brancos − 3% nulos), o total de comparecimentos seria 62.000 ÷ 0,92 ≈ 67.391 eleitores, valor que não corresponde a nenhuma das alternativas apresentadas (124k–140k). O enunciado precisa ser corrigido antes de ser ativado.",
    url_imagem: null,
    url_video: null,
    active: false,
    auditada: false,
  },

  // ── Q9 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Alta",
    param_a: 1.7,
    param_b: 1.2,
    param_c: 0.2,
    enunciado: "Uma loja oferece duas formas de pagamento para um produto: à vista por R$ 850,00 ou parcelado em 5 vezes sem juros de R$ 190,00 cada parcela. Porém, ao analisar melhor, o lojista percebeu que o valor parcelado embute uma taxa de administração. Qual é o percentual de acréscimo que o comprador paga ao parcelar, em relação ao preço à vista?",
    alternativas: JSON.stringify({ A: "10,2%", B: "11,2%", C: "11,8%", D: "12,5%", E: "13,0%" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular o valor total parcelado. $$5 \\cdot 190 = 950 \\text{ reais}$$\n\nPasso 2: Calcular o acréscimo em relação ao valor à vista. $$950 - 850 = 100 \\text{ reais}$$\n\nPasso 3: Calcular o percentual de acréscimo. O percentual é calculado sempre em relação ao valor à vista (valor original): $$\\frac{100}{850} \\cdot 100 = \\frac{10000}{850} \\approx 11{,}76\\%$$\n\nPasso 4: Arredondar e identificar a alternativa mais próxima. $11{,}76\\% \\approx 11{,}8\\%$, que corresponde à alternativa C.\n\nAtenção: o erro comum é calcular o percentual sobre o valor parcelado ($\\frac{100}{950} \\approx 10{,}5\\%$), mas o correto é sempre usar o valor original como base.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q10 ─────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Matemática Financeira", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8,
    param_b: 2.0,
    param_c: 0.2,
    enunciado: "Uma cooperativa agrícola do Cerrado registrou crescimento de produção de soja ao longo de três anos consecutivos: no primeiro ano, a produção cresceu 20%; no segundo ano, cresceu 25% em relação ao ano anterior; no terceiro ano, houve uma queda de 10% em relação ao segundo ano. Ao final dos três anos, a produção final representava aproximadamente qual percentual da produção inicial? (Considere $1{,}20 \\cdot 1{,}25 = 1{,}50$ e $1{,}50 \\cdot 0{,}90 = 1{,}35$)",
    alternativas: JSON.stringify({
      A: "A produção caiu 35% em relação à inicial",
      B: "A produção cresceu 25% em relação à inicial",
      C: "A produção cresceu 35% em relação à inicial",
      D: "A produção cresceu 45% em relação à inicial",
      E: "A produção cresceu 50% em relação à inicial",
    }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Entender que variações percentuais sucessivas se multiplicam, não se somam. Não podemos simplesmente somar $20\\% + 25\\% - 10\\% = 35\\%$, pois cada percentual incide sobre uma base diferente.\n\nPasso 2: Calcular o fator do primeiro ano. Aumento de 20%: fator = $1{,}20$.\n\nPasso 3: Calcular o fator do segundo ano. Aumento de 25%: fator = $1{,}25$.\n\nPasso 4: Calcular o fator do terceiro ano. Queda de 10%: fator = $0{,}90$.\n\nPasso 5: Multiplicar todos os fatores para obter o fator global. $$1{,}20 \\cdot 1{,}25 \\cdot 0{,}90 = 1{,}50 \\cdot 0{,}90 = 1{,}35$$\n\nPasso 6: Interpretar o resultado. Um fator de $1{,}35$ significa que a produção final equivale a $135\\%$ da produção inicial, ou seja, cresceu $35\\%$ em relação ao início.\n\nPasso 7: Por que as outras alternativas são erradas? A alternativa E ($50\\%$) ignora a queda do terceiro ano. A alternativa D ($45\\%$) é um erro de cálculo intermediário.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },
];

async function main() {
  const db = await mysql.createConnection(DATABASE_URL);

  console.log(`Importando ${QUESTIONS.length} questões REPVET — Porcentagem...\n`);

  let ok = 0;
  let skipped = 0;

  for (const [i, q] of QUESTIONS.entries()) {
    const label = `Q${i + 1} (${q.nivel_dificuldade}, gabarito ${q.gabarito}${!q.active ? " — INATIVA" : ""})`;
    try {
      await db.execute(
        `INSERT INTO questions
          (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
           param_a, param_b, param_c,
           enunciado, alternativas, gabarito, comentario_resolucao,
           url_imagem, url_video, active, auditada)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.fonte, q.ano, q.conteudo_principal, q.tags, q.nivel_dificuldade,
          q.param_a, q.param_b, q.param_c,
          q.enunciado, q.alternativas, q.gabarito, q.comentario_resolucao,
          q.url_imagem, q.url_video,
          q.active ? 1 : 0, q.auditada ? 1 : 0,
        ]
      );
      console.log(`  ✓ ${label}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${label}: ${err.message}`);
      skipped++;
    }
  }

  await db.end();
  console.log(`\nConcluído: ${ok} inseridas, ${skipped} com erro.`);
  if (skipped === 0) console.log("Todas as questões foram importadas com sucesso!");
}

main().catch((err) => {
  console.error("Erro fatal:", err.message);
  process.exit(1);
});
