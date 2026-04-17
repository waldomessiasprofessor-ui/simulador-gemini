import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "node:path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { createContext } from "./trpc";
import { appRouter } from "./router";
import { authMiddleware } from "./auth";
import { db, pool } from "./db";
import { questions, users } from "./schema";
import { eq } from "drizzle-orm";
import {
  MATEMATICA_BASICA_ARTICLES,
  GEO_ESPACIAL_CARDS,
} from "./seed-matematica-content";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === "production";

// Cloudinary — configurado via variáveis de ambiente no Railway
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Apenas imagens são permitidas."));
  },
});

app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);

// =============================================================================
// Rota: promover utilizador a admin
// URL: /admin/make-admin?secret=IMPORTAR2024&email=teu@email.com
// =============================================================================

app.get("/admin/make-admin", async (req, res) => {
  const secret = req.query.secret as string;
  const email = req.query.email as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";

  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  if (!email) return res.status(400).send("Forneça ?email=teu@email.com");

  try {
    await db.update(users).set({ role: "admin" }).where(eq(users.email, email.toLowerCase().trim()));
    res.send(`✅ ${email} é agora admin. Faça logout e login novamente no site.`);
  } catch (err: any) {
    res.status(500).send(`Erro: ${err.message}`);
  }
});

// =============================================================================
// Rota: seed de flashcards de geometria
// GET /admin/seed-flashcards?secret=IMPORTAR2024&action=list
// GET /admin/seed-flashcards?secret=IMPORTAR2024&action=insert&deckId=N
// =============================================================================

const GEOMETRY_CARDS = [
  // ── Triângulos — relações e trigonometria ────────────────────────────────
  {
    front: "Relações métricas no triângulo retângulo\n\nCatetos $a$, $b$, hipotenusa $c$, altura $h$ relativa à hipotenusa (projeções $m$ e $n$).",
    back:  "$$h^2 = m \\cdot n \\qquad a^2 = m \\cdot c \\qquad b^2 = n \\cdot c$$\n$$h \\cdot c = a \\cdot b$$\n\n$m$ = projeção de $a$ sobre $c$; $n$ = projeção de $b$ sobre $c$.",
  },
  {
    front: "Área do triângulo — fórmula com seno\n\nDois lados $a$ e $b$ formam entre si o ângulo $C$. Qual é a área?",
    back:  "$$A = \\frac{a \\cdot b \\cdot \\operatorname{sen}(C)}{2}$$",
  },
  {
    front: "Lei dos Senos\n\nRelacione os lados e os ângulos opostos de qualquer triângulo.",
    back:  "$$\\frac{a}{\\operatorname{sen} A} = \\frac{b}{\\operatorname{sen} B} = \\frac{c}{\\operatorname{sen} C} = 2R$$\n\n$R$ = raio da circunferência circunscrita.",
  },
  {
    front: "Lei dos Cossenos\n\nRelacione o lado $c$ com $a$, $b$ e o ângulo $C$ oposto a $c$.",
    back:  "$$c^2 = a^2 + b^2 - 2ab\\cos C$$\n\nGeneraliza Pitágoras: quando $C = 90°$, resulta $c^2 = a^2 + b^2$.",
  },
  {
    front: "Triângulo equilátero — altura e área\n\nLado $l$.",
    back:  "$$h = \\frac{l\\sqrt{3}}{2} \\qquad A = \\frac{l^2\\sqrt{3}}{4}$$\n\nPitágoras: $h^2 + \\left(\\dfrac{l}{2}\\right)^2 = l^2$.",
  },
  {
    front: "Raio da circunferência inscrita no triângulo\n\nÁrea $A$, semiperímetro $s$.",
    back:  "$$r = \\frac{A}{s}, \\qquad s = \\frac{a+b+c}{2}$$",
  },
  {
    front: "Raio da circunferência circunscrita no triângulo\n\nLados $a$, $b$, $c$, área $A$.",
    back:  "$$R = \\frac{abc}{4A}$$\n\nTambém (Lei dos Senos): $R = \\dfrac{a}{2\\operatorname{sen} A}$.",
  },
  {
    front: "Teorema da bissetriz interna\n\nA bissetriz do ângulo $A$ divide o lado oposto $BC$ nos segmentos $m$ (junto a $b$) e $n$ (junto a $c$).",
    back:  "$$\\frac{m}{n} = \\frac{b}{c}$$\n\nA bissetriz interna divide o lado oposto proporcionalmente aos lados adjacentes.",
  },
  {
    front: "Baricentro — propriedade da mediana\n\nComo o baricentro $G$ divide cada mediana do triângulo?",
    back:  "O baricentro divide cada mediana na razão $\\mathbf{2:1}$ a partir do vértice.\n\n$$AG = \\frac{2}{3}\\,m_a$$\n\n$m_a$ = comprimento da mediana relativa ao vértice $A$.",
  },
  {
    front: "Triplas pitagóricas\n\nCite as triplas mais cobradas em vestibulares e suas variações.",
    back:  "$(3,\\,4,\\,5)$ → múltiplos: $(6,8,10)$, $(9,12,15)$…\n\n$(5,\\,12,\\,13)$\n\n$(8,\\,15,\\,17)$\n\n$(7,\\,24,\\,25)$\n\nVerifique sempre: $a^2 + b^2 = c^2$.",
  },
  // ── Trigonometria no plano ───────────────────────────────────────────────
  {
    front: "Relações trigonométricas no triângulo retângulo\n\nExpresse $\\operatorname{sen}$, $\\cos$ e $\\operatorname{tg}$ em termos dos lados.",
    back:  "$$\\operatorname{sen}\\theta = \\frac{\\text{oposto}}{\\text{hipotenusa}} \\qquad \\cos\\theta = \\frac{\\text{adjacente}}{\\text{hipotenusa}} \\qquad \\operatorname{tg}\\theta = \\frac{\\text{oposto}}{\\text{adjacente}}$$",
  },
  {
    front: "Valores trigonométricos notáveis\n\n$\\operatorname{sen}$, $\\cos$ e $\\operatorname{tg}$ de $30°$, $45°$ e $60°$.",
    back:  "$$\\operatorname{sen}30° = \\tfrac{1}{2},\\quad \\cos30° = \\tfrac{\\sqrt{3}}{2},\\quad \\operatorname{tg}30° = \\tfrac{\\sqrt{3}}{3}$$\n$$\\operatorname{sen}45° = \\cos45° = \\tfrac{\\sqrt{2}}{2},\\quad \\operatorname{tg}45° = 1$$\n$$\\operatorname{sen}60° = \\tfrac{\\sqrt{3}}{2},\\quad \\cos60° = \\tfrac{1}{2},\\quad \\operatorname{tg}60° = \\sqrt{3}$$",
  },
  {
    front: "Identidade fundamental da trigonometria",
    back:  "$$\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$$\n\nDerivada do Teorema de Pitágoras no círculo unitário de raio 1.",
  },
  {
    front: "Relação entre $\\operatorname{tg}$, $\\operatorname{sen}$ e $\\cos$",
    back:  "$$\\operatorname{tg}\\theta = \\frac{\\operatorname{sen}\\theta}{\\cos\\theta}$$\n\nDa identidade fundamental: $1 + \\operatorname{tg}^2\\theta = \\sec^2\\theta$.",
  },
  // ── Semelhança ──────────────────────────────────────────────────────────
  {
    front: "Semelhança de triângulos — critérios\n\nCite os três critérios que garantem semelhança.",
    back:  "AA — dois ângulos iguais\n\nLAL — dois lados proporcionais e o ângulo entre eles igual\n\nLLL — os três pares de lados proporcionais\n\nTriângulos semelhantes têm lados correspondentes proporcionais e ângulos iguais.",
  },
  {
    front: "Semelhança — razão entre perímetros e áreas\n\nSe a razão de semelhança é $k$, qual é a razão entre perímetros? E entre áreas?",
    back:  "$$\\frac{P_1}{P_2} = k \\qquad \\frac{A_1}{A_2} = k^2$$\n\nPerímetros na razão $k$; áreas na razão $k^2$.",
  },
  // ── Quadriláteros ────────────────────────────────────────────────────────
  {
    front: "Quadrado — diagonal\n\nLado $l$.",
    back:  "$$d = l\\sqrt{2}$$\n\nPitágoras: $d^2 = l^2 + l^2 = 2l^2$.",
  },
  {
    front: "Retângulo — diagonal\n\nLados $a$ e $b$.",
    back:  "$$d = \\sqrt{a^2 + b^2}$$",
  },
  {
    front: "Losango — relação entre diagonais e lado\n\nDiagonais $d_1$ e $d_2$, lado $l$.",
    back:  "$$l = \\sqrt{\\left(\\frac{d_1}{2}\\right)^2 + \\left(\\frac{d_2}{2}\\right)^2}$$\n\nAs diagonais do losango são perpendiculares e bissetoras entre si.",
  },
  {
    front: "Trapézio — base média\n\nQual é o comprimento do segmento médio que une os pontos médios dos lados não paralelos?",
    back:  "$$m = \\frac{B + b}{2}$$\n\n$B$ = base maior, $b$ = base menor. O segmento médio é paralelo às bases.",
  },
  // ── Polígonos regulares ──────────────────────────────────────────────────
  {
    front: "Polígono regular — ângulo interno\n\n$n$ lados.",
    back:  "$$\\theta_{\\text{int}} = \\frac{(n-2)\\cdot 180°}{n}$$\n\nExemplos: triângulo $60°$, quadrado $90°$, hexágono $120°$.",
  },
  {
    front: "Polígono regular — ângulo externo\n\n$n$ lados.",
    back:  "$$\\theta_{\\text{ext}} = \\frac{360°}{n}$$\n\nA soma de todos os ângulos externos de qualquer polígono convexo é sempre $360°$.",
  },
  {
    front: "Polígono regular — número de diagonais\n\n$n$ lados.",
    back:  "$$D = \\frac{n(n-3)}{2}$$\n\nEscolhe-se 2 vértices ($\\binom{n}{2}$ pares) e subtraem-se os $n$ lados.",
  },
  {
    front: "Polígono regular — área\n\nLado $l$, apótema $a$, $n$ lados.",
    back:  "$$A = \\frac{n \\cdot l \\cdot a}{2} = \\frac{\\text{Perímetro} \\cdot a}{2}$$",
  },
  // ── Circunferência e círculo ─────────────────────────────────────────────
  {
    front: "Ângulo inscrito em semicírculo\n\nUm triângulo tem como lado o diâmetro de uma circunferência. O que se pode afirmar do ângulo oposto?",
    back:  "O ângulo inscrito que intercepta um semicírculo mede sempre $90°$.\n\nConsequência: todo triângulo inscrito em um semicírculo é retângulo.",
  },
  {
    front: "Potência de um ponto — duas cordas\n\nDuas cordas $AB$ e $CD$ se cruzam no ponto $P$ interno à circunferência.",
    back:  "$$PA \\cdot PB = PC \\cdot PD$$\n\nO produto dos segmentos de uma corda é igual ao produto dos segmentos da outra.",
  },
  {
    front: "Potência de um ponto — tangente e secante\n\nDo ponto externo $P$: tangente $PT$ e secante $PAB$.",
    back:  "$$PT^2 = PA \\cdot PB$$\n\n$T$ = ponto de tangência; $A$ e $B$ = interseções da secante com a circunferência.",
  },
  {
    front: "Corda e distância ao centro\n\nCorda de comprimento $2c$ a distância $d$ do centro. Raio $r$.",
    back:  "$$r^2 = d^2 + c^2$$\n\nO segmento do centro ao ponto médio da corda é perpendicular à corda.",
  },
  {
    front: "Comprimento da corda — ângulo central\n\nCorda que subtende ângulo central $\\theta$ em circunferência de raio $r$.",
    back:  "$$\\ell = 2r\\operatorname{sen}\\!\\left(\\frac{\\theta}{2}\\right)$$",
  },
  {
    front: "Ângulo entre duas cordas que se cruzam\n\nDuas cordas se intersectam dentro da circunferência. Os arcos opostos medem $\\alpha$ e $\\beta$.",
    back:  "$$\\theta = \\frac{\\alpha + \\beta}{2}$$\n\nO ângulo no ponto de cruzamento é a média aritmética dos arcos interceptados.",
  },
  {
    front: "Posição relativa de dois círculos\n\nRaios $R \\geq r$, distância entre centros $d$.",
    back:  "$d > R+r$ → externos\n$d = R+r$ → tangentes externos\n$|R-r| < d < R+r$ → secantes\n$d = R-r$ → tangentes internos\n$d < R-r$ → internos\n$d = 0$ → concêntricos",
  },
];

// =============================================================================
// Rota: seed do artigo de Probabilidade no Revise
// GET /admin/seed-review-probabilidade?secret=IMPORTAR2024
// =============================================================================

const PROBABILIDADE_ARTICLE = {
  titulo: "Probabilidade — Conceitos Básicos e Operações",
  topico: "Probabilidade e Estatística",
  active: true,
  url_pdf: null,
  conteudo: `## 1. Espaço Amostral e Evento

O **espaço amostral** ($\\Omega$) é o conjunto de todos os resultados possíveis de um experimento aleatório. Um **evento** ($A$) é qualquer subconjunto do espaço amostral.

**Exemplo:** No lançamento de um dado, $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$. O evento "sair número par" é $A = \\{2, 4, 6\\}$.

---

## 2. Definição Clássica de Probabilidade

Se todos os resultados são **equiprováveis** (igualmente prováveis):

$$P(A) = \\frac{n(A)}{n(\\Omega)}$$

onde $n(A)$ é o número de casos **favoráveis** e $n(\\Omega)$ é o total de casos possíveis.

**Propriedades fundamentais:**
• $0 \\leq P(A) \\leq 1$
• $P(\\Omega) = 1$ (evento certo)
• $P(\\emptyset) = 0$ (evento impossível)

---

## 3. Probabilidade do Complementar

O complementar de $A$ (escrito $\\bar{A}$ ou $A^c$) é o evento "A **não** ocorre":

$$P(\\bar{A}) = 1 - P(A)$$

**Dica importante:** quando o enunciado pede "pelo menos um", costuma ser mais fácil calcular $P(\\text{nenhum})$ e subtrair de 1.

**Exemplo:** A probabilidade de tirar pelo menos uma cara em dois lançamentos de moeda:

$$P(\\text{pelo menos uma cara}) = 1 - P(\\text{nenhuma cara}) = 1 - \\frac{1}{4} = \\frac{3}{4}$$

---

## 4. Regra da Adição — União de Eventos

Para quaisquer eventos $A$ e $B$:

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

O termo $P(A \\cap B)$ é subtraído para **não contar duas vezes** os resultados em comum.

**Eventos mutuamente exclusivos** ($A \\cap B = \\emptyset$): não podem ocorrer ao mesmo tempo, logo:

$$P(A \\cup B) = P(A) + P(B)$$

**Exemplo:** Num baralho de 52 cartas, a probabilidade de sortear um ás **ou** uma carta de copas:

$$P(\\text{ás} \\cup \\text{copas}) = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13}$$

---

## 5. Probabilidade Condicional

A probabilidade de $A$ ocorrer **dado que** $B$ já ocorreu é:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$

**Exemplo:** Numa urna com 3 bolas vermelhas e 2 azuis, qual é a probabilidade de a segunda bola ser vermelha, dado que a primeira foi vermelha (sem reposição)?

$$P(V_2 \\mid V_1) = \\frac{2}{4} = \\frac{1}{2}$$

---

## 6. Regra do Produto — Interseção de Eventos

Da definição de probabilidade condicional, deduz-se:

$$P(A \\cap B) = P(A) \\cdot P(B \\mid A) = P(B) \\cdot P(A \\mid B)$$

**Eventos independentes:** $A$ e $B$ são independentes quando a ocorrência de um **não afeta** a probabilidade do outro:

$$P(A \\mid B) = P(A) \\implies P(A \\cap B) = P(A) \\cdot P(B)$$

**Exemplo:** Lançando dois dados, a probabilidade de obter 6 no primeiro **e** 6 no segundo:

$$P(6 \\cap 6) = \\frac{1}{6} \\cdot \\frac{1}{6} = \\frac{1}{36}$$

---

## 7. Distribuição Binomial

Quando um experimento com probabilidade de sucesso $p$ é repetido $n$ vezes de forma **independente**, a probabilidade de exatamente $k$ sucessos é:

$$P(X = k) = \\binom{n}{k}\\, p^k\\,(1-p)^{n-k}$$

onde $\\displaystyle\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$ é o coeficiente binomial.

**Exemplo:** Jogando uma moeda honesta 4 vezes, a probabilidade de exatamente 3 caras:

$$P(X = 3) = \\binom{4}{3}\\left(\\frac{1}{2}\\right)^3\\left(\\frac{1}{2}\\right)^1 = 4 \\cdot \\frac{1}{8} \\cdot \\frac{1}{2} = \\frac{1}{4}$$

---

## Resumo das Fórmulas

| Operação | Fórmula |
|---|---|
| Probabilidade clássica | $P(A) = \\dfrac{n(A)}{n(\\Omega)}$ |
| Complementar | $P(\\bar{A}) = 1 - P(A)$ |
| União (geral) | $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ |
| União (exclusivos) | $P(A \\cup B) = P(A) + P(B)$ |
| Condicional | $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$ |
| Interseção (geral) | $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$ |
| Interseção (independentes) | $P(A \\cap B) = P(A) \\cdot P(B)$ |
| Binomial | $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ |`,
  questoes: [
    {
      enunciado: "Num baralho com 52 cartas, qual é a probabilidade de sortear um ás ou uma carta de copas?",
      opcoes: [
        "1/4",
        "4/13",
        "17/52",
        "1/13",
      ],
      correta: 1,
    },
    {
      enunciado: "Dois eventos A e B são independentes, com P(A) = 1/3 e P(B) = 1/2. A probabilidade de que pelo menos um deles ocorra é:",
      opcoes: [
        "1/6",
        "5/6",
        "2/3",
        "1/2",
      ],
      correta: 2,
    },
    {
      enunciado: "Numa turma de 30 alunos, 18 estudam Matemática, 12 estudam Física e 6 estudam ambas. A probabilidade de um aluno sorteado estudar apenas Matemática é:",
      opcoes: [
        "3/5",
        "1/2",
        "2/5",
        "1/5",
      ],
      correta: 2,
    },
  ],
};

app.get("/admin/seed-review-probabilidade", async (req: any, res: any) => {
  const secret = req.query.secret as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");

  let conn: any;
  try {
    conn = await pool.getConnection();

    // Evita duplicata — verifica se já existe artigo com esse título
    const [existing]: any[] = await conn.query(
      "SELECT id FROM review_contents WHERE titulo = ? LIMIT 1",
      [PROBABILIDADE_ARTICLE.titulo]
    );
    if (existing.length > 0) {
      return res.send(`⚠️ Artigo já existe (id=${existing[0].id}). Nada inserido.`);
    }

    await conn.query(
      `INSERT INTO review_contents (titulo, topico, conteudo, url_pdf, questoes, active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [
        PROBABILIDADE_ARTICLE.titulo,
        PROBABILIDADE_ARTICLE.topico,
        PROBABILIDADE_ARTICLE.conteudo,
        null,
        JSON.stringify(PROBABILIDADE_ARTICLE.questoes),
      ]
    );

    res.send(`✅ Artigo "${PROBABILIDADE_ARTICLE.titulo}" inserido com sucesso!`);
  } catch (err: any) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/admin/seed-flashcards", async (req: any, res: any) => {
  const secret = req.query.secret as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");

  const action = (req.query.action as string) ?? "list";
  let conn: any;

  try {
    conn = await pool.getConnection();

    if (action === "list") {
      // Mostra decks e cards existentes
      const [decks]: any[] = await conn.query("SELECT id, title, active FROM flashcard_decks ORDER BY id");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write("=== BARALHOS ===\n");
      for (const d of decks) {
        const [cards]: any[] = await conn.query(
          "SELECT id, LEFT(front, 100) as front FROM flashcards WHERE deck_id = ? ORDER BY order_index, id",
          [d.id]
        );
        res.write(`\n[${d.id}] ${d.title} (${cards.length} cards, active=${d.active})\n`);
        for (const c of cards) res.write(`  #${c.id}: ${c.front.replace(/\n/g, " ↵ ")}\n`);
      }
      res.write("\n\nUse ?action=insert&deckId=N para inserir os 30 novos cards.\n");
      return res.end();
    }

    if (action === "insert") {
      const deckId = Number(req.query.deckId);
      if (!deckId) return res.status(400).send("Forneça ?deckId=N (veja os IDs com ?action=list).");

      const [deckRows]: any[] = await conn.query("SELECT id, title FROM flashcard_decks WHERE id = ?", [deckId]);
      if (!deckRows.length) return res.status(404).send(`Deck ${deckId} não encontrado.`);

      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      const log = (m: string) => { console.log(m); res.write(m + "\n"); };
      log(`Inserindo cards no baralho "${deckRows[0].title}" (id=${deckId})...\n`);

      // Busca cards existentes para evitar duplicatas (compara pelo front)
      const [existing]: any[] = await conn.query(
        "SELECT LEFT(front, 200) as front FROM flashcards WHERE deck_id = ?", [deckId]
      );
      const existingFronts = new Set(existing.map((r: any) => r.front.trim().slice(0, 80)));

      // Calcula próximo order_index
      const [lastIdx]: any[] = await conn.query(
        "SELECT COALESCE(MAX(order_index), -1) as maxIdx FROM flashcards WHERE deck_id = ?", [deckId]
      );
      let orderIndex = (lastIdx[0]?.maxIdx ?? -1) + 1;

      let inseridos = 0, pulados = 0;
      for (const card of GEOMETRY_CARDS) {
        const frontKey = card.front.trim().slice(0, 80);
        if (existingFronts.has(frontKey)) {
          log(`  [skip] ${frontKey.replace(/\n/g, " ↵ ").slice(0, 60)}`);
          pulados++;
          continue;
        }
        await conn.query(
          "INSERT INTO flashcards (deck_id, front, back, order_index, active, created_at) VALUES (?, ?, ?, ?, 1, NOW())",
          [deckId, card.front, card.back, orderIndex++]
        );
        log(`  ✅ ${frontKey.replace(/\n/g, " ↵ ").slice(0, 70)}`);
        inseridos++;
      }

      log(`\nConcluído: ${inseridos} inseridos, ${pulados} ignorados (já existiam).`);
      return res.end();
    }

    res.status(400).send("action deve ser 'list' ou 'insert'.");
  } catch (err: any) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});

// =============================================================================
// Rota: seed/upsert dos 4 artigos de Matemática Básica no Revise
// (Operações com Frações, Razão e Proporção, Divisão em Partes Proporcionais,
//  Princípio Fundamental da Contagem e Fatorial)
// GET /admin/seed-review-matematica-basica?secret=IMPORTAR2024
// Usa UPDATE se o título já existe; INSERT caso contrário.
// =============================================================================

app.get("/admin/seed-review-matematica-basica", async (req: any, res: any) => {
  const secret = req.query.secret as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");

  let conn: any;
  try {
    conn = await pool.getConnection();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Aplicando seed/upsert dos 4 artigos de Matemática Básica...\n\n");

    let inseridos = 0;
    let atualizados = 0;

    for (const art of MATEMATICA_BASICA_ARTICLES) {
      const [existing]: any[] = await conn.query(
        "SELECT id FROM review_contents WHERE titulo = ? LIMIT 1",
        [art.titulo]
      );

      if (existing.length > 0) {
        await conn.query(
          `UPDATE review_contents
             SET topico = ?, conteudo = ?, questoes = ?, active = 1
           WHERE id = ?`,
          [art.topico, art.conteudo, JSON.stringify(art.questoes), existing[0].id]
        );
        res.write(`  🔄 Atualizado: "${art.titulo}" (id=${existing[0].id})\n`);
        atualizados++;
      } else {
        await conn.query(
          `INSERT INTO review_contents (titulo, topico, conteudo, url_pdf, questoes, active, created_at)
           VALUES (?, ?, ?, ?, ?, 1, NOW())`,
          [art.titulo, art.topico, art.conteudo, null, JSON.stringify(art.questoes)]
        );
        res.write(`  ✅ Inserido: "${art.titulo}"\n`);
        inseridos++;
      }
    }

    res.write(`\nConcluído: ${inseridos} inseridos, ${atualizados} atualizados.\n`);
    res.end();
  } catch (err: any) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});

// =============================================================================
// Rota: seed dos 50 flashcards de Geometria Espacial
// Cria o baralho "Geometria Espacial" se ainda não existir e insere os cards.
// GET /admin/seed-flashcards-geoespacial?secret=IMPORTAR2024
// =============================================================================

app.get("/admin/seed-flashcards-geoespacial", async (req: any, res: any) => {
  const secret = req.query.secret as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");

  let conn: any;
  try {
    conn = await pool.getConnection();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Iniciando seed de flashcards de Geometria Espacial...\n\n");

    const DECK_TITLE = "Geometria Espacial";

    // 1. Busca ou cria o deck
    let [decks]: any[] = await conn.query(
      "SELECT id FROM flashcard_decks WHERE title = ? LIMIT 1",
      [DECK_TITLE]
    );
    let deckId: number;
    if (decks.length > 0) {
      deckId = decks[0].id;
      res.write(`Baralho "${DECK_TITLE}" já existia (id=${deckId}).\n`);
    } else {
      const [insertRes]: any = await conn.query(
        `INSERT INTO flashcard_decks (title, description, color, active, created_at)
         VALUES (?, ?, ?, 1, NOW())`,
        [
          DECK_TITLE,
          "Fórmulas e conceitos de sólidos: prismas, cilindros, cones, pirâmides, esferas, troncos, Cavalieri, poliedros de Platão e Euler.",
          "#00796B",
        ]
      );
      deckId = insertRes.insertId;
      res.write(`✅ Baralho "${DECK_TITLE}" criado (id=${deckId}).\n`);
    }

    // 2. Busca cards existentes para evitar duplicatas
    const [existing]: any[] = await conn.query(
      "SELECT LEFT(front, 200) as front FROM flashcards WHERE deck_id = ?",
      [deckId]
    );
    const existingFronts = new Set(existing.map((r: any) => r.front.trim().slice(0, 80)));

    const [lastIdx]: any[] = await conn.query(
      "SELECT COALESCE(MAX(order_index), -1) as maxIdx FROM flashcards WHERE deck_id = ?",
      [deckId]
    );
    let orderIndex = (lastIdx[0]?.maxIdx ?? -1) + 1;

    let inseridos = 0;
    let pulados = 0;
    for (const card of GEO_ESPACIAL_CARDS) {
      const frontKey = card.front.trim().slice(0, 80);
      if (existingFronts.has(frontKey)) {
        res.write(`  [skip] ${frontKey.replace(/\n/g, " ↵ ").slice(0, 60)}\n`);
        pulados++;
        continue;
      }
      await conn.query(
        `INSERT INTO flashcards (deck_id, front, back, order_index, active, created_at)
         VALUES (?, ?, ?, ?, 1, NOW())`,
        [deckId, card.front, card.back, orderIndex++]
      );
      res.write(`  ✅ ${frontKey.replace(/\n/g, " ↵ ").slice(0, 70)}\n`);
      inseridos++;
    }

    res.write(`\nConcluído: ${inseridos} cards inseridos, ${pulados} ignorados (já existiam).\n`);
    res.end();
  } catch (err: any) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});

// =============================================================================
// Rota: importar questões do ENEM
// URL: /admin/import?secret=IMPORTAR2024&year=2023
// =============================================================================

app.get("/admin/import", async (req, res) => {
  const secret = req.query.secret as string;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");

  const year = Number(req.query.year ?? 2023);
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  const log = (msg: string) => { console.log(msg); res.write(msg + "\n"); };
  log(`Iniciando importação — ENEM ${year}...`);

  try {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    const allQuestions: any[] = [];

    while (hasMore) {
      await delay(1200);
      const url = `https://api.enem.dev/v1/exams/${year}/questions?limit=${limit}&offset=${offset}`;
      const resp = await fetch(url);
      if (!resp.ok) { log(`Erro HTTP ${resp.status}`); break; }
      const data = await resp.json();
      const mathQs = data.questions.filter((q: any) => q.discipline === "matematica");
      allQuestions.push(...mathQs);
      log(`  Página ${offset}: ${mathQs.length} questões de matemática`);
      hasMore = data.metadata.hasMore;
      offset += limit;
    }

    log(`\nTotal: ${allQuestions.length} questões`);

    function estimateTRI(index: number) {
      const r = index / 45;
      if (r < 0.25) return { a: 0.8, b: -1.5, c: 0.2, nivel: "Baixa" as const };
      if (r < 0.50) return { a: 1.0, b: -0.5, c: 0.2, nivel: "Média" as const };
      if (r < 0.75) return { a: 1.2, b: 0.5, c: 0.2, nivel: "Alta" as const };
      return { a: 1.5, b: 1.5, c: 0.2, nivel: "Muito Alta" as const };
    }

    let inseridas = 0;
    let ignoradas = 0;
    let erros = 0;

    for (const q of allQuestions) {
      // -----------------------------------------------------------------------
      // 1. Alternativas: preserva imagens como [Imagem: url] para renderização
      // -----------------------------------------------------------------------
      const alternativas: Record<string, string> = {};
      for (const alt of (q.alternatives ?? [])) {
        if (alt.text && alt.file) {
          // Texto + imagem: concatena
          alternativas[alt.letter] = `${alt.text}\n[Imagem: ${alt.file}]`;
        } else if (alt.file) {
          // Só imagem: usa tag renderizável (não descarta!)
          alternativas[alt.letter] = `[Imagem: ${alt.file}]`;
        } else {
          alternativas[alt.letter] = alt.text ?? "";
        }
      }
      // Descarta só se não tiver nenhuma alternativa mapeada
      if (Object.keys(alternativas).length < 2) {
        ignoradas++;
        log(`  [ignorada] Questão ${q.index}/${q.year}: apenas ${Object.keys(alternativas).length} alternativa(s).`);
        continue;
      }

      // -----------------------------------------------------------------------
      // 2. Enunciado: context + alternativesIntroduction (o "comando")
      //    Converte qualquer formato de imagem Markdown para [Imagem: url]
      // -----------------------------------------------------------------------

      // Converte formatos vindos da API para o padrão da plataforma:
      //   ![](url)       → [Imagem: url]
      //   ![alt](url)    → [Imagem: url]
      function normalizeImages(text: string): string {
        return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "[Imagem: $2]");
      }

      const partes: string[] = [];
      if (q.context)                  partes.push(normalizeImages(q.context.trim()));
      if (q.alternativesIntroduction) partes.push(normalizeImages(q.alternativesIntroduction.trim()));

      // Adiciona imagens do campo files que ainda não estejam no enunciado
      const textoAtual = partes.join(" ");
      for (const imgUrl of (q.files ?? [])) {
        if (!textoAtual.includes(imgUrl)) {
          partes.push(`[Imagem: ${imgUrl}]`);
        }
      }

      const enunciado = partes.join("\n\n") || `Questão ${q.index} — ENEM ${q.year}`;

      // -----------------------------------------------------------------------
      // 3. Insere no banco
      // -----------------------------------------------------------------------
      const tri = estimateTRI(q.index);
      try {
        await db.insert(questions).values({
          fonte: "ENEM", ano: q.year,
          conteudo_principal: "Matemática e suas Tecnologias",
          tags: ["Matemática", "ENEM", `ENEM ${q.year}`],
          nivel_dificuldade: tri.nivel,
          param_a: tri.a, param_b: tri.b, param_c: tri.c,
          enunciado,
          url_imagem: null,          // imagens agora ficam inline no enunciado
          alternativas, gabarito: (q.correctAlternative ?? "A").toUpperCase(),
          comentario_resolucao: null, active: true,
        });
        inseridas++;
        if (inseridas % 5 === 0) log(`  ${inseridas} inseridas...`);
      } catch (err: any) {
        erros++;
        log(`  [erro] Questão ${q.index}/${q.year}: ${err.message}`);
      }
    }

    log(`\nConcluído: ${inseridas} inseridas, ${ignoradas} ignoradas (sem alternativas), ${erros} erros de banco.`);
  } catch (err: any) {
    log(`Erro: ${err.message}`);
  }
  res.end();
});

// =============================================================================
// Rota: upload de imagem para Cloudinary (somente admin)
// POST /api/upload-image  —  multipart/form-data, campo "file"
// =============================================================================

app.post("/api/upload-image", upload.single("file"), async (req: any, res: any) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Não autorizado." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({ error: "Cloudinary não configurado. Adicione as variáveis no Railway." });
  }

  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "questoes-enem", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      ).end(req.file!.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ error: `Erro no upload: ${err.message}` });
  }
});

// =============================================================================
// Rota: upload de PDF para Cloudinary (somente admin)
// POST /api/upload-pdf  —  multipart/form-data, campo "file"
// =============================================================================

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Apenas arquivos PDF são permitidos."));
  },
});

app.post("/api/upload-pdf", uploadPdf.single("file"), async (req: any, res: any) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "Não autorizado." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({ error: "Cloudinary não configurado." });
  }

  try {
    // Tenta "image" (aceito em todos os planos Cloudinary, incluindo free)
    // Cloudinary suporta PDFs como resource_type "image" e entrega o arquivo original
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "revise-pdfs", resource_type: "image", format: "pdf" },
        (error, result) => (error ? reject(error) : resolve(result))
      ).end(req.file!.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ error: `Erro no upload: ${err.message}` });
  }
});

// =============================================================================
// tRPC
// =============================================================================

app.use("/api/trpc", createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: !isProd ? ({ path, error }) => console.error(`[tRPC] /${path}:`, error.message) : undefined,
}));

// =============================================================================
// Frontend estático
// =============================================================================

if (isProd) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// =============================================================================
// Migrations automáticas — executadas no startup, idempotentes (IF NOT EXISTS)
// =============================================================================
async function runMigrations() {
  let conn: any;
  try {
    conn = await pool.getConnection();

    // ── url_video ────────────────────────────────────────────────────────────
    const [colRows]: any[] = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'questions' AND COLUMN_NAME = 'url_video'
    `);
    if (Array.isArray(colRows) && colRows.length > 0) {
      console.log("✅ Migration: url_video já existe.");
    } else {
      await conn.query(`ALTER TABLE questions ADD COLUMN url_video VARCHAR(512) NULL AFTER comentario_resolucao`);
      console.log("✅ Migration: url_video adicionada.");
    }

    // ── study_schedule ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS study_schedule (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        user_id     INT NOT NULL,
        day_of_week TINYINT NOT NULL,
        start_time  VARCHAR(5) NOT NULL,
        end_time    VARCHAR(5) NOT NULL,
        topic       TEXT NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await conn.query(`ALTER TABLE study_schedule MODIFY COLUMN topic TEXT NOT NULL`);
    console.log("✅ Migration: study_schedule OK.");

    // ── flashcard_decks ───────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS flashcard_decks (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        color       VARCHAR(20) NOT NULL DEFAULT '#009688',
        active      TINYINT(1)  NOT NULL DEFAULT 1,
        created_at  TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("✅ Migration: flashcard_decks OK.");

    // ── flashcards ────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id           INT PRIMARY KEY AUTO_INCREMENT,
        deck_id      INT NOT NULL,
        front        TEXT NOT NULL,
        back         TEXT NOT NULL,
        front_image  VARCHAR(512),
        back_image   VARCHAR(512),
        order_index  INT NOT NULL DEFAULT 0,
        active       TINYINT(1) NOT NULL DEFAULT 1,
        created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
        FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Migration: flashcards OK.");

    // ── flashcard_progress ────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS flashcard_progress (
        id               INT PRIMARY KEY AUTO_INCREMENT,
        user_id          INT NOT NULL,
        card_id          INT NOT NULL,
        easiness_factor  FLOAT NOT NULL DEFAULT 2.5,
        \`interval\`     INT   NOT NULL DEFAULT 0,
        repetitions      INT   NOT NULL DEFAULT 0,
        next_review      TIMESTAMP NULL,
        last_reviewed    TIMESTAMP NULL,
        created_at       TIMESTAMP DEFAULT NOW() NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (card_id) REFERENCES flashcards(id) ON DELETE CASCADE,
        UNIQUE KEY uk_user_card (user_id, card_id)
      )
    `);
    console.log("✅ Migration: flashcard_progress OK.");

  } catch (err: any) {
    console.error("❌ Migration falhou:", err?.message ?? err);
  } finally {
    if (conn) conn.release();
  }
}

runMigrations().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 http://localhost:${PORT} [${process.env.NODE_ENV ?? "development"}]`);
  });
});

export type { AppRouter } from "./router";
