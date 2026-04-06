/**
 * Insere 5 questões UNICAMP 2026 — Lote 2
 * node insert-unicamp2026-lote2.mjs
 *
 * ⚠️  Imagens que precisam ser adicionadas via admin depois:
 *   Q2 (Geometria Analítica) — gráfico da reta com ângulo 30°
 *   Q3 (Razões e Proporções) — mapa da plataforma continental
 *   Q4 (Função Quadrática)   — Figura 1 e Figura 2 do vôlei
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const questions = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Q1 — Polinômios
  // ─────────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Polinômios",
    tags: ["Polinômios", "Equações e Inequações"],
    nivel_dificuldade: "Média",
    enunciado:
      "Sobre dois polinômios $p(x)$ e $q(x)$ de coeficientes reais sabe-se que:\n\n" +
      "$p(x) + q(x)$ tem grau igual a 3.\n\n" +
      "$p(x) \\cdot q(x)$ tem grau igual a 8.\n\n" +
      "É correto afirmar que o grau de $p(x) - q(x)$ é igual a",
    url_imagem: null,
    alternativas: { A: "5.", B: "4.", C: "3.", D: "2." },
    gabarito: "B",
    comentario_resolucao:
      "Como $p(x) \\cdot q(x)$ tem grau 8, temos $\\text{grau}[p(x)] + \\text{grau}[q(x)] = 8$.\n\n" +
      "As possibilidades para $(\\text{grau}[p], \\text{grau}[q], \\text{grau}[p+q])$ são:\n" +
      "(0, 8, 8), (1, 7, 7), (2, 6, 6), (3, 5, 5), **(4, 4, ≤ 4)**, (5, 3, 5), (6, 2, 6), (7, 1, 7), (8, 0, 8).\n\n" +
      "Como $p(x) + q(x)$ tem grau **3**, a única possibilidade é $\\text{grau}[p(x)] = \\text{grau}[q(x)] = 4$. " +
      "Nesse caso, os coeficientes do termo de grau 4 são opostos — eles se cancelam na soma, resultando em grau 3.\n\n" +
      "Em $p(x) - q(x)$, esses coeficientes se **somam** (subtrair o oposto é somar), " +
      "portanto o termo de grau 4 não se cancela.\n\n" +
      "$$\\therefore\\ \\text{grau}[p(x) - q(x)] = 4$$",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Q2 — Geometria Analítica › Reta (⚠️ imagem do gráfico pendente)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Geometria Analítica",
    tags: ["Geometria Analítica", "Trigonometria"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "A reta de equação $y = ax + b$ faz um ângulo de 30 graus com o eixo $y$, " +
      "conforme ilustrado na figura a seguir, e sua distância até a origem é $\\sqrt{3}$.\n\n" +
      "O valor de $ab$ é",
    url_imagem: null,
    alternativas: { A: "$-4$.", B: "$-5$.", C: "$-6$.", D: "$-7$." },
    gabarito: "C",
    comentario_resolucao:
      "**Coeficiente angular:**\n\n" +
      "A reta faz 30° com o eixo $y$, logo faz $90° - 30° = 60°$ com o eixo $x$. Portanto:\n" +
      "$$a = \\tan(60°) = \\sqrt{3}$$\n\n" +
      "**Distância da reta à origem:**\n\n" +
      "A forma geral da reta é $\\sqrt{3}\\,x - y + b = 0$. A distância à origem $(0, 0)$ é:\n" +
      "$$d = \\frac{|\\sqrt{3}\\cdot 0 - 1\\cdot 0 + b|}{\\sqrt{(\\sqrt{3})^2 + (-1)^2}} = \\frac{|b|}{\\sqrt{4}} = \\frac{|b|}{2} = \\sqrt{3}$$\n\n" +
      "Logo $|b| = 2\\sqrt{3}$. Como o gráfico mostra que a reta intercepta o eixo $y$ abaixo da origem, " +
      "$b = -2\\sqrt{3}$.\n\n" +
      "**Resultado:**\n\n" +
      "$$ab = \\sqrt{3} \\cdot (-2\\sqrt{3}) = -2 \\cdot 3 = -6$$",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Q3 — Grandezas Proporcionais › Razões e Proporções (⚠️ imagem do mapa pendente)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Razão, Proporção e Regra de Três",
    tags: ["Razão, Proporção e Regra de Três", "Escala"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "Em 2025, a Comissão de Limites da Plataforma Continental (CLPC), da Organização das Nações Unidas (ONU), " +
      "aprovou uma proposta do Brasil que pedia a ampliação da plataforma continental na costa do litoral norte. " +
      "A decisão reconhece o direito do Brasil de explorar a Margem Equatorial, em uma área equivalente à área territorial da Alemanha.\n\n" +
      "O cálculo de área de figuras planas irregulares envolve em geral noções complexas de matemática. " +
      "No caso de áreas de figuras que estão impressas e/ou desenhadas em um papel, pode-se empregar um método prático, " +
      "que considera a relação entre o peso do papel por unidade de área.\n\n" +
      "Para calcular a área da região recentemente incorporada ao território brasileiro, um mapa contendo esta região, " +
      "na escala $1:5.000.000$ — isto é, 1 cm no papel equivale a 5.000.000 cm no local — foi impresso em um papel " +
      "cuja relação peso/área é de $75\\,\\text{g/m}^2$. A seguir, a parte do mapa referente a esta região foi recortada " +
      "e pesada, obtendo-se $1{,}0815\\,\\text{g}$.\n\n" +
      "A partir desses dados, é correto afirmar que a área obtida foi:",
    url_imagem: null,
    alternativas: {
      A: "$359.900\\,\\text{km}^2$.",
      B: "$360.100\\,\\text{km}^2$.",
      C: "$360.300\\,\\text{km}^2$.",
      D: "$360.500\\,\\text{km}^2$.",
    },
    gabarito: "D",
    comentario_resolucao:
      "**Passo 1 — Área do recorte no mapa:**\n\n" +
      "Usando a relação peso/área do papel:\n" +
      "$$\\frac{75\\,\\text{g}}{1\\,\\text{m}^2} = \\frac{1{,}0815\\,\\text{g}}{x} \\implies x = \\frac{1{,}0815}{75} = 0{,}01442\\,\\text{m}^2$$\n\n" +
      "**Passo 2 — Convertendo para área real:**\n\n" +
      "A escala é $1:5.000.000$, ou seja, $1\\,\\text{m}$ no papel corresponde a $5\\times10^6\\,\\text{m}$ na realidade. " +
      "Para áreas, o fator é o quadrado da escala:\n" +
      "$$A_{\\text{real}} = 0{,}01442 \\times (5\\times10^6)^2\\,\\text{m}^2 = 0{,}01442 \\times 2{,}5\\times10^{13}\\,\\text{m}^2$$\n" +
      "$$A_{\\text{real}} = 3{,}605\\times10^{11}\\,\\text{m}^2$$\n\n" +
      "**Passo 3 — Conversão para km²** (sabendo que $1\\,\\text{km}^2 = 10^6\\,\\text{m}^2$):\n" +
      "$$A_{\\text{real}} = \\frac{3{,}605\\times10^{11}}{10^6}\\,\\text{km}^2 = 3{,}605\\times10^5\\,\\text{km}^2 = 360.500\\,\\text{km}^2$$",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Q4 — Funções › Função Quadrática (Vôlei) (⚠️ imagens Figura 1 e Figura 2 pendentes)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Função Quadrática",
    tags: ["Função Quadrática", "Funções de 1º e 2º Grau"],
    nivel_dificuldade: "Baixa",
    enunciado:
      "O movimento de ataque em um jogo de vôlei é mais eficiente se o atleta atingir a bola no ponto mais alto " +
      "da trajetória do centro de massa da bola. A Figura 1 mostra a trajetória da bola que foi lançada pela Atleta A " +
      "em direção à Atleta B.\n\n" +
      "O centro de massa da bola, ao ser lançada pela Atleta A, está a 2 metros de altura em relação ao solo. " +
      "Quando a Atleta B ataca, o centro de massa da bola está a 3 metros de altura em relação ao solo.\n\n" +
      "As jogadoras estão no mesmo plano da trajetória da bola e a distância entre as jogadoras é de 9 metros. " +
      "Sabe-se que a trajetória do centro de massa da bola é uma parábola e que o ataque aconteceu justamente no " +
      "ponto de maior altura da parábola, conforme representado na Figura 2.\n\n" +
      "A equação da parábola que descreve a trajetória do centro de massa da bola é",
    url_imagem: null,
    alternativas: {
      A: "$y = \\left(-\\dfrac{1}{9}\\right)x^2 + \\dfrac{10}{9}x + 2$.",
      B: "$y = \\left(-\\dfrac{1}{99}\\right)x^2 + \\dfrac{20}{99}x + 2$.",
      C: "$y = \\left(-\\dfrac{1}{81}\\right)x^2 + \\dfrac{2}{9}x + 2$.",
      D: "$y = \\left(-\\dfrac{1}{4}\\right)x^2 + \\dfrac{9}{2}x + 2$.",
    },
    gabarito: "C",
    comentario_resolucao:
      "**Estratégia:** Deslocar o eixo $y$ 2 unidades para cima (subtrair 2 da altura), " +
      "de modo que a parábola passe pela origem.\n\n" +
      "No novo sistema, os pontos relevantes são:\n" +
      "- Atleta A lança em $x = 0$, altura $= 2 - 2 = 0\\,\\text{m}$ → ponto $(0,\\ 0)$\n" +
      "- Vértice (ponto de ataque): $x = 9$, altura $= 3 - 2 = 1\\,\\text{m}$ → ponto $(9,\\ 1)$\n" +
      "- Por simetria da parábola com vértice em $x = 9$, a parábola cruza o eixo $x$ também em $x = 18$\n\n" +
      "**Equação na forma fatorada:**\n" +
      "$$y = a\\,x(x - 18)$$\n\n" +
      "Substituindo o vértice $(9,\\ 1)$:\n" +
      "$$1 = a \\cdot 9 \\cdot (9 - 18) = a \\cdot 9 \\cdot (-9) = -81a \\implies a = -\\frac{1}{81}$$\n\n" +
      "**Equação expandida no sistema deslocado:**\n" +
      "$$y = -\\frac{1}{81}x(x-18) = -\\frac{1}{81}x^2 + \\frac{18}{81}x = -\\frac{1}{81}x^2 + \\frac{2}{9}x$$\n\n" +
      "**Voltando ao sistema original** (descendo 2 unidades):\n" +
      "$$\\boxed{y = -\\frac{1}{81}x^2 + \\frac{2}{9}x + 2}$$",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Q5 — Probabilidade (Caixa Divertida)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    fonte: "UNICAMP",
    ano: 2026,
    conteudo_principal: "Probabilidade",
    tags: ["Probabilidade", "Análise Combinatória"],
    nivel_dificuldade: "Média",
    enunciado:
      "Em uma creche se realiza o \"dia da troca do brinquedo\". Cada criança leva um brinquedo para a escola " +
      "e o guarda na Caixa Divertida. Ao final do dia, cada criança retira um brinquedo da Caixa Divertida sem olhar, " +
      "e o leva para brincar em casa. Em uma sala com cinco crianças, qual é a probabilidade de exatamente duas " +
      "crianças retirarem da Caixa Divertida seus próprios brinquedos?",
    url_imagem: null,
    alternativas: {
      A: "$\\dfrac{1}{5}$.",
      B: "$\\dfrac{1}{6}$.",
      C: "$\\dfrac{1}{25}$.",
      D: "$\\dfrac{1}{30}$.",
    },
    gabarito: "B",
    comentario_resolucao:
      "Queremos que **exatamente 2** das 5 crianças retirem seu próprio brinquedo, e as outras **3** não retirem os seus.\n\n" +
      "**Passo 1 — Escolher quais 2 crianças acertam:**\n" +
      "$$\\binom{5}{2} = 10 \\text{ maneiras}$$\n\n" +
      "**Passo 2 — Arranjar os brinquedos das 3 crianças restantes sem que nenhuma acerte** " +
      "(número de **desarranjos** de 3 elementos, $D_3$):\n" +
      "$$D_3 = 3!\\left(1 - 1 + \\frac{1}{2!} - \\frac{1}{3!}\\right) = 6\\left(\\frac{1}{2} - \\frac{1}{6}\\right) = 6 \\cdot \\frac{1}{3} = 2$$\n\n" +
      "**Passo 3 — Total de maneiras de distribuir os 5 brinquedos:**\n" +
      "$$5! = 120$$\n\n" +
      "**Probabilidade:**\n" +
      "$$P = \\frac{\\binom{5}{2} \\cdot D_3}{5!} = \\frac{10 \\times 2}{120} = \\frac{20}{120} = \\frac{1}{6}$$",
  },
];

// ─── Inserção ─────────────────────────────────────────────────────────────────

const db = await mysql.createConnection(DATABASE_URL);

let inseridas = 0;
for (const q of questions) {
  const [result] = await db.execute(
    `INSERT INTO questions
       (fonte, ano, conteudo_principal, tags, nivel_dificuldade,
        param_a, param_b, param_c,
        enunciado, url_imagem, alternativas, gabarito, comentario_resolucao, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      q.fonte,
      q.ano,
      q.conteudo_principal,
      JSON.stringify(q.tags),
      q.nivel_dificuldade,
      1.0, 0.0, 0.2,
      q.enunciado,
      q.url_imagem,
      JSON.stringify(q.alternativas),
      q.gabarito,
      q.comentario_resolucao,
    ]
  );
  const id = result.insertId;
  console.log(`✅ ID ${id} — ${q.conteudo_principal} [${q.nivel_dificuldade}] Gabarito: ${q.gabarito}`);
  inseridas++;
}

console.log(`\n✅ ${inseridas} questões inseridas com sucesso.`);
console.log("⚠️  Lembre de adicionar as imagens pelo admin:");
console.log("   - Q Geometria Analítica: gráfico da reta (ângulo 30° com eixo y)");
console.log("   - Q Razões e Proporções: mapa da plataforma continental");
console.log("   - Q Função Quadrática: Figura 1 (jogadoras) e Figura 2 (parábola)");

await db.end();
