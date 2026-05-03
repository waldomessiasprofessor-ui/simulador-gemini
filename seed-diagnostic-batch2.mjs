/**
 * seed-diagnostic-batch2.mjs
 * ==========================
 * 1. Corrige a questão 20 do lote 1 (app de corridas — valores inconsistentes)
 * 2. Insere as 20 novas questões diagnósticas do lote 2, com todas as
 *    inconsistências de gabarito/resolução já corrigidas antes da inserção.
 *
 * Uso:
 *   set DATABASE_URL=mysql://... && node seed-diagnostic-batch2.mjs
 *   node seed-diagnostic-batch2.mjs --dry-run
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// =============================================================================
// LOTE 2 — 20 novas questões (já com correções aplicadas)
// Inconsistências corrigidas:
//   Q10: gabarito era "E" → corrigido para "B" (matemática: 25/4)
//   Q15: gabarito era "D" e resolução dizia "A" → corrigido; alternativas ajustadas
//   Q18: resultado real era 22/9 mas não aparecia nas alternativas → opção C corrigida
//   Q19: resolução dava R$63.604,40 mas nenhuma alternativa batia → alternativas corrigidas
//   Q20: gabarito era "B" mas resolução concluía "D" → corrigido para "D"
// =============================================================================

const BATCH2 = [
  // ── FAIXA 1: Fáceis (param_b ≤ −0.5) ───────────────────────────────────────
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.3, param_c: 0.2,
    enunciado: "Determine o valor da potência: $$3^4$$",
    alternativas: { A: "12", B: "64", C: "81", D: "27", E: "34" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: $3^4$ significa 3 multiplicado por ele mesmo 4 vezes.\n\nPasso 2: Calcular. $$3^4 = 3 \\cdot 3 \\cdot 3 \\cdot 3 = 9 \\cdot 9 = 81$$\n\nAtenção: $3^4 \\neq 3 \\cdot 4 = 12$ (alternativa A) e $3^4 \\neq 3^3 = 27$ (alternativa D).\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.1, param_c: 0.2,
    enunciado: "Resolva a subtração de frações: $$\\frac{5}{6} - \\frac{1}{4}$$",
    alternativas: { A: "$\\frac{4}{2}$", B: "$\\frac{7}{12}$", C: "$\\frac{1}{2}$", D: "$\\frac{4}{6}$", E: "$\\frac{2}{3}$" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: MMC(6, 4) = 12.\n\nPasso 2: Converter. $$\\frac{5}{6} = \\frac{10}{12} \\quad \\text{e} \\quad \\frac{1}{4} = \\frac{3}{12}$$\n\nPasso 3: Subtrair. $$\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$$\n\nComo 7 é primo e não divide 12, a fração já está na forma irredutível.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Muito Baixa",
    param_a: 0.7, param_b: -2.0, param_c: 0.2,
    enunciado: "Determine o valor da raiz quadrada: $$\\sqrt{225}$$",
    alternativas: { A: "25", B: "16", C: "14", D: "15", E: "20" },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Encontrar o número cujo quadrado é 225.\n\nPasso 2: Testar a alternativa D: $15 \\times 15 = 225$. Correto!\n\nPasso 3: Descartar as outras. $14^2 = 196$; $16^2 = 256$; $20^2 = 400$; $25^2 = 625$.\n\nPortanto, $\\sqrt{225} = 15$ e o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.5, param_c: 0.2,
    enunciado: "Resolva a expressão numérica, respeitando a ordem das operações: $$20 - 3 \\times 4 + 2$$",
    alternativas: { A: "6", B: "10", C: "70", D: "18", E: "12" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: Multiplicações têm prioridade. $$3 \\times 4 = 12$$\n\nPasso 2: Calcular da esquerda para a direita. $$20 - 12 + 2 = 8 + 2 = 10$$\n\nErro comum: calcular sem prioridade → $20 - 3 = 17$; $17 \\times 4 = 68$; $68 + 2 = 70$ (alternativa C).\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.3, param_c: 0.2,
    enunciado: "Em uma gráfica, 5 folhas de papel cartão custam R$ 12,50. Mantendo o mesmo preço unitário, quanto custarão 12 folhas?",
    alternativas: { A: "R$ 25,00", B: "R$ 28,00", C: "R$ 30,00", D: "R$ 32,50", E: "R$ 35,00" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: Preço unitário. $$\\frac{12{,}50}{5} = 2{,}50 \\text{ reais por folha}$$\n\nPasso 2: Preço de 12 folhas. $$12 \\times 2{,}50 = 30{,}00 \\text{ reais}$$\n\nVerificação pela proporção: $\\dfrac{12{,}50}{5} = \\dfrac{x}{12} \\Rightarrow x = 30$.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Baixa",
    param_a: 0.9, param_b: -1.2, param_c: 0.2,
    enunciado: "Determine a área de um quadrado com lado de 9 cm.",
    alternativas: { A: "36 cm²", B: "45 cm²", C: "72 cm²", D: "81 cm²", E: "18 cm²" },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Fórmula da área do quadrado. $$A = l^2 = 9^2 = 81 \\text{ cm}^2$$\n\nAtenção: a alternativa A (36 cm²) corresponde ao perímetro $P = 4 \\times 9 = 36$ cm — grandeza diferente da área.\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },

  // ── FAIXA 2: Médias (−0.5 < param_b ≤ 0.5) ──────────────────────────────────
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.2, param_b: -0.5, param_c: 0.2,
    enunciado: "Resolva a multiplicação de frações e simplifique o resultado: $$\\frac{4}{9} \\times \\frac{3}{8}$$",
    alternativas: { A: "$\\frac{7}{17}$", B: "$\\frac{1}{8}$", C: "$\\frac{12}{72}$", D: "$\\frac{1}{6}$", E: "$\\frac{2}{9}$" },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Multiplicar. $$\\frac{4 \\cdot 3}{9 \\cdot 8} = \\frac{12}{72}$$\n\nPasso 2: Simplificar dividindo por 12. $$\\frac{12 \\div 12}{72 \\div 12} = \\frac{1}{6}$$\n\nDica: simplifique antes de multiplicar — 4 e 8 por 4, 3 e 9 por 3: $$\\frac{1}{3} \\times \\frac{1}{2} = \\frac{1}{6}$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.3, param_c: 0.2,
    enunciado: "Determine o valor da expressão: $$(-3)^2 - 2^4$$",
    alternativas: { A: "$-7$", B: "$25$", C: "$-6$", D: "$7$", E: "$-25$" },
    gabarito: "A",
    comentario_resolucao: "Passo 1: Calcular $(-3)^2$. Base negativa com expoente par → resultado positivo. $$(-3)^2 = 9$$\n\nPasso 2: Calcular $2^4 = 16$.\n\nPasso 3: Subtrair. $$9 - 16 = -7$$\n\nErro comum: calcular $(-3)^2 = -9$, obtendo $-9 - 16 = -25$ (alternativa E).\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.2, param_c: 0.2,
    enunciado: "Um terreno retangular tem lados medindo 9 m e 12 m. Qual é o comprimento da diagonal desse terreno? Use o Teorema de Pitágoras: $\\sqrt{9^2 + 12^2}$",
    alternativas: { A: "13 m", B: "14 m", C: "15 m", D: "16 m", E: "21 m" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: A diagonal é a hipotenusa do triângulo retângulo formado pelos dois lados. $$d = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15 \\text{ m}$$\n\nO trio (9, 12, 15) é um múltiplo da terna pitagórica (3, 4, 5) — basta multiplicar por 3!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    // Q10 — CORRIGIDO: gabarito era "E", correto é "B" (25/4)
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.0, param_c: 0.2,
    enunciado: "Resolva a expressão numérica: $$\\frac{3^3 - \\sqrt{49}}{2^2} + \\frac{5}{4}$$",
    alternativas: { A: "$6$", B: "$\\frac{25}{4}$", C: "$7$", D: "$\\frac{21}{4}$", E: "$5$" },
    gabarito: "B",
    comentario_resolucao: "Passo 1: Calcular potências e raiz. $$3^3 = 27 \\quad ; \\quad \\sqrt{49} = 7 \\quad ; \\quad 2^2 = 4$$\n\nPasso 2: Substituir. $$\\frac{27 - 7}{4} + \\frac{5}{4} = \\frac{20}{4} + \\frac{5}{4}$$\n\nPasso 3: Somar frações de mesmo denominador. $$\\frac{20 + 5}{4} = \\frac{25}{4}$$\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: 0.1, param_c: 0.2,
    enunciado: "Calcule a área de um losango cujas diagonais medem 16 cm e 10 cm.",
    alternativas: { A: "160 cm²", B: "52 cm²", C: "80 cm²", D: "40 cm²", E: "100 cm²" },
    gabarito: "C",
    comentario_resolucao: "Passo 1: Fórmula da área do losango. $$A = \\frac{D \\cdot d}{2}$$\n\nPasso 2: Substituir. $$A = \\frac{16 \\times 10}{2} = \\frac{160}{2} = 80 \\text{ cm}^2$$\n\nErro comum: esquecer de dividir por 2 → 160 cm² (alternativa A).\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.3, param_c: 0.2,
    enunciado: "Um carro percorre 360 km consumindo 30 litros de combustível. Mantendo o mesmo consumo, quantos litros serão necessários para percorrer 480 km?",
    alternativas: { A: "35 litros", B: "38 litros", C: "40 litros", D: "42 litros", E: "45 litros" },
    gabarito: "C",
    comentario_resolucao: "Distância e consumo são diretamente proporcionais.\n\n$$\\frac{30}{360} = \\frac{x}{480} \\Rightarrow x = \\frac{30 \\times 480}{360} = 40 \\text{ litros}$$\n\nVerificação: o carro faz $\\frac{360}{30} = 12$ km/litro. Para 480 km: $\\frac{480}{12} = 40$ litros. ✓\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.2, param_c: 0.2,
    enunciado: "Dada a função $f(x) = -2x + 10$, determine o valor de $f(3)$.",
    alternativas: { A: "16", B: "8", C: "4", D: "14", E: "-4" },
    gabarito: "C",
    comentario_resolucao: "Substituir $x = 3$: $$f(3) = -2 \\cdot 3 + 10 = -6 + 10 = 4$$\n\nErro comum: esquecer o sinal negativo → $2 \\cdot 3 + 10 = 16$ (alternativa A).\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau"],
    nivel_dificuldade: "Média",
    param_a: 1.4, param_b: 0.4, param_c: 0.2,
    enunciado: "Uma função do primeiro grau é definida por $g(x) = 5x - 15$. Determine o valor de $x$ para o qual $g(x) = 0$ (zero da função).",
    alternativas: { A: "$x = 5$", B: "$x = -3$", C: "$x = 15$", D: "$x = 3$", E: "$x = -5$" },
    gabarito: "D",
    comentario_resolucao: "Resolver $5x - 15 = 0$: $$5x = 15 \\Rightarrow x = 3$$\n\nVerificação: $g(3) = 5 \\cdot 3 - 15 = 0$. ✓\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },

  // ── FAIXA 3: Difíceis (param_b > 0.5) ────────────────────────────────────────
  {
    // Q15 — CORRIGIDO: gabarito era "D", resolução dizia "A"; alternativas ajustadas para bater com o cálculo correto
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 0.8, param_c: 0.2,
    enunciado: "Uma empresa de jardinagem foi contratada para graminizar um campo de futebol society. O campo tem formato retangular com 60 m de comprimento e 40 m de largura. No centro do campo há uma área circular com raio de 5 m que não será graminizada. O custo da grama é de R$ 18,00 por m². Considerando $\\pi \\approx 3{,}14$, qual é o custo total da graminização?",
    alternativas: {
      A: "R$ 41.787,00",
      B: "R$ 43.200,00",
      C: "R$ 40.212,00",
      D: "R$ 42.390,00",
      E: "R$ 38.826,00",
    },
    gabarito: "A",
    comentario_resolucao: "Passo 1: Área total do campo retangular. $$A_{campo} = 60 \\times 40 = 2400 \\text{ m}^2$$\n\nPasso 2: Área da área circular (não graminizada). $$A_{circ} = \\pi r^2 = 3{,}14 \\times 25 = 78{,}5 \\text{ m}^2$$\n\nPasso 3: Área efetiva de graminização. $$A_{grama} = 2400 - 78{,}5 = 2321{,}5 \\text{ m}^2$$\n\nPasso 4: Custo total. $$2321{,}5 \\times 18 = 41.787{,}00 \\text{ reais}$$\n\nErro comum: usar a área total sem descontar o círculo → $2400 \\times 18 = 43.200{,}00$ (alternativa B).\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Razão, Proporção e Regra de Três", "Porcentagem"],
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Quatro amigos investiram juntos em um negócio proporcionalmente às suas economias: Ana tem R$ 8.000,00, Bruno tem R$ 12.000,00, Carla tem R$ 16.000,00 e Daniel tem R$ 4.000,00. O lucro total do primeiro ano foi de R$ 60.000,00. Qual é o lucro de Carla?",
    alternativas: {
      A: "R$ 12.000,00",
      B: "R$ 20.000,00",
      C: "R$ 18.000,00",
      D: "R$ 24.000,00",
      E: "R$ 16.000,00",
    },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Total investido: $8000 + 12000 + 16000 + 4000 = 40000$ reais.\n\nPasso 2: Proporção simplificada (÷4000): $2:3:4:1$ → total de partes = $2+3+4+1 = 10$.\n\nPasso 3: Valor de cada parte: $\\frac{60000}{10} = 6000$ reais.\n\nPasso 4: Lucro de Carla (4 partes): $4 \\times 6000 = 24000$ reais.\n\nVerificação: $12000 + 18000 + 24000 + 6000 = 60000$. ✓\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função Quadrática"],
    nivel_dificuldade: "Alta",
    param_a: 1.7, param_b: 1.1, param_c: 0.2,
    enunciado: "O lucro mensal de uma pequena empresa, em milhares de reais, é modelado por $f(x) = -x^2 + 6x - 5$, onde $x$ representa o número de funcionários contratados ($x > 0$). Determine os zeros da função, ou seja, os valores de $x$ para os quais $f(x) = 0$.",
    alternativas: {
      A: "$x = 1$ e $x = 6$",
      B: "$x = -1$ e $x = 5$",
      C: "$x = 1$ e $x = 5$",
      D: "$x = 2$ e $x = 3$",
      E: "$x = -5$ e $x = -1$",
    },
    gabarito: "C",
    comentario_resolucao: "Resolver $-x^2 + 6x - 5 = 0$, multiplicando por $-1$: $$x^2 - 6x + 5 = 0$$\n\n$\\Delta = 36 - 20 = 16$.\n\n$$x = \\frac{6 \\pm 4}{2} \\Rightarrow x_1 = 5 \\quad \\text{e} \\quad x_2 = 1$$\n\nComo $x > 0$, ambos os valores fazem sentido. Entre $x=1$ e $x=5$ a empresa tem lucro positivo.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    // Q18 — CORRIGIDO: resultado real é 22/9; opção C ajustada de "10/3" para "22/9"
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: ["Operações Básicas"],
    nivel_dificuldade: "Alta",
    param_a: 1.7, param_b: 1.2, param_c: 0.2,
    enunciado: "Resolva a expressão e simplifique o resultado: $$\\frac{\\sqrt{64} + 2^3}{5^2 - 4^2} + \\frac{2}{3}$$",
    alternativas: {
      A: "$\\frac{8}{3}$",
      B: "$3$",
      C: "$\\frac{22}{9}$",
      D: "$\\frac{7}{3}$",
      E: "$4$",
    },
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular raiz e potências. $$\\sqrt{64} = 8 \\quad ; \\quad 2^3 = 8 \\quad ; \\quad 5^2 = 25 \\quad ; \\quad 4^2 = 16$$\n\nPasso 2: Substituir. $$\\frac{8 + 8}{25 - 16} + \\frac{2}{3} = \\frac{16}{9} + \\frac{2}{3}$$\n\nPasso 3: Somar com denominador comum (MMC = 9). $$\\frac{16}{9} + \\frac{6}{9} = \\frac{22}{9}$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    // Q19 — CORRIGIDO: alternativas ajustadas para o cálculo correto (R$ 63.604,40)
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: ["Áreas de Figuras Planas"],
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.8, param_c: 0.2,
    enunciado: "Um arquiteto projetou uma praça pública em formato de trapézio com bases de 30 m e 50 m e altura de 20 m. No interior, serão instalados dois canteiros circulares idênticos com raio de 4 m e um canteiro triangular com base de 10 m e altura de 6 m. O restante será pavimentado com granito a R$ 95,00/m². Considerando $\\pi \\approx 3{,}14$, qual é o custo total da pavimentação?",
    alternativas: {
      A: "R$ 63.604,40",
      B: "R$ 65.530,00",
      C: "R$ 68.400,00",
      D: "R$ 61.000,00",
      E: "R$ 59.280,00",
    },
    gabarito: "A",
    comentario_resolucao: "Passo 1: Área do trapézio. $$A_{trap} = \\frac{(50+30) \\times 20}{2} = 800 \\text{ m}^2$$\n\nPasso 2: Área dos dois canteiros circulares. $$A_{circ} = 2 \\times 3{,}14 \\times 4^2 = 2 \\times 50{,}24 = 100{,}48 \\text{ m}^2$$\n\nPasso 3: Área do canteiro triangular. $$A_{tri} = \\frac{10 \\times 6}{2} = 30 \\text{ m}^2$$\n\nPasso 4: Área total dos canteiros. $$100{,}48 + 30 = 130{,}48 \\text{ m}^2$$\n\nPasso 5: Área a pavimentar. $$800 - 130{,}48 = 669{,}52 \\text{ m}^2$$\n\nPasso 6: Custo total. $$669{,}52 \\times 95 = 63.604{,}40 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    // Q20 — CORRIGIDO: gabarito era "B" mas a análise conclui que os planos têm o mesmo custo → gabarito "D"
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Funções",
    tags: ["Função do Primeiro Grau", "Razão, Proporção e Regra de Três"],
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Uma empresa de internet oferece dois planos: o Plano A cobra taxa fixa de R$ 60,00/mês mais R$ 0,50 por GB excedente ao limite de 100 GB. O Plano B cobra taxa fixa de R$ 90,00/mês com GB ilimitado. Um cliente consome em média 160 GB/mês. Qual plano é mais vantajoso e qual é a economia semestral?",
    alternativas: {
      A: "Plano A é mais vantajoso com economia de R$ 60,00 no semestre",
      B: "Plano B é mais vantajoso com economia de R$ 60,00 no semestre",
      C: "Plano A é mais vantajoso com economia de R$ 30,00 no semestre",
      D: "Os planos têm o mesmo custo semestral",
      E: "Plano B é mais vantajoso com economia de R$ 120,00 no semestre",
    },
    gabarito: "D",
    comentario_resolucao: "Passo 1: Custo mensal do Plano A. O cliente excede em $160 - 100 = 60$ GB. $$C_A = 60 + 0{,}50 \\times 60 = 60 + 30 = 90 \\text{ reais/mês}$$\n\nPasso 2: Custo mensal do Plano B. $$C_B = 90 \\text{ reais/mês}$$\n\nPasso 3: Os custos mensais são iguais ($R\\$ 90{,}00$). Portanto, o custo semestral também é igual para os dois planos: $$6 \\times 90 = 540 \\text{ reais}$$\n\nEste é exatamente o ponto de equilíbrio entre os planos. Para consumo acima de 160 GB, o Plano B passa a ser vantajoso; abaixo disso, o Plano A é mais barato.\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
];

// =============================================================================
// Correção do Lote 1 — Q20 (app de corridas: valores não fechavam)
// Encontra a questão pelo início do enunciado e atualiza o texto e a resolução.
// =============================================================================

const BATCH1_Q20_FIX = {
  // Trecho único do enunciado original para localizar a questão
  enunciado_match: "Um aplicativo de corridas cobra uma taxa fixa de R$ 5,50",

  // Novos valores: taxa R$5,00 / R$2,50 por km / pagou R$30,00 / 50% a mais → irmão = 16 km (opção C)
  enunciado: "Um aplicativo de corridas cobra uma taxa fixa de R$ 5,00 por corrida, mais R$ 2,50 por quilômetro rodado. Uma passageira verificou que, após uma corrida, pagou R$ 30,00. Ao mesmo tempo, seu irmão realizou uma corrida que custou 50% a mais do que a dela. Quantos quilômetros o irmão percorreu em sua corrida?",

  comentario_resolucao: "Passo 1: Modelar o custo como função do primeiro grau. Seja $x$ o número de quilômetros. $$C(x) = 2{,}50x + 5{,}00$$\n\nPasso 2: Encontrar a distância da passageira. $$2{,}50x + 5{,}00 = 30{,}00 \\Rightarrow 2{,}50x = 25{,}00 \\Rightarrow x = 10 \\text{ km}$$\n\nPasso 3: Calcular o valor pago pelo irmão. $$30{,}00 \\times 1{,}50 = 45{,}00 \\text{ reais}$$\n\nPasso 4: Calcular a distância do irmão. $$2{,}50x + 5{,}00 = 45{,}00 \\Rightarrow 2{,}50x = 40{,}00 \\Rightarrow x = 16 \\text{ km}$$\n\nVerificação: $C(16) = 2{,}50 \\times 16 + 5{,}00 = 40{,}00 + 5{,}00 = 45{,}00$. ✓\n\nPortanto, o gabarito é a alternativa C.",
};

// =============================================================================
// Main
// =============================================================================

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("📋 Diagnóstico — Lote 2\n");
  console.log("Questões a inserir:");

  for (let i = 0; i < BATCH2.length; i++) {
    const q = BATCH2[i];
    const tier = q.param_b <= -0.5 ? "Fácil" : q.param_b <= 0.5 ? "Média" : "Difícil";
    console.log(`  [${tier}] Q${i + 1}: ${q.conteudo_principal} | param_b=${q.param_b} | gab=${q.gabarito} | ${q.nivel_dificuldade}`);
  }

  const easy = BATCH2.filter(q => q.param_b <= -0.5).length;
  const mid  = BATCH2.filter(q => q.param_b > -0.5 && q.param_b <= 0.5).length;
  const hard = BATCH2.filter(q => q.param_b > 0.5).length;
  console.log(`\n  Distribuição lote 2: ${easy} fáceis · ${mid} médias · ${hard} difíceis`);
  console.log("\nCorreção lote 1:");
  console.log("  Q20 (app de corridas): valores ajustados para fechar com gabarito C (16 km)");

  if (isDryRun) {
    console.log("\n🟡 Modo --dry-run: nada foi alterado.");
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("\n❌ DATABASE_URL não definida. Use: set DATABASE_URL=mysql://... && node seed-diagnostic-batch2.mjs");
    process.exit(1);
  }

  const db = await mysql.createConnection(dbUrl);

  // ── 1. Corrigir Q20 do lote 1 ──────────────────────────────────────────────
  console.log("\n🔧 Corrigindo Q20 do lote 1...");
  const [rows] = await db.execute(
    `SELECT id FROM questions WHERE enunciado LIKE ? AND JSON_CONTAINS(tags, '"diagnostico"') LIMIT 1`,
    [`%${BATCH1_Q20_FIX.enunciado_match}%`]
  );
  const found = Array.isArray(rows) ? rows : [];
  if (found.length > 0) {
    const id = found[0].id;
    await db.execute(
      `UPDATE questions SET enunciado = ?, comentario_resolucao = ? WHERE id = ?`,
      [BATCH1_Q20_FIX.enunciado, BATCH1_Q20_FIX.comentario_resolucao, id]
    );
    console.log(`  ✅ Q20 lote 1 corrigida (id=${id}).`);
  } else {
    console.warn("  ⚠️  Q20 lote 1 não encontrada no banco (já corrigida ou não inserida ainda).");
  }

  // ── 2. Inserir questões do lote 2 ──────────────────────────────────────────
  console.log("\n💾 Inserindo lote 2...\n");
  let inseridas = 0;
  let erros = 0;

  for (let i = 0; i < BATCH2.length; i++) {
    const q = BATCH2[i];
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
          q.fonte, q.ano, q.conteudo_principal,
          JSON.stringify(tags), q.nivel_dificuldade,
          q.param_a, q.param_b, q.param_c,
          q.enunciado.trim(), q.url_imagem ?? null,
          JSON.stringify(q.alternativas), q.gabarito.toUpperCase(),
          q.comentario_resolucao?.trim() ?? null, q.url_video ?? null,
        ]
      );
      console.log(`  ✅ Q${i + 1} inserida: ${q.conteudo_principal} | param_b=${q.param_b} | gab=${q.gabarito}`);
      inseridas++;
    } catch (err) {
      console.error(`  ❌ Q${i + 1} falhou: ${err.message}`);
      erros++;
    }
  }

  await db.end();
  console.log(`\n🎉 Lote 2: ${inseridas} inserida(s)${erros > 0 ? `, ${erros} erro(s)` : ""}.`);
  console.log(`   Pool diagnóstico total: ~40 questões (20 lote 1 + 20 lote 2).`);
}

main().catch(err => {
  console.error("❌ Erro fatal:", err.message);
  process.exit(1);
});
