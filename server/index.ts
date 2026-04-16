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
  // ── Geometria Plana (avançada) ───────────────────────────────────────────
  {
    front: "Fórmula de Heron\n\nQual é a área de um triângulo em função dos três lados $a$, $b$ e $c$?",
    back:  "$$A = \\sqrt{s(s-a)(s-b)(s-c)}$$\n\n$s = \\dfrac{a+b+c}{2}$ é o semiperímetro do triângulo.",
  },
  {
    front: "Área do triângulo — fórmula trigonométrica\n\nComo calcular a área usando dois lados e o ângulo entre eles?",
    back:  "$$A = \\frac{a \\cdot b \\cdot \\operatorname{sen}(C)}{2}$$\n\n$C$ é o ângulo formado pelos lados $a$ e $b$.",
  },
  {
    front: "Lei dos Cossenos\n\nRelacione o lado $c$ com os lados $a$, $b$ e o ângulo $C$ (ângulo oposto a $c$).",
    back:  "$$c^2 = a^2 + b^2 - 2ab\\cos C$$\n\nGeneralização do Teorema de Pitágoras. Quando $C = 90°$, temos $c^2 = a^2 + b^2$.",
  },
  {
    front: "Lei dos Senos\n\nQual é a relação entre lados e ângulos opostos em qualquer triângulo?",
    back:  "$$\\frac{a}{\\operatorname{sen} A} = \\frac{b}{\\operatorname{sen} B} = \\frac{c}{\\operatorname{sen} C} = 2R$$\n\n$R$ é o raio da circunferência circunscrita ao triângulo.",
  },
  {
    front: "Triângulo equilátero — área\n\nSe o lado mede $l$, qual é a área?",
    back:  "$$A = \\frac{l^2\\sqrt{3}}{4}$$\n\nDerivado de Heron com $a = b = c = l$, ou de $A = \\frac{b \\cdot h}{2}$ com $h = \\frac{l\\sqrt{3}}{2}$.",
  },
  {
    front: "Triângulo equilátero — altura\n\nSe o lado mede $l$, qual é a altura $h$?",
    back:  "$$h = \\frac{l\\sqrt{3}}{2}$$\n\nPitágoras no triângulo retângulo formado pela metade da base: $h^2 + \\left(\\frac{l}{2}\\right)^2 = l^2$.",
  },
  {
    front: "Setor circular — área\n\nRaio $r$ e ângulo central $\\theta$ em graus.",
    back:  "$$A = \\frac{\\theta}{360°} \\cdot \\pi r^2$$\n\nEm radianos: $A = \\dfrac{\\theta \\, r^2}{2}$",
  },
  {
    front: "Comprimento do arco\n\nRaio $r$ e ângulo central $\\theta$ em graus.",
    back:  "$$\\ell = \\frac{\\theta}{360°} \\cdot 2\\pi r$$\n\nEm radianos: $\\ell = r\\theta$",
  },
  {
    front: "Raio da circunferência inscrita num triângulo\n\nExpresse $r$ em função da área $A$ e do semiperímetro $s$.",
    back:  "$$r = \\frac{A}{s}$$\n\n$s = \\dfrac{a+b+c}{2}$, $A$ = área do triângulo.",
  },
  {
    front: "Raio da circunferência circunscrita num triângulo\n\nExpresse $R$ em função dos lados $a$, $b$, $c$ e da área $A$.",
    back:  "$$R = \\frac{abc}{4A}$$\n\nTambém: $R = \\dfrac{a}{2\\operatorname{sen} A}$ (Lei dos Senos).",
  },
  // ── Geometria Espacial ──────────────────────────────────────────────────
  {
    front: "Cubo — diagonal do espaço\n\nSe a aresta mede $a$, qual é a diagonal do sólido?",
    back:  "$$d = a\\sqrt{3}$$\n\nAplicando Pitágoras duas vezes: $d^2 = a^2 + a^2 + a^2 = 3a^2$.",
  },
  {
    front: "Paralelepípedo — diagonal do espaço\n\nExpresse $d$ em função das dimensões $a$, $b$ e $c$.",
    back:  "$$d = \\sqrt{a^2 + b^2 + c^2}$$\n\nGeneralização tridimensional do Teorema de Pitágoras.",
  },
  {
    front: "Cilindro — área total\n\nRaio $r$, altura $h$.",
    back:  "$$A_T = 2\\pi r(r + h)$$\n\nÁrea lateral $= 2\\pi r h$, mais duas bases circulares $= 2\\pi r^2$.",
  },
  {
    front: "Cone — geratriz\n\nRelação entre raio $r$, altura $h$ e geratriz $g$.",
    back:  "$$g = \\sqrt{r^2 + h^2}$$\n\nPitágoras no triângulo retângulo axial do cone.",
  },
  {
    front: "Cone — área total\n\nRaio $r$, geratriz $g$.",
    back:  "$$A_T = \\pi r(r + g)$$\n\nÁrea lateral $= \\pi r g$, base $= \\pi r^2$.",
  },
  {
    front: "Esfera — volume\n\nRaio $r$.",
    back:  "$$V = \\frac{4\\pi r^3}{3}$$",
  },
  {
    front: "Esfera — área da superfície\n\nRaio $r$.",
    back:  "$$A = 4\\pi r^2$$",
  },
  {
    front: "Tronco de cone — volume\n\nRaios $R$ (base maior) e $r$ (base menor), altura $h$.",
    back:  "$$V = \\frac{\\pi h}{3}\\left(R^2 + Rr + r^2\\right)$$",
  },
  {
    front: "Prisma — volume\n\nFórmula geral para qualquer prisma.",
    back:  "$$V = A_b \\cdot h$$\n\n$A_b$ = área da base, $h$ = altura. Vale para prismas triangular, quadrangular, hexagonal…",
  },
  {
    front: "Pirâmide — volume\n\nFórmula geral.",
    back:  "$$V = \\frac{A_b \\cdot h}{3}$$\n\n$A_b$ = área da base, $h$ = altura. Um terço do prisma de mesma base e altura.",
  },
  // ── Geometria Analítica ─────────────────────────────────────────────────
  {
    front: "Distância entre dois pontos\n\n$A(x_1, y_1)$ e $B(x_2, y_2)$",
    back:  "$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$",
  },
  {
    front: "Ponto médio de um segmento\n\n$A(x_1, y_1)$ e $B(x_2, y_2)$",
    back:  "$$M = \\left(\\frac{x_1 + x_2}{2},\\; \\frac{y_1 + y_2}{2}\\right)$$",
  },
  {
    front: "Equação reduzida da reta\n\nDescreva a forma geral e o significado dos coeficientes.",
    back:  "$$y = mx + n$$\n\n$m$ = coeficiente angular (inclinação), $n$ = coeficiente linear (intercepto com eixo $y$).",
  },
  {
    front: "Coeficiente angular entre dois pontos\n\n$A(x_1, y_1)$ e $B(x_2, y_2)$",
    back:  "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\operatorname{tg}\\,\\alpha$$\n\n$\\alpha$ é o ângulo que a reta faz com o eixo $x$ positivo.",
  },
  {
    front: "Distância de um ponto a uma reta\n\nPonto $P(x_0, y_0)$, reta $ax + by + c = 0$",
    back:  "$$d = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$$",
  },
  {
    front: "Equação da circunferência\n\nCentro $C(a, b)$, raio $r$.",
    back:  "$$(x - a)^2 + (y - b)^2 = r^2$$\n\nForma geral: $x^2 + y^2 + Dx + Ey + F = 0$",
  },
  {
    front: "Paralelismo de retas\n\n$r_1: y = m_1 x + n_1$ e $r_2: y = m_2 x + n_2$. Quando são paralelas?",
    back:  "$$r_1 \\parallel r_2 \\iff m_1 = m_2 \\text{ e } n_1 \\neq n_2$$\n\nMesmo coeficiente angular, interceptos diferentes.",
  },
  {
    front: "Perpendicularidade de retas\n\nQuando $r_1$ e $r_2$ são perpendiculares?",
    back:  "$$r_1 \\perp r_2 \\iff m_1 \\cdot m_2 = -1$$\n\nOs coeficientes angulares são inversos e com sinais opostos.",
  },
  {
    front: "Área de triângulo por coordenadas\n\n$A(x_1,y_1)$, $B(x_2,y_2)$, $C(x_3,y_3)$",
    back:  "$$A = \\frac{1}{2}\\left|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\\right|$$\n\nFórmula do determinante (regra de Sarrus).",
  },
  {
    front: "Distância entre retas paralelas\n\n$r_1: ax + by + c_1 = 0$ e $r_2: ax + by + c_2 = 0$",
    back:  "$$d = \\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}$$",
  },
];

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
