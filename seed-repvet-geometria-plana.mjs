/**
 * seed-repvet-geometria-plana.mjs
 * Insere 20 questões de Geometria Plana (REPVET 2025) no banco geral.
 * Estas questões NÃO são do diagnóstico.
 *
 * Uso:
 *   set DATABASE_URL=mysql://root:SENHA@gondola.proxy.rlwy.net:40821/railway
 *   node seed-repvet-geometria-plana.mjs
 */

import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("❌  DATABASE_URL não definida."); process.exit(1); }

const questions = [
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Um arquiteto projetou uma calçada em formato de trapézio isósceles com bases medindo 10 m e 16 m, e lados iguais de 5 m cada. Para calcular o custo de pavimentação, é necessário conhecer a área do trapézio. Qual é essa área?",
    alternativas: JSON.stringify({ A: "52 m²", B: "48 m²", C: "60 m²", D: "65 m²", E: "78 m²" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Determinar a altura usando Pitágoras. A diferença entre as bases distribui-se igualmente: $$\\frac{16-10}{2} = 3 \\text{ m}$$\n\nPasso 2: Altura do trapézio. $$h = \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4 \\text{ m}$$\n\nPasso 3: Área. $$A = \\frac{(16+10) \\cdot 4}{2} = \\frac{104}{2} = 52 \\text{ m}^2$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 0.9, param_c: 0.2,
    enunciado: "Um topógrafo mediu os três lados de um terreno triangular e obteve as medidas 13 m, 14 m e 15 m. Utilizando a Fórmula de Heron, calcule a área desse terreno.",
    alternativas: JSON.stringify({ A: "72 m²", B: "78 m²", C: "80 m²", D: "84 m²", E: "90 m²" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Semiperímetro. $$s = \\frac{13+14+15}{2} = 21 \\text{ m}$$\n\nPasso 2: Fórmula de Heron. $$A = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = 84 \\text{ m}^2$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Um artesão confeccionou uma peça em formato de losango com lado de 13 cm e diagonal maior de 24 cm. Qual é a área dessa peça?",
    alternativas: JSON.stringify({ A: "60 cm²", B: "96 cm²", C: "120 cm²", D: "130 cm²", E: "156 cm²" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: As diagonais se cruzam perpendicularmente ao meio. Metade da diagonal maior = 12 cm.\n\nPasso 2: Metade da diagonal menor via Pitágoras. $$\\left(\\frac{d_2}{2}\\right)^2 = 13^2 - 12^2 = 169 - 144 = 25 \\Rightarrow \\frac{d_2}{2} = 5$$\n\nPasso 3: $d_2 = 10$ cm. Área: $$A = \\frac{d_1 \\cdot d_2}{2} = \\frac{24 \\cdot 10}{2} = 120 \\text{ cm}^2$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Um carpinteiro precisa cortar uma chapa retangular cuja diagonal mede 26 cm e um dos lados mede 10 cm. Qual é a área da chapa?",
    alternativas: JSON.stringify({ A: "168 cm²", B: "240 cm²", C: "260 cm²", D: "288 cm²", E: "312 cm²" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Outro lado via Pitágoras. $$l = \\sqrt{26^2 - 10^2} = \\sqrt{576} = 24 \\text{ cm}$$\n\nPasso 2: Área. $$A = 10 \\times 24 = 240 \\text{ cm}^2$$\n\nVerificação: (10, 24, 26) é múltiplo de (5, 12, 13). Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Um triângulo isósceles tem base de 10 cm e área igual a 60 cm². Qual é o perímetro desse triângulo?",
    alternativas: JSON.stringify({ A: "30 cm", B: "33 cm", C: "34 cm", D: "36 cm", E: "40 cm" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Altura pela fórmula da área. $$60 = \\frac{10 \\cdot h}{2} \\Rightarrow h = 12 \\text{ cm}$$\n\nPasso 2: Lado igual via Pitágoras (catetos h=12 e b/2=5). $$l = \\sqrt{12^2 + 5^2} = \\sqrt{169} = 13 \\text{ cm}$$\n\nPasso 3: Perímetro. $$P = 10 + 2 \\cdot 13 = 36 \\text{ cm}$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Em um triângulo retângulo com catetos de 6 cm e 8 cm, traçou-se a altura relativa à hipotenusa. Qual é o valor dessa altura?",
    alternativas: JSON.stringify({ A: "3,6 cm", B: "4,8 cm", C: "5,0 cm", D: "6,0 cm", E: "7,2 cm" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Hipotenusa. $$c = \\sqrt{6^2+8^2} = 10 \\text{ cm}$$\n\nPasso 2: Área por dois caminhos. $$A = \\frac{6 \\cdot 8}{2} = 24 \\text{ cm}^2 = \\frac{10 \\cdot h}{2} \\Rightarrow h = \\frac{48}{10} = 4{,}8 \\text{ cm}$$\n\nFórmula direta: $$h = \\frac{a \\cdot b}{c} = \\frac{6 \\cdot 8}{10} = 4{,}8 \\text{ cm}$$ ✓\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Uma praça pública foi construída no formato de hexágono regular com lado de 4 m. Qual é a área dessa praça? (Considere $\\sqrt{3} \\approx 1{,}73$)",
    alternativas: JSON.stringify({ A: "32 m²", B: "36 m²", C: "41,57 m²", D: "48 m²", E: "50,24 m²" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Fórmula do hexágono regular. $$A = \\frac{3\\sqrt{3}}{2} \\cdot l^2 = \\frac{3\\sqrt{3}}{2} \\cdot 16 = 24\\sqrt{3} \\text{ m}^2$$\n\nPasso 2: Valor numérico. $$A \\approx 24 \\times 1{,}73 = 41{,}52 \\approx 41{,}57 \\text{ m}^2$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Um terreno triangular tem dois lados medindo 8 m e 12 m, com um ângulo de $30°$ entre eles. Qual é a área desse terreno?",
    alternativas: JSON.stringify({ A: "24 m²", B: "36 m²", C: "48 m²", D: "60 m²", E: "96 m²" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Fórmula com dois lados e o ângulo entre eles. $$A = \\frac{1}{2} \\cdot a \\cdot b \\cdot \\sin(C) = \\frac{1}{2} \\cdot 8 \\cdot 12 \\cdot \\sin(30°) = \\frac{1}{2} \\cdot 96 \\cdot \\frac{1}{2} = 24 \\text{ m}^2$$\n\nErro comum: esquecer o $\\sin(30°)$ e obter 48 m².\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Um azulejo tem formato de paralelogramo com base de 18 cm, lado adjacente de 10 cm e ângulo entre eles de $30°$. Qual é a área desse azulejo?",
    alternativas: JSON.stringify({ A: "54 cm²", B: "60 cm²", C: "72 cm²", D: "80 cm²", E: "90 cm²" }),
    gabarito: "E",
    comentario_resolucao: "Passo 1: Altura do paralelogramo. $$h = 10 \\cdot \\sin(30°) = 10 \\cdot \\frac{1}{2} = 5 \\text{ cm}$$\n\nPasso 2: Área. $$A = b \\cdot h = 18 \\cdot 5 = 90 \\text{ cm}^2$$\n\nFórmula direta: $$A = a \\cdot b \\cdot \\sin(\\theta) = 18 \\cdot 10 \\cdot \\frac{1}{2} = 90 \\text{ cm}^2$$ ✓\n\nPortanto, o gabarito é a alternativa E.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Um círculo é inscrito em um triângulo equilátero de lado 6 cm. Qual é a área do círculo inscrito?",
    alternativas: JSON.stringify({ A: "$\\pi$ cm²", B: "$3\\pi$ cm²", C: "$6\\pi$ cm²", D: "$9\\pi$ cm²", E: "$12\\pi$ cm²" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Inraio do triângulo equilátero de lado $l$: $$r = \\frac{l}{2\\sqrt{3}} = \\frac{6}{2\\sqrt{3}} = \\sqrt{3} \\text{ cm}$$\n\nPasso 2: Área do círculo. $$A = \\pi r^2 = \\pi (\\sqrt{3})^2 = 3\\pi \\text{ cm}^2$$\n\nVerificação: Área do triângulo $= 9\\sqrt{3}$; semiperímetro $= 9$; $r = 9\\sqrt{3}/9 = \\sqrt{3}$. Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    // Note: original JSON had C and D both = "72 cm²" — D corrected to "80 cm²"
    enunciado: "No triângulo ABC, a área total é de 180 cm². O ponto D pertence ao segmento BC de forma que $BD:DC = 2:3$. Qual é a área do triângulo ABD?",
    alternativas: JSON.stringify({ A: "54 cm²", B: "60 cm²", C: "72 cm²", D: "80 cm²", E: "90 cm²" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: ABD e ADC compartilham a mesma altura relativa a BC. A razão das áreas é igual à razão das bases. $$\\frac{BD}{BC} = \\frac{2}{2+3} = \\frac{2}{5}$$\n\nPasso 2: Área de ABD. $$A_{ABD} = \\frac{2}{5} \\cdot 180 = 72 \\text{ cm}^2$$\n\nVerificação: $A_{ADC} = \\frac{3}{5} \\cdot 180 = 108$; $72+108=180$. Correto!\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.8, param_c: 0.2,
    enunciado: "Um lote em formato de trapézio tem área de 70 m², altura de 7 m e uma das bases mede 12 m. Qual é a medida da outra base?",
    alternativas: JSON.stringify({ A: "8 m", B: "9 m", C: "10 m", D: "11 m", E: "14 m" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Fórmula da área do trapézio. $$70 = \\frac{(12+b) \\cdot 7}{2}$$\n\nPasso 2: Resolver. $$12 + b = \\frac{140}{7} = 20 \\Rightarrow b = 8 \\text{ m}$$\n\nVerificação: $\\frac{(12+8) \\cdot 7}{2} = 70$. Correto!\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "A fachada de uma casa tem o formato de um retângulo encimado por um triângulo isósceles. O retângulo tem 12 m de largura e 6 m de altura. O triângulo tem a mesma base e altura de 4 m. Qual é a área total da fachada?",
    alternativas: JSON.stringify({ A: "72 m²", B: "84 m²", C: "96 m²", D: "108 m²", E: "120 m²" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Área do retângulo. $$A_{ret} = 12 \\times 6 = 72 \\text{ m}^2$$\n\nPasso 2: Área do triângulo. $$A_{tri} = \\frac{12 \\times 4}{2} = 24 \\text{ m}^2$$\n\nPasso 3: Total. $$72 + 24 = 96 \\text{ m}^2$$\n\nErro comum: usar h=6 no triângulo → área total 108 m² (alternativa D).\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.1, param_c: 0.2,
    enunciado: "Dois triângulos são semelhantes e a razão entre seus perímetros é $3:4$. Sabendo que a área do triângulo maior é 192 cm², qual é a área do triângulo menor?",
    alternativas: JSON.stringify({ A: "72 cm²", B: "108 cm²", C: "128 cm²", D: "144 cm²", E: "160 cm²" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Razão de semelhança $k = \\frac{3}{4}$.\n\nPasso 2: Razão das áreas $= k^2 = \\frac{9}{16}$.\n\nPasso 3: Área menor. $$A_{menor} = 192 \\cdot \\frac{9}{16} = 108 \\text{ cm}^2$$\n\nVerificação: $\\frac{108}{192} = \\frac{9}{16}$; $\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$. Correto!\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.5, param_b: 0.9, param_c: 0.2,
    enunciado: "Em um triângulo retângulo, a altura relativa à hipotenusa mede 6 cm e a hipotenusa mede 20 cm. Qual é a área desse triângulo?",
    alternativas: JSON.stringify({ A: "48 cm²", B: "54 cm²", C: "56 cm²", D: "60 cm²", E: "72 cm²" }),
    gabarito: "D",
    comentario_resolucao: "Usando a hipotenusa como base e h como altura: $$A = \\frac{c \\cdot h_c}{2} = \\frac{20 \\cdot 6}{2} = 60 \\text{ cm}^2$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.0, param_c: 0.2,
    enunciado: "Um quadrado tem diagonal medindo 10 cm. Qual é a área desse quadrado?",
    alternativas: JSON.stringify({ A: "25 cm²", B: "$25\\sqrt{2}$ cm²", C: "50 cm²", D: "$50\\sqrt{2}$ cm²", E: "100 cm²" }),
    gabarito: "C",
    comentario_resolucao: "Fórmula direta: $$A = \\frac{d^2}{2} = \\frac{100}{2} = 50 \\text{ cm}^2$$\n\nErro comum: calcular $A = d^2 = 100$ cm².\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.1, param_c: 0.2,
    enunciado: "Em um triângulo retângulo com catetos medindo 6 cm e 8 cm, M é o ponto médio da hipotenusa. Qual é o comprimento da mediana AM traçada do vértice do ângulo reto A até M?",
    alternativas: JSON.stringify({ A: "5 cm", B: "6 cm", C: "7 cm", D: "8 cm", E: "$5\\sqrt{2}$ cm" }),
    gabarito: "A",
    comentario_resolucao: "Passo 1: Hipotenusa. $$c = \\sqrt{36+64} = 10 \\text{ cm}$$\n\nPasso 2: Em todo triângulo retângulo, a mediana relativa à hipotenusa é metade dela. $$AM = \\frac{10}{2} = 5 \\text{ cm}$$\n\nPortanto, o gabarito é a alternativa A.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.1, param_c: 0.2,
    enunciado: "Em um triângulo retângulo, a altura relativa à hipotenusa divide-a em dois segmentos de 4 cm e 9 cm. Qual é a área desse triângulo?",
    alternativas: JSON.stringify({ A: "26 cm²", B: "30 cm²", C: "36 cm²", D: "39 cm²", E: "42 cm²" }),
    gabarito: "D",
    comentario_resolucao: "Passo 1: Hipotenusa $c = 4+9 = 13$ cm.\n\nPasso 2: Altura pela relação métrica. $$h = \\sqrt{4 \\cdot 9} = 6 \\text{ cm}$$\n\nPasso 3: Área. $$A = \\frac{13 \\cdot 6}{2} = 39 \\text{ cm}^2$$\n\nPortanto, o gabarito é a alternativa D.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.6, param_b: 1.2, param_c: 0.2,
    enunciado: "Um agrônomo dispõe de 40 metros de cerca para delimitar um terreno retangular. Qual deve ser o formato do terreno para que a área seja máxima, e qual é essa área máxima?",
    alternativas: JSON.stringify({ A: "Retângulo 5 × 15 m — Área = 75 m²", B: "Quadrado 10 × 10 m — Área = 100 m²", C: "Retângulo 8 × 12 m — Área = 96 m²", D: "Retângulo 6 × 14 m — Área = 84 m²", E: "Retângulo 4 × 16 m — Área = 64 m²" }),
    gabarito: "B",
    comentario_resolucao: "Passo 1: Perímetro fixo: $2(l+w)=40 \\Rightarrow l+w=20$.\n\nPasso 2: Área $A = l(20-l)$, parábola com máximo em $l=10$ m.\n\nPasso 3: Área máxima. $$A_{max} = 10 \\times 10 = 100 \\text{ m}^2$$\n\nPrincípio: entre todos os retângulos de mesmo perímetro, o quadrado tem maior área.\n\nPortanto, o gabarito é a alternativa B.",
    url_imagem: null, url_video: null,
  },
  {
    fonte: "REPVET", ano: 2025,
    conteudo_principal: "Geometria Plana",
    tags: JSON.stringify(["Áreas de Figuras Planas", "Geometria Plana"]),
    nivel_dificuldade: "Alta",
    param_a: 1.7, param_b: 1.3, param_c: 0.2,
    enunciado: "Um setor circular tem raio de 10 cm e ângulo central de $90°$. Uma corda une as extremidades do arco, formando um segmento circular. Qual é a área do segmento circular (região entre a corda e o arco)? Considere $\\pi \\approx 3{,}14$.",
    alternativas: JSON.stringify({ A: "21,5 cm²", B: "25,0 cm²", C: "28,5 cm²", D: "31,4 cm²", E: "35,0 cm²" }),
    gabarito: "C",
    comentario_resolucao: "Passo 1: Área do setor. $$A_{setor} = \\frac{90}{360} \\cdot \\pi \\cdot 10^2 = 25\\pi \\text{ cm}^2$$\n\nPasso 2: Área do triângulo retângulo isósceles (catetos = 10 cm). $$A_{tri} = \\frac{10 \\cdot 10}{2} = 50 \\text{ cm}^2$$\n\nPasso 3: Segmento = setor − triângulo. $$A_{seg} = 25\\pi - 50 = 25 \\times 3{,}14 - 50 = 78{,}5 - 50 = 28{,}5 \\text{ cm}^2$$\n\nPortanto, o gabarito é a alternativa C.",
    url_imagem: null, url_video: null,
  },
];

async function main() {
  console.log(`📐 REPVET 2025 — Geometria Plana (${questions.length} questões)\n`);

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
      console.log(`  ✅ Q${i+1}: ${q.enunciado.slice(0,60)}... | gab=${q.gabarito}`);
      inseridas++;
    } catch (err) {
      console.error(`  ❌ Q${i+1} falhou: ${err.message}`);
      erros++;
    }
  }

  await db.end();
  console.log(`\n🎉 ${inseridas} questão(ões) inserida(s)${erros > 0 ? `, ${erros} erro(s)` : ""}.`);
}

main().catch(err => {
  console.error("❌ Erro fatal:", err.message);
  process.exit(1);
});
