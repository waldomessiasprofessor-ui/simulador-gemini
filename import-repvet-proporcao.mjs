/**
 * import-repvet-proporcao.mjs
 * ---------------------------
 * Importa 10 questões REPVET — Porcentagem + Razão, Proporção e Regra de Três.
 * Correções aplicadas:
 *   - Q8: gabarito corrigido "A" → "C" (cálculo: 3 × 5.460 = R$16.380,00 = alt. C)
 *   - Q9: active = false (M estoque 600 + G estoque 720 = 1.320, nenhuma alt. bate)
 * Uso: node import-repvet-proporcao.mjs
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
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Baixa",
    param_a: 0.8,
    param_b: -1.3,
    param_c: 0.2,
    enunciado: "Em uma fazenda do Cerrado goiano, foram colhidas 2.500 sacas de milho na última safra. Desse total, 40% foram vendidas para uma cooperativa local e o restante foi armazenado para consumo próprio. Quantas sacas foram armazenadas?",
    alternativas: JSON.stringify({ A: "900 sacas", B: "1.000 sacas", C: "1.400 sacas", D: "1.500 sacas", E: "1.600 sacas" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Calcular o percentual armazenado. Se 40% foram vendidas, então $100\\% - 40\\% = 60\\%$ foram armazenadas.\n\nPasso 2: Calcular 60% de 2.500. $$0{,}60 \\cdot 2500 = 1500 \\text{ sacas}$$\n\nPasso 3: Verificar. $0{,}40 \\cdot 2500 = 1000$ (vendidas) $+$ $1500$ (armazenadas) $= 2500$. Correto!\n\nPortanto, o gabarito é a alternativa D.",
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
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Baixa",
    param_a: 0.9,
    param_b: -1.0,
    param_c: 0.2,
    enunciado: "Em uma turma de 45 alunos, a proporção entre meninas e meninos é de 4 para 5. Quantas meninas há nessa turma?",
    alternativas: JSON.stringify({ A: "15 meninas", B: "18 meninas", C: "20 meninas", D: "25 meninas", E: "27 meninas" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Entender a proporção. Para cada 4 meninas há 5 meninos, totalizando $4 + 5 = 9$ partes.\n\nPasso 2: Encontrar o valor de cada parte. $$\\frac{45}{9} = 5 \\text{ alunos por parte}$$\n\nPasso 3: Calcular o número de meninas. $$4 \\cdot 5 = 20 \\text{ meninas}$$\n\nPasso 4: Verificar. Meninos: $5 \\cdot 5 = 25$. Total: $20 + 25 = 45$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
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
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Média",
    param_a: 1.2,
    param_b: -0.4,
    param_c: 0.2,
    enunciado: "Segundo a Agência Nacional de Águas (ANA, 2023), o volume de um reservatório que abastece uma cidade caiu de 80 milhões de m³ para 52 milhões de m³ em um período de seca. Um técnico afirmou que o volume caiu em uma determinada porcentagem. Qual foi o percentual de redução do volume do reservatório?",
    alternativas: JSON.stringify({ A: "28%", B: "32%", C: "35%", D: "38%", E: "42%" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular a variação absoluta. $$80 - 52 = 28 \\text{ milhões de m}^3$$\n\nPasso 2: Calcular o percentual de redução em relação ao valor original. $$\\frac{28}{80} \\cdot 100 = \\frac{2800}{80} = 35\\%$$\n\nPasso 3: Atenção ao erro comum. Alguns alunos calculam $\\frac{28}{52} \\cdot 100 \\approx 53{,}8\\%$, usando o valor final como base — isso está errado. O percentual de variação é sempre calculado sobre o valor inicial.\n\nPortanto, o gabarito é a alternativa C.",
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
    tags: JSON.stringify(["Razão, Proporção e Regra de Três", "Porcentagem"]),
    nivel_dificuldade: "Média",
    param_a: 1.3,
    param_b: -0.1,
    param_c: 0.2,
    enunciado: "Uma receita de bolo para 8 pessoas utiliza 360 g de farinha, 240 g de açúcar e 120 ml de óleo. Um confeiteiro deseja preparar essa receita para 30 pessoas. Mantendo as proporções originais, quantos gramas de açúcar serão necessários?",
    alternativas: JSON.stringify({ A: "750 g", B: "800 g", C: "850 g", D: "900 g", E: "960 g" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Identificar a grandeza em questão. A quantidade de açúcar é diretamente proporcional ao número de pessoas.\n\nPasso 2: Montar a proporção. $$\\frac{240}{8} = \\frac{x}{30}$$\n\nPasso 3: Resolver para $x$. $$x = \\frac{240 \\cdot 30}{8} = \\frac{7200}{8} = 900 \\text{ g}$$\n\nPasso 4: Verificar a razão. A razão por pessoa é $\\frac{240}{8} = 30$ g por pessoa. Para 30 pessoas: $30 \\cdot 30 = 900$ g. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q5 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três", "Matemática Financeira"]),
    nivel_dificuldade: "Média",
    param_a: 1.3,
    param_b: 0.2,
    param_c: 0.2,
    enunciado: "Em uma fábrica de calçados do interior de Minas Gerais, a produção diária é de 1.200 pares. Um novo sistema automatizado aumentou essa produção em 35%. Com o aumento, a fábrica passou a gastar 20% a mais de energia elétrica por dia, custando R$ 960,00 de energia diariamente. Qual era o gasto diário com energia antes da automação?",
    alternativas: JSON.stringify({ A: "R$ 720,00", B: "R$ 750,00", C: "R$ 780,00", D: "R$ 800,00", E: "R$ 840,00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Identificar o que se pede. O gasto após a automação é R$ 960,00 e isso representa um aumento de 20% sobre o gasto anterior.\n\nPasso 2: Montar a equação. Se o gasto original é $G$: $$G \\cdot 1{,}20 = 960$$\n\nPasso 3: Resolver para $G$. $$G = \\frac{960}{1{,}20} = 800 \\text{ reais}$$\n\nPasso 4: Verificar. $800 \\cdot 1{,}20 = 960$. Correto!\n\nAtenção: o aumento de 35% na produção é dado de contexto e não é necessário para o cálculo — cuidado para não se confundir com dados extras no enunciado.\n\nPortanto, o gabarito é a alternativa D.",
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
    tags: JSON.stringify(["Razão, Proporção e Regra de Três", "Porcentagem", "Escala"]),
    nivel_dificuldade: "Média",
    param_a: 1.4,
    param_b: 0.3,
    param_c: 0.2,
    enunciado: "Um mapa turístico do estado de Goiás utiliza a escala 1:4.000.000. Nesse mapa, a distância entre Goiânia e Brasília é medida como 4,5 cm. Qual é a distância real, em quilômetros, entre as duas cidades?",
    alternativas: JSON.stringify({ A: "160 km", B: "175 km", C: "180 km", D: "190 km", E: "200 km" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Entender a escala. A escala 1:4.000.000 significa que 1 cm no mapa equivale a 4.000.000 cm na realidade.\n\nPasso 2: Calcular a distância real em centímetros. $$4{,}5 \\cdot 4.000.000 = 18.000.000 \\text{ cm}$$\n\nPasso 3: Converter para quilômetros. Sabemos que $1 \\text{ km} = 100.000 \\text{ cm}$: $$\\frac{18.000.000}{100.000} = 180 \\text{ km}$$\n\nPasso 4: Verificar. A distância real entre Goiânia e Brasília é de aproximadamente 180 km, o que é geograficamente coerente.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q7 ──────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5,
    param_b: 0.9,
    param_c: 0.2,
    enunciado: "Um hospital público registrou, em 2022, 4.800 atendimentos de emergência. Em 2023, esse número cresceu 25%. Em 2024, houve uma redução de 16% em relação a 2023 devido à inauguração de uma UPA no bairro. Quantos atendimentos foram registrados em 2024 e qual foi a variação percentual em relação a 2022?",
    alternativas: JSON.stringify({
      A: "4.800 atendimentos — variação de 0%",
      B: "5.000 atendimentos — crescimento de 4,2%",
      C: "5.040 atendimentos — crescimento de 5%",
      D: "5.100 atendimentos — crescimento de 6,25%",
      E: "5.200 atendimentos — crescimento de 8,3%",
    }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular os atendimentos em 2023. $$4800 \\cdot 1{,}25 = 6000 \\text{ atendimentos}$$\n\nPasso 2: Calcular os atendimentos em 2024. $$6000 \\cdot 0{,}84 = 5040 \\text{ atendimentos}$$\n\nPasso 3: Calcular a variação percentual em relação a 2022. $$\\frac{5040 - 4800}{4800} \\cdot 100 = \\frac{240}{4800} \\cdot 100 = 5\\%$$\n\nPasso 4: Interpretar. O fator global é $1{,}25 \\cdot 0{,}84 = 1{,}05$, confirmando crescimento de 5% em relação a 2022.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q8 ── gabarito corrigido "A" → "C" (3 × 5.460 = R$16.380,00 = alt. C)
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Razão, Proporção e Regra de Três", "Porcentagem"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6,
    param_b: 1.1,
    param_c: 0.2,
    enunciado: "Três sócios — Ana, Bruno e Carla — investiram em um negócio nas proporções de 2, 3 e 5, respectivamente. Ao final do primeiro ano, o lucro total foi de R$ 48.000,00. No segundo ano, o lucro cresceu 30% e a participação de Ana foi aumentada para 30% do total, mantendo a razão original entre Bruno e Carla para o restante. Qual foi o lucro de Bruno no segundo ano?",
    alternativas: JSON.stringify({
      A: "R$ 13.860,00",
      B: "R$ 15.120,00",
      C: "R$ 16.380,00",
      D: "R$ 18.720,00",
      E: "R$ 19.440,00",
    }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular o lucro total no segundo ano. $$48000 \\cdot 1{,}30 = 62400 \\text{ reais}$$\n\nPasso 2: Calcular o lucro de Ana (30% do total). $$0{,}30 \\cdot 62400 = 18720 \\text{ reais}$$\n\nPasso 3: Calcular o restante para Bruno e Carla. $$62400 - 18720 = 43680 \\text{ reais}$$\n\nPasso 4: Distribuir entre Bruno e Carla na proporção original 3:5. Total de partes: $3 + 5 = 8$. Valor por parte: $$\\frac{43680}{8} = 5460 \\text{ reais}$$\n\nPasso 5: Calcular o lucro de Bruno (3 partes). $$3 \\cdot 5460 = 16380 \\text{ reais}$$\n\nVerificação: Ana $18720$ + Bruno $16380$ + Carla ($5 \\cdot 5460 = 27300$) $= 62400$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },

  // ── Q9 ── active: false (M estoque 600 + G estoque 720 = 1.320, nenhuma alternativa bate com 820–1.100)
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três", "Matemática Financeira"]),
    nivel_dificuldade: "Alta",
    param_a: 1.7,
    param_b: 1.3,
    param_c: 0.2,
    enunciado: "Uma indústria têxtil do Nordeste produz camisetas em três tamanhos: P, M e G, na proporção 2:5:3. Em um mês, foram produzidas 6.000 camisetas no total. O gerente de vendas informou que 80% das camisetas M e 60% das camisetas G foram vendidas naquele mês. Quantas camisetas (M e G juntas) ainda estavam em estoque ao final do mês?",
    alternativas: JSON.stringify({ A: "820 camisetas", B: "900 camisetas", C: "980 camisetas", D: "1.020 camisetas", E: "1.100 camisetas" }),
    gabarito: "D",
    comentario_resolucao: "ATENÇÃO — questão desativada para revisão. O cálculo correto é: total de partes = 10; M = 3.000; G = 1.800. Estoque M = 20% × 3.000 = 600; Estoque G = 40% × 1.800 = 720. Total estoque M+G = 1.320 camisetas — valor que não corresponde a nenhuma das alternativas (820 a 1.100). O enunciado ou as alternativas precisam ser corrigidos antes de reativar a questão.",
    url_imagem: null,
    url_video: null,
    active: false,
    auditada: false,
  },

  // ── Q10 ─────────────────────────────────────────────────────────────────────
  {
    fonte: "REPVET",
    ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["Porcentagem", "Razão, Proporção e Regra de Três", "Matemática Financeira"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9,
    param_b: 2.1,
    param_c: 0.2,
    enunciado: "Uma startup brasileira de tecnologia captou investimentos em três rodadas. Na primeira rodada, captou R$ 500.000,00 e os investidores receberam 20% da empresa. Na segunda rodada, novos investidores aportaram recursos e receberam 25% da empresa já diluída. Na terceira rodada, mais investidores receberam 10% da empresa. Após as três rodadas, qual é o percentual da empresa que ainda pertence aos fundadores?",
    alternativas: JSON.stringify({ A: "45,0%", B: "50,0%", C: "54,0%", D: "57,5%", E: "60,0%" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Entender o conceito de diluição. Cada rodada multiplica o percentual dos fundadores pelo complemento do percentual cedido.\n\nPasso 2: Após a primeira rodada. Fundadores ficam com: $$100\\% - 20\\% = 80\\% \\Rightarrow \\text{fator } 0{,}80$$\n\nPasso 3: Após a segunda rodada. Novos investidores recebem 25%, fundadores ficam com 75% do que tinham: $$0{,}80 \\cdot 0{,}75 = 0{,}60 = 60\\%$$\n\nPasso 4: Após a terceira rodada. Novos investidores recebem 10%, fundadores ficam com 90% do que tinham: $$0{,}60 \\cdot 0{,}90 = 0{,}54 = 54\\%$$\n\nPasso 5: Conclusão. O erro clássico é somar os percentuais ($20\\% + 25\\% + 10\\% = 55\\%$) e subtrair de 100%, obtendo 45% — isso ignora que cada percentual incide sobre uma base diferente.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null,
    url_video: null,
    active: true,
    auditada: false,
  },
];

async function main() {
  const db = await mysql.createConnection(DATABASE_URL);

  console.log(`Importando ${QUESTIONS.length} questões REPVET — Porcentagem + Proporção...\n`);

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
}

main().catch((err) => {
  console.error("Erro fatal:", err.message);
  process.exit(1);
});
