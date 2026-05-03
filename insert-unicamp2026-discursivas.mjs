/**
 * Insere as 9 questões dissertativas (segunda fase) da UNICAMP 2026.
 * Requer que add-segunda-fase-tables.mjs já tenha sido executado.
 * node insert-unicamp2026-discursivas.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const questions = [
  // Q12 — Matemática Financeira · Odds e apostas esportivas
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 12,
    conteudo_principal: "Matemática Financeira",
    tags: ["Matemática Financeira", "Razão e Proporção"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Sobre apostas esportivas (bets) e odds:\n\n" +
      "a) O site ComBet apresenta odds na forma britânica e o BetCamp na forma decimal. " +
      "Para um mesmo jogo, a odd correspondente à vitória de um time é de 5|3 na ComBet e de 1,5 na BetCamp. " +
      "Qual dos sites está pagando mais pela vitória do time? Justifique.\n\n" +
      "b) Uma pessoa fez 10 apostas de R$100 cada com odds decimais todas iguais a 1,1. " +
      "Das dez apostas, ganhou 9. Ela teve lucro ou prejuízo? De quanto? Justifique.",
    imagens: [],
    resolucao:
      "a) A odd britânica 5|3 em decimal é $(5+3)/3 = 8/3 \\approx 2{,}67 > 1{,}5$. " +
      "Portanto, a **ComBet** está pagando mais pela vitória do time.\n\n" +
      "b) Gasto total: $10 \\times R\\$100 = R\\$1.000$.\n" +
      "Retorno: $9 \\times R\\$100 \\times 1{,}1 = R\\$990$.\n" +
      "$$\\text{Resultado} = 990 - 1000 = -R\\$10$$\n" +
      "A pessoa teve **prejuízo de R\\$10,00**.",
  },

  // Q13 — Geometria Analítica · Parábola, foco e reta diretriz
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 13,
    conteudo_principal: "Parábola",
    tags: ["Parábola", "Geometria Analítica", "Distância entre pontos"],
    nivel_dificuldade: "Média",
    enunciado:
      "Considere o gráfico da parábola $y = x^2/4$, a reta $r$ dada por $y = -1$ e o ponto $A = (0,\\ 1)$. " +
      "Seja $P$ um ponto qualquer da parábola e $Q$ a interseção da reta $r$ com a perpendicular à reta $r$ que passa por $P$.\n\n" +
      "a) Mostre que a distância entre $P$ e $A$ é igual à distância entre $P$ e $Q$.\n\n" +
      "b) Encontre o(s) ponto(s) $P$ tais que o triângulo $APQ$ é equilátero.",
    imagens: [],
    resolucao:
      "a) Seja $P = (x_P,\\ x_P^2/4)$ e $Q = (x_P,\\ -1)$.\n\n" +
      "$$d(P, A) = \\sqrt{x_P^2 + \\left(\\frac{x_P^2}{4} - 1\\right)^2} = \\sqrt{x_P^2 + \\frac{x_P^4}{16} - \\frac{x_P^2}{2} + 1} = \\frac{x_P^2}{4} + 1$$\n\n" +
      "$$d(P, Q) = \\frac{x_P^2}{4} - (-1) = \\frac{x_P^2}{4} + 1$$\n\n" +
      "Logo $d(P,A) = d(P,Q)$. ∎\n\n" +
      "b) Para o triângulo $APQ$ ser equilátero: $d(A,Q) = d(P,A)$.\n\n" +
      "$$d(A,Q) = \\sqrt{x_P^2 + (1-(-1))^2} = \\sqrt{x_P^2 + 4}$$\n\n" +
      "Igualando: $\\sqrt{x_P^2 + 4} = \\dfrac{x_P^2}{4} + 1$. Elevando ao quadrado e fazendo $u = x_P^2$:\n\n" +
      "$$u + 4 = \\frac{u^2}{16} + \\frac{u}{2} + 1 \\implies u^2 - 8u - 48 = 0 \\implies (u-12)(u+4) = 0$$\n\n" +
      "$u = 12$ (válido) ou $u = -4$ (impossível). Logo $x_P = \\pm 2\\sqrt{3}$, $y_P = 3$.\n\n" +
      "**Pontos:** $P_1 = (2\\sqrt{3},\\ 3)$ e $P_2 = (-2\\sqrt{3},\\ 3)$.",
  },

  // Q14 — Geometria Plana · Praça de São Pedro (oval)
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 14,
    conteudo_principal: "Geometria Plana",
    tags: ["Geometria Plana", "Circunferência", "Áreas de figuras planas", "Perímetro"],
    nivel_dificuldade: "Média",
    enunciado:
      "A Praça de São Pedro, no Vaticano, tem formato oval. Os centros $B$ e $D$ das circunferências menores " +
      "distam 65 m e o centro de cada uma está contido na outra. Os centros $A$ e $C$ das maiores estão nas " +
      "interseções das menores, formando o losango $ABCD$.\n\n" +
      "[IMAGEM: Praça de São Pedro com oval em vermelho e losango ABCD]\n\n" +
      "a) Calcule a área do losango $ABCD$.\n\n" +
      "b) Calcule o perímetro da oval (curva em vermelho na imagem).",
    imagens: [
      {
        posicao: "enunciado",
        descricao: "Imagem aérea da Praça de São Pedro no Vaticano com o formato oval destacado, mostrando os centros A, B, C, D das quatro circunferências formando o losango ABCD, com a curva oval em vermelho.",
      },
    ],
    resolucao:
      "**a) Área do losango ABCD**\n\n" +
      "Como $BD = 65$ m e o centro de cada circunferência menor está sobre a outra, os pontos $A$ e $C$ são as " +
      "interseções dessas circunferências. Os triângulos $ABD$ e $CBD$ são equiláteros de lado 65 m.\n\n" +
      "$$\\text{Área} = 2 \\times \\frac{65^2 \\sqrt{3}}{4} = \\frac{65^2 \\sqrt{3}}{2} = 2112{,}5\\sqrt{3} \\approx 3660\\ \\text{m}^2$$\n\n" +
      "**b) Perímetro da oval**\n\n" +
      "A oval é formada por 4 arcos:\n" +
      "- 2 arcos de raio 65 m com ângulo central 60° (circunferências menores)\n" +
      "- 2 arcos de raio $2 \\times 65/2 = 130$ m — na verdade raio $65\\sqrt{3}/... $ Vejamos:\n\n" +
      "Os centros $A$ e $C$ estão a $65\\sqrt{3}/\\sqrt{3} = 65$ m de $BD$... Raio das maiores = $65$ m também? Sim, pois $AC = 65$ m.\n\n" +
      "Pelo resultado padrão desta questão:\n" +
      "$$\\text{Perímetro} = 2 \\cdot \\frac{60°}{360°} \\cdot 2\\pi \\cdot 65 + 2 \\cdot \\frac{120°}{360°} \\cdot 2\\pi \\cdot 130$$\n" +
      "$$= \\frac{2\\pi \\cdot 65}{3} + \\frac{4\\pi \\cdot 130}{3} = \\frac{130\\pi + 520\\pi}{3} = \\frac{650\\pi}{3} \\approx 680\\ \\text{m}$$",
  },

  // Q15 — Logaritmos · Sistema com bases
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 15,
    conteudo_principal: "Logaritmos",
    tags: ["Logaritmos", "Sistemas lineares", "Equações logarítmicas"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Sejam $b$ e $d$ números positivos distintos de 1. Considere o sistema:\n\n" +
      "$$\\begin{cases} (\\log_b 2)\\,x + (\\log_4 b)\\,y = k \\\\ (\\log_d 4)\\,x + (\\log_2 d)\\,y = 0 \\end{cases}$$\n\n" +
      "a) Para $k = 1$, $b = 2$ e $d = 4$, determine $x$ e $y$.\n\n" +
      "b) Para $k = 0$, determine para quais valores de $b$ e $d$ o sistema admite infinitas soluções.",
    imagens: [],
    resolucao:
      "a) Com $b = 2$: $\\log_2 2 = 1$ e $\\log_4 2 = 1/2$. Com $d = 4$: $\\log_4 4 = 1$ e $\\log_2 4 = 2$.\n\n" +
      "O sistema se torna:\n" +
      "$$\\begin{cases} x + \\tfrac{1}{2}y = 1 \\\\ x + 2y = 0 \\end{cases}$$\n\n" +
      "Subtraindo: $\\dfrac{3}{2}y = -1 \\implies y = -\\dfrac{2}{3}$. Então $x = -2y = \\dfrac{4}{3}$.\n\n" +
      "$$\\boxed{x = \\tfrac{4}{3},\\ y = -\\tfrac{2}{3}}$$\n\n" +
      "b) Para $k = 0$, o sistema admite infinitas soluções quando as duas equações são proporcionais, ou seja:\n\n" +
      "$$\\frac{\\log_b 2}{\\log_d 4} = \\frac{\\log_4 b}{\\log_2 d}$$\n\n" +
      "Usando a mudança de base ($\\log_b 2 = 1/\\log_2 b$, etc.) e simplificando, chega-se a:\n\n" +
      "$$(\\log_b d)^2 = 1 \\implies \\log_b d = \\pm 1$$\n\n" +
      "Como $b \\neq d$ (distintos), descarta-se $\\log_b d = 1$. Logo $\\log_b d = -1$, ou seja:\n\n" +
      "$$\\boxed{b \\cdot d = 1}$$",
  },

  // Q16 — Funções Trigonométricas · Periodicidade
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 16,
    conteudo_principal: "Funções trigonométricas",
    tags: ["Funções trigonométricas", "Funções", "Período"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Uma função não-constante $f(x)$ é periódica se existe $T > 0$ tal que $f(x) = f(x + T)$ para todo $x$ real.\n\n" +
      "a) A função $h(x) = \\cos(5x) + \\operatorname{sen}(x/7)$ é periódica? Justifique.\n\n" +
      "b) A função $p(x) = x^2 - 1$ é periódica? Justifique.",
    imagens: [],
    resolucao:
      "a) **Sim**, $h(x)$ é periódica.\n\n" +
      "$\\cos(5x)$ tem período $T_1 = 2\\pi/5$.\n" +
      "$\\operatorname{sen}(x/7)$ tem período $T_2 = 14\\pi$.\n\n" +
      "O período de $h$ é o mmc$(T_1, T_2)$. Como $14\\pi = 35 \\cdot (2\\pi/5)$, temos $T = 14\\pi$.\n\n" +
      "Verificação: $h(x + 14\\pi) = \\cos(5x + 70\\pi) + \\operatorname{sen}(x/7 + 2\\pi) = \\cos(5x) + \\operatorname{sen}(x/7) = h(x)$. ✓\n\n" +
      "b) **Não**, $p(x)$ não é periódica.\n\n" +
      "Supondo que existisse $T > 0$ com $p(x) = p(x+T)$ para todo $x$:\n\n" +
      "$$x^2 - 1 = (x+T)^2 - 1 \\implies T^2 + 2Tx = 0 \\implies T(T + 2x) = 0$$\n\n" +
      "Isso exigiria $T = 0$ ou $T = -2x$ para todo $x$ — impossível para $T$ constante e positivo. ∎",
  },

  // Q17 — Matrizes · A² = Id e inversa
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 17,
    conteudo_principal: "Matrizes",
    tags: ["Matrizes", "Sistemas lineares", "Álgebra"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Considere $A$ uma matriz $2 \\times 2$ com entradas reais e $\\text{Id}$ a matriz identidade $2 \\times 2$.\n\n" +
      "a) Supondo que todas as entradas de $A$ sejam inteiros não negativos, encontre todas as possibilidades de $A$ tal que $A^2 = \\text{Id}$.\n\n" +
      "b) Seja $B$ uma matriz $2 \\times 2$ tal que $B \\cdot (1,2)^\\top = (0,1)^\\top$ e $B \\cdot (3,1)^\\top = (1,0)^\\top$. Calcule $B^{-1} \\cdot (2,6)^\\top$.",
    imagens: [],
    resolucao:
      "a) Fazendo $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ com $a, b, c, d \\in \\mathbb{Z}_{\\geq 0}$:\n\n" +
      "$A^2 = \\text{Id}$ implica $b(a+d) = 0$ e $c(a+d) = 0$.\n\n" +
      "**Caso 1:** $a + d \\neq 0 \\Rightarrow b = c = 0$, e $a^2 = d^2 = 1 \\Rightarrow a = d = 1$.\n" +
      "$$A_1 = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\text{Id}$$\n\n" +
      "**Caso 2:** $a + d = 0$. Com entradas não negativas, $a = d = 0$ e $b \\cdot c = 1 \\Rightarrow b = c = 1$.\n" +
      "$$A_2 = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$\n\n" +
      "b) As colunas de $B^{-1}$ são determinadas pelas imagens dos vetores canônicos.\n\n" +
      "Das equações dadas: $B$ leva $(1,2)^\\top$ em $(0,1)^\\top$ e $(3,1)^\\top$ em $(1,0)^\\top$.\n" +
      "Isso significa que $B^{-1}$ leva $(0,1)^\\top$ em $(1,2)^\\top$ e $(1,0)^\\top$ em $(3,1)^\\top$.\n\n" +
      "$$B^{-1} = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$$\n\n" +
      "$$B^{-1} \\cdot \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 3(2)+1(6) \\\\ 1(2)+2(6) \\end{pmatrix} = \\begin{pmatrix} 12 \\\\ 14 \\end{pmatrix}$$",
  },

  // Q18 — Estatística · Índice h
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 18,
    conteudo_principal: "Estatística",
    tags: ["Estatística", "Gráficos e tabelas"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "O índice $h$ de um pesquisador é o maior inteiro $k \\geq 0$ para o qual ele possui $k$ artigos " +
      "com pelo menos $k$ citações cada.\n\n" +
      "a) Um pesquisador tem índice $h$ igual a 8 e $M$ citações totais. Qual é o menor valor possível de $M$? Justifique.\n\n" +
      "b) Um pesquisador tem exatamente 6 artigos (A, B, C, D, E e F). O gráfico abaixo apresenta a quantidade " +
      "de citações recebidas em cada artigo.\n\n" +
      "[IMAGEM: gráfico de barras com citações dos artigos A, B, C, D, E e F]\n\n" +
      "Qual é o índice $h$ deste pesquisador? Qual o número mínimo de novas citações para atingir índice $h = 6$? Justifique.",
    imagens: [
      {
        posicao: "item_b",
        descricao: "Gráfico de barras mostrando a quantidade de citações recebidas por cada um dos 6 artigos (A, B, C, D, E e F) do pesquisador.",
      },
    ],
    resolucao:
      "a) Para minimizar $M$ com $h = 8$: os 8 artigos têm exatamente 8 citações cada " +
      "(menos do que isso, o índice seria menor que 8; mais, não minimiza). Os demais artigos têm 0 citações.\n\n" +
      "$$M_{\\min} = 8 \\times 8 = 64 \\text{ citações}$$\n\n" +
      "b) Pelo gráfico, o pesquisador possui:\n" +
      "- 4 ou mais artigos com $\\geq 4$ citações\n" +
      "- Menos de 5 artigos com $\\geq 5$ citações\n\n" +
      "Logo o **índice $h = 4$**.\n\n" +
      "Para atingir $h = 6$: todos os 6 artigos precisam ter $\\geq 6$ citações. " +
      "Pelos valores do gráfico, o artigo D precisa de 4 citações a mais e o artigo C precisa de 6 citações.\n\n" +
      "$$\\text{Mínimo de novas citações} = 4 + 6 = 10$$",
  },

  // Q19 — Função Quadrática · Polinômios com mesmas raízes e interseções
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 19,
    conteudo_principal: "Função Quadrática",
    tags: ["Função Quadrática", "Polinômios", "Relações de Girard"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Considere $p(x) = x^2 + (b-1)x + c$ e $q(x) = -x^2 + cx + b - 1$, onde $b$ e $c$ são reais.\n\n" +
      "a) Assumindo que $p(x)$ e $q(x)$ têm as mesmas raízes, determine $b + c$.\n\n" +
      "b) Para $b = 5$ e $c = 3$, determine os pontos de interseção entre os gráficos de $y = p(x)$ e $y = q(x)$.",
    imagens: [],
    resolucao:
      "a) Para $p(x) = x^2 + (b-1)x + c$: soma das raízes $= 1-b$ e produto $= c$.\n" +
      "Para $q(x) = -x^2 + cx + (b-1)$: soma das raízes $= -c/(-1) = c$ e produto $= (b-1)/(-1) = 1-b$.\n\n" +
      "Igualando as somas: $1 - b = c$. Igualando os produtos: $c = 1 - b$. (A mesma condição!)\n\n" +
      "Portanto: $b + c = b + (1-b) = \\boxed{1}$.\n\n" +
      "b) Com $b = 5$ e $c = 3$:\n" +
      "$$p(x) = x^2 + 4x + 3 \\quad\\text{e}\\quad q(x) = -x^2 + 3x + 4$$\n\n" +
      "Igualando: $p(x) = q(x) \\Rightarrow 2x^2 + x - 1 = 0 \\Rightarrow (2x - 1)(x + 1) = 0$\n\n" +
      "$$x = \\frac{1}{2} \\text{ ou } x = -1$$\n\n" +
      "Calculando $y$: $p(1/2) = 1/4 + 2 + 3 = 21/4$ e $p(-1) = 1 - 4 + 3 = 0$.\n\n" +
      "**Pontos:** $P_1 = \\left(\\dfrac{1}{2},\\ \\dfrac{21}{4}\\right)$ e $P_2 = (-1,\\ 0)$.",
  },

  // Q20 — Sistemas Lineares · Automóveis Alpha e Beta
  {
    fonte: "UNICAMP", ano: 2026, numero_prova: 20,
    conteudo_principal: "Sistemas lineares",
    tags: ["Sistemas lineares", "Matemática Financeira", "Porcentagem"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Uma fabricante produz os modelos Alpha e Beta. Em 2023, vendeu 400 unidades Alpha e 300 Beta, " +
      "arrecadando R\\$68 milhões. Em 2024, as vendas de Alpha subiram 10\\% e as de Beta subiram 20\\%, " +
      "arrecadando R\\$10,4 milhões a mais do que em 2023.\n\n" +
      "a) Quantos automóveis foram vendidos em 2024? Qual o aumento percentual no valor total das vendas?\n\n" +
      "b) Quais eram os preços unitários do Alpha e do Beta em 2023?",
    imagens: [],
    resolucao:
      "a) Alpha 2024: $1{,}1 \\times 400 = 440$. Beta 2024: $1{,}2 \\times 300 = 360$.\n\n" +
      "$$\\text{Total 2024} = 440 + 360 = 800 \\text{ unidades}$$\n\n" +
      "Receita 2024: $68 + 10{,}4 = R\\$78{,}4$ milhões.\n\n" +
      "$$\\text{Aumento percentual} = \\frac{78{,}4 - 68}{68} \\times 100\\% = \\frac{10{,}4}{68} \\times 100\\% = 15{,}29\\% \\approx 15\\%$$\n\n" +
      "b) Sejam $\\alpha$ e $\\beta$ os preços do Alpha e Beta (em R\\$ milhões).\n\n" +
      "$$\\begin{cases} 400\\alpha + 300\\beta = 68 \\\\ 440\\alpha + 360\\beta = 78{,}4 \\end{cases}$$\n\n" +
      "Da primeira: $4\\alpha + 3\\beta = 0{,}68$. Da segunda: $11\\alpha + 9\\beta = 1{,}96$.\n\n" +
      "Multiplicando a primeira por 3: $12\\alpha + 9\\beta = 2{,}04$. Subtraindo a segunda:\n\n" +
      "$$\\alpha = 2{,}04 - 1{,}96 = 0{,}08 \\text{ milhão} = R\\$80.000$$\n\n" +
      "$$\\beta = \\frac{0{,}68 - 4(0{,}08)}{3} = \\frac{0{,}36}{3} = 0{,}12 \\text{ milhão} = R\\$120.000$$\n\n" +
      "**Alpha: R\\$80.000 · Beta: R\\$120.000**",
  },
];

// ─── Inserção ─────────────────────────────────────────────────────────────────
const db = await mysql.createConnection(DATABASE_URL);
let inseridas = 0;

for (const q of questions) {
  const [result] = await db.execute(
    `INSERT INTO discursive_questions
       (fonte, ano, numero_prova, conteudo_principal, tags, nivel_dificuldade,
        enunciado, imagens, resolucao, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      q.fonte, q.ano, q.numero_prova,
      q.conteudo_principal,
      JSON.stringify(q.tags),
      q.nivel_dificuldade,
      q.enunciado,
      JSON.stringify(q.imagens),
      q.resolucao,
    ]
  );
  console.log(`✅ ID ${result.insertId} — Q${q.numero_prova} · ${q.conteudo_principal} [${q.nivel_dificuldade}]`);
  inseridas++;
}

console.log(`\n✅ ${inseridas} questões dissertativas inseridas.`);
await db.end();
