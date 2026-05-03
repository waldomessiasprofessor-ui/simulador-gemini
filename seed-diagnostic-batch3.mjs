/**
 * seed-diagnostic-batch3.mjs
 * Insere 10 questões de Matemática Básica no pool diagnóstico (Lote 3).
 * Distribuição: 0 fáceis · 5 médias · 5 difíceis
 *
 * Uso:
 *   set DATABASE_URL=mysql://root:SENHA@gondola.proxy.rlwy.net:40821/railway
 *   node seed-diagnostic-batch3.mjs
 */

import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("❌  DATABASE_URL não definida."); process.exit(1); }

const questions = [
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.3, param_c: 0.2,
    enunciado: "Um supermercado vendeu, em uma semana, 240 kg de arroz, 180 kg de feijão e 60 kg de macarrão. Qual é a razão entre a quantidade de feijão vendida e o total de produtos vendidos nessa semana?",
    alternativas: JSON.stringify({ A: "$\\frac{1}{3}$", B: "$\\frac{2}{5}$", C: "$\\frac{3}{8}$", D: "$\\frac{1}{4}$", E: "$\\frac{3}{5}$" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular o total de produtos vendidos. $$240 + 180 + 60 = 480 \\text{ kg}$$\n\nPasso 2: Montar a razão entre feijão e total. $$\\frac{180}{480}$$\n\nPasso 3: Simplificar dividindo pelo MDC(180, 480) = 60. $$\\frac{180 \\div 60}{480 \\div 60} = \\frac{3}{8}$$\n\nPasso 4: Verificar. $3 \\times 60 = 180$ e $8 \\times 60 = 480$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.2, param_c: 0.2,
    enunciado: "Calcule o valor da expressão: $$\\frac{120}{8} - \\frac{45}{9} + 2^3$$",
    alternativas: JSON.stringify({ A: "15", B: "16", C: "18", D: "20", E: "23" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Resolver cada operação separadamente. $$\\frac{120}{8} = 15 \\quad ; \\quad \\frac{45}{9} = 5 \\quad ; \\quad 2^3 = 8$$\n\nPasso 2: Substituir na expressão. $$15 - 5 + 8$$\n\nPasso 3: Calcular da esquerda para a direita. $$15 - 5 = 10 \\quad \\Rightarrow \\quad 10 + 8 = 18$$\n\nErro comum: calcular $15 - (5 + 8) = 2$, agrupando indevidamente a subtração com a soma.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Porcentagem"]),
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: -0.1, param_c: 0.2,
    enunciado: "Segundo o IBGE (2023), em um município brasileiro havia 48.000 habitantes. Desses, $\\frac{3}{8}$ são crianças e adolescentes. Quantas pessoas nesse município não são crianças nem adolescentes?",
    alternativas: JSON.stringify({ A: "18.000", B: "24.000", C: "28.000", D: "30.000", E: "32.000" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Calcular o número de crianças e adolescentes. $$\\frac{3}{8} \\cdot 48000 = \\frac{144000}{8} = 18000$$\n\nPasso 2: Calcular o restante. $$48000 - 18000 = 30000$$\n\nPasso 3: Verificar pela fração complementar. O restante representa $1 - \\frac{3}{8} = \\frac{5}{8}$ da população. $$\\frac{5}{8} \\cdot 48000 = \\frac{240000}{8} = 30000 \\checkmark$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.1, param_c: 0.2,
    enunciado: "Um ciclista percorre $\\frac{2}{5}$ de uma trilha no primeiro dia e $\\frac{1}{3}$ no segundo dia. Que fração da trilha ainda falta percorrer?",
    alternativas: JSON.stringify({ A: "$\\frac{4}{15}$", B: "$\\frac{3}{8}$", C: "$\\frac{2}{15}$", D: "$\\frac{7}{15}$", E: "$\\frac{1}{2}$" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Somar as frações percorridas. MMC(5, 3) = 15. $$\\frac{2}{5} + \\frac{1}{3} = \\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15}$$\n\nPasso 2: Calcular a fração restante. $$1 - \\frac{11}{15} = \\frac{15}{15} - \\frac{11}{15} = \\frac{4}{15}$$\n\nPasso 3: Verificar. $\\frac{6}{15} + \\frac{5}{15} + \\frac{4}{15} = \\frac{15}{15} = 1$. Correto!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.2, param_c: 0.2,
    enunciado: "Em uma fábrica, a máquina A produz 360 peças em 6 horas e a máquina B produz 400 peças em 8 horas. Trabalhando juntas por 5 horas, quantas peças as duas máquinas produzem no total?",
    alternativas: JSON.stringify({ A: "550 peças", B: "600 peças", C: "650 peças", D: "700 peças", E: "750 peças" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Calcular a produção por hora de cada máquina. $$\\text{Máquina A: } \\frac{360}{6} = 60 \\text{ peças/hora}$$ $$\\text{Máquina B: } \\frac{400}{8} = 50 \\text{ peças/hora}$$\n\nPasso 2: Calcular a produção conjunta por hora. $$60 + 50 = 110 \\text{ peças/hora}$$\n\nPasso 3: Calcular a produção total em 5 horas. $$110 \\cdot 5 = 550 \\text{ peças}$$\n\nPasso 4: Verificar. Máquina A em 5h: $60 \\cdot 5 = 300$. Máquina B em 5h: $50 \\cdot 5 = 250$. Total: $300 + 250 = 550$. Correto!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.8, param_c: 0.2,
    enunciado: "Um comerciante comprou um lote de 120 produtos por R$ 4.800,00 e colocou cada item à venda com 40% de lucro sobre o preço de custo. Após vender $\\frac{3}{4}$ do lote pelo preço cheio, ele aplicou um desconto de 20% sobre o preço de venda nos itens restantes para liquidar o estoque. Qual foi o lucro total obtido pelo comerciante?",
    alternativas: JSON.stringify({ A: "R$ 1.296,00", B: "R$ 1.440,00", C: "R$ 1.584,00", D: "R$ 1.728,00", E: "R$ 1.920,00" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular o preço de custo por item. $$\\frac{4800}{120} = 40 \\text{ reais por item}$$\n\nPasso 2: Calcular o preço de venda com 40% de lucro. $$40 \\cdot 1{,}40 = 56 \\text{ reais por item}$$\n\nPasso 3: Calcular as quantidades em cada fase. $$\\frac{3}{4} \\cdot 120 = 90 \\text{ itens ao preço cheio} \\quad ; \\quad 30 \\text{ itens com desconto}$$\n\nPasso 4: Calcular o preço com desconto de 20%. $$56 \\cdot 0{,}80 = 44{,}80 \\text{ reais por item}$$\n\nPasso 5: Calcular a receita total. $$90 \\cdot 56 + 30 \\cdot 44{,}80 = 5040 + 1344 = 6384 \\text{ reais}$$\n\nPasso 6: Calcular o lucro. $$6384 - 4800 = 1584 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 1.9, param_c: 0.2,
    enunciado: "Três torneiras A, B e C abastecem um reservatório. A torneira A sozinha o encheria em 4 horas, a torneira B sozinha em 6 horas e a torneira C sozinha em 12 horas. As três são abertas ao mesmo tempo. Após 1 hora de funcionamento conjunto, a torneira B é fechada. Quanto tempo total, desde a abertura das torneiras, será necessário para encher o reservatório?",
    alternativas: JSON.stringify({ A: "$1\\frac{1}{2}$ horas", B: "$1\\frac{3}{4}$ horas", C: "$2$ horas", D: "$2\\frac{1}{4}$ horas", E: "$2\\frac{1}{2}$ horas" }),
    gabarito: "E",
    comentario_resolucao: "Passo 1: Calcular a fração enchida por hora por cada torneira. $$A: \\frac{1}{4} \\quad ; \\quad B: \\frac{1}{6} \\quad ; \\quad C: \\frac{1}{12}$$\n\nPasso 2: Calcular o que as três juntas enchem em 1 hora. MMC(4, 6, 12) = 12. $$\\frac{3}{12} + \\frac{2}{12} + \\frac{1}{12} = \\frac{6}{12} = \\frac{1}{2}$$\n\nPasso 3: Após 1 hora, $\\frac{1}{2}$ está cheio. Falta $\\frac{1}{2}$. A torneira B é fechada.\n\nPasso 4: Taxa conjunta de A e C. $$\\frac{1}{4} + \\frac{1}{12} = \\frac{3}{12} + \\frac{1}{12} = \\frac{4}{12} = \\frac{1}{3} \\text{ por hora}$$\n\nPasso 5: Tempo para A e C encherem a metade restante. $$t = \\frac{1/2}{1/3} = \\frac{3}{2} = 1{,}5 \\text{ hora}$$\n\nPasso 6: Tempo total. $$1 + 1{,}5 = 2{,}5 = 2\\frac{1}{2} \\text{ horas}$$\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três", "Porcentagem"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Três agricultores colheram juntos 4.800 kg de soja na proporção 3:5:4, respectivamente. O preço de venda foi de R$ 2,00 por kg e cada produtor vendeu toda a sua parte. O agricultor com maior cota pagou 10% do valor recebido como taxa de cooperativa. Qual foi o valor líquido recebido por esse agricultor após o desconto da taxa?",
    alternativas: JSON.stringify({ A: "R$ 3.200,00", B: "R$ 3.400,00", C: "R$ 3.500,00", D: "R$ 3.600,00", E: "R$ 4.000,00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Identificar o agricultor com maior cota. A proporção é 3:5:4; o maior valor é 5.\n\nPasso 2: Calcular o total de partes. $$3 + 5 + 4 = 12 \\text{ partes}$$\n\nPasso 3: Calcular a quantidade colhida pelo maior agricultor. $$\\frac{5}{12} \\cdot 4800 = 2000 \\text{ kg}$$\n\nPasso 4: Calcular o valor bruto. $$2000 \\cdot 2{,}00 = 4000 \\text{ reais}$$\n\nPasso 5: Descontar 10% de taxa. $$4000 \\cdot 0{,}90 = 3600 \\text{ reais}$$\n\nPasso 6: Verificar. $4000 \\times 0{,}10 = 400$ de taxa. $4000 - 400 = 3600$. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.9, param_c: 0.2,
    enunciado: "Uma loja aplica dois descontos sucessivos sobre o preço original de um produto: primeiro um desconto de 10% e, sobre o valor resultante, um desconto adicional de 25%. O preço original do produto é R$ 2.000,00. Uma cliente acredita que o desconto total equivale a 35% do preço original. Ela está certa? Qual é o preço final pago pela cliente?",
    alternativas: JSON.stringify({ A: "R$ 1.200,00 — a cliente está certa", B: "R$ 1.350,00 — a cliente está errada", C: "R$ 1.400,00 — a cliente está certa", D: "R$ 1.440,00 — a cliente está errada", E: "R$ 1.500,00 — a cliente está errada" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Aplicar o primeiro desconto de 10%. $$2000 \\cdot 0{,}90 = 1800 \\text{ reais}$$\n\nPasso 2: Aplicar o segundo desconto de 25% sobre R$ 1.800,00 (não sobre o original!). $$1800 \\cdot 0{,}75 = 1350 \\text{ reais}$$\n\nPasso 3: Calcular o desconto total equivalente. $$\\frac{2000 - 1350}{2000} \\cdot 100 = \\frac{650}{2000} \\cdot 100 = 32{,}5\\%$$\n\nPasso 4: Concluir. O desconto equivalente é 32,5%, não 35%. A cliente está errada. O fator combinado é $0{,}90 \\cdot 0{,}75 = 0{,}675$.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.1, param_c: 0.2,
    enunciado: "Um número inteiro positivo $n$ satisfaz simultaneamente as três condições abaixo:\n\n- Ao ser dividido por 4, o resto é 3;\n- Ao ser dividido por 5, o resto é 2;\n- Ao ser dividido por 6, o resto é 1.\n\nQual é o menor número inteiro positivo que satisfaz todas essas condições?",
    alternativas: JSON.stringify({ A: "7", B: "11", C: "17", D: "23", E: "37" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Entender as condições. Procuramos $n$ tal que: $$n = 4k + 3 \\quad ; \\quad n = 5j + 2 \\quad ; \\quad n = 6m + 1$$\n\nPasso 2: Listar os candidatos da primeira condição. $$3,\\ 7,\\ 11,\\ 15,\\ 19,\\ \\ldots$$\n\nPasso 3: Verificar quais também satisfazem a segunda condição (resto 2 ao dividir por 5). $$3 \\div 5: \\text{ resto } 3 \\quad \\times$$ $$7 \\div 5: \\text{ resto } 2 \\quad \\checkmark$$\n\nPasso 4: Verificar se $n = 7$ satisfaz a terceira condição (resto 1 ao dividir por 6). $$7 \\div 6: \\text{ resto } 1 \\quad \\checkmark$$\n\nPasso 5: Confirmar. $$7 = 4 \\cdot 1 + 3 \\checkmark \\quad 7 = 5 \\cdot 1 + 2 \\checkmark \\quad 7 = 6 \\cdot 1 + 1 \\checkmark$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
];

async function main() {
  console.log("📋 Diagnóstico — Lote 3 (10 questões de Matemática Básica)\n");

  const url = new URL(DATABASE_URL);
  const db = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    ssl: { rejectUnauthorized: false },
  });

  let inseridas = 0, erros = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const tier = q.param_b <= -0.5 ? "Fácil" : q.param_b <= 0.5 ? "Média" : "Difícil";
    console.log(`  [${tier}] Q${i + 1}: ${q.conteudo_principal} | param_b=${q.param_b} | gab=${q.gabarito}`);

    try {
      await db.execute(
        `INSERT INTO questions
           (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
            param_a, param_b, param_c, enunciado, alternativas,
            gabarito, comentario_resolucao, url_imagem, url_video, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          q.fonte, q.ano, q.conteudo_principal, q.tags, q.nivel_dificuldade,
          q.param_a, q.param_b, q.param_c, q.enunciado, q.alternativas,
          q.gabarito, q.comentario_resolucao, q.url_imagem, q.url_video,
        ]
      );
      console.log(`    ✅ Inserida`);
      inseridas++;
    } catch (err) {
      console.error(`    ❌ Falhou: ${err.message}`);
      erros++;
    }
  }

  await db.end();
  console.log(`\n🎉 Lote 3: ${inseridas} inserida(s)${erros > 0 ? `, ${erros} erro(s)` : ""}.`);
  console.log(`   Pool diagnóstico total: ~50 questões (20 lote 1 + 20 lote 2 + 10 lote 3).`);
}

main().catch(err => {
  console.error("❌ Erro fatal:", err.message);
  process.exit(1);
});
