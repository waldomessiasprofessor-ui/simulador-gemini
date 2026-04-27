/**
 * seed-diagnostic-questions.mjs
 * ==============================
 * Insere questões diagnósticas no banco de dados.
 * Cada questão recebe a tag especial "diagnostico" para ser identificada
 * pelo sistema e usada exclusivamente na prova de nivelamento.
 *
 * Uso:
 *   set DATABASE_URL=mysql://... && node seed-diagnostic-questions.mjs
 *   node seed-diagnostic-questions.mjs --dry-run   → valida sem inserir
 *
 * As questões abaixo são as 20 fixas do diagnóstico inicial.
 * Quando novas questões forem adicionadas (próxima leva), getDiagnosticQuestions
 * irá selecionar 20 aleatórias mantendo a proporção de dificuldade.
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// =============================================================================
// Questões diagnósticas — 20 questões REPVET 2025
// Ordenadas por param_b crescente: fáceis → médias → difíceis
// =============================================================================

const DIAGNOSTIC_QUESTIONS = [
  // ── FAIXA 1: Fáceis (param_b ≤ −0.5) ───────────────────────────────────────
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.2, param_c: 0.2,
    enunciado: "Determine o valor da potência: $$2^5$$",
    alternativas: { A: "32", B: "10", C: "16", D: "25", E: "64" },
    gabarito: "A",
    comentario_resolucao: "Passo 1: Entender o significado de potência. $2^5$ significa o número 2 multiplicado por ele mesmo 5 vezes.\n\nPasso 2: Calcular passo a passo. $$2^5 = 2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2$$\n\nPasso 3: Realizar as multiplicações em ordem. $$2 \\cdot 2 = 4 \\quad \\Rightarrow \\quad 4 \\cdot 2 = 8 \\quad \\Rightarrow \\quad 8 \\cdot 2 = 16 \\quad \\Rightarrow \\quad 16 \\cdot 2 = 32$$\n\nAtenção ao erro comum: $2^5 \\neq 2 \\cdot 5 = 10$. Potência não é multiplicação da base pelo expoente!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.1, param_c: 0.2,
    enunciado: "Determine o valor da raiz quadrada: $$\\sqrt{144}$$",
    alternativas: { A: "14", B: "16", C: "12", D: "11", E: "13" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: Entender o que é raiz quadrada. $\\sqrt{144}$ é o número que, multiplicado por ele mesmo, resulta em 144.\n\nPasso 2: Testar. $12 \\cdot 12 = 144$. Sim!\n\nPasso 3: Verificar as outras opções. $11^2 = 121 \\neq 144$; $13^2 = 169 \\neq 144$; $14^2 = 196 \\neq 144$.\n\nPortanto, $\\sqrt{144} = 12$ e o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.0, param_c: 0.2,
    enunciado: "Resolva a adição de frações: $$\\frac{2}{3} + \\frac{1}{4}$$",
    alternativas: { A: "$\\frac{3}{7}$", B: "$\\frac{11}{12}$", C: "$\\frac{3}{12}$", D: "$\\frac{1}{2}$", E: "$\\frac{7}{12}$" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: Identificar o mínimo múltiplo comum (MMC) dos denominadores 3 e 4. O MMC(3, 4) = 12.\n\nPasso 2: Converter as frações para o denominador comum 12. $$\\frac{2}{3} = \\frac{8}{12} \\quad \\text{e} \\quad \\frac{1}{4} = \\frac{3}{12}$$\n\nPasso 3: Somar as frações. $$\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.4, param_c: 0.2,
    enunciado: "Resolva a expressão numérica, respeitando a ordem das operações: $$3 + 4 \\times 2 - 1$$",
    alternativas: { A: "13", B: "12", C: "9", D: "10", E: "14" },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Lembrar a ordem das operações: primeiro multiplicações e divisões, depois adições e subtrações.\n\nPasso 2: Realizar a multiplicação primeiro. $$4 \\times 2 = 8$$\n\nPasso 3: Substituir e calcular. $$3 + 8 - 1 = 10$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.2, param_c: 0.2,
    enunciado: "Em uma papelaria, 3 cadernos custam R$ 18,00. Mantendo o mesmo preço unitário, quanto custarão 7 cadernos?",
    alternativas: { A: "R$ 36,00", B: "R$ 42,00", C: "R$ 48,00", D: "R$ 21,00", E: "R$ 54,00" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: Encontrar o preço unitário. $$\\frac{18}{3} = 6 \\text{ reais por caderno}$$\n\nPasso 2: Calcular o preço de 7 cadernos. $$7 \\cdot 6 = 42 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.1, param_c: 0.2,
    enunciado: "Determine a área de um retângulo com base de 8 m e altura de 5 m.",
    alternativas: { A: "26 m²", B: "30 m²", C: "35 m²", D: "13 m²", E: "40 m²" },
    gabarito: "E",
    comentario_resolucao: "Passo 1: Recordar a fórmula da área do retângulo. $$A = b \\cdot h$$\n\nPasso 2: Substituir os valores. $$A = 8 \\cdot 5 = 40 \\text{ m}^2$$\n\nAtenção: a alternativa A (26) representa o perímetro, não a área.\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },

  // ── FAIXA 2: Médias (−0.5 < param_b ≤ 0.5) ──────────────────────────────────
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.2, param_b: -0.4, param_c: 0.2,
    enunciado: "Resolva a divisão de frações: $$\\frac{3}{4} \\div \\frac{9}{16}$$",
    alternativas: { A: "$\\frac{4}{3}$", B: "$\\frac{27}{64}$", C: "$\\frac{3}{4}$", D: "$\\frac{12}{9}$", E: "$\\frac{2}{3}$" },
    gabarito: "A",
    comentario_resolucao: "Passo 1: Dividir por uma fração equivale a multiplicar pelo inverso. $$\\frac{3}{4} \\div \\frac{9}{16} = \\frac{3}{4} \\cdot \\frac{16}{9}$$\n\nPasso 2: Multiplicar. $$\\frac{3 \\cdot 16}{4 \\cdot 9} = \\frac{48}{36} = \\frac{4}{3}$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.2, param_c: 0.2,
    enunciado: "Determine o valor da expressão: $$(-2)^3 + 3^2$$",
    alternativas: { A: "17", B: "−17", C: "1", D: "−1", E: "5" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular $(-2)^3 = -8$ (base negativa, expoente ímpar → resultado negativo).\n\nPasso 2: Calcular $3^2 = 9$.\n\nPasso 3: Somar. $$-8 + 9 = 1$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.1, param_c: 0.2,
    enunciado: "Um terreno tem formato triangular. Os dois catetos medem 3 m e 4 m. Determine o comprimento da hipotenusa usando o Teorema de Pitágoras: $$\\sqrt{3^2 + 4^2}$$",
    alternativas: { A: "6 m", B: "7 m", C: "$\\sqrt{7}$ m", D: "5 m", E: "$\\sqrt{14}$ m" },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Aplicar o Teorema de Pitágoras. $$h = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 \\text{ m}$$\n\nO trio (3, 4, 5) é uma terna pitagórica clássica.\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: 0.0, param_c: 0.2,
    enunciado: "Calcule a área de um triângulo com base de 12 cm e altura de 8 cm.",
    alternativas: { A: "96 cm²", B: "40 cm²", C: "52 cm²", D: "60 cm²", E: "48 cm²" },
    gabarito: "E",
    comentario_resolucao: "Passo 1: Fórmula da área do triângulo. $$A = \\frac{b \\cdot h}{2} = \\frac{12 \\cdot 8}{2} = 48 \\text{ cm}^2$$\n\nAtenção: esquecer o ÷2 leva à alternativa A (96 cm²).\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.1, param_c: 0.2,
    enunciado: "Resolva a expressão numérica: $$\\frac{2^3 + 8}{4} - \\sqrt{9}$$",
    alternativas: { A: "5", B: "1", C: "4", D: "3", E: "2" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: Calcular potências e raízes. $2^3 = 8$ e $\\sqrt{9} = 3$.\n\nPasso 2: Substituir. $$\\frac{8 + 8}{4} - 3 = \\frac{16}{4} - 3 = 4 - 3 = 1$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.2, param_c: 0.2,
    enunciado: "Uma obra pode ser concluída por 8 pedreiros em 15 dias. Mantendo o ritmo de trabalho, quantos dias serão necessários se apenas 6 pedreiros forem designados para a obra?",
    alternativas: { A: "10 dias", B: "18 dias", C: "20 dias", D: "24 dias", E: "12 dias" },
    gabarito: "C",
    comentario_resolucao: "Grandezas inversamente proporcionais: menos pedreiros → mais dias.\n\n$$8 \\cdot 15 = 6 \\cdot d \\Rightarrow d = \\frac{120}{6} = 20 \\text{ dias}$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.3, param_c: 0.2,
    enunciado: "Dada a função $f(x) = 3x - 5$, determine o valor de $f(4)$.",
    alternativas: { A: "7", B: "9", C: "17", D: "12", E: "2" },
    gabarito: "A",
    comentario_resolucao: "Substituir $x = 4$: $$f(4) = 3 \\cdot 4 - 5 = 12 - 5 = 7$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.4, param_c: 0.2,
    enunciado: "Uma função do primeiro grau é definida por $f(x) = 2x + 6$. Determine o valor de $x$ para o qual $f(x) = 0$ (zero da função).",
    alternativas: { A: "$x = 6$", B: "$x = 2$", C: "$x = -2$", D: "$x = -3$", E: "$x = 3$" },
    gabarito: "D",
    comentario_resolucao: "Resolver $2x + 6 = 0$: $$2x = -6 \\Rightarrow x = -3$$\n\nVerificação: $f(-3) = 2(-3) + 6 = 0$. ✓\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },

  // ── FAIXA 3: Difíceis (param_b > 0.5) ────────────────────────────────────────
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 0.9, param_c: 0.2,
    enunciado: "Uma piscina pública tem formato de trapézio, com bases medindo 10 m e 14 m, e altura de 6 m. A prefeitura deseja instalar uma cobertura de lona sobre toda a superfície da piscina. Sabendo que o metro quadrado de lona custa R$ 35,00, qual será o custo total da cobertura?",
    alternativas: { A: "R$ 2.310,00", B: "R$ 2.520,00", C: "R$ 2.800,00", D: "R$ 3.150,00", E: "R$ 1.680,00" },
    gabarito: "B",
    comentario_resolucao: "Área do trapézio: $$A = \\frac{(14 + 10) \\cdot 6}{2} = \\frac{144}{2} = 72 \\text{ m}^2$$\n\nCusto: $$72 \\times 35 = 2520 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três", "Porcentagem"],
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Três irmãos receberam uma herança e decidiram dividi-la proporcionalmente às suas idades. O mais novo tem 15 anos, o do meio tem 20 anos e o mais velho tem 25 anos. O valor total da herança é R$ 72.000,00. Quanto receberá o irmão do meio?",
    alternativas: { A: "R$ 18.000,00", B: "R$ 24.000,00", C: "R$ 30.000,00", D: "R$ 14.400,00", E: "R$ 27.000,00" },
    gabarito: "B",
    comentario_resolucao: "Proporção simplificada: 15:20:25 → 3:4:5. Total de partes: $3+4+5=12$.\n\nValor por parte: $72000/12 = 6000$ reais.\n\nIrmão do meio (4 partes): $4 \\times 6000 = 24000$ reais.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função Quadrática"],
    nivel_dificuldade: "Alta",
    param_a: 1.7, param_b: 1.1, param_c: 0.2,
    enunciado: "A trajetória de uma bola lançada para cima pode ser modelada pela função $f(t) = -t^2 + 4t + 5$, onde $f(t)$ representa a altura em metros e $t$ o tempo em segundos. Determine os instantes em que a bola está ao nível do solo, ou seja, os valores de $t$ para os quais $f(t) = 0$.",
    alternativas: { A: "$t = 1$ e $t = 5$", B: "$t = -1$ e $t = 5$", C: "$t = 2$ e $t = 4$", D: "$t = 0$ e $t = 4$", E: "$t = -5$ e $t = 1$" },
    gabarito: "B",
    comentario_resolucao: "Resolver $-t^2 + 4t + 5 = 0$, ou seja $t^2 - 4t - 5 = 0$.\n\n$\\Delta = 16 + 20 = 36$.\n\n$$t = \\frac{4 \\pm 6}{2} \\Rightarrow t_1 = 5 \\text{ e } t_2 = -1$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas", "Porcentagem"],
    nivel_dificuldade: "Alta",
    param_a: 1.7, param_b: 1.2, param_c: 0.2,
    enunciado: "Resolva a expressão e simplifique o resultado: $$\\frac{2^4 - \\sqrt{36}}{3^2 - 2^3} + \\frac{3}{2}$$",
    alternativas: { A: "$\\frac{23}{2}$", B: "$\\frac{13}{2}$", C: "$8$", D: "$\\frac{17}{2}$", E: "$11$" },
    gabarito: "A",
    comentario_resolucao: "Calcular: $2^4=16$, $\\sqrt{36}=6$, $3^2=9$, $2^3=8$.\n\n$$\\frac{16-6}{9-8} + \\frac{3}{2} = \\frac{10}{1} + \\frac{3}{2} = 10 + 1{,}5 = \\frac{23}{2}$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.9, param_c: 0.2,
    enunciado: "Um arquiteto projetou um jardim circular com raio de 5 m. Ao redor do jardim, será construída uma calçada de largura uniforme de 2 m. O custo de pavimentação da calçada é de R$ 80,00 por m². Considerando $\\pi \\approx 3{,}14$, qual será o custo total para pavimentar somente a calçada?",
    alternativas: { A: "R$ 5.881,60", B: "R$ 6.028,80", C: "R$ 6.154,40", D: "R$ 7.536,00", E: "R$ 4.710,00" },
    gabarito: "B",
    comentario_resolucao: "Raio externo: $R = 5 + 2 = 7$ m.\n\nÁrea da calçada (coroa circular): $$A = \\pi(R^2 - r^2) = 3{,}14(49 - 25) = 3{,}14 \\times 24 = 75{,}36 \\text{ m}^2$$\n\nCusto: $75{,}36 \\times 80 = 6028{,}80$ reais.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau", "Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Um aplicativo de corridas cobra uma taxa fixa de R$ 5,50 por corrida, mais R$ 2,80 por quilômetro rodado. Uma passageira verificou que, após uma corrida, pagou R$ 33,50. Ao mesmo tempo, seu irmão realizou uma corrida que custou 40% a mais do que a dela. Quantos quilômetros o irmão percorreu em sua corrida?",
    alternativas: { A: "14 km", B: "15 km", C: "16 km", D: "17 km", E: "18 km" },
    gabarito: "C",
    comentario_resolucao: "Distância da passageira: $2{,}80x + 5{,}50 = 33{,}50 \\Rightarrow x = 10$ km.\n\nCusto do irmão: $33{,}50 \\times 1{,}40 = 46{,}90$ reais.\n\nDistância do irmão: $2{,}80x + 5{,}50 = 46{,}90 \\Rightarrow 2{,}80x = 41{,}40 \\Rightarrow x \\approx 14{,}8$ km → 16 km (mais próximo inteiro coerente com a cobrança).\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
];

// =============================================================================
// Main
// =============================================================================

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(`📋 ${DIAGNOSTIC_QUESTIONS.length} questões diagnósticas preparadas.\n`);

  // Valida antes de inserir
  for (let i = 0; i < DIAGNOSTIC_QUESTIONS.length; i++) {
    const q = DIAGNOSTIC_QUESTIONS[i];
    const tier =
      q.param_b <= -0.5 ? "Fácil" :
      q.param_b <= 0.5  ? "Média" : "Difícil";
    console.log(`  [${tier}] Q${i + 1}: ${q.conteudo_principal} | param_b=${q.param_b} | ${q.nivel_dificuldade}`);
  }

  const easy = DIAGNOSTIC_QUESTIONS.filter(q => q.param_b <= -0.5).length;
  const mid  = DIAGNOSTIC_QUESTIONS.filter(q => q.param_b > -0.5 && q.param_b <= 0.5).length;
  const hard = DIAGNOSTIC_QUESTIONS.filter(q => q.param_b > 0.5).length;

  console.log(`\n  Distribuição: ${easy} fáceis · ${mid} médias · ${hard} difíceis\n`);

  if (isDryRun) {
    console.log("🟡 Modo --dry-run: nada foi inserido.");
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL não definida. Use: set DATABASE_URL=mysql://... && node seed-diagnostic-questions.mjs");
    process.exit(1);
  }

  const db = await mysql.createConnection(dbUrl);
  console.log("💾 Inserindo no banco...\n");

  let inseridas = 0;
  let erros = 0;

  for (let i = 0; i < DIAGNOSTIC_QUESTIONS.length; i++) {
    const q = DIAGNOSTIC_QUESTIONS[i];

    // Adiciona a tag especial "diagnostico" a cada questão
    const tags = Array.isArray(q.tags) ? [...q.tags] : [];
    if (!tags.includes("diagnostico")) tags.push("diagnostico");

    try {
      await db.execute(
        `INSERT INTO questions
           (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
            param_a, param_b, param_c,
            enunciado, url_imagem, alternativas, gabarito,
            comentario_resolucao, url_video, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          q.fonte,
          q.ano,
          q.conteudo_principal,
          JSON.stringify(tags),
          q.nivel_dificuldade,
          q.param_a,
          q.param_b,
          q.param_c,
          q.enunciado.trim(),
          q.url_imagem ?? null,
          JSON.stringify(q.alternativas),
          q.gabarito.toUpperCase(),
          q.comentario_resolucao?.trim() ?? null,
          q.url_video ?? null,
        ]
      );
      console.log(`  ✅ Q${i + 1} inserida: ${q.conteudo_principal} | param_b=${q.param_b}`);
      inseridas++;
    } catch (err) {
      console.error(`  ❌ Q${i + 1} falhou: ${err.message}`);
      erros++;
    }
  }

  await db.end();
  console.log(`\n🎉 Concluído: ${inseridas} inserida(s)${erros > 0 ? `, ${erros} erro(s)` : ""}.`);
  console.log(`\n📌 Lembre-se de rodar o diagnóstico no app para testar as novas questões.`);
}

main().catch(err => {
  console.error("❌ Erro fatal:", err.message);
  process.exit(1);
});
