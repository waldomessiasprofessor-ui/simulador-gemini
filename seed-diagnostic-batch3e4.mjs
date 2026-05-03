/**
 * seed-diagnostic-batch3e4.mjs
 * Insere 40 questões no pool diagnóstico (Lotes 3 e 4).
 *
 * Lote 3 (10 questões): Matemática Básica — 0 fáceis · 5 médias · 5 difíceis
 * Lote 4 (20 questões): Matemática Básica — 0 fáceis · 0 médias · 20 difíceis
 *
 * Uso:
 *   set DATABASE_URL=mysql://root:SENHA@gondola.proxy.rlwy.net:40821/railway
 *   node seed-diagnostic-batch3e4.mjs
 */

import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("❌  DATABASE_URL não definida."); process.exit(1); }

const questions = [

  // ── LOTE 3 ───────────────────────────────────────────────────────────────────

  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Média",
    param_a: 1.3, param_b: -0.3, param_c: 0.2,
    enunciado: "Um supermercado vendeu, em uma semana, 240 kg de arroz, 180 kg de feijão e 60 kg de macarrão. Qual é a razão entre a quantidade de feijão vendida e o total de produtos vendidos nessa semana?",
    alternativas: JSON.stringify({ A: "$\\frac{1}{3}$", B: "$\\frac{2}{5}$", C: "$\\frac{3}{8}$", D: "$\\frac{1}{4}$", E: "$\\frac{3}{5}$" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Calcular o total de produtos vendidos. $$240 + 180 + 60 = 480 \\text{ kg}$$\n\nPasso 2: Montar a razão entre feijão e total. $$\\frac{180}{480}$$\n\nPasso 3: Simplificar dividindo pelo MDC(180, 480) = 60. $$\\frac{180 \\div 60}{480 \\div 60} = \\frac{3}{8}$$\n\nVerificação: $3 \\times 60 = 180$ e $8 \\times 60 = 480$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
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
    comentario_resolucao: "Passo 1: Resolver cada operação separadamente. $$\\frac{120}{8} = 15 \\quad ; \\quad \\frac{45}{9} = 5 \\quad ; \\quad 2^3 = 8$$\n\nPasso 2: Substituir e calcular da esquerda para a direita. $$15 - 5 + 8 = 10 + 8 = 18$$\n\nErro comum: calcular $15 - (5 + 8) = 2$, agrupando indevidamente.\n\nPortanto, o gabarito é a alternativa C.",
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
    comentario_resolucao: "Passo 1: Calcular o número de crianças e adolescentes. $$\\frac{3}{8} \\cdot 48000 = 18000$$\n\nPasso 2: Calcular o restante. $$48000 - 18000 = 30000$$\n\nVerificação: $\\frac{5}{8} \\cdot 48000 = 30000$. Correto!\n\nPortanto, o gabarito é a alternativa D.",
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
    comentario_resolucao: "Passo 1: Somar as frações percorridas. MMC(5, 3) = 15. $$\\frac{2}{5} + \\frac{1}{3} = \\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15}$$\n\nPasso 2: Calcular a fração restante. $$1 - \\frac{11}{15} = \\frac{4}{15}$$\n\nVerificação: $\\frac{6}{15} + \\frac{5}{15} + \\frac{4}{15} = 1$. Correto!\n\nPortanto, o gabarito é a alternativa A.",
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
    comentario_resolucao: "Passo 1: Produção por hora. $$A: \\frac{360}{6} = 60 \\text{ peças/h} \\quad ; \\quad B: \\frac{400}{8} = 50 \\text{ peças/h}$$\n\nPasso 2: Produção conjunta por hora. $$60 + 50 = 110 \\text{ peças/h}$$\n\nPasso 3: Total em 5 horas. $$110 \\times 5 = 550 \\text{ peças}$$\n\nPortanto, o gabarito é a alternativa A.",
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
    comentario_resolucao: "Passo 1: Custo por item. $$\\frac{4800}{120} = 40 \\text{ reais}$$\n\nPasso 2: Preço de venda (+40%). $$40 \\times 1{,}40 = 56 \\text{ reais}$$\n\nPasso 3: Quantidades. $$90 \\text{ itens ao preço cheio} \\quad ; \\quad 30 \\text{ itens com desconto}$$\n\nPasso 4: Preço com desconto de 20%. $$56 \\times 0{,}80 = 44{,}80 \\text{ reais}$$\n\nPasso 5: Receita e lucro. $$90 \\times 56 + 30 \\times 44{,}80 = 5040 + 1344 = 6384$$ $$\\text{Lucro} = 6384 - 4800 = 1584 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa C.",
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
    comentario_resolucao: "Passo 1: Taxa por hora. $$A: \\frac{1}{4} \\quad ; \\quad B: \\frac{1}{6} \\quad ; \\quad C: \\frac{1}{12}$$\n\nPasso 2: Juntas em 1 hora. $$\\frac{3+2+1}{12} = \\frac{6}{12} = \\frac{1}{2}$$\n\nPasso 3: Restam $\\frac{1}{2}$ com A e C. $$A+C = \\frac{1}{4}+\\frac{1}{12} = \\frac{4}{12} = \\frac{1}{3} \\text{ por hora}$$\n\nPasso 4: Tempo para a metade restante. $$t = \\frac{1/2}{1/3} = \\frac{3}{2} = 1{,}5 \\text{ h}$$\n\nPasso 5: Total. $$1 + 1{,}5 = 2{,}5 = 2\\frac{1}{2} \\text{ horas}$$\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três", "Porcentagem"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Três agricultores colheram juntos 4.800 kg de soja na proporção 3:5:4, respectivamente. O preço de venda foi de R$ 2,00 por kg. O agricultor com maior cota pagou 10% do valor recebido como taxa de cooperativa. Qual foi o valor líquido recebido por esse agricultor?",
    alternativas: JSON.stringify({ A: "R$ 3.200,00", B: "R$ 3.400,00", C: "R$ 3.500,00", D: "R$ 3.600,00", E: "R$ 4.000,00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Total de partes: $3+5+4=12$. Maior cota (5 partes): $$\\frac{5}{12} \\times 4800 = 2000 \\text{ kg}$$\n\nPasso 2: Valor bruto. $$2000 \\times 2{,}00 = 4000 \\text{ reais}$$\n\nPasso 3: Líquido após 10% de taxa. $$4000 \\times 0{,}90 = 3600 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Porcentagem", "Matemática Financeira"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.9, param_c: 0.2,
    enunciado: "Uma loja aplica dois descontos sucessivos: primeiro 10% e, sobre o valor resultante, mais 25%. O preço original é R$ 2.000,00. Uma cliente acredita que o desconto total equivale a 35% do preço original. Ela está certa? Qual é o preço final?",
    alternativas: JSON.stringify({ A: "R$ 1.200,00 — a cliente está certa", B: "R$ 1.350,00 — a cliente está errada", C: "R$ 1.400,00 — a cliente está certa", D: "R$ 1.440,00 — a cliente está errada", E: "R$ 1.500,00 — a cliente está errada" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Aplicar os descontos sucessivos. $$2000 \\times 0{,}90 \\times 0{,}75 = 1350 \\text{ reais}$$\n\nPasso 2: Calcular o desconto equivalente. $$\\frac{650}{2000} \\times 100 = 32{,}5\\%$$\n\nO desconto real é 32,5%, não 35%. A cliente está errada.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.1, param_c: 0.2,
    enunciado: "Um número inteiro positivo $n$ satisfaz simultaneamente: ao ser dividido por 4, o resto é 3; ao ser dividido por 5, o resto é 2; ao ser dividido por 6, o resto é 1. Qual é o menor número inteiro positivo que satisfaz todas essas condições?",
    alternativas: JSON.stringify({ A: "7", B: "11", C: "17", D: "23", E: "37" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Listar candidatos da 1ª condição ($4k+3$): 3, 7, 11, 15...\n\nPasso 2: Verificar $n=7$ na 2ª condição. $$7 \\div 5 = 1 \\text{ resto } 2 \\checkmark$$\n\nPasso 3: Verificar $n=7$ na 3ª condição. $$7 \\div 6 = 1 \\text{ resto } 1 \\checkmark$$\n\nTodas as três condições satisfeitas!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },

  // ── LOTE 4 ───────────────────────────────────────────────────────────────────

  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.7, param_c: 0.2,
    enunciado: "Um reservatório estava com $\\frac{3}{4}$ de sua capacidade total. Após receber 120 litros de água, passou a estar com $\\frac{9}{10}$ de sua capacidade. Qual é a capacidade total do reservatório, em litros?",
    alternativas: JSON.stringify({ A: "600 litros", B: "800 litros", C: "960 litros", D: "1.000 litros", E: "1.200 litros" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Calcular a diferença de nível causada pelos 120 litros. $$\\frac{9}{10} - \\frac{3}{4} = \\frac{18}{20} - \\frac{15}{20} = \\frac{3}{20}$$\n\nPasso 2: Os 120 litros correspondem a $\\frac{3}{20}$ da capacidade $C$. $$\\frac{3}{20} \\cdot C = 120 \\Rightarrow C = 120 \\cdot \\frac{20}{3} = 800 \\text{ litros}$$\n\nVerificação: $\\frac{3}{4} \\times 800 = 600$; $600 + 120 = 720$; $\\frac{720}{800} = \\frac{9}{10}$. Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Os números de três páginas consecutivas e pares de um livro somam 78. Qual é o número da maior dessas páginas?",
    alternativas: JSON.stringify({ A: "24", B: "26", C: "28", D: "30", E: "32" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Representar os três pares consecutivos. Seja $n$ o menor. Os três são $n$, $n+2$, $n+4$.\n\nPasso 2: Equação da soma. $$n + (n+2) + (n+4) = 78 \\Rightarrow 3n + 6 = 78 \\Rightarrow n = 24$$\n\nPasso 3: Os números são 24, 26, 28. A maior página é 28.\n\nVerificação: $24+26+28=78$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Hoje, Maria tem o triplo da idade de Carlos. Daqui a 10 anos, Maria terá o dobro da idade de Carlos. Quantos anos tem Maria hoje?",
    alternativas: JSON.stringify({ A: "20 anos", B: "25 anos", C: "28 anos", D: "30 anos", E: "36 anos" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Seja $C$ a idade atual de Carlos. Maria tem $3C$.\n\nPasso 2: Daqui a 10 anos. $$3C + 10 = 2(C + 10) \\Rightarrow C = 10 \\text{ anos}$$\n\nPasso 3: Maria hoje. $$M = 3 \\times 10 = 30 \\text{ anos}$$\n\nVerificação: Daqui a 10 anos: Maria=40, Carlos=20, razão=2. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 0.9, param_c: 0.2,
    enunciado: "O pedreiro A conclui uma obra sozinho em 8 dias. O pedreiro B conclui a mesma obra sozinho em 12 dias. Eles trabalham juntos por 3 dias e então A precisa se ausentar. Quantos dias B ainda levará para terminar a obra sozinho?",
    alternativas: JSON.stringify({ A: "$4{,}5$ dias", B: "$5$ dias", C: "$6$ dias", D: "$4$ dias", E: "$3$ dias" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Taxa diária. $$A: \\frac{1}{8} \\quad ; \\quad B: \\frac{1}{12}$$\n\nPasso 2: O que os dois fazem em 3 dias. $$3 \\cdot \\left(\\frac{1}{8} + \\frac{1}{12}\\right) = 3 \\cdot \\frac{5}{24} = \\frac{5}{8}$$\n\nPasso 3: Fração restante. $$1 - \\frac{5}{8} = \\frac{3}{8}$$\n\nPasso 4: Tempo de B para terminar. $$t = \\frac{3/8}{1/12} = \\frac{3}{8} \\times 12 = 4{,}5 \\text{ dias}$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Porcentagem"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "O preço de um produto foi aumentado em 20% em janeiro. Em fevereiro, o novo preço sofreu uma redução de 15%. Em relação ao preço original de janeiro, o produto ficou mais caro ou mais barato? Qual foi a variação percentual líquida?",
    alternativas: JSON.stringify({ A: "Aumentou 5%", B: "Diminuiu 5%", C: "Aumentou 2%", D: "Não houve variação", E: "Diminuiu 2%" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Fator combinado. $$1{,}20 \\times 0{,}85 = 1{,}02$$\n\nPasso 2: Fator $1{,}02$ representa aumento líquido de $2\\%$.\n\nVerificação: Preço = R$100 → +20% = R$120 → -15% = R$102. Variação: +2%. Correto!\n\nErro comum: calcular $20\\% - 15\\% = 5\\%$ diretamente.\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Um químico possui 30 litros de uma solução com 40% de álcool. Quantos litros de álcool puro ele deve acrescentar para que a nova solução tenha 50% de álcool?",
    alternativas: JSON.stringify({ A: "4 litros", B: "6 litros", C: "8 litros", D: "10 litros", E: "12 litros" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Álcool inicial. $$0{,}40 \\times 30 = 12 \\text{ litros}$$\n\nPasso 2: Equação para 50%. Seja $x$ os litros adicionados. $$\\frac{12 + x}{30 + x} = 0{,}50 \\Rightarrow 12 + x = 15 + 0{,}5x \\Rightarrow x = 6$$\n\nVerificação: $\\frac{18}{36} = 0{,}50$. Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Duas cidades estão separadas por 400 km. Dois carros partem simultaneamente das cidades em direção um ao outro. O carro A viaja a 60 km/h e o carro B a 40 km/h. Partiram às 8h00. A que horas os dois carros se encontrarão?",
    alternativas: JSON.stringify({ A: "11h00", B: "11h30", C: "12h30", D: "12h00", E: "13h00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Velocidade de aproximação. $$60 + 40 = 100 \\text{ km/h}$$\n\nPasso 2: Tempo até o encontro. $$t = \\frac{400}{100} = 4 \\text{ horas}$$\n\nPasso 3: Horário. $$8\\text{h}00 + 4\\text{h} = 12\\text{h}00$$\n\nVerificação: A percorre 240 km; B percorre 160 km; total = 400 km. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Sequências"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.1, param_c: 0.2,
    enunciado: "Qual é o algarismo das unidades de $3^{2025}$?",
    alternativas: JSON.stringify({ A: "3", B: "7", C: "9", D: "1", E: "4" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Padrão das unidades de potências de 3. $$3^1=3,\\ 3^2=9,\\ 3^3=27,\\ 3^4=81,\\ 3^5=243\\ldots$$\n\nPasso 2: O ciclo é $3, 9, 7, 1$ — se repete a cada 4 termos.\n\nPasso 3: $2025 \\div 4 = 506$ com resto $1$. Resto 1 → 1º elemento do ciclo = 3.\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Um estudante gastou $\\frac{1}{3}$ de suas economias em livros, $\\frac{1}{4}$ em alimentação e $\\frac{1}{5}$ em transporte. O valor restante, de R$ 130,00, foi destinado ao lazer. Qual era o total de economias do estudante?",
    alternativas: JSON.stringify({ A: "R$ 400,00", B: "R$ 480,00", C: "R$ 520,00", D: "R$ 560,00", E: "R$ 600,00" }),
    gabarito: "E",
    comentario_resolucao: "Passo 1: Fração total gasta. MMC(3,4,5)=60. $$\\frac{1}{3}+\\frac{1}{4}+\\frac{1}{5} = \\frac{20+15+12}{60} = \\frac{47}{60}$$\n\nPasso 2: Fração para lazer. $$1 - \\frac{47}{60} = \\frac{13}{60}$$\n\nPasso 3: Equação. $$\\frac{13}{60} \\cdot E = 130 \\Rightarrow E = 130 \\cdot \\frac{60}{13} = 600 \\text{ reais}$$\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Probabilidade e Estatística",
    tags: JSON.stringify(["diagnostico", "Medidas de Tendência Central"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Em uma disciplina, as notas de um aluno foram 6,0, 7,5 e 8,0, com pesos 1, 2 e 3, respectivamente. Qual foi a média ponderada do aluno?",
    alternativas: JSON.stringify({ A: "7,0", B: "7,2", C: "7,5", D: "7,8", E: "8,0" }),
    gabarito: "C",
    comentario_resolucao: "Fórmula: $$\\bar{x} = \\frac{\\sum (x_i \\cdot p_i)}{\\sum p_i}$$\n\nNumerador: $$6{,}0 \\times 1 + 7{,}5 \\times 2 + 8{,}0 \\times 3 = 6 + 15 + 24 = 45$$\n\nDenominador: $$1 + 2 + 3 = 6$$\n\nMédia ponderada: $$\\frac{45}{6} = 7{,}5$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.7, param_c: 0.2,
    enunciado: "Um cano A enche um tanque em 3 horas. Um cano B esvazia o mesmo tanque em 5 horas. Os dois canos são abertos simultaneamente com o tanque vazio. Quanto tempo será necessário para encher o tanque completamente?",
    alternativas: JSON.stringify({ A: "5h00", B: "6h00", C: "6h30", D: "7h30", E: "8h00" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Taxa líquida. $$\\frac{1}{3} - \\frac{1}{5} = \\frac{5-3}{15} = \\frac{2}{15} \\text{ do tanque/hora}$$\n\nPasso 2: Tempo total. $$t = \\frac{1}{2/15} = \\frac{15}{2} = 7{,}5 \\text{ horas} = 7\\text{h}30\\text{min}$$\n\nVerificação: A coloca $\\frac{7{,}5}{3}=2{,}5$ tanques; B drena $\\frac{7{,}5}{5}=1{,}5$ tanques. Saldo: 1 tanque. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Porcentagem"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.8, param_c: 0.2,
    enunciado: "O preço de um produto foi aumentado em 25%. Para que o preço retorne exatamente ao valor original, qual deve ser o percentual de desconto aplicado sobre o novo preço?",
    alternativas: JSON.stringify({ A: "15%", B: "20%", C: "25%", D: "30%", E: "35%" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Novo preço. $$P_{novo} = P \\times 1{,}25$$\n\nPasso 2: Para voltar a $P$. $$1{,}25P \\times (1-d) = P \\Rightarrow 1-d = \\frac{1}{1{,}25} = 0{,}80 \\Rightarrow d = 20\\%$$\n\nVerificação: $1{,}25P \\times 0{,}80 = 1{,}00P$. Correto!\n\nErro comum: responder 25%, esquecendo que a base do desconto mudou.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 1.9, param_c: 0.2,
    enunciado: "A soma dos algarismos de um número de dois dígitos é 11. Se os algarismos forem invertidos, o novo número formado é 27 unidades maior que o original. Qual é o número original?",
    alternativas: JSON.stringify({ A: "29", B: "38", C: "47", D: "56", E: "74" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Seja $a$ o algarismo das dezenas e $b$ o das unidades. $$a + b = 11 \\quad (\\text{I})$$ $$(10b + a) - (10a + b) = 27 \\Rightarrow b - a = 3 \\quad (\\text{II})$$\n\nPasso 2: Resolver o sistema. Somando I e II: $2b=14 \\Rightarrow b=7$; $a=4$.\n\nPasso 3: Número original: $47$.\n\nVerificação: $4+7=11$; $74-47=27$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.8, param_c: 0.2,
    enunciado: "Um trem parte de uma estação a 90 km/h. Um carro parte da mesma estação, no mesmo sentido, 30 minutos depois, a 120 km/h. Quanto tempo após a partida do carro ele alcançará o trem?",
    alternativas: JSON.stringify({ A: "1h30min", B: "1h45min", C: "2h00", D: "2h15min", E: "2h30min" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Vantagem do trem quando o carro parte. $$90 \\times \\frac{1}{2} = 45 \\text{ km}$$\n\nPasso 2: Velocidade relativa (mesmo sentido). $$120 - 90 = 30 \\text{ km/h}$$\n\nPasso 3: Tempo para cobrir os 45 km. $$t = \\frac{45}{30} = 1{,}5 \\text{ h} = 1\\text{h}30\\text{min}$$\n\nVerificação: trem em 2h=180km; carro em 1,5h=180km. Posições iguais! Correto!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Progressão Aritmética", "Sequências"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.9, param_c: 0.2,
    enunciado: "Em uma progressão aritmética, o 3° termo é 11 e o 7° termo é 23. Qual é a soma dos 10 primeiros termos dessa progressão?",
    alternativas: JSON.stringify({ A: "150", B: "165", C: "170", D: "180", E: "185" }),
    gabarito: "E",
    comentario_resolucao: "Passo 1: Sistema de equações. $$a_1 + 2r = 11 \\quad ; \\quad a_1 + 6r = 23$$\n\nPasso 2: Subtraindo. $$4r = 12 \\Rightarrow r = 3 \\Rightarrow a_1 = 5$$\n\nPasso 3: Soma dos 10 primeiros termos. $$S_{10} = \\frac{10}{2}(2 \\times 5 + 9 \\times 3) = 5 \\times 37 = 185$$\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 2.0, param_c: 0.2,
    enunciado: "Três linhas de ônibus partem simultaneamente de um terminal. A linha A retorna a cada 24 minutos, a linha B a cada 36 minutos e a linha C a cada 48 minutos. Após quantos minutos as três linhas estarão no terminal ao mesmo tempo novamente?",
    alternativas: JSON.stringify({ A: "72 minutos", B: "96 minutos", C: "120 minutos", D: "144 minutos", E: "192 minutos" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Fatorar em primos. $$24 = 2^3 \\times 3 \\quad ; \\quad 36 = 2^2 \\times 3^2 \\quad ; \\quad 48 = 2^4 \\times 3$$\n\nPasso 2: MMC = maiores expoentes. $$\\text{MMC} = 2^4 \\times 3^2 = 16 \\times 9 = 144$$\n\nVerificação: $144 \\div 24 = 6$; $144 \\div 36 = 4$; $144 \\div 48 = 3$. Todas divisões exatas!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Porcentagem", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.8, param_b: 1.9, param_c: 0.2,
    enunciado: "Em 2022, uma empresa tinha 500 funcionários, dos quais 40% eram mulheres. Em 2023, ampliou para 600 funcionários, com 45% de mulheres. Quantas mulheres foram contratadas nesse período?",
    alternativas: JSON.stringify({ A: "50 mulheres", B: "70 mulheres", C: "80 mulheres", D: "90 mulheres", E: "100 mulheres" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Mulheres em 2022. $$0{,}40 \\times 500 = 200$$\n\nPasso 2: Mulheres em 2023. $$0{,}45 \\times 600 = 270$$\n\nPasso 3: Contratadas. $$270 - 200 = 70 \\text{ mulheres}$$\n\nErro comum: calcular $(45\\%-40\\%) \\times 500 = 25$ — ignora a mudança de base.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Um tanque estava com $\\frac{5}{8}$ de sua capacidade. Após retirar 120 litros, ficou com $\\frac{3}{8}$ da capacidade. Em seguida, adicionou-se água até atingir $\\frac{7}{8}$ da capacidade. Quantos litros foram adicionados nessa última etapa?",
    alternativas: JSON.stringify({ A: "120 litros", B: "180 litros", C: "240 litros", D: "300 litros", E: "360 litros" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Capacidade total. $$\\frac{5}{8} - \\frac{3}{8} = \\frac{2}{8} = \\frac{1}{4} \\text{ da capacidade} = 120 \\Rightarrow C = 480 \\text{ litros}$$\n\nPasso 2: Variação na última etapa. $$\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8} = \\frac{1}{2}$$\n\nPasso 3: Litros adicionados. $$\\frac{1}{2} \\times 480 = 240 \\text{ litros}$$\n\nVerificação: $180+240=420$; $\\frac{420}{480}=\\frac{7}{8}$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.1, param_c: 0.2,
    enunciado: "Um número inteiro $N$, quando dividido por 8, fornece quociente 15 e um certo resto $r$. Sabe-se ainda que, ao dividir $N$ por 12, o resto é 4. Qual é o valor de $N$?",
    alternativas: JSON.stringify({ A: "124", B: "128", C: "132", D: "136", E: "140" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: $N = 8 \\times 15 + r = 120 + r$, com $0 \\leq r < 8$.\n\nPasso 2: Segunda condição: $N \\equiv 4 \\pmod{12}$.\n\nPasso 3: $120 = 10 \\times 12$, então $120 \\equiv 0 \\pmod{12}$. Logo $r \\equiv 4 \\pmod{12}$.\n\nPasso 4: Como $0 \\leq r < 8$, a única solução é $r = 4$. $$N = 124$$\n\nVerificação: $124 \\div 8 = 15$ resto $4$ ✓; $124 \\div 12 = 10$ resto $4$ ✓.\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Matemática Básica",
    tags: JSON.stringify(["diagnostico", "Operações Básicas", "Razão, Proporção e Regra de Três"]),
    nivel_dificuldade: "Muito Alta",
    param_a: 1.9, param_b: 2.0, param_c: 0.2,
    enunciado: "Um comerciante comprou uma mistura de maçãs e laranjas, totalizando 100 kg e gastando R$ 210,00. O preço da maçã foi de R$ 2,50 por kg e o da laranja R$ 1,50 por kg. Quantos quilogramas de maçã o comerciante comprou?",
    alternativas: JSON.stringify({ A: "40 kg", B: "45 kg", C: "50 kg", D: "60 kg", E: "75 kg" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Sistema. $$m + l = 100 \\quad ; \\quad 2{,}5m + 1{,}5l = 210$$\n\nPasso 2: Substituindo $l = 100-m$. $$2{,}5m + 1{,}5(100-m) = 210 \\Rightarrow m = 60 \\text{ kg}$$\n\nVerificação: $2{,}5 \\times 60 + 1{,}5 \\times 40 = 150 + 60 = 210$. Correto!\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
];

async function main() {
  console.log(`📋 Diagnóstico — Lotes 3 e 4 (${questions.length} questões)\n`);

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
    const lote = i < 10 ? "L3" : "L4";
    const tier = q.param_b <= -0.5 ? "Fácil" : q.param_b <= 0.5 ? "Média" : "Difícil";
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
      console.log(`  ✅ [${lote}][${tier}] Q${i+1}: ${q.conteudo_principal} | param_b=${q.param_b} | gab=${q.gabarito}`);
      inseridas++;
    } catch (err) {
      console.error(`  ❌ Q${i+1} falhou: ${err.message}`);
      erros++;
    }
  }

  await db.end();
  console.log(`\n🎉 ${inseridas} questão(ões) inserida(s)${erros > 0 ? `, ${erros} erro(s)` : ""}.`);
  console.log(`   Pool diagnóstico total: ~70 questões (20 L1 + 20 L2 + 10 L3 + 20 L4).`);
}

main().catch(err => {
  console.error("❌ Erro fatal:", err.message);
  process.exit(1);
});
