var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "node:path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// server/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// server/schema.ts
var schema_exports = {};
__export(schema_exports, {
  dailyChallenges: () => dailyChallenges,
  dailyChallengesRelations: () => dailyChallengesRelations,
  dailyReviews: () => dailyReviews,
  dailyReviewsRelations: () => dailyReviewsRelations,
  flashcardDecks: () => flashcardDecks,
  flashcardProgress: () => flashcardProgress,
  flashcards: () => flashcards,
  formulas: () => formulas,
  questions: () => questions,
  reviewContents: () => reviewContents,
  simulationAnswers: () => simulationAnswers,
  simulationAnswersRelations: () => simulationAnswersRelations,
  simulations: () => simulations,
  simulationsRelations: () => simulationsRelations,
  studySchedule: () => studySchedule,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
  index,
  json,
  text,
  float
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
var users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["student", "admin"]).notNull().default("student"),
  active: boolean("active").notNull().default(true),
  // Controlo de assinatura — null = sem expiração (admin/free)
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var questions = mysqlTable(
  "questions",
  {
    id: int("id").primaryKey().autoincrement(),
    fonte: varchar("fonte", { length: 50 }).notNull().default("ENEM"),
    ano: int("ano"),
    conteudo_principal: varchar("conteudo_principal", { length: 100 }).notNull(),
    tags: json("tags").$type().notNull().default([]),
    nivel_dificuldade: mysqlEnum("nivel_dificuldade", [
      "Muito Baixa",
      "Baixa",
      "M\xE9dia",
      "Alta",
      "Muito Alta"
    ]).notNull().default("M\xE9dia"),
    param_a: float("param_a").notNull().default(1),
    param_b: float("param_b").notNull().default(0),
    param_c: float("param_c").notNull().default(0.2),
    enunciado: text("enunciado").notNull(),
    url_imagem: varchar("url_imagem", { length: 512 }),
    alternativas: json("alternativas").$type().notNull(),
    gabarito: varchar("gabarito", { length: 1 }).notNull(),
    comentario_resolucao: text("comentario_resolucao"),
    url_video: varchar("url_video", { length: 512 }),
    active: boolean("active").notNull().default(true),
    auditada: boolean("auditada").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
  },
  (t2) => ({
    idxConteudo: index("idx_conteudo_principal").on(t2.conteudo_principal),
    idxActive: index("idx_active").on(t2.active)
  })
);
var simulations = mysqlTable(
  "simulations",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    stage: int("stage").notNull().default(1),
    score: float("score"),
    triTheta: float("tri_theta"),
    correctCount: int("correct_count"),
    totalQuestions: int("total_questions"),
    totalTimeSeconds: int("total_time_seconds"),
    status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).notNull().default("in_progress"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
  },
  (t2) => ({
    idxUser: index("idx_user_id").on(t2.userId),
    idxUserStage: index("idx_user_stage").on(t2.userId, t2.stage)
  })
);
var simulationAnswers = mysqlTable(
  "simulation_answers",
  {
    id: int("id").primaryKey().autoincrement(),
    simulationId: int("simulation_id").notNull().references(() => simulations.id, { onDelete: "cascade" }),
    questionId: int("question_id").notNull().references(() => questions.id, { onDelete: "restrict" }),
    selectedAnswer: varchar("selected_answer", { length: 1 }),
    isCorrect: boolean("is_correct"),
    timeSpentSeconds: int("time_spent_seconds"),
    questionOrder: int("question_order").notNull(),
    answeredAt: timestamp("answered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (t2) => ({
    idxSimulation: index("idx_simulation_id").on(t2.simulationId)
  })
);
var usersRelations = relations(users, ({ many }) => ({
  simulations: many(simulations)
}));
var simulationsRelations = relations(simulations, ({ one, many }) => ({
  user: one(users, { fields: [simulations.userId], references: [users.id] }),
  answers: many(simulationAnswers)
}));
var simulationAnswersRelations = relations(simulationAnswers, ({ one }) => ({
  simulation: one(simulations, { fields: [simulationAnswers.simulationId], references: [simulations.id] }),
  question: one(questions, { fields: [simulationAnswers.questionId], references: [questions.id] })
}));
var dailyChallenges = mysqlTable(
  "daily_challenges",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    challengeDate: varchar("challenge_date", { length: 10 }).notNull(),
    // YYYY-MM-DD
    questionIds: json("question_ids").$type().notNull(),
    answers: json("answers").$type().notNull().default({}),
    completed: boolean("completed").notNull().default(false),
    correctCount: int("correct_count"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (t2) => ({
    idxUserDate: index("idx_user_date").on(t2.userId, t2.challengeDate)
  })
);
var dailyChallengesRelations = relations(dailyChallenges, ({ one }) => ({
  user: one(users, { fields: [dailyChallenges.userId], references: [users.id] })
}));
var reviewContents = mysqlTable(
  "review_contents",
  {
    id: int("id").primaryKey().autoincrement(),
    titulo: varchar("titulo", { length: 200 }).notNull(),
    conteudo: text("conteudo").notNull().default(""),
    // suporta LaTeX; vazio quando usa PDF
    url_pdf: varchar("url_pdf", { length: 500 }),
    // URL Cloudinary do PDF (opcional)
    topico: varchar("topico", { length: 100 }),
    questoes: json("questoes").$type().notNull().default([]),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
  },
  (t2) => ({
    idxActive: index("idx_review_active").on(t2.active)
  })
);
var dailyReviews = mysqlTable(
  "daily_reviews",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    reviewDate: varchar("review_date", { length: 10 }).notNull(),
    // YYYY-MM-DD
    contentId: int("content_id").notNull().references(() => reviewContents.id),
    answers: json("answers").$type().notNull().default({}),
    completed: boolean("completed").notNull().default(false),
    correctCount: int("correct_count"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (t2) => ({
    idxUserDate: index("idx_review_user_date").on(t2.userId, t2.reviewDate)
  })
);
var dailyReviewsRelations = relations(dailyReviews, ({ one }) => ({
  user: one(users, { fields: [dailyReviews.userId], references: [users.id] }),
  content: one(reviewContents, { fields: [dailyReviews.contentId], references: [reviewContents.id] })
}));
var formulas = mysqlTable("formulas", {
  id: int("id").primaryKey().autoincrement(),
  secao: varchar("secao", { length: 100 }).notNull(),
  cor: varchar("cor", { length: 20 }).notNull().default("#01738d"),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  formula: text("formula").notNull(),
  descricao: text("descricao").notNull(),
  ordem: int("ordem").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var studySchedule = mysqlTable("study_schedule", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dayOfWeek: int("day_of_week").notNull(),
  // 1=Seg … 6=Sáb
  startTime: varchar("start_time", { length: 5 }).notNull(),
  // "08:00"
  endTime: varchar("end_time", { length: 5 }).notNull(),
  // "10:00"
  topic: text("topic").notNull(),
  // JSON array de strings: ["Funções","Geometria Plana"]
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var flashcardDecks = mysqlTable("flashcard_decks", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 20 }).notNull().default("#009688"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var flashcards = mysqlTable("flashcards", {
  id: int("id").primaryKey().autoincrement(),
  deckId: int("deck_id").notNull().references(() => flashcardDecks.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  frontImage: varchar("front_image", { length: 512 }),
  backImage: varchar("back_image", { length: 512 }),
  orderIndex: int("order_index").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var flashcardProgress = mysqlTable(
  "flashcard_progress",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    cardId: int("card_id").notNull().references(() => flashcards.id, { onDelete: "cascade" }),
    easinessFactor: float("easiness_factor").notNull().default(2.5),
    interval: int("interval").notNull().default(0),
    // dias até próxima revisão
    repetitions: int("repetitions").notNull().default(0),
    // revisões bem-sucedidas consecutivas
    nextReview: timestamp("next_review"),
    // null = card novo, nunca visto
    lastReviewed: timestamp("last_reviewed"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (t2) => ({
    idxUserCard: index("idx_fc_user_card").on(t2.userId, t2.cardId),
    idxNextReview: index("idx_fc_next_review").on(t2.userId, t2.nextReview)
  })
);

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL n\xE3o definida");
}
var pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10
});
var db = drizzle(pool, { schema: schema_exports, mode: "default" });

// server/trpc.ts
async function createContext({
  req,
  res
}) {
  const user = req.user ?? null;
  return { db, req, res, user };
}
var t = initTRPC.context().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  }
});
var createTRPCRouter = t.router;
var middleware = t.middleware;
var isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "\xC9 necess\xE1rio estar autenticado para aceder a este recurso."
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var isAdmin = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "N\xE3o autenticado." });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acesso restrito a administradores."
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var publicProcedure = t.procedure;
var protectedProcedure = t.procedure.use(isAuthenticated);
var adminProcedure = t.procedure.use(isAdmin);

// server/questions.router.ts
import { z } from "zod";
import { eq, and, sql, asc, desc } from "drizzle-orm";
import { TRPCError as TRPCError2 } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
var NivelDificuldadeEnum = z.enum(["Muito Baixa", "Baixa", "M\xE9dia", "Alta", "Muito Alta"]);
var QuestionBaseSchema = z.object({
  fonte: z.string().max(50).default("ENEM"),
  ano: z.number().int().min(2e3).max(2100).optional(),
  conteudo_principal: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  nivel_dificuldade: NivelDificuldadeEnum.default("M\xE9dia"),
  param_a: z.number().min(0.1).max(4).default(1),
  param_b: z.number().min(-4).max(4).default(0),
  param_c: z.number().min(0).max(0.5).default(0.2),
  enunciado: z.string().min(5),
  url_imagem: z.string().url().nullable().optional(),
  alternativas: z.record(z.string().min(1).max(5), z.any()),
  gabarito: z.string().length(1),
  comentario_resolucao: z.string().optional(),
  url_video: z.string().url().nullable().optional()
});
var questionsRouter = createTRPCRouter({
  list: protectedProcedure.input(z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
    conteudo: z.string().optional(),
    fonte: z.string().optional(),
    tag: z.string().optional(),
    // topic = busca combinada em conteudo_principal (LIKE) OU tags (exato).
    // Usado por links vindos do Planner/Dashboard onde o vocabulário do
    // ENEM_TOPICS pode não bater exatamente com nenhum dos dois campos.
    topic: z.string().optional(),
    nivel_dificuldade: NivelDificuldadeEnum.optional(),
    activeOnly: z.boolean().default(true),
    orderBy: z.enum(["id", "ano", "conteudo_principal", "nivel_dificuldade", "createdAt"]).default("ano"),
    orderDir: z.enum(["asc", "desc"]).default("asc")
  })).query(async ({ ctx, input }) => {
    const { page, pageSize, activeOnly, orderBy, orderDir } = input;
    const offset = (page - 1) * pageSize;
    const filters = [];
    if (activeOnly) filters.push(eq(questions.active, true));
    if (input.conteudo) filters.push(sql`${questions.conteudo_principal} LIKE ${"%" + input.conteudo + "%"}`);
    if (input.fonte) filters.push(eq(questions.fonte, input.fonte));
    if (input.nivel_dificuldade) filters.push(eq(questions.nivel_dificuldade, input.nivel_dificuldade));
    if (input.tag) filters.push(sql`JSON_CONTAINS(${questions.tags}, JSON_QUOTE(${input.tag}))`);
    if (input.topic) {
      filters.push(sql`(
          ${questions.conteudo_principal} LIKE ${"%" + input.topic + "%"}
          OR JSON_CONTAINS(${questions.tags}, JSON_QUOTE(${input.topic}))
        )`);
    }
    const where = filters.length > 0 ? and(...filters) : void 0;
    const orderColumn = orderBy === "conteudo_principal" ? questions.conteudo_principal : orderBy === "nivel_dificuldade" ? questions.nivel_dificuldade : orderBy === "createdAt" ? questions.createdAt : orderBy === "ano" ? questions.ano : questions.id;
    const orderFn = orderDir === "asc" ? asc : desc;
    const orderClauses = orderBy === "id" ? [orderFn(questions.id)] : [orderFn(orderColumn), asc(questions.id)];
    const [rows, [{ count }]] = await Promise.all([
      ctx.db.select().from(questions).where(where).orderBy(...orderClauses).limit(pageSize).offset(offset),
      ctx.db.select({ count: sql`COUNT(*)` }).from(questions).where(where)
    ]);
    return {
      questions: rows,
      pagination: { total: Number(count), page, pageSize, totalPages: Math.ceil(Number(count) / pageSize) }
    };
  }),
  getByIdAdmin: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
    if (!q) throw new TRPCError2({ code: "NOT_FOUND", message: "Quest\xE3o n\xE3o encontrada." });
    return q;
  }),
  create: adminProcedure.input(QuestionBaseSchema).mutation(async ({ ctx, input }) => {
    const [result] = await ctx.db.insert(questions).values({
      ...input,
      gabarito: input.gabarito.toUpperCase(),
      url_imagem: input.url_imagem ?? null,
      url_video: input.url_video ?? null,
      active: true
    });
    return { id: Number(result.insertId), success: true };
  }),
  update: adminProcedure.input(QuestionBaseSchema.partial().extend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const updateData = { ...data };
    if (data.gabarito) updateData.gabarito = data.gabarito.toUpperCase();
    if (data.url_imagem !== void 0) updateData.url_imagem = data.url_imagem ?? null;
    if (data.url_video !== void 0) updateData.url_video = data.url_video ?? null;
    await ctx.db.update(questions).set(updateData).where(eq(questions.id, id));
    return { success: true };
  }),
  toggleActive: adminProcedure.input(z.object({ id: z.number().int().positive(), active: z.boolean() })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(questions).set({ active: input.active }).where(eq(questions.id, input.id));
    return { success: true };
  }),
  delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(simulationAnswers).where(eq(simulationAnswers.questionId, input.id));
    await ctx.db.delete(questions).where(eq(questions.id, input.id));
    return { success: true };
  }),
  deleteAll: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(simulationAnswers);
    await ctx.db.delete(questions);
    return { success: true };
  }),
  // ─── Auditoria com Gemini ──────────────────────────────────────────────────
  auditQuestion: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "GEMINI_API_KEY n\xE3o configurada no servidor. Adicione a vari\xE1vel no Railway." });
    const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
    if (!q) throw new TRPCError2({ code: "NOT_FOUND", message: "Quest\xE3o n\xE3o encontrada." });
    const alts = Object.entries(q.alternativas).sort().map(([k, v]) => `${k}) ${typeof v === "object" ? v.text ?? "" : v}`).join("\n");
    const TAGS_VALIDAS = [
      "An\xE1lise Combinat\xF3ria",
      "\xC1reas de Figuras Planas",
      "Convers\xE3o de Unidades",
      "Equa\xE7\xF5es e Inequa\xE7\xF5es",
      "Escala",
      "Estat\xEDstica",
      "Fun\xE7\xE3o Composta",
      "Fun\xE7\xE3o do Primeiro Grau",
      "Fun\xE7\xE3o Exponencial",
      "Fun\xE7\xE3o Logar\xEDtmica",
      "Fun\xE7\xE3o Quadr\xE1tica",
      "Fun\xE7\xF5es de 1\xBA e 2\xBA Grau",
      "Geometria Anal\xEDtica",
      "Geometria Espacial",
      "Geometria Plana",
      "Leitura de Gr\xE1ficos e Tabelas",
      "Logaritmos",
      "Matem\xE1tica Financeira",
      "Medidas de Tend\xEAncia Central",
      "No\xE7\xF5es de L\xF3gica Matem\xE1tica",
      "Opera\xE7\xF5es B\xE1sicas",
      "Polin\xF4mios",
      "Porcentagem",
      "Probabilidade",
      "Progress\xE3o Aritm\xE9tica",
      "Progress\xE3o Geom\xE9trica",
      "Raz\xE3o, Propor\xE7\xE3o e Regra de Tr\xEAs",
      "Sequ\xEAncias",
      "Trigonometria",
      "Visualiza\xE7\xE3o Espacial/Proje\xE7\xE3o Ortogonal"
    ];
    const tagsAtuais = Array.isArray(q.tags) && q.tags.length > 0 ? q.tags.join(", ") : "Nenhuma tag definida";
    const systemInstruction = `Voc\xEA \xE9 um especialista em elabora\xE7\xE3o de quest\xF5es para o ENEM e vestibulares brasileiros.

REGRAS ABSOLUTAS DE FORMATA\xC7\xC3O \u2014 nunca as ignore:
1. Responda SEMPRE em portugu\xEAs do Brasil. Nunca em ingl\xEAs.
2. Toda express\xE3o matem\xE1tica DEVE estar em LaTeX com delimitadores $ ou $$.
   - Inline: $P = \\frac{1}{2}$, $x^2 + 3x - 4 = 0$, $\\frac{3}{4}$
   - Bloco:  $$P(A) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}$$
3. PROIBIDO escrever f\xF3rmulas em texto puro: nunca "1/2", "x^2", "(1/2)^3" \u2014 sempre dentro de $.
4. PROIBIDO usar crases, backticks ou marca\xE7\xE3o markdown (**, *, _) nos campos de texto.
5. Moeda brasileira: escreva sempre "R$ 675,00" como texto simples \u2014 NUNCA use "R\\$" nem coloque valores monet\xE1rios dentro de $ $.
6. O campo "comentario_resolucao_reescrito" deve ser uma resolu\xE7\xE3o passo a passo completa em portugu\xEAs, com express\xF5es matem\xE1ticas em $...$ ou $$...$$, e texto corrido sem markdown.`;
    const prompt = `QUEST\xC3O #${q.id}
Fonte: ${q.fonte} \xB7 Ano: ${q.ano ?? "N\xE3o informado"}
Conte\xFAdo declarado: ${q.conteudo_principal}
Tags atuais: ${tagsAtuais}
Dificuldade declarada: ${q.nivel_dificuldade}

ENUNCIADO:
${q.enunciado}

ALTERNATIVAS:
${alts}

GABARITO DECLARADO: ${q.gabarito}
RESOLU\xC7\xC3O EXISTENTE: ${q.comentario_resolucao ?? "N\xE3o informada"}

TAGS DISPON\xCDVEIS NO SISTEMA (use APENAS estas, escolha as que realmente se aplicam):
${TAGS_VALIDAS.join(", ")}

Responda em JSON puro (sem markdown, sem bloco de c\xF3digo) com exatamente esta estrutura:
{
  "disciplina": "Matem\xE1tica" | "F\xEDsica" | "Qu\xEDmica" | "Outra",
  "disciplina_justificativa": "Breve explica\xE7\xE3o em portugu\xEAs",
  "gabarito_correto": true | false,
  "gabarito_sugerido": "A" | "B" | "C" | "D" | "E" | null,
  "dificuldade_real": "Muito Baixa" | "Baixa" | "M\xE9dia" | "Alta" | "Muito Alta",
  "dificuldade_compativel": true | false,
  "tags_sugeridas": ["array com as tags da lista acima que se aplicam"],
  "tags_atuais_corretas": true | false,
  "nota_qualidade": 1 a 10,
  "problemas": ["lista de problemas em portugu\xEAs, ou array vazio se nenhum"],
  "sugestoes": ["lista de sugest\xF5es em portugu\xEAs"],
  "parecer": "Texto de 2-3 frases em portugu\xEAs com avalia\xE7\xE3o geral",
  "enunciado_reescrito": "Enunciado melhorado em portugu\xEAs com LaTeX correto, ou null",
  "comentario_resolucao_reescrito": "Resolu\xE7\xE3o passo a passo COMPLETA em portugu\xEAs com LaTeX ($...$ e $$...$$) para TODA express\xE3o matem\xE1tica, ou null"
}`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: `Erro na API Gemini: ${err}` });
    }
    const data = await res.json();
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
      throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: `Gemini encerrou com motivo: ${finishReason}. Tente novamente ou simplifique a quest\xE3o.` });
    }
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!rawText) {
      throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "Gemini n\xE3o retornou conte\xFAdo. Verifique a cota da API ou tente novamente." });
    }
    const parseJson = (text2) => {
      try {
        return JSON.parse(text2);
      } catch {
        return null;
      }
    };
    const fixLatexBackslashes = (raw) => {
      return raw.replace(/\\\\/g, "\0DS\0").replace(/\\"/g, "\0QT\0").replace(/\\n/g, "\0NL\0").replace(/\\/g, "\\\\").replace(/\x00DS\x00/g, "\\\\").replace(/\x00QT\x00/g, '\\"').replace(/\x00NL\x00/g, "\\n");
    };
    const audit = parseJson(rawText) ?? parseJson(fixLatexBackslashes(rawText));
    if (!audit) {
      throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "Gemini retornou resposta que n\xE3o p\xF4de ser interpretada. Tente novamente." });
    }
    return { success: true, audit, questionId: q.id };
  }),
  // ─── Auditoria com Claude ──────────────────────────────────────────────────
  auditQuestionClaude: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "ANTHROPIC_API_KEY n\xE3o configurada no servidor. Adicione a vari\xE1vel no Railway." });
    const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
    if (!q) throw new TRPCError2({ code: "NOT_FOUND", message: "Quest\xE3o n\xE3o encontrada." });
    const alts = Object.entries(q.alternativas).sort().map(([k, v]) => `${k}) ${typeof v === "object" ? v.text ?? "" : v}`).join("\n");
    const TAGS_VALIDAS = [
      "Raz\xE3o, Propor\xE7\xE3o e Regra de Tr\xEAs",
      "Porcentagem",
      "Escala",
      "Opera\xE7\xF5es B\xE1sicas",
      "Convers\xE3o de Unidades",
      "Geometria Espacial",
      "Geometria Plana",
      "Visualiza\xE7\xE3o Espacial/Proje\xE7\xE3o Ortogonal",
      "Trigonometria",
      "Leitura de Gr\xE1ficos e Tabelas",
      "Medidas de Tend\xEAncia Central",
      "Estat\xEDstica",
      "Probabilidade",
      "Fun\xE7\xF5es de 1\xBA e 2\xBA Grau",
      "Fun\xE7\xE3o do Primeiro Grau",
      "Fun\xE7\xE3o Quadr\xE1tica",
      "Fun\xE7\xE3o Exponencial",
      "Fun\xE7\xE3o Logar\xEDtmica",
      "Equa\xE7\xF5es e Inequa\xE7\xF5es",
      "Sequ\xEAncias",
      "Progress\xE3o Aritm\xE9tica",
      "Progress\xE3o Geom\xE9trica",
      "Matem\xE1tica Financeira",
      "An\xE1lise Combinat\xF3ria",
      "Logaritmos",
      "No\xE7\xF5es de L\xF3gica Matem\xE1tica",
      "\xC1reas de Figuras Planas"
    ];
    const tagsAtuais = Array.isArray(q.tags) && q.tags.length > 0 ? q.tags.join(", ") : "Nenhuma tag definida";
    const latexInstructions = `
REGRAS OBRIGAT\xD3RIAS DE FORMATA\xC7\xC3O (siga sem exce\xE7\xE3o):
- Responda SEMPRE em portugu\xEAs do Brasil.
- Use LaTeX para todas as express\xF5es matem\xE1ticas.
- F\xF3rmulas inline: $f(x)$, $T^2 - 4$, $P = \\frac{1}{2}$
- F\xF3rmulas em bloco (equa\xE7\xF5es centralizadas): $$V = T^2 - 4$$
- NUNCA use crases, backticks (\`) ou markdown para math. Apenas $ e $$.
- NUNCA escreva f\xF3rmulas em texto puro como "T^2-4" \u2014 sempre com $.
- Textos normais (parecer, problemas, sugest\xF5es) em portugu\xEAs corrido, sem LaTeX desnecess\xE1rio.`;
    const prompt = `Voc\xEA \xE9 um especialista em elabora\xE7\xE3o de quest\xF5es para o ENEM e vestibulares brasileiros. Analise a quest\xE3o abaixo com rigor t\xE9cnico e pedag\xF3gico.

${latexInstructions}

QUEST\xC3O #${q.id}
Fonte: ${q.fonte} \xB7 Ano: ${q.ano ?? "N\xE3o informado"}
Conte\xFAdo declarado: ${q.conteudo_principal}
Tags atuais: ${tagsAtuais}
Dificuldade declarada: ${q.nivel_dificuldade}

ENUNCIADO:
${q.enunciado}

ALTERNATIVAS:
${alts}

GABARITO DECLARADO: ${q.gabarito}
RESOLU\xC7\xC3O: ${q.comentario_resolucao ?? "N\xE3o informada"}

TAGS DISPON\xCDVEIS NO SISTEMA (use APENAS estas, escolha as que realmente se aplicam):
${TAGS_VALIDAS.join(", ")}

Responda em JSON puro (sem markdown, sem bloco de c\xF3digo) com exatamente esta estrutura:
{
  "disciplina": "Matem\xE1tica" | "F\xEDsica" | "Qu\xEDmica" | "Outra",
  "disciplina_justificativa": "Breve explica\xE7\xE3o em portugu\xEAs",
  "gabarito_correto": true | false,
  "gabarito_sugerido": "A" | "B" | "C" | "D" | "E" | null,
  "dificuldade_real": "Muito Baixa" | "Baixa" | "M\xE9dia" | "Alta" | "Muito Alta",
  "dificuldade_compativel": true | false,
  "tags_sugeridas": ["array com as tags da lista acima que se aplicam"],
  "tags_atuais_corretas": true | false,
  "nota_qualidade": 1 a 10,
  "problemas": ["lista de problemas em portugu\xEAs, ou array vazio se nenhum"],
  "sugestoes": ["lista de sugest\xF5es em portugu\xEAs"],
  "parecer": "Texto de 2-3 frases em portugu\xEAs com avalia\xE7\xE3o geral",
  "enunciado_reescrito": "Enunciado melhorado em portugu\xEAs com LaTeX correto, ou null",
  "comentario_resolucao_reescrito": "Resolu\xE7\xE3o passo a passo em portugu\xEAs com LaTeX correto ($...$ e $$...$$), ou null"
}`;
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }]
    });
    const rawText = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    try {
      const audit = JSON.parse(clean);
      await ctx.db.update(questions).set({ auditada: true }).where(eq(questions.id, input.id));
      return { success: true, audit, questionId: q.id };
    } catch {
      throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "Claude retornou uma resposta em formato inv\xE1lido. Tente novamente." });
    }
  }),
  // ─── Estatísticas de auditoria ────────────────────────────────────────────
  getAuditStats: adminProcedure.query(async ({ ctx }) => {
    const [{ total }] = await ctx.db.select({ total: sql`COUNT(*)` }).from(questions).where(eq(questions.active, true));
    const [{ auditadas }] = await ctx.db.select({ auditadas: sql`COUNT(*)` }).from(questions).where(and(eq(questions.active, true), eq(questions.auditada, true)));
    return { total: Number(total), auditadas: Number(auditadas) };
  }),
  // Marca/desmarca auditada manualmente (sem passar pelo processo de IA)
  toggleAuditada: adminProcedure.input(z.object({
    id: z.number().int().positive(),
    auditada: z.boolean()
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(questions).set({ auditada: input.auditada }).where(eq(questions.id, input.id));
    return { success: true };
  }),
  // ─── Aplica correções sugeridas pela auditoria ─────────────────────────────
  applyAuditFixes: adminProcedure.input(z.object({
    id: z.number().int().positive(),
    gabarito: z.string().length(1).optional(),
    nivel_dificuldade: NivelDificuldadeEnum.optional(),
    enunciado: z.string().min(5).optional(),
    comentario_resolucao: z.string().optional(),
    tags: z.array(z.string()).optional()
  })).mutation(async ({ ctx, input }) => {
    const { id, ...fields } = input;
    const [q] = await ctx.db.select({ id: questions.id }).from(questions).where(eq(questions.id, id)).limit(1);
    if (!q) throw new TRPCError2({ code: "NOT_FOUND", message: "Quest\xE3o n\xE3o encontrada." });
    const NIVEIS_VALIDOS = ["Muito Baixa", "Baixa", "M\xE9dia", "Alta", "Muito Alta"];
    const updateData = {};
    if (fields.gabarito) updateData.gabarito = fields.gabarito.toUpperCase();
    if (fields.nivel_dificuldade && NIVEIS_VALIDOS.includes(fields.nivel_dificuldade))
      updateData.nivel_dificuldade = fields.nivel_dificuldade;
    if (fields.enunciado) updateData.enunciado = fields.enunciado;
    if (fields.comentario_resolucao !== void 0) updateData.comentario_resolucao = fields.comentario_resolucao;
    if (fields.tags !== void 0) updateData.tags = fields.tags;
    if (Object.keys(updateData).length === 0) return { success: true, applied: [] };
    await ctx.db.update(questions).set(updateData).where(eq(questions.id, id));
    return { success: true, applied: Object.keys(updateData) };
  })
});

// server/simulations.router.ts
import { z as z2 } from "zod";
import { eq as eq2, and as and2, desc as desc2, sql as sql2, inArray as inArray2 } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/tri.ts
var D = 1.702;
function probabilityCorrect(theta, params) {
  const { a, b, c } = params;
  const exponent = -D * a * (theta - b);
  return c + (1 - c) / (1 + Math.exp(exponent));
}
function itemInformation(theta, params) {
  const p = probabilityCorrect(theta, params);
  const { a, c } = params;
  if (p <= 1e-10 || p >= 1 - 1e-10) return 0;
  const numerator = D * D * a * a * Math.pow(p - c, 2) * (1 - p);
  const denominator = Math.pow(1 - c, 2) * p;
  return numerator / denominator;
}
function testInformation(theta, items) {
  return items.reduce((sum, params) => sum + itemInformation(theta, params), 0);
}
function estimateTheta(results, maxIter = 50, tolerance = 1e-3, thetaInit = 0) {
  const answered = results.filter((r) => r.correct !== null);
  if (answered.length === 0) {
    return { theta: 0, standardError: 999, iterations: 0, converged: false };
  }
  const allCorrect = answered.every((r) => r.correct === true);
  const allWrong = answered.every((r) => r.correct === false);
  if (allCorrect) {
    return { theta: 3, standardError: 0.5, iterations: 0, converged: true };
  }
  if (allWrong) {
    return { theta: -3, standardError: 0.5, iterations: 0, converged: true };
  }
  let theta = thetaInit;
  let converged = false;
  let iterations = 0;
  for (let iter = 0; iter < maxIter; iter++) {
    iterations++;
    let firstDerivative = 0;
    let secondDerivative = 0;
    for (const { params, correct } of answered) {
      const p = probabilityCorrect(theta, params);
      const { a, c } = params;
      const dP = D * a * (p - c) * (1 - p) / (1 - c);
      const u = correct ? 1 : 0;
      if (p > 1e-10 && p < 1 - 1e-10) {
        firstDerivative += (u - p) * dP / (p * (1 - p));
        secondDerivative -= dP * dP / (p * (1 - p));
      }
    }
    if (Math.abs(secondDerivative) < 1e-10) break;
    const delta = firstDerivative / secondDerivative;
    theta -= delta;
    theta = Math.max(-4, Math.min(4, theta));
    if (Math.abs(delta) < tolerance) {
      converged = true;
      break;
    }
  }
  const info = testInformation(theta, answered.map((r) => r.params));
  const standardError = info > 1e-10 ? 1 / Math.sqrt(info) : 999;
  return { theta, standardError, iterations, converged };
}
function thetaToEnemScore(theta) {
  const mean = 500;
  const sd = 110;
  const raw = mean + sd * theta;
  return Math.round(Math.max(0, Math.min(1e3, raw)));
}
function checkStagePass(stage, correctCount) {
  const requirements = { 1: 12, 2: 18, 3: 0 };
  const required = requirements[stage];
  const passed = stage === 3 || correctCount >= required;
  const message = passed ? stage === 3 ? `Simulado conclu\xEDdo! Nota TRI calculada.` : `Parab\xE9ns! Voc\xEA acertou ${correctCount} quest\xF5es e avan\xE7ou para a Etapa ${stage + 1}.` : `Voc\xEA acertou ${correctCount} de ${required} necess\xE1rias. Tente novamente a Etapa ${stage}.`;
  return { passed, required, message };
}

// server/macro-areas.ts
var MACRO_AREAS = [
  "Matem\xE1tica B\xE1sica",
  "\xC1lgebra",
  "Fun\xE7\xF5es",
  "Geometria Plana",
  "Geometria Espacial",
  "Trigonometria",
  "Probabilidade e Estat\xEDstica",
  "An\xE1lise Combinat\xF3ria"
];
var TOPIC_TO_AREA = {
  // ─── Matemática Básica ────────────────────────────────────────────────────
  "Aritm\xE9tica": "Matem\xE1tica B\xE1sica",
  "Opera\xE7\xF5es com fra\xE7\xF5es": "Matem\xE1tica B\xE1sica",
  "Opera\xE7\xF5es com Fra\xE7\xF5es": "Matem\xE1tica B\xE1sica",
  "Fra\xE7\xF5es": "Matem\xE1tica B\xE1sica",
  "Porcentagem": "Matem\xE1tica B\xE1sica",
  "Raz\xE3o e propor\xE7\xE3o": "Matem\xE1tica B\xE1sica",
  "Raz\xE3o e Propor\xE7\xE3o": "Matem\xE1tica B\xE1sica",
  "Raz\xE3o, propor\xE7\xE3o e regra de tr\xEAs": "Matem\xE1tica B\xE1sica",
  "Regra de tr\xEAs": "Matem\xE1tica B\xE1sica",
  "Regra de Tr\xEAs": "Matem\xE1tica B\xE1sica",
  "Propor\xE7\xF5es": "Matem\xE1tica B\xE1sica",
  "Divis\xE3o em partes proporcionais": "Matem\xE1tica B\xE1sica",
  "Divis\xE3o em Partes Proporcionais": "Matem\xE1tica B\xE1sica",
  "Juros simples": "Matem\xE1tica B\xE1sica",
  "Juros compostos": "Matem\xE1tica B\xE1sica",
  "Juros": "Matem\xE1tica B\xE1sica",
  "Matem\xE1tica financeira": "Matem\xE1tica B\xE1sica",
  "Matem\xE1tica Financeira": "Matem\xE1tica B\xE1sica",
  "Conjuntos num\xE9ricos": "Matem\xE1tica B\xE1sica",
  "Conjuntos Num\xE9ricos": "Matem\xE1tica B\xE1sica",
  "Conjuntos": "Matem\xE1tica B\xE1sica",
  "Grandezas e medidas": "Matem\xE1tica B\xE1sica",
  "Grandezas e Medidas": "Matem\xE1tica B\xE1sica",
  "Sistema de medidas": "Matem\xE1tica B\xE1sica",
  "Nota\xE7\xE3o cient\xEDfica": "Matem\xE1tica B\xE1sica",
  "Pot\xEAncias e ra\xEDzes": "Matem\xE1tica B\xE1sica",
  "Opera\xE7\xF5es": "Matem\xE1tica B\xE1sica",
  // ─── Álgebra ──────────────────────────────────────────────────────────────
  "\xC1lgebra": "\xC1lgebra",
  "Equa\xE7\xF5es do 1\xBA grau": "\xC1lgebra",
  "Equa\xE7\xF5es do 2\xBA grau": "\xC1lgebra",
  "Equa\xE7\xF5es polinomiais": "\xC1lgebra",
  "Equa\xE7\xF5es exponenciais": "\xC1lgebra",
  "Equa\xE7\xF5es logar\xEDtmicas": "\xC1lgebra",
  "Equa\xE7\xF5es": "\xC1lgebra",
  "Inequa\xE7\xF5es": "\xC1lgebra",
  "Sistemas lineares": "\xC1lgebra",
  "Sistemas de equa\xE7\xF5es": "\xC1lgebra",
  "Matrizes": "\xC1lgebra",
  "Determinantes": "\xC1lgebra",
  "Matrizes e determinantes": "\xC1lgebra",
  "N\xFAmeros complexos": "\xC1lgebra",
  "Logaritmo": "\xC1lgebra",
  "Logaritmos": "\xC1lgebra",
  "Progress\xE3o aritm\xE9tica": "\xC1lgebra",
  "Progress\xE3o Aritm\xE9tica": "\xC1lgebra",
  "Progress\xE3o geom\xE9trica": "\xC1lgebra",
  "Progress\xE3o Geom\xE9trica": "\xC1lgebra",
  "Progress\xF5es": "\xC1lgebra",
  "PA": "\xC1lgebra",
  "PG": "\xC1lgebra",
  "Polin\xF4mios": "\xC1lgebra",
  // ─── Funções ──────────────────────────────────────────────────────────────
  "Fun\xE7\xF5es": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o afim": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Afim": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o linear": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o do 1\xBA grau": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o do 1\xB0 grau": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o quadr\xE1tica": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Quadr\xE1tica": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o do 2\xBA grau": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o do 2\xB0 grau": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o exponencial": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Exponencial": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o logar\xEDtmica": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Logar\xEDtmica": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o modular": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Modular": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o composta": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Composta": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o inversa": "Fun\xE7\xF5es",
  "Fun\xE7\xE3o Inversa": "Fun\xE7\xF5es",
  "Dom\xEDnio e imagem": "Fun\xE7\xF5es",
  "Gr\xE1ficos de fun\xE7\xF5es": "Fun\xE7\xF5es",
  // ─── Geometria Plana (inclui Analítica) ───────────────────────────────────
  "Geometria Plana": "Geometria Plana",
  "\xC1reas": "Geometria Plana",
  "\xC1reas de figuras planas": "Geometria Plana",
  "Per\xEDmetro": "Geometria Plana",
  "Per\xEDmetros": "Geometria Plana",
  "Teorema de Pit\xE1goras": "Geometria Plana",
  "Teorema de Tales": "Geometria Plana",
  "Semelhan\xE7a": "Geometria Plana",
  "Semelhan\xE7a de tri\xE2ngulos": "Geometria Plana",
  "Congru\xEAncia": "Geometria Plana",
  "Pol\xEDgonos": "Geometria Plana",
  "Pol\xEDgonos regulares": "Geometria Plana",
  "Tri\xE2ngulos": "Geometria Plana",
  "Quadril\xE1teros": "Geometria Plana",
  "C\xEDrculo": "Geometria Plana",
  "Circunfer\xEAncia": "Geometria Plana",
  "Rela\xE7\xF5es m\xE9tricas": "Geometria Plana",
  // Analítica — por pedido do Prof. Waldo entra em Plana
  "Geometria Anal\xEDtica": "Geometria Plana",
  "Geo. Anal\xEDtica": "Geometria Plana",
  "Geometria anal\xEDtica": "Geometria Plana",
  "Dist\xE2ncia entre pontos": "Geometria Plana",
  "Equa\xE7\xE3o da reta": "Geometria Plana",
  "Retas": "Geometria Plana",
  "C\xF4nicas": "Geometria Plana",
  "Elipse": "Geometria Plana",
  "Hip\xE9rbole": "Geometria Plana",
  "Par\xE1bola": "Geometria Plana",
  // ─── Geometria Espacial ───────────────────────────────────────────────────
  "Geometria Espacial": "Geometria Espacial",
  "Prismas": "Geometria Espacial",
  "Prisma": "Geometria Espacial",
  "Paralelep\xEDpedo": "Geometria Espacial",
  "Cubo": "Geometria Espacial",
  "Cilindros": "Geometria Espacial",
  "Cilindro": "Geometria Espacial",
  "Cones": "Geometria Espacial",
  "Cone": "Geometria Espacial",
  "Pir\xE2mides": "Geometria Espacial",
  "Pir\xE2mide": "Geometria Espacial",
  "Esferas": "Geometria Espacial",
  "Esfera": "Geometria Espacial",
  "Poliedros": "Geometria Espacial",
  "Volumes": "Geometria Espacial",
  "S\xF3lidos": "Geometria Espacial",
  "S\xF3lidos de revolu\xE7\xE3o": "Geometria Espacial",
  // ─── Trigonometria ────────────────────────────────────────────────────────
  "Trigonometria": "Trigonometria",
  "Trigonometria no tri\xE2ngulo ret\xE2ngulo": "Trigonometria",
  "Raz\xF5es trigonom\xE9tricas": "Trigonometria",
  "C\xEDrculo trigonom\xE9trico": "Trigonometria",
  "Identidades trigonom\xE9tricas": "Trigonometria",
  "Lei dos senos": "Trigonometria",
  "Lei dos cossenos": "Trigonometria",
  "Fun\xE7\xF5es trigonom\xE9tricas": "Trigonometria",
  // ─── Probabilidade e Estatística ──────────────────────────────────────────
  "Probabilidade": "Probabilidade e Estat\xEDstica",
  "Probabilidade e estat\xEDstica": "Probabilidade e Estat\xEDstica",
  "Probabilidade e Estat\xEDstica": "Probabilidade e Estat\xEDstica",
  "Probabilidade condicional": "Probabilidade e Estat\xEDstica",
  "Distribui\xE7\xE3o binomial": "Probabilidade e Estat\xEDstica",
  "Estat\xEDstica": "Probabilidade e Estat\xEDstica",
  "M\xE9dia": "Probabilidade e Estat\xEDstica",
  "Mediana": "Probabilidade e Estat\xEDstica",
  "Moda": "Probabilidade e Estat\xEDstica",
  "Medidas de tend\xEAncia central": "Probabilidade e Estat\xEDstica",
  "Medidas de Tend\xEAncia Central": "Probabilidade e Estat\xEDstica",
  "Desvio padr\xE3o": "Probabilidade e Estat\xEDstica",
  "Vari\xE2ncia": "Probabilidade e Estat\xEDstica",
  "Gr\xE1ficos e tabelas": "Probabilidade e Estat\xEDstica",
  // ─── Análise Combinatória ─────────────────────────────────────────────────
  "An\xE1lise Combinat\xF3ria": "An\xE1lise Combinat\xF3ria",
  "An\xE1lise combinat\xF3ria": "An\xE1lise Combinat\xF3ria",
  "Princ\xEDpio Fundamental da Contagem": "An\xE1lise Combinat\xF3ria",
  "Princ\xEDpio fundamental da contagem": "An\xE1lise Combinat\xF3ria",
  "PFC": "An\xE1lise Combinat\xF3ria",
  "Arranjo": "An\xE1lise Combinat\xF3ria",
  "Arranjos": "An\xE1lise Combinat\xF3ria",
  "Combina\xE7\xE3o": "An\xE1lise Combinat\xF3ria",
  "Combina\xE7\xF5es": "An\xE1lise Combinat\xF3ria",
  "Permuta\xE7\xE3o": "An\xE1lise Combinat\xF3ria",
  "Permuta\xE7\xF5es": "An\xE1lise Combinat\xF3ria",
  "Fatorial": "An\xE1lise Combinat\xF3ria"
};
function keywordFallback(raw) {
  const t2 = raw.toLowerCase();
  if (/\bfun[çc][aã]o\b/.test(t2)) return "Fun\xE7\xF5es";
  if (/trigonom|\bseno\b|\bcosseno\b|\btangente\b|\bcotangente\b/.test(t2)) return "Trigonometria";
  if (/prism|cilind|\bcone\b|pir[aâ]mid|esfera|poliedro|s[oó]lido|volume|tronco/.test(t2)) return "Geometria Espacial";
  if (/anal[íi]tica|\brat[aa]\b|\bretas\b|c[oô]nica|elipse|hip[eé]rbole|par[aá]bola/.test(t2)) return "Geometria Plana";
  if (/tri[aâ]ngulo|quadril[aá]t|c[ií]rculo|circunfer[eê]ncia|pol[ií]gono|pit[aá]goras|tales|semelhan[çc]a|congru[eê]ncia|[aá]reas?|per[íi]metro/.test(t2)) return "Geometria Plana";
  if (/probabilidade|estat[íi]stica|m[eé]dia|mediana|moda|desvio|vari[aâ]ncia/.test(t2)) return "Probabilidade e Estat\xEDstica";
  if (/combinat[oó]r|combina[çc][aã]o|arranjo|permuta[çc][aã]o|fatorial|contagem|pfc/.test(t2)) return "An\xE1lise Combinat\xF3ria";
  if (/logaritm|progress[aã]o\b|\bpa\b|\bpg\b|matriz|determinante|sistema|polin[oô]m|equa[çc][aã]o|inequa[çc][aã]o|complexo/.test(t2)) return "\xC1lgebra";
  if (/fra[çc][aã]o|porcentagem|propor[çc][aã]o|raz[aã]o|regra de tr[eê]s|juros|financeira|aritm[eé]tica|grandeza|\bmedida/.test(t2)) return "Matem\xE1tica B\xE1sica";
  return null;
}
function resolveArea(conteudo, tags) {
  if (conteudo) {
    const k = conteudo.trim();
    if (k) {
      const explicit = TOPIC_TO_AREA[k];
      if (explicit) return explicit;
      const fb = keywordFallback(k);
      if (fb) return fb;
    }
  }
  if (Array.isArray(tags)) {
    for (const t2 of tags) {
      if (typeof t2 !== "string") continue;
      const k = t2.trim();
      if (!k) continue;
      const explicit = TOPIC_TO_AREA[k];
      if (explicit) return explicit;
    }
    for (const t2 of tags) {
      if (typeof t2 !== "string") continue;
      const fb = keywordFallback(t2.trim());
      if (fb) return fb;
    }
  }
  return null;
}

// server/simulations.router.ts
var STAGE_CONFIG = {
  1: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 },
  2: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 },
  3: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 }
};
async function drawQuestions(db2, count, excludeIds = [], fonte) {
  const whereClause = fonte ? and2(eq2(questions.active, true), eq2(questions.fonte, fonte)) : eq2(questions.active, true);
  const rows = await db2.select({
    id: questions.id,
    conteudo_principal: questions.conteudo_principal,
    nivel_dificuldade: questions.nivel_dificuldade,
    param_a: questions.param_a,
    param_b: questions.param_b,
    param_c: questions.param_c,
    enunciado: questions.enunciado,
    url_imagem: questions.url_imagem,
    alternativas: questions.alternativas,
    tags: questions.tags
  }).from(questions).where(whereClause).orderBy(sql2`RAND()`).limit(count + (excludeIds.length > 0 ? excludeIds.length : 0));
  const filtered = rows.filter((q) => !excludeIds.includes(q.id));
  return filtered.slice(0, count);
}
function notFound(entity) {
  throw new TRPCError3({ code: "NOT_FOUND", message: `${entity} n\xE3o encontrado(a).` });
}
var simulationsRouter = createTRPCRouter({
  // ---------------------------------------------------------------------------
  // INICIA um novo simulado
  // ---------------------------------------------------------------------------
  start: protectedProcedure.input(
    z2.object({
      stage: z2.union([z2.literal(1), z2.literal(2), z2.literal(3)]),
      fonte: z2.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const { stage, fonte } = input;
    const userId = ctx.user.id;
    const config = STAGE_CONFIG[stage];
    const total = fonte && fonte !== "ENEM" ? 12 : config.total;
    const [existing] = await ctx.db.select({ id: simulations.id }).from(simulations).where(
      and2(
        eq2(simulations.userId, userId),
        eq2(simulations.status, "in_progress"),
        sql2`${simulations.stage} > 0`
      )
    ).limit(1);
    if (existing) {
      throw new TRPCError3({
        code: "CONFLICT",
        message: "Voc\xEA j\xE1 tem um simulado em andamento. Finalize-o antes de iniciar outro."
      });
    }
    const drawn = await drawQuestions(ctx.db, total, [], fonte);
    if (drawn.length < total) {
      throw new TRPCError3({
        code: "PRECONDITION_FAILED",
        message: `Banco de quest\xF5es insuficiente. Necess\xE1rio: ${total}, dispon\xEDvel: ${drawn.length}.`
      });
    }
    const newSim = {
      userId,
      stage,
      totalQuestions: total,
      status: "in_progress"
    };
    const [result] = await ctx.db.insert(simulations).values(newSim);
    const simulationId = Number(result.insertId);
    const answerSlots = drawn.map((q, idx) => ({
      simulationId,
      questionId: q.id,
      questionOrder: idx + 1
    }));
    await ctx.db.insert(simulationAnswers).values(answerSlots);
    return {
      simulationId,
      stage,
      totalQuestions: config.total,
      minPassRequired: config.minPass,
      timeLimitPerQuestion: config.timeLimitPerQuestion,
      questions: drawn
      // sem gabarito
    };
  }),
  // ---------------------------------------------------------------------------
  // SALVA RESPOSTA de uma questão
  // ---------------------------------------------------------------------------
  saveAnswer: protectedProcedure.input(
    z2.object({
      simulationId: z2.number().int().positive(),
      questionId: z2.number().int().positive(),
      selectedAnswer: z2.string().length(1).toUpperCase(),
      timeSpentSeconds: z2.number().int().min(0)
    })
  ).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [sim] = await ctx.db.select().from(simulations).where(
      and2(
        eq2(simulations.id, input.simulationId),
        eq2(simulations.userId, userId),
        eq2(simulations.status, "in_progress")
      )
    ).limit(1);
    if (!sim) notFound("Simulado activo");
    const [answerRow] = await ctx.db.select({
      id: simulationAnswers.id,
      questionId: simulationAnswers.questionId,
      gabarito: questions.gabarito
    }).from(simulationAnswers).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(
      and2(
        eq2(simulationAnswers.simulationId, input.simulationId),
        eq2(simulationAnswers.questionId, input.questionId)
      )
    ).limit(1);
    if (!answerRow) notFound("Quest\xE3o neste simulado");
    const isCorrect = input.selectedAnswer.toUpperCase() === answerRow.gabarito.toUpperCase();
    await ctx.db.update(simulationAnswers).set({
      selectedAnswer: input.selectedAnswer.toUpperCase(),
      isCorrect,
      timeSpentSeconds: input.timeSpentSeconds,
      answeredAt: /* @__PURE__ */ new Date()
    }).where(eq2(simulationAnswers.id, answerRow.id));
    return { isCorrect };
  }),
  // ---------------------------------------------------------------------------
  // FINALIZA simulado e calcula pontuação
  // ---------------------------------------------------------------------------
  finish: protectedProcedure.input(
    z2.object({
      simulationId: z2.number().int().positive(),
      totalTimeSeconds: z2.number().int().min(0)
    })
  ).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [sim] = await ctx.db.select().from(simulations).where(
      and2(
        eq2(simulations.id, input.simulationId),
        eq2(simulations.userId, userId),
        eq2(simulations.status, "in_progress")
      )
    ).limit(1);
    if (!sim) notFound("Simulado activo");
    const stage = sim.stage;
    const config = STAGE_CONFIG[stage];
    const answers = await ctx.db.select({
      questionId: simulationAnswers.questionId,
      selectedAnswer: simulationAnswers.selectedAnswer,
      isCorrect: simulationAnswers.isCorrect,
      timeSpentSeconds: simulationAnswers.timeSpentSeconds,
      param_a: questions.param_a,
      param_b: questions.param_b,
      param_c: questions.param_c,
      gabarito: questions.gabarito,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade
    }).from(simulationAnswers).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(eq2(simulationAnswers.simulationId, input.simulationId));
    const correctCount = answers.filter((a) => a.isCorrect === true).length;
    let score;
    let triTheta = null;
    let enemScore = null;
    if (stage === 3) {
      const triResults = answers.map((a) => ({
        questionId: a.questionId,
        params: { a: a.param_a, b: a.param_b, c: a.param_c },
        correct: a.isCorrect
      }));
      const { theta, standardError } = estimateTheta(triResults);
      triTheta = theta;
      enemScore = thetaToEnemScore(theta);
      score = enemScore;
    } else {
      score = sim.totalQuestions && sim.totalQuestions > 0 ? Math.round(correctCount / sim.totalQuestions * 100) : 0;
    }
    const stageResult = checkStagePass(stage, correctCount);
    await ctx.db.update(simulations).set({
      status: "completed",
      correctCount,
      score,
      triTheta,
      totalTimeSeconds: input.totalTimeSeconds,
      completedAt: /* @__PURE__ */ new Date()
    }).where(eq2(simulations.id, input.simulationId));
    const avgTime = answers.filter((a) => a.timeSpentSeconds != null).length > 0 ? Math.round(
      answers.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) / answers.length
    ) : 0;
    const timeWarning = avgTime > config.timeLimitPerQuestion ? `Voc\xEA gastou em m\xE9dia ${Math.round(avgTime / 60)} min por quest\xE3o. O ideal \xE9 at\xE9 ${config.timeLimitPerQuestion / 60} min.` : null;
    return {
      simulationId: input.simulationId,
      stage,
      correctCount,
      totalQuestions: sim.totalQuestions ?? config.total,
      score,
      triTheta,
      enemScore,
      stageResult,
      timeWarning,
      totalTimeSeconds: input.totalTimeSeconds,
      // Resumo por questão (gabarito revelado após finalizar)
      answersSummary: answers.map((a) => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: a.gabarito,
        isCorrect: a.isCorrect,
        timeSpentSeconds: a.timeSpentSeconds,
        conteudo_principal: a.conteudo_principal,
        nivel_dificuldade: a.nivel_dificuldade
      }))
    };
  }),
  // ---------------------------------------------------------------------------
  // SIMULADO ACTIVO do aluno (para retomar após reload)
  // ---------------------------------------------------------------------------
  getActive: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [sim] = await ctx.db.select().from(simulations).where(
      and2(eq2(simulations.userId, userId), eq2(simulations.status, "in_progress"))
    ).limit(1);
    if (!sim) return null;
    const answers = await ctx.db.select({
      questionId: simulationAnswers.questionId,
      questionOrder: simulationAnswers.questionOrder,
      selectedAnswer: simulationAnswers.selectedAnswer,
      timeSpentSeconds: simulationAnswers.timeSpentSeconds,
      // Dados da questão (sem gabarito)
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade,
      param_a: questions.param_a,
      param_b: questions.param_b,
      param_c: questions.param_c,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      alternativas: questions.alternativas,
      tags: questions.tags
    }).from(simulationAnswers).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(eq2(simulationAnswers.simulationId, sim.id)).orderBy(simulationAnswers.questionOrder);
    const stage = sim.stage;
    const config = STAGE_CONFIG[stage];
    return {
      simulationId: sim.id,
      stage,
      totalQuestions: sim.totalQuestions ?? config.total,
      minPassRequired: config.minPass,
      timeLimitPerQuestion: config.timeLimitPerQuestion,
      answeredCount: answers.filter((a) => a.selectedAnswer != null).length,
      questions: answers.map((a) => ({
        id: a.questionId,
        order: a.questionOrder,
        selectedAnswer: a.selectedAnswer,
        // null se ainda não respondida
        conteudo_principal: a.conteudo_principal,
        nivel_dificuldade: a.nivel_dificuldade,
        param_a: a.param_a,
        param_b: a.param_b,
        param_c: a.param_c,
        enunciado: a.enunciado,
        url_imagem: a.url_imagem,
        alternativas: a.alternativas,
        tags: a.tags
      }))
    };
  }),
  // ---------------------------------------------------------------------------
  // RESULTADO DETALHADO de um simulado finalizado
  // ---------------------------------------------------------------------------
  getResult: protectedProcedure.input(z2.object({ simulationId: z2.number().int().positive() })).query(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [sim] = await ctx.db.select().from(simulations).where(
      and2(
        eq2(simulations.id, input.simulationId),
        eq2(simulations.userId, userId),
        eq2(simulations.status, "completed")
      )
    ).limit(1);
    if (!sim) notFound("Simulado");
    const answers = await ctx.db.select({
      questionId: simulationAnswers.questionId,
      questionOrder: simulationAnswers.questionOrder,
      selectedAnswer: simulationAnswers.selectedAnswer,
      isCorrect: simulationAnswers.isCorrect,
      timeSpentSeconds: simulationAnswers.timeSpentSeconds,
      // Questão completa (gabarito incluído — simulado já finalizado)
      enunciado: questions.enunciado,
      alternativas: questions.alternativas,
      gabarito: questions.gabarito,
      comentario_resolucao: questions.comentario_resolucao,
      url_video: questions.url_video,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade,
      tags: questions.tags,
      url_imagem: questions.url_imagem
    }).from(simulationAnswers).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(eq2(simulationAnswers.simulationId, sim.id)).orderBy(simulationAnswers.questionOrder);
    const byDifficulty = {};
    for (const a of answers) {
      const diff = a.nivel_dificuldade ?? "M\xE9dia";
      if (!byDifficulty[diff]) byDifficulty[diff] = { correct: 0, total: 0 };
      byDifficulty[diff].total++;
      if (a.isCorrect) byDifficulty[diff].correct++;
    }
    const byTopic = {};
    for (const a of answers) {
      const topic = a.conteudo_principal;
      if (!byTopic[topic]) byTopic[topic] = { correct: 0, total: 0 };
      byTopic[topic].total++;
      if (a.isCorrect) byTopic[topic].correct++;
    }
    const stage = sim.stage;
    const config = STAGE_CONFIG[stage];
    return {
      simulationId: sim.id,
      stage,
      status: sim.status,
      score: sim.score,
      triTheta: sim.triTheta,
      correctCount: sim.correctCount ?? 0,
      totalQuestions: sim.totalQuestions ?? config.total,
      totalTimeSeconds: sim.totalTimeSeconds,
      completedAt: sim.completedAt,
      minPassRequired: config.minPass,
      stageResult: checkStagePass(stage, sim.correctCount ?? 0),
      byDifficulty,
      byTopic,
      answers
    };
  }),
  // ---------------------------------------------------------------------------
  // HISTÓRICO — últimas N tentativas por etapa
  // ---------------------------------------------------------------------------
  getHistory: protectedProcedure.input(
    z2.object({
      stage: z2.union([z2.literal(1), z2.literal(2), z2.literal(3)]).optional(),
      limit: z2.number().int().min(1).max(50).default(10)
    })
  ).query(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const filters = [
      eq2(simulations.userId, userId),
      eq2(simulations.status, "completed"),
      sql2`${simulations.stage} > 0`
      // Exclui sessões de treino livre (stage=0)
    ];
    if (input.stage) filters.push(eq2(simulations.stage, input.stage));
    const rows = await ctx.db.select({
      id: simulations.id,
      stage: simulations.stage,
      score: simulations.score,
      triTheta: simulations.triTheta,
      correctCount: simulations.correctCount,
      totalQuestions: simulations.totalQuestions,
      totalTimeSeconds: simulations.totalTimeSeconds,
      completedAt: simulations.completedAt
    }).from(simulations).where(and2(...filters)).orderBy(desc2(simulations.completedAt)).limit(input.limit);
    return rows;
  }),
  // ---------------------------------------------------------------------------
  // PROGRESSO nas 3 etapas (para o dashboard)
  // ---------------------------------------------------------------------------
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const completed = await ctx.db.select({
      stage: simulations.stage,
      score: simulations.score,
      triTheta: simulations.triTheta,
      correctCount: simulations.correctCount,
      totalQuestions: simulations.totalQuestions,
      completedAt: simulations.completedAt
    }).from(simulations).where(
      and2(eq2(simulations.userId, userId), eq2(simulations.status, "completed"))
    ).orderBy(desc2(simulations.completedAt));
    const stageStats = [1, 2, 3].map((stage) => {
      const attempts = completed.filter((s) => s.stage === stage);
      const config = STAGE_CONFIG[stage];
      const best = attempts.reduce(
        (max, a) => (a.correctCount ?? 0) > (max?.correctCount ?? -1) ? a : max,
        null
      );
      const passed = best != null && (best.correctCount ?? 0) >= config.minPass;
      const unlocked = true;
      return {
        stage,
        unlocked,
        passed,
        attempts: attempts.length,
        bestCorrectCount: best?.correctCount ?? null,
        bestScore: best?.score ?? null,
        bestTriTheta: best?.triTheta ?? null,
        minPassRequired: config.minPass,
        totalQuestions: config.total,
        lastAttemptAt: attempts[0]?.completedAt ?? null,
        recentAttempts: attempts.slice(0, 5)
      };
    });
    return stageStats;
  }),
  // ---------------------------------------------------------------------------
  // STATS — streak, metas semanais, gráfico diário (dashboard)
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // STATS — conta TODA atividade: simulados + desafio diário + treino salvo
  // ---------------------------------------------------------------------------
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const now = /* @__PURE__ */ new Date();
    const answered = await ctx.db.select({
      answeredAt: simulationAnswers.answeredAt,
      isCorrect: simulationAnswers.isCorrect
    }).from(simulationAnswers).innerJoin(simulations, eq2(simulationAnswers.simulationId, simulations.id)).where(
      and2(
        eq2(simulations.userId, userId),
        sql2`${simulationAnswers.answeredAt} IS NOT NULL`
      )
    );
    const challenges = await ctx.db.select({
      answers: dailyChallenges.answers,
      questionIds: dailyChallenges.questionIds,
      challengeDate: dailyChallenges.challengeDate,
      completedAt: dailyChallenges.completedAt,
      completed: dailyChallenges.completed,
      correctCount: dailyChallenges.correctCount
    }).from(dailyChallenges).where(eq2(dailyChallenges.userId, userId));
    const completedSims = await ctx.db.select({
      completedAt: simulations.completedAt,
      totalQuestions: simulations.totalQuestions,
      correctCount: simulations.correctCount
    }).from(simulations).where(and2(eq2(simulations.userId, userId), eq2(simulations.status, "completed"))).orderBy(desc2(simulations.completedAt));
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    function dayKey(d) {
      if (!d) return "";
      const dt = typeof d === "string" ? /* @__PURE__ */ new Date(d + "T12:00:00") : new Date(d);
      return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    }
    function sameDay(d, ref) {
      if (!d) return false;
      const dt = typeof d === "string" ? /* @__PURE__ */ new Date(d + "T12:00:00") : new Date(d);
      return dt.getFullYear() === ref.getFullYear() && dt.getMonth() === ref.getMonth() && dt.getDate() === ref.getDate();
    }
    const dayMap = /* @__PURE__ */ new Map();
    function addToDay(key, q, c) {
      if (!key) return;
      const existing = dayMap.get(key) ?? { questoes: 0, acertos: 0 };
      dayMap.set(key, { questoes: existing.questoes + q, acertos: existing.acertos + c });
    }
    for (const a of answered) {
      const key = dayKey(a.answeredAt);
      addToDay(key, 1, a.isCorrect ? 1 : 0);
    }
    for (const ch of challenges) {
      const ans = ch.answers;
      const ids = ch.questionIds;
      const countAnswered = Object.keys(ans).length;
      if (countAnswered === 0) continue;
      const key = ch.challengeDate;
      const dt = /* @__PURE__ */ new Date(ch.challengeDate + "T12:00:00");
      const nKey = dayKey(dt);
      const correct = ch.completed ? ch.correctCount ?? 0 : 0;
      addToDay(nKey, countAnswered, correct);
    }
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      if (dayMap.has(key) && dayMap.get(key).questoes > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
    const dailyData = days.map((day) => {
      const label = ["Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b", "Dom"][day.getDay() === 0 ? 6 : day.getDay() - 1];
      const key = dayKey(day);
      const { questoes, acertos } = dayMap.get(key) ?? { questoes: 0, acertos: 0 };
      return { label, questoes, acertos, pct: questoes > 0 ? Math.round(acertos / questoes * 100) : 0 };
    });
    const weeklyData = dailyData.reduce((acc, d) => ({
      questoes: acc.questoes + d.questoes,
      acertos: acc.acertos + d.acertos
    }), { questoes: 0, acertos: 0 });
    const weeklyAccuracy = weeklyData.questoes > 0 ? Math.round(weeklyData.acertos / weeklyData.questoes * 100) : 0;
    const allEntries = Array.from(dayMap.values());
    const totalQuestions = allEntries.reduce((s, d) => s + d.questoes, 0);
    const totalCorrect = allEntries.reduce((s, d) => s + d.acertos, 0);
    const totalAccuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
    return {
      streak,
      weeklyQuestions: weeklyData.questoes,
      weeklyAccuracy,
      totalSimulations: completedSims.length,
      dailyData,
      // Gerais
      totalQuestions,
      totalAccuracy
    };
  }),
  // ---------------------------------------------------------------------------
  // RANKING — top 20 alunos por melhor nota TRI na Etapa 3
  // ---------------------------------------------------------------------------
  getRanking: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select({
      userId: simulations.userId,
      score: simulations.score,
      correctCount: simulations.correctCount,
      completedAt: simulations.completedAt,
      userName: users.name
    }).from(simulations).innerJoin(users, eq2(simulations.userId, users.id)).where(and2(eq2(simulations.stage, 3), eq2(simulations.status, "completed"))).orderBy(desc2(simulations.score)).limit(100);
    const bestByUser = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const existing = bestByUser.get(row.userId);
      if (!existing || (row.score ?? 0) > (existing.score ?? 0)) {
        bestByUser.set(row.userId, row);
      }
    }
    const ranking = Array.from(bestByUser.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 20).map((r, idx) => ({
      position: idx + 1,
      userId: r.userId,
      userName: r.userName,
      score: r.score,
      correctCount: r.correctCount,
      completedAt: r.completedAt,
      isMe: r.userId === ctx.user.id
    }));
    return ranking;
  }),
  // ---------------------------------------------------------------------------
  // DESEMPENHO POR ÁREA MACRO — para o gráfico radar da dashboard
  // Agrupa as ~34 áreas granulares em 8 áreas macro (Matemática Básica, Álgebra,
  // Funções, Geometria Plana, Geometria Espacial, Trigonometria, Probabilidade e
  // Estatística, Análise Combinatória). Cada questão credita a UMA área só, com
  // prioridade em conteudo_principal e fallback em tags — ver server/macro-areas.ts.
  // Combina simulationAnswers + dailyChallenges.
  // ---------------------------------------------------------------------------
  getTopicStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const simRows = await ctx.db.select({
      conteudo: questions.conteudo_principal,
      tags: questions.tags,
      isCorrect: simulationAnswers.isCorrect,
      timeSpent: simulationAnswers.timeSpentSeconds
    }).from(simulationAnswers).innerJoin(simulations, eq2(simulationAnswers.simulationId, simulations.id)).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(and2(
      eq2(simulations.userId, userId),
      sql2`${simulationAnswers.isCorrect} IS NOT NULL`
    ));
    const map = /* @__PURE__ */ new Map();
    for (const r of simRows) {
      const area = resolveArea(r.conteudo, r.tags);
      if (!area) continue;
      const entry = map.get(area) ?? { total: 0, correct: 0, timeSum: 0, timeCount: 0 };
      entry.total++;
      if (r.isCorrect) entry.correct++;
      if (r.timeSpent != null && r.timeSpent > 0) {
        entry.timeSum += r.timeSpent;
        entry.timeCount++;
      }
      map.set(area, entry);
    }
    const challenges = await ctx.db.select({
      answers: dailyChallenges.answers,
      questionIds: dailyChallenges.questionIds,
      completed: dailyChallenges.completed
    }).from(dailyChallenges).where(and2(eq2(dailyChallenges.userId, userId), eq2(dailyChallenges.completed, true)));
    if (challenges.length > 0) {
      const allQIds = [...new Set(challenges.flatMap((c) => c.questionIds))];
      if (allQIds.length > 0) {
        const qDetails = await ctx.db.select({
          id: questions.id,
          conteudo: questions.conteudo_principal,
          tags: questions.tags,
          gabarito: questions.gabarito
        }).from(questions).where(inArray2(questions.id, allQIds));
        const qMap = new Map(qDetails.map((q) => [q.id, q]));
        for (const ch of challenges) {
          const answers = ch.answers;
          for (const [qIdStr, selected] of Object.entries(answers)) {
            const q = qMap.get(parseInt(qIdStr));
            if (!q) continue;
            const area = resolveArea(q.conteudo, q.tags);
            if (!area) continue;
            const hit = selected === q.gabarito;
            const entry = map.get(area) ?? { total: 0, correct: 0, timeSum: 0, timeCount: 0 };
            entry.total++;
            if (hit) entry.correct++;
            map.set(area, entry);
          }
        }
      }
    }
    return MACRO_AREAS.map((area) => {
      const v = map.get(area) ?? { total: 0, correct: 0, timeSum: 0, timeCount: 0 };
      const pct = v.total > 0 ? Math.round(v.correct / v.total * 100) : 0;
      return {
        conteudo: area,
        total: v.total,
        correct: v.correct,
        pct,
        accuracy: pct,
        // alias (página Desempenho usa "accuracy")
        avgTime: v.timeCount > 0 ? Math.round(v.timeSum / v.timeCount) : null
      };
    });
  }),
  // ---------------------------------------------------------------------------
  // TREINO LIVRE — sorteia N questões de um tópico com gabarito imediato
  // ---------------------------------------------------------------------------
  startFreeTraining: protectedProcedure.input(z2.object({
    conteudo: z2.string().optional(),
    count: z2.number().int().min(1).max(20).default(10)
  })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const filters = [eq2(questions.active, true)];
    if (input.conteudo) {
      filters.push(sql2`(
          ${questions.conteudo_principal} = ${input.conteudo}
          OR JSON_CONTAINS(${questions.tags}, JSON_QUOTE(${input.conteudo}))
        )`);
    }
    const rows = await ctx.db.select({
      id: questions.id,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      url_video: questions.url_video,
      alternativas: questions.alternativas,
      gabarito: questions.gabarito,
      comentario_resolucao: questions.comentario_resolucao,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade,
      tags: questions.tags
    }).from(questions).where(and2(...filters)).orderBy(sql2`RAND()`).limit(input.count);
    await ctx.db.update(simulations).set({ status: "abandoned" }).where(and2(
      eq2(simulations.userId, userId),
      eq2(simulations.status, "in_progress"),
      sql2`${simulations.stage} = 0`
    ));
    const [result] = await ctx.db.insert(simulations).values({
      userId,
      stage: 0,
      totalQuestions: rows.length,
      status: "in_progress"
    });
    const simulationId = Number(result.insertId);
    return { simulationId, questions: rows };
  }),
  // Salva uma resposta de treino livre no banco
  saveTrainingAnswer: protectedProcedure.input(z2.object({
    simulationId: z2.number().int().positive(),
    questionId: z2.number().int().positive(),
    selectedAnswer: z2.string().length(1),
    isCorrect: z2.boolean(),
    order: z2.number().int().min(0)
  })).mutation(async ({ ctx, input }) => {
    const [sim] = await ctx.db.select({ id: simulations.id }).from(simulations).where(and2(
      eq2(simulations.id, input.simulationId),
      eq2(simulations.userId, ctx.user.id)
    )).limit(1);
    if (!sim) return { success: false };
    await ctx.db.insert(simulationAnswers).values({
      simulationId: input.simulationId,
      questionId: input.questionId,
      selectedAnswer: input.selectedAnswer,
      isCorrect: input.isCorrect,
      questionOrder: input.order,
      answeredAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  // Finaliza sessão de treino livre
  finishTrainingSession: protectedProcedure.input(z2.object({
    simulationId: z2.number().int().positive(),
    correctCount: z2.number().int().min(0),
    totalTimeSeconds: z2.number().int().min(0)
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(simulations).set({
      status: "completed",
      correctCount: input.correctCount,
      totalTimeSeconds: input.totalTimeSeconds,
      completedAt: /* @__PURE__ */ new Date()
    }).where(and2(
      eq2(simulations.id, input.simulationId),
      eq2(simulations.userId, ctx.user.id)
    ));
    return { success: true };
  }),
  // Tópicos disponíveis para treino livre
  // Para cada tópico T (valor distinto de conteudo_principal), o total é o número
  // de questões em que conteudo_principal = T **ou** T aparece em tags — assim uma
  // questão cadastrada como "Aritmética" com tag "Razão, proporção e regra de
  // três" conta no tópico "Razão, proporção e regra de três" (e não só em
  // "Aritmética"). Usa COUNT(DISTINCT id) para evitar dupla contagem.
  getTopics: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.execute(sql2`
      SELECT t.conteudo AS conteudo,
             (
               SELECT COUNT(DISTINCT q.id)
                 FROM questions q
                WHERE q.active = 1
                  AND (
                    q.conteudo_principal = t.conteudo
                    OR JSON_CONTAINS(q.tags, JSON_QUOTE(t.conteudo))
                  )
             ) AS total
        FROM (
          SELECT DISTINCT conteudo_principal AS conteudo
            FROM questions
           WHERE active = 1
        ) t
       ORDER BY t.conteudo
    `);
    const list = Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    return list.map((r) => ({
      conteudo: r.conteudo,
      total: Number(r.total)
    }));
  }),
  // ---------------------------------------------------------------------------
  // DESAFIO DIÁRIO — 3 questões randômicas sem repetição
  // ---------------------------------------------------------------------------
  getDailyChallenge: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString().slice(0, 10);
    const [existing] = await ctx.db.select().from(dailyChallenges).where(and2(eq2(dailyChallenges.userId, userId), eq2(dailyChallenges.challengeDate, today))).orderBy(desc2(dailyChallenges.id)).limit(1);
    if (existing) {
      const qs = await ctx.db.select({
        id: questions.id,
        enunciado: questions.enunciado,
        url_imagem: questions.url_imagem,
        url_video: questions.url_video,
        alternativas: questions.alternativas,
        gabarito: questions.gabarito,
        comentario_resolucao: questions.comentario_resolucao,
        conteudo_principal: questions.conteudo_principal,
        nivel_dificuldade: questions.nivel_dificuldade
      }).from(questions).where(inArray2(questions.id, existing.questionIds));
      const ordered = existing.questionIds.map((id) => qs.find((q) => q.id === id)).filter(Boolean);
      return {
        challengeId: existing.id,
        date: today,
        completed: existing.completed,
        correctCount: existing.correctCount,
        answers: existing.answers,
        questions: ordered
      };
    }
    const pastChallenges = await ctx.db.select({ questionIds: dailyChallenges.questionIds }).from(dailyChallenges).where(eq2(dailyChallenges.userId, userId));
    const usedIds = new Set(pastChallenges.flatMap((c) => c.questionIds));
    let drawn = await ctx.db.select({
      id: questions.id,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      url_video: questions.url_video,
      alternativas: questions.alternativas,
      gabarito: questions.gabarito,
      comentario_resolucao: questions.comentario_resolucao,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade
    }).from(questions).where(eq2(questions.active, true)).orderBy(sql2`RAND()`).limit(100);
    const filtered = drawn.filter((q) => !usedIds.has(q.id)).slice(0, 3);
    const final = filtered.length >= 3 ? filtered : drawn.slice(0, 3);
    const newChallenge = {
      userId,
      challengeDate: today,
      questionIds: final.map((q) => q.id),
      answers: {},
      completed: false
    };
    const [result] = await ctx.db.insert(dailyChallenges).values(newChallenge);
    return {
      challengeId: Number(result.insertId),
      date: today,
      completed: false,
      correctCount: null,
      answers: {},
      questions: final
    };
  }),
  saveDailyAnswer: protectedProcedure.input(z2.object({
    challengeId: z2.number().int().positive(),
    questionId: z2.number().int().positive(),
    selectedAnswer: z2.string().length(1)
  })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [challenge] = await ctx.db.select().from(dailyChallenges).where(and2(eq2(dailyChallenges.id, input.challengeId), eq2(dailyChallenges.userId, userId))).limit(1);
    if (!challenge || challenge.completed) return { ok: false };
    const [q] = await ctx.db.select({ gabarito: questions.gabarito }).from(questions).where(eq2(questions.id, input.questionId)).limit(1);
    const newAnswers = { ...challenge.answers, [input.questionId]: input.selectedAnswer.toUpperCase() };
    const allAnswered = challenge.questionIds.every((id) => newAnswers[id]);
    const correctCount = challenge.questionIds.filter((id) => {
      const [qData] = [{ gabarito: q?.gabarito }];
      return newAnswers[id] === (newAnswers[id] ? q?.gabarito : null);
    }).length;
    await ctx.db.update(dailyChallenges).set({
      answers: newAnswers,
      ...allAnswered ? { completed: true, completedAt: /* @__PURE__ */ new Date() } : {}
    }).where(eq2(dailyChallenges.id, input.challengeId));
    return { ok: true, isCorrect: input.selectedAnswer.toUpperCase() === q?.gabarito };
  }),
  finishDailyChallenge: protectedProcedure.input(z2.object({ challengeId: z2.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [challenge] = await ctx.db.select().from(dailyChallenges).where(and2(eq2(dailyChallenges.id, input.challengeId), eq2(dailyChallenges.userId, userId))).limit(1);
    if (!challenge) return { ok: false };
    const answers = challenge.answers;
    const qs = await ctx.db.select({ id: questions.id, gabarito: questions.gabarito }).from(questions).where(inArray2(questions.id, challenge.questionIds));
    const correctCount = qs.filter((q) => answers[q.id] === q.gabarito).length;
    await ctx.db.update(dailyChallenges).set({ completed: true, correctCount, completedAt: /* @__PURE__ */ new Date() }).where(eq2(dailyChallenges.id, input.challengeId));
    return { ok: true, correctCount, total: challenge.questionIds.length };
  }),
  // ---------------------------------------------------------------------------
  // NOVO DESAFIO — força criação de novo desafio (permite repetir ilimitadamente)
  // ---------------------------------------------------------------------------
  newDailyChallenge: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString().slice(0, 10);
    const pastChallenges = await ctx.db.select({ questionIds: dailyChallenges.questionIds }).from(dailyChallenges).where(eq2(dailyChallenges.userId, userId));
    const usedIds = new Set(pastChallenges.flatMap((c) => c.questionIds));
    const drawn = await ctx.db.select({
      id: questions.id,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      url_video: questions.url_video,
      alternativas: questions.alternativas,
      gabarito: questions.gabarito,
      comentario_resolucao: questions.comentario_resolucao,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade
    }).from(questions).where(eq2(questions.active, true)).orderBy(sql2`RAND()`).limit(100);
    const filtered = drawn.filter((q) => !usedIds.has(q.id)).slice(0, 3);
    const final = filtered.length >= 3 ? filtered : drawn.slice(0, 3);
    const newChallenge = {
      userId,
      challengeDate: today,
      questionIds: final.map((q) => q.id),
      answers: {},
      completed: false
    };
    const [result] = await ctx.db.insert(dailyChallenges).values(newChallenge);
    return {
      challengeId: Number(result.insertId),
      date: today,
      completed: false,
      correctCount: null,
      answers: {},
      questions: final
    };
  }),
  getDailyHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const rows = await ctx.db.select({
      id: dailyChallenges.id,
      challengeDate: dailyChallenges.challengeDate,
      completed: dailyChallenges.completed,
      correctCount: dailyChallenges.correctCount,
      completedAt: dailyChallenges.completedAt
    }).from(dailyChallenges).where(eq2(dailyChallenges.userId, userId)).orderBy(desc2(dailyChallenges.challengeDate)).limit(30);
    return rows;
  }),
  // ---------------------------------------------------------------------------
  // QUESTÕES ERRADAS — histórico de erros do aluno para revisão
  // Inclui erros de: simulados, treino livre e desafio diário
  // ---------------------------------------------------------------------------
  getWrongAnswers: protectedProcedure.input(z2.object({
    limit: z2.number().int().min(1).max(100).default(50),
    offset: z2.number().int().min(0).default(0)
  })).query(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const simRows = await ctx.db.select({
      answerId: simulationAnswers.id,
      simulationId: simulationAnswers.simulationId,
      questionId: simulationAnswers.questionId,
      selectedAnswer: simulationAnswers.selectedAnswer,
      answeredAt: simulationAnswers.answeredAt,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      url_video: questions.url_video,
      alternativas: questions.alternativas,
      gabarito: questions.gabarito,
      comentario_resolucao: questions.comentario_resolucao,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade
    }).from(simulationAnswers).innerJoin(simulations, eq2(simulationAnswers.simulationId, simulations.id)).innerJoin(questions, eq2(simulationAnswers.questionId, questions.id)).where(
      and2(
        eq2(simulations.userId, userId),
        eq2(simulations.status, "completed"),
        eq2(simulationAnswers.isCorrect, false)
      )
    ).orderBy(desc2(simulationAnswers.answeredAt));
    const completedChallenges = await ctx.db.select().from(dailyChallenges).where(and2(
      eq2(dailyChallenges.userId, userId),
      eq2(dailyChallenges.completed, true)
    ));
    let dailyRows = [];
    if (completedChallenges.length > 0) {
      const dailyItems = [];
      for (const ch of completedChallenges) {
        const answers = ch.answers;
        for (const [qIdStr, selected] of Object.entries(answers)) {
          dailyItems.push({
            questionId: parseInt(qIdStr),
            selectedAnswer: selected,
            challengeId: ch.id,
            answeredAt: ch.completedAt
          });
        }
      }
      if (dailyItems.length > 0) {
        const uniqueQIds = [...new Set(dailyItems.map((w) => w.questionId))];
        const qDetails = await ctx.db.select({
          id: questions.id,
          enunciado: questions.enunciado,
          url_imagem: questions.url_imagem,
          alternativas: questions.alternativas,
          gabarito: questions.gabarito,
          comentario_resolucao: questions.comentario_resolucao,
          conteudo_principal: questions.conteudo_principal,
          nivel_dificuldade: questions.nivel_dificuldade
        }).from(questions).where(inArray2(questions.id, uniqueQIds));
        const qMap = new Map(qDetails.map((q) => [q.id, q]));
        let syntheticId = -1;
        for (const item of dailyItems) {
          const q = qMap.get(item.questionId);
          if (!q) continue;
          if (item.selectedAnswer === q.gabarito) continue;
          dailyRows.push({
            answerId: syntheticId--,
            simulationId: -item.challengeId,
            questionId: item.questionId,
            selectedAnswer: item.selectedAnswer,
            answeredAt: item.answeredAt,
            enunciado: q.enunciado,
            url_imagem: q.url_imagem,
            alternativas: q.alternativas,
            gabarito: q.gabarito,
            comentario_resolucao: q.comentario_resolucao,
            conteudo_principal: q.conteudo_principal,
            nivel_dificuldade: q.nivel_dificuldade
          });
        }
      }
    }
    const allRows = [...simRows, ...dailyRows].sort((a, b) => {
      const da = a.answeredAt ? new Date(a.answeredAt).getTime() : 0;
      const db2 = b.answeredAt ? new Date(b.answeredAt).getTime() : 0;
      return db2 - da;
    });
    const total = allRows.length;
    const rows = allRows.slice(input.offset, input.offset + input.limit);
    return { rows, total };
  }),
  // ---------------------------------------------------------------------------
  // ABANDONA simulado em andamento
  // ---------------------------------------------------------------------------
  abandon: protectedProcedure.input(z2.object({ simulationId: z2.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    await ctx.db.update(simulations).set({ status: "abandoned" }).where(
      and2(
        eq2(simulations.id, input.simulationId),
        eq2(simulations.userId, userId),
        eq2(simulations.status, "in_progress")
      )
    );
    return { success: true };
  })
});

// server/auth.router.ts
import { z as z3 } from "zod";
import { eq as eq3 } from "drizzle-orm";
import { TRPCError as TRPCError4 } from "@trpc/server";

// server/auth.ts
import { jwtVerify, SignJWT } from "jose";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
var scryptAsync = promisify(scrypt);
var JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-mude-em-producao-12345"
);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${salt}:${buf.toString("hex")}`;
}
async function verifyPassword(password, hash) {
  const [salt, storedHash] = hash.split(":");
  const buf = await scryptAsync(password, salt, 64);
  const storedBuf = Buffer.from(storedHash, "hex");
  return timingSafeEqual(buf, storedBuf);
}
async function createToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(JWT_SECRET);
}
async function authMiddleware(req, _res, next) {
  try {
    const token = req.cookies?.token ?? req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      req.user = payload;
    }
  } catch {
  }
  next();
}

// server/auth.router.ts
function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1e3
    // 30 dias
  };
}
var authRouter = createTRPCRouter({
  // Retorna sessão actual com dados frescos do banco
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const [user] = await ctx.db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      subscriptionExpiresAt: users.subscriptionExpiresAt,
      active: users.active
    }).from(users).where(eq3(users.id, Number(ctx.user.id))).limit(1);
    if (!user || !user.active) return null;
    return user;
  }),
  // Cadastro
  register: publicProcedure.input(z3.object({
    name: z3.string().min(2).max(100),
    email: z3.string().email(),
    password: z3.string().min(6)
  })).mutation(async ({ ctx, input }) => {
    const [existing] = await ctx.db.select({ id: users.id }).from(users).where(eq3(users.email, input.email.toLowerCase().trim())).limit(1);
    if (existing) {
      throw new TRPCError4({ code: "CONFLICT", message: "Este e-mail j\xE1 est\xE1 cadastrado." });
    }
    const passwordHash = await hashPassword(input.password);
    const [result] = await ctx.db.insert(users).values({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      role: "student"
    });
    const userId = Number(result.insertId);
    const token = await createToken({ id: userId, email: input.email, name: input.name, role: "student" });
    ctx.res.cookie("token", token, cookieOptions());
    return { id: userId, name: input.name, email: input.email, role: "student" };
  }),
  // Login
  login: publicProcedure.input(z3.object({
    email: z3.string().email(),
    password: z3.string().min(1)
  })).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.select().from(users).where(eq3(users.email, input.email.toLowerCase().trim())).limit(1);
    if (!user || !await verifyPassword(input.password, user.passwordHash)) {
      throw new TRPCError4({ code: "UNAUTHORIZED", message: "E-mail ou senha incorretos." });
    }
    if (!user.active) {
      throw new TRPCError4({ code: "FORBIDDEN", message: "Conta desativada." });
    }
    const token = await createToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    ctx.res.cookie("token", token, cookieOptions());
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }),
  // Logout
  logout: protectedProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("token", { path: "/" });
    return { success: true };
  })
});

// server/users.router.ts
import { z as z4 } from "zod";
import { eq as eq4 } from "drizzle-orm";
import { TRPCError as TRPCError5 } from "@trpc/server";
var usersRouter = createTRPCRouter({
  // Lista todos os utilizadores com status de assinatura
  list: adminProcedure.input(z4.object({ search: z4.string().optional() })).query(async ({ ctx, input }) => {
    const rows = await ctx.db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      active: users.active,
      subscriptionExpiresAt: users.subscriptionExpiresAt,
      createdAt: users.createdAt
    }).from(users).orderBy(users.createdAt);
    const now = /* @__PURE__ */ new Date();
    const withStatus = rows.map((u) => ({
      ...u,
      subscriptionStatus: u.role === "admin" ? "admin" : u.subscriptionExpiresAt === null ? "sem_assinatura" : u.subscriptionExpiresAt > now ? "ativa" : "expirada",
      daysRemaining: u.subscriptionExpiresAt && u.subscriptionExpiresAt > now ? Math.ceil((u.subscriptionExpiresAt.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)) : null
    }));
    if (!input.search) return withStatus;
    const q = input.search.toLowerCase();
    return withStatus.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }),
  // Define ou renova a assinatura de um utilizador
  setSubscription: adminProcedure.input(z4.object({
    id: z4.number().int().positive(),
    // Número de meses a adicionar a partir de hoje (ou da expiração actual se ainda válida)
    months: z4.number().int().min(1).max(24)
  })).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.select({ id: users.id, subscriptionExpiresAt: users.subscriptionExpiresAt }).from(users).where(eq4(users.id, input.id)).limit(1);
    if (!user) throw new TRPCError5({ code: "NOT_FOUND", message: "Utilizador n\xE3o encontrado." });
    const now = /* @__PURE__ */ new Date();
    const base = user.subscriptionExpiresAt && user.subscriptionExpiresAt > now ? user.subscriptionExpiresAt : now;
    const newExpiry = new Date(base);
    newExpiry.setMonth(newExpiry.getMonth() + input.months);
    await ctx.db.update(users).set({ subscriptionExpiresAt: newExpiry, active: true }).where(eq4(users.id, input.id));
    return { success: true, expiresAt: newExpiry };
  }),
  // Remove a assinatura de um utilizador
  revokeSubscription: adminProcedure.input(z4.object({ id: z4.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(users).set({ subscriptionExpiresAt: null, active: false }).where(eq4(users.id, input.id));
    return { success: true };
  }),
  // Redefine a senha
  resetPassword: adminProcedure.input(z4.object({
    id: z4.number().int().positive(),
    newPassword: z4.string().min(6)
  })).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.select({ id: users.id }).from(users).where(eq4(users.id, input.id)).limit(1);
    if (!user) throw new TRPCError5({ code: "NOT_FOUND", message: "Utilizador n\xE3o encontrado." });
    const passwordHash = await hashPassword(input.newPassword);
    await ctx.db.update(users).set({ passwordHash }).where(eq4(users.id, input.id));
    return { success: true };
  }),
  // Elimina utilizador
  delete: adminProcedure.input(z4.object({ id: z4.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.select({ id: users.id, role: users.role }).from(users).where(eq4(users.id, input.id)).limit(1);
    if (!user) throw new TRPCError5({ code: "NOT_FOUND", message: "Utilizador n\xE3o encontrado." });
    if (user.role === "admin") throw new TRPCError5({ code: "FORBIDDEN", message: "N\xE3o \xE9 poss\xEDvel excluir um admin." });
    const userSims = await ctx.db.select({ id: simulations.id }).from(simulations).where(eq4(simulations.userId, input.id));
    for (const sim of userSims) {
      await ctx.db.delete(simulationAnswers).where(eq4(simulationAnswers.simulationId, sim.id));
    }
    await ctx.db.delete(simulations).where(eq4(simulations.userId, input.id));
    await ctx.db.delete(users).where(eq4(users.id, input.id));
    return { success: true };
  })
});

// server/review.router.ts
import { z as z5 } from "zod";
import { eq as eq5, and as and3, desc as desc3, sql as sql3 } from "drizzle-orm";
var QuestaoSchema = z5.object({
  enunciado: z5.string().min(5),
  opcoes: z5.array(z5.string()).length(4),
  correta: z5.number().int().min(0).max(3)
});
var ReviewBaseSchema = z5.object({
  titulo: z5.string().min(3).max(200),
  conteudo: z5.string().default(""),
  url_pdf: z5.string().url().nullable().optional(),
  topico: z5.string().optional(),
  questoes: z5.array(QuestaoSchema).default([]),
  active: z5.boolean().default(true)
});
var reviewRouter = createTRPCRouter({
  // ── Admin: lista todos os textos ──────────────────────────────────────────
  adminList: adminProcedure.input(z5.object({ page: z5.number().default(1), pageSize: z5.number().default(20) })).query(async ({ ctx, input }) => {
    const offset = (input.page - 1) * input.pageSize;
    const [rows, [{ count }]] = await Promise.all([
      ctx.db.select().from(reviewContents).orderBy(desc3(reviewContents.createdAt)).limit(input.pageSize).offset(offset),
      ctx.db.select({ count: sql3`COUNT(*)` }).from(reviewContents)
    ]);
    return { items: rows, total: Number(count), page: input.page, pageSize: input.pageSize };
  }),
  // ── Admin: cria texto ─────────────────────────────────────────────────────
  create: adminProcedure.input(ReviewBaseSchema).mutation(async ({ ctx, input }) => {
    const [result] = await ctx.db.insert(reviewContents).values(input);
    return { id: Number(result.insertId), success: true };
  }),
  // ── Admin: atualiza texto ─────────────────────────────────────────────────
  update: adminProcedure.input(ReviewBaseSchema.partial().extend({ id: z5.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    await ctx.db.update(reviewContents).set(data).where(eq5(reviewContents.id, id));
    return { success: true };
  }),
  // ── Admin: toggle active ──────────────────────────────────────────────────
  toggleActive: adminProcedure.input(z5.object({ id: z5.number().int().positive(), active: z5.boolean() })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(reviewContents).set({ active: input.active }).where(eq5(reviewContents.id, input.id));
    return { success: true };
  }),
  // ── Admin: deleta texto ───────────────────────────────────────────────────
  delete: adminProcedure.input(z5.object({ id: z5.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(reviewContents).where(eq5(reviewContents.id, input.id));
    return { success: true };
  }),
  // ── Aluno: lista todos os conteúdos ativos (para página de browse) ───────
  listAll: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select({
      id: reviewContents.id,
      titulo: reviewContents.titulo,
      topico: reviewContents.topico,
      url_pdf: reviewContents.url_pdf,
      createdAt: reviewContents.createdAt
    }).from(reviewContents).where(eq5(reviewContents.active, true)).orderBy(desc3(reviewContents.createdAt));
    return rows;
  }),
  // ── Aluno: busca conteúdo específico por id ───────────────────────────────
  getById: protectedProcedure.input(z5.object({ id: z5.number().int().positive() })).query(async ({ ctx, input }) => {
    const [content] = await ctx.db.select().from(reviewContents).where(and3(eq5(reviewContents.id, input.id), eq5(reviewContents.active, true))).limit(1);
    return content ?? null;
  }),
  // ── Aluno: pega (ou cria) o Revise do dia ────────────────────────────────
  getDaily: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const [existing] = await ctx.db.select().from(dailyReviews).where(and3(eq5(dailyReviews.userId, userId), eq5(dailyReviews.reviewDate, today))).limit(1);
    if (existing) {
      const [content] = await ctx.db.select().from(reviewContents).where(eq5(reviewContents.id, existing.contentId)).limit(1);
      return { review: existing, content: content ?? null };
    }
    const seen = await ctx.db.select({ contentId: dailyReviews.contentId }).from(dailyReviews).where(eq5(dailyReviews.userId, userId));
    const seenIds = seen.map((s) => s.contentId);
    const allActive = await ctx.db.select().from(reviewContents).where(eq5(reviewContents.active, true)).orderBy(sql3`RAND()`).limit(50);
    const unseen = allActive.filter((c) => !seenIds.includes(c.id));
    const chosen = unseen.length > 0 ? unseen[0] : allActive[0];
    if (!chosen) return { review: null, content: null };
    const newReview = {
      userId,
      reviewDate: today,
      contentId: chosen.id,
      answers: {},
      completed: false
    };
    const [result] = await ctx.db.insert(dailyReviews).values(newReview);
    const review = { ...newReview, id: Number(result.insertId), correctCount: null, completedAt: null, createdAt: /* @__PURE__ */ new Date() };
    return { review, content: chosen };
  }),
  // ── Aluno: salva resposta e finaliza se todas respondidas ─────────────────
  saveAnswer: protectedProcedure.input(z5.object({
    reviewId: z5.number().int().positive(),
    questionIndex: z5.number().int().min(0).max(2),
    answer: z5.number().int().min(0).max(3)
  })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const [review] = await ctx.db.select().from(dailyReviews).where(and3(eq5(dailyReviews.id, input.reviewId), eq5(dailyReviews.userId, userId))).limit(1);
    if (!review || review.completed) return { ok: false };
    const newAnswers = { ...review.answers, [input.questionIndex]: input.answer };
    const allDone = [0, 1, 2].every((i) => newAnswers[i] !== void 0);
    let correctCount = null;
    if (allDone) {
      const [content] = await ctx.db.select().from(reviewContents).where(eq5(reviewContents.id, review.contentId)).limit(1);
      if (content) {
        const qs = content.questoes;
        correctCount = qs.filter((q, i) => newAnswers[i] === q.correta).length;
      }
    }
    await ctx.db.update(dailyReviews).set({
      answers: newAnswers,
      ...allDone ? { completed: true, correctCount, completedAt: /* @__PURE__ */ new Date() } : {}
    }).where(eq5(dailyReviews.id, input.reviewId));
    return { ok: true, allDone, correctCount };
  }),
  // ── Aluno: histórico de revisões ──────────────────────────────────────────
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select({
      id: dailyReviews.id,
      reviewDate: dailyReviews.reviewDate,
      completed: dailyReviews.completed,
      correctCount: dailyReviews.correctCount,
      completedAt: dailyReviews.completedAt,
      titulo: reviewContents.titulo,
      topico: reviewContents.topico
    }).from(dailyReviews).leftJoin(reviewContents, eq5(dailyReviews.contentId, reviewContents.id)).where(eq5(dailyReviews.userId, ctx.user.id)).orderBy(desc3(dailyReviews.reviewDate)).limit(30);
    return rows;
  })
});

// server/formulas.router.ts
import { z as z6 } from "zod";
import { eq as eq6, asc as asc2 } from "drizzle-orm";
var formulasRouter = createTRPCRouter({
  // Listagem para todos os alunos — agrupa por secao
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select().from(formulas).where(eq6(formulas.active, true)).orderBy(asc2(formulas.secao), asc2(formulas.ordem), asc2(formulas.id));
    const grouped = {};
    for (const f of rows) {
      if (!grouped[f.secao]) grouped[f.secao] = { cor: f.cor, formulas: [] };
      grouped[f.secao].formulas.push(f);
    }
    return grouped;
  }),
  // Admin: listagem completa (incluindo inactivas)
  listAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(formulas).orderBy(asc2(formulas.secao), asc2(formulas.ordem));
  }),
  // Admin: criar fórmula
  create: adminProcedure.input(z6.object({
    secao: z6.string().min(1).max(100),
    cor: z6.string().default("#01738d"),
    titulo: z6.string().min(1).max(200),
    formula: z6.string().min(1),
    descricao: z6.string().min(1),
    ordem: z6.number().int().default(0)
  })).mutation(async ({ ctx, input }) => {
    const [result] = await ctx.db.insert(formulas).values({ ...input, active: true });
    return { id: Number(result.insertId), success: true };
  }),
  // Admin: editar fórmula
  update: adminProcedure.input(z6.object({
    id: z6.number().int().positive(),
    secao: z6.string().min(1).max(100).optional(),
    cor: z6.string().optional(),
    titulo: z6.string().min(1).max(200).optional(),
    formula: z6.string().min(1).optional(),
    descricao: z6.string().min(1).optional(),
    ordem: z6.number().int().optional(),
    active: z6.boolean().optional()
  })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    await ctx.db.update(formulas).set(data).where(eq6(formulas.id, id));
    return { success: true };
  }),
  // Admin: excluir fórmula
  delete: adminProcedure.input(z6.object({ id: z6.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(formulas).where(eq6(formulas.id, input.id));
    return { success: true };
  })
});

// server/agenda.router.ts
import { eq as eq7, sql as sql4, and as and4 } from "drizzle-orm";
import { z as z7 } from "zod";
var ENEM_TOPICS = [
  { topic: "Grandezas Proporcionais", weight: 0.25 },
  { topic: "Geometria Espacial", weight: 0.11 },
  { topic: "Fun\xE7\xF5es", weight: 0.09 },
  { topic: "Estat\xEDstica", weight: 0.09 },
  { topic: "Geometria Plana", weight: 0.08 },
  { topic: "Probabilidades", weight: 0.06 },
  { topic: "Aritm\xE9tica", weight: 0.05 },
  { topic: "An\xE1lise Combinat\xF3ria", weight: 0.04 },
  { topic: "M\xE9dias", weight: 0.04 },
  { topic: "Trigonometria", weight: 0.03 },
  { topic: "No\xE7\xF5es de L\xF3gica Matem\xE1tica", weight: 0.02 },
  { topic: "Geometria Anal\xEDtica", weight: 0.02 },
  { topic: "Logar\xEDtmos", weight: 0.02 },
  { topic: "Conjuntos Num\xE9ricos", weight: 0.02 },
  { topic: "Progress\xE3o Aritm\xE9tica", weight: 0.02 },
  { topic: "Progress\xE3o Geom\xE9trica", weight: 0.02 },
  { topic: "Equa\xE7\xF5es", weight: 0.01 },
  { topic: "Constru\xE7\xF5es Geom\xE9tricas", weight: 0.01 },
  { topic: "Inequa\xE7\xF5es", weight: 0.01 },
  { topic: "Matrizes", weight: 0.01 },
  { topic: "Potencia\xE7\xE3o", weight: 0.01 },
  { topic: "Sistemas Lineares", weight: 0.01 },
  { topic: "Conjuntos", weight: 5e-3 },
  { topic: "Equa\xE7\xF5es polinomiais", weight: 5e-3 },
  { topic: "Matem\xE1tica Financeira", weight: 5e-3 }
];
function parseTopics(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return raw ? [raw] : [];
  }
}
var agendaRouter = createTRPCRouter({
  // ── Cronograma salvo pelo aluno ───────────────────────────────────────────
  // Helpers para parse/stringify de topics (suporta legado string simples)
  getMySchedule: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select().from(studySchedule).where(eq7(studySchedule.userId, ctx.user.id)).orderBy(studySchedule.dayOfWeek, studySchedule.startTime);
    return rows.map((r) => ({
      ...r,
      topics: parseTopics(r.topic)
    }));
  }),
  addSlot: protectedProcedure.input(z7.object({
    dayOfWeek: z7.number().int().min(1).max(6),
    startTime: z7.string().regex(/^\d{2}:\d{2}$/),
    endTime: z7.string().regex(/^\d{2}:\d{2}$/),
    topics: z7.array(z7.string().min(1).max(100)).min(1)
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(studySchedule).values({
      userId: ctx.user.id,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      topic: JSON.stringify(input.topics)
    });
    return { success: true };
  }),
  removeSlot: protectedProcedure.input(z7.object({ id: z7.number().int().positive() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(studySchedule).where(
      and4(eq7(studySchedule.id, input.id), eq7(studySchedule.userId, ctx.user.id))
    );
    return { success: true };
  }),
  // ── Desempenho por tópico (para sugestões) ───────────────────────────────
  getTopicStats: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.select({
      topic: questions.conteudo_principal,
      total: sql4`COUNT(*)`,
      correct: sql4`SUM(CASE WHEN ${simulationAnswers.isCorrect} = 1 THEN 1 ELSE 0 END)`
    }).from(simulationAnswers).innerJoin(simulations, eq7(simulationAnswers.simulationId, simulations.id)).innerJoin(questions, eq7(simulationAnswers.questionId, questions.id)).where(eq7(simulations.userId, ctx.user.id)).groupBy(questions.conteudo_principal);
    const accuracy = {};
    for (const r of rows) {
      const total = Number(r.total);
      if (total > 0) accuracy[r.topic] = Number(r.correct) / total;
    }
    return ENEM_TOPICS.map((t2) => {
      const acc = accuracy[t2.topic] ?? null;
      const hasData = t2.topic in accuracy;
      let status = !hasData ? "sem_dados" : acc < 0.4 ? "fraco" : acc < 0.7 ? "regular" : "forte";
      return {
        topic: t2.topic,
        enemPct: Math.round(t2.weight * 100),
        userAccuracy: hasData ? Math.round(acc * 100) : null,
        status
      };
    });
  })
});

// server/flashcards.router.ts
import { z as z8 } from "zod";
import { eq as eq8, and as and5, asc as asc3, inArray as inArray3, sql as sql5 } from "drizzle-orm";
function applySM2(quality, prev) {
  let { easinessFactor, interval, repetitions } = prev;
  easinessFactor = Math.max(
    1.3,
    easinessFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  }
  const nextReview = /* @__PURE__ */ new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  return { easinessFactor, interval, repetitions, nextReview };
}
var flashcardsRouter = createTRPCRouter({
  // ── Decks (admin) ─────────────────────────────────────────────────────────
  listAllDecks: adminProcedure.query(async () => {
    const decks = await db.select().from(flashcardDecks).orderBy(asc3(flashcardDecks.createdAt));
    const counts = await db.select({ deckId: flashcards.deckId, count: sql5`COUNT(*)` }).from(flashcards).groupBy(flashcards.deckId);
    const countMap = new Map(counts.map((r) => [r.deckId, Number(r.count)]));
    return decks.map((d) => ({ ...d, cardCount: countMap.get(d.id) ?? 0 }));
  }),
  createDeck: adminProcedure.input(z8.object({
    title: z8.string().min(1).max(255),
    description: z8.string().optional(),
    color: z8.string().default("#009688")
  })).mutation(async ({ input }) => {
    const [res] = await db.insert(flashcardDecks).values({
      title: input.title,
      description: input.description ?? null,
      color: input.color
    });
    return { id: res.insertId };
  }),
  updateDeck: adminProcedure.input(z8.object({
    id: z8.number(),
    title: z8.string().min(1).max(255).optional(),
    description: z8.string().nullable().optional(),
    color: z8.string().optional(),
    active: z8.boolean().optional()
  })).mutation(async ({ input }) => {
    const { id, ...rest } = input;
    await db.update(flashcardDecks).set(rest).where(eq8(flashcardDecks.id, id));
  }),
  deleteDeck: adminProcedure.input(z8.object({ id: z8.number() })).mutation(async ({ input }) => {
    await db.delete(flashcardDecks).where(eq8(flashcardDecks.id, input.id));
  }),
  // ── Cards (admin) ─────────────────────────────────────────────────────────
  listCards: adminProcedure.input(z8.object({ deckId: z8.number() })).query(async ({ input }) => {
    return db.select().from(flashcards).where(eq8(flashcards.deckId, input.deckId)).orderBy(asc3(flashcards.orderIndex), asc3(flashcards.createdAt));
  }),
  createCard: adminProcedure.input(z8.object({
    deckId: z8.number(),
    front: z8.string().min(1),
    back: z8.string().min(1),
    frontImage: z8.string().url().nullable().optional(),
    backImage: z8.string().url().nullable().optional()
  })).mutation(async ({ input }) => {
    const last = await db.select({ idx: flashcards.orderIndex }).from(flashcards).where(eq8(flashcards.deckId, input.deckId)).orderBy(sql5`order_index DESC`).limit(1);
    const orderIndex = last.length > 0 ? last[0].idx + 1 : 0;
    const [res] = await db.insert(flashcards).values({
      deckId: input.deckId,
      front: input.front,
      back: input.back,
      frontImage: input.frontImage ?? null,
      backImage: input.backImage ?? null,
      orderIndex
    });
    return { id: res.insertId };
  }),
  updateCard: adminProcedure.input(z8.object({
    id: z8.number(),
    front: z8.string().min(1).optional(),
    back: z8.string().min(1).optional(),
    frontImage: z8.string().nullable().optional(),
    backImage: z8.string().nullable().optional(),
    active: z8.boolean().optional()
  })).mutation(async ({ input }) => {
    const { id, ...rest } = input;
    await db.update(flashcards).set(rest).where(eq8(flashcards.id, id));
  }),
  deleteCard: adminProcedure.input(z8.object({ id: z8.number() })).mutation(async ({ input }) => {
    await db.delete(flashcards).where(eq8(flashcards.id, input.id));
  }),
  // ── Decks com progresso do aluno (tela de seleção) ────────────────────────
  listDecks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const now = /* @__PURE__ */ new Date();
    const decks = await db.select().from(flashcardDecks).where(eq8(flashcardDecks.active, true)).orderBy(asc3(flashcardDecks.createdAt));
    const result = await Promise.all(decks.map(async (deck) => {
      const cards = await db.select({ id: flashcards.id }).from(flashcards).where(and5(eq8(flashcards.deckId, deck.id), eq8(flashcards.active, true)));
      const totalCards = cards.length;
      if (totalCards === 0) return { ...deck, totalCards: 0, dueCount: 0, newCount: 0, masteredCount: 0, studyableCount: 0 };
      const cardIds = cards.map((c) => c.id);
      const progRows = await db.select().from(flashcardProgress).where(and5(eq8(flashcardProgress.userId, userId), inArray3(flashcardProgress.cardId, cardIds)));
      const progressMap = new Map(progRows.map((p) => [p.cardId, p]));
      let dueCount = 0, newCount = 0, masteredCount = 0;
      for (const { id } of cards) {
        const p = progressMap.get(id);
        if (!p || !p.nextReview) newCount++;
        else if (p.nextReview <= now) dueCount++;
        else if (p.repetitions >= 3) masteredCount++;
      }
      return { ...deck, totalCards, dueCount, newCount, masteredCount, studyableCount: dueCount + newCount };
    }));
    return result;
  }),
  // ── Sessão de estudo ──────────────────────────────────────────────────────
  getStudySession: protectedProcedure.input(z8.object({ deckId: z8.number(), limit: z8.number().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const now = /* @__PURE__ */ new Date();
    const [deck] = await db.select().from(flashcardDecks).where(eq8(flashcardDecks.id, input.deckId)).limit(1);
    const allCards = await db.select().from(flashcards).where(and5(eq8(flashcards.deckId, input.deckId), eq8(flashcards.active, true))).orderBy(asc3(flashcards.orderIndex), asc3(flashcards.createdAt));
    if (allCards.length === 0) {
      return { deck: deck ?? null, cards: [], totalInDeck: 0, dueCount: 0, newCount: 0 };
    }
    const cardIds = allCards.map((c) => c.id);
    const progRows = await db.select().from(flashcardProgress).where(and5(eq8(flashcardProgress.userId, userId), inArray3(flashcardProgress.cardId, cardIds)));
    const progressMap = new Map(progRows.map((p) => [p.cardId, p]));
    const due = [];
    const nw = [];
    for (const card of allCards) {
      const p = progressMap.get(card.id);
      if (!p || !p.nextReview) nw.push(card);
      else if (p.nextReview <= now) due.push(card);
    }
    const session = [...due, ...nw].slice(0, input.limit);
    let nextScheduled = null;
    if (due.length === 0 && nw.length === 0) {
      const upcoming = progRows.filter((p) => p.nextReview && p.nextReview > now).sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
      nextScheduled = upcoming[0]?.nextReview ?? null;
    }
    return {
      deck: deck ?? null,
      cards: session.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
        frontImage: c.frontImage,
        backImage: c.backImage,
        progress: progressMap.get(c.id) ?? null
      })),
      totalInDeck: allCards.length,
      dueCount: due.length,
      newCount: nw.length,
      nextScheduled
    };
  }),
  // ── Registar revisão (SM-2) ───────────────────────────────────────────────
  recordReview: protectedProcedure.input(z8.object({
    cardId: z8.number(),
    quality: z8.union([z8.literal(1), z8.literal(3), z8.literal(5)])
  })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const { cardId, quality } = input;
    const [existing] = await db.select().from(flashcardProgress).where(and5(eq8(flashcardProgress.userId, userId), eq8(flashcardProgress.cardId, cardId)));
    const prev = existing ? { easinessFactor: existing.easinessFactor, interval: existing.interval, repetitions: existing.repetitions } : { easinessFactor: 2.5, interval: 0, repetitions: 0 };
    const { easinessFactor, interval, repetitions, nextReview } = applySM2(quality, prev);
    const now = /* @__PURE__ */ new Date();
    if (existing) {
      await db.update(flashcardProgress).set({ easinessFactor, interval, repetitions, nextReview, lastReviewed: now }).where(eq8(flashcardProgress.id, existing.id));
    } else {
      await db.insert(flashcardProgress).values({
        userId,
        cardId,
        easinessFactor,
        interval,
        repetitions,
        nextReview,
        lastReviewed: now
      });
    }
    return { interval, repetitions, nextReview };
  })
});

// server/router.ts
var appRouter = createTRPCRouter({
  auth: authRouter,
  questions: questionsRouter,
  simulations: simulationsRouter,
  users: usersRouter,
  review: reviewRouter,
  formulas: formulasRouter,
  agenda: agendaRouter,
  flashcards: flashcardsRouter
});

// server/index.ts
import { eq as eq9 } from "drizzle-orm";

// server/seed-matematica-content.ts
var FRACOES_ARTICLE = {
  titulo: "Opera\xE7\xF5es com Fra\xE7\xF5es",
  topico: "Aritm\xE9tica",
  conteudo: `## 1. O que \xE9 uma fra\xE7\xE3o?

Uma **fra\xE7\xE3o** representa uma parte de um todo dividido em partes iguais. Na nota\xE7\xE3o $\\dfrac{a}{b}$, com $b \\neq 0$:

\u2022 $a$ \xE9 o **numerador** (quantas partes tomamos)
\u2022 $b$ \xE9 o **denominador** (em quantas partes o todo foi dividido)

**Tipos de fra\xE7\xF5es:**
\u2022 **Pr\xF3pria:** $|a| < |b|$ \u2014 representa menos que um inteiro. Ex.: $\\tfrac{3}{5}$
\u2022 **Impr\xF3pria:** $|a| \\geq |b|$ \u2014 representa um inteiro ou mais. Ex.: $\\tfrac{7}{3}$
\u2022 **Aparente:** quando \xE9 equivalente a um inteiro. Ex.: $\\tfrac{8}{4} = 2$
\u2022 **Mista:** um inteiro mais uma fra\xE7\xE3o. Ex.: $2\\tfrac{1}{3} = \\tfrac{7}{3}$

---

## 2. Fra\xE7\xF5es equivalentes e simplifica\xE7\xE3o

Duas fra\xE7\xF5es s\xE3o **equivalentes** quando representam a mesma quantidade. Multiplicar (ou dividir) numerador e denominador pelo mesmo n\xFAmero diferente de zero gera uma fra\xE7\xE3o equivalente:

$$\\frac{a}{b} = \\frac{a \\cdot k}{b \\cdot k} \\quad (k \\neq 0)$$

**Simplificar** uma fra\xE7\xE3o \xE9 dividir numerador e denominador pelo seu m\xE1ximo divisor comum (MDC), obtendo a **forma irredut\xEDvel**.

**Exemplo:**

$$\\frac{24}{36} = \\frac{24 \\div 12}{36 \\div 12} = \\frac{2}{3}$$

---

## 3. Adi\xE7\xE3o e subtra\xE7\xE3o

**Caso 1 \u2014 Mesmo denominador:** soma-se (ou subtrai-se) os numeradores e conserva-se o denominador.

$$\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}$$

**Caso 2 \u2014 Denominadores diferentes:** calcula-se o **MMC** dos denominadores e reduzem-se as fra\xE7\xF5es a esse denominador comum antes de somar.

**Exemplo:**

$$\\frac{1}{6} + \\frac{3}{4} = \\frac{2}{12} + \\frac{9}{12} = \\frac{11}{12}$$

(MMC(6,4) = 12; depois: $12 \\div 6 \\cdot 1 = 2$ e $12 \\div 4 \\cdot 3 = 9$.)

**Atalho (soma cruzada)** \u2014 \xFAtil para duas fra\xE7\xF5es:

$$\\frac{a}{b} + \\frac{c}{d} = \\frac{a\\,d + b\\,c}{b\\,d}$$

\u26A0\uFE0F Gera um denominador maior; simplifique ao final.

---

## 4. Multiplica\xE7\xE3o

Multiplica-se numerador com numerador e denominador com denominador:

$$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$$

**Dica:** simplifique antes de multiplicar (cancelamento cruzado) \u2014 evita n\xFAmeros grandes.

**Exemplo:**

$$\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{\\cancel{4}^{\\,1}}{9} \\cdot \\frac{\\cancel{3}^{\\,1}}{\\cancel{8}^{\\,2}} \\cdot \\frac{1}{\\cancel{9}^{\\,3}} = \\frac{1}{6}$$

---

## 5. Divis\xE3o

Dividir por uma fra\xE7\xE3o \xE9 multiplicar pelo seu **inverso** (tamb\xE9m chamado rec\xEDproco):

$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$$

**Exemplo:**

$$\\frac{5}{6} \\div \\frac{2}{3} = \\frac{5}{6} \\cdot \\frac{3}{2} = \\frac{15}{12} = \\frac{5}{4}$$

---

## 6. Potencia\xE7\xE3o e radicia\xE7\xE3o

**Pot\xEAncia:** eleva-se separadamente numerador e denominador:

$$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$

**Expoente negativo** inverte a fra\xE7\xE3o:

$$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$$

**Raiz:** extrai-se a raiz do numerador e do denominador:

$$\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}$$

---

## 7. Fra\xE7\xE3o de uma quantidade

"Fra\xE7\xE3o de" em problemas significa **multiplica\xE7\xE3o**:

$$\\frac{a}{b} \\text{ de } N = \\frac{a}{b} \\cdot N$$

**Exemplo:** $\\tfrac{3}{4}$ de 200 reais $= \\tfrac{3}{4} \\cdot 200 = 150$ reais.

---

## 8. Erros mais comuns

\u274C Somar numeradores e denominadores separadamente: $\\tfrac{1}{2} + \\tfrac{1}{3} \\neq \\tfrac{2}{5}$.

\u2705 O correto \xE9: $\\tfrac{1}{2} + \\tfrac{1}{3} = \\tfrac{3}{6} + \\tfrac{2}{6} = \\tfrac{5}{6}$.

\u274C Inverter a fra\xE7\xE3o errada na divis\xE3o: na divis\xE3o $\\tfrac{a}{b} \\div \\tfrac{c}{d}$ inverte-se **apenas** a segunda.

\u274C Esquecer de simplificar ao final: respostas como $\\tfrac{6}{8}$ devem virar $\\tfrac{3}{4}$.

---

## Resumo das opera\xE7\xF5es

| Opera\xE7\xE3o | Regra |
|---|---|
| Soma/Subtra\xE7\xE3o (mesmo denom.) | $\\dfrac{a}{c} \\pm \\dfrac{b}{c} = \\dfrac{a \\pm b}{c}$ |
| Soma/Subtra\xE7\xE3o (denom. diferentes) | Reduzir ao MMC |
| Multiplica\xE7\xE3o | $\\dfrac{a}{b} \\cdot \\dfrac{c}{d} = \\dfrac{ac}{bd}$ |
| Divis\xE3o | $\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}$ |
| Pot\xEAncia | $\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$ |
| Fra\xE7\xE3o de N | $\\dfrac{a}{b} \\cdot N$ |`,
  questoes: [
    {
      enunciado: "Calcule: $\\dfrac{2}{3} + \\dfrac{1}{4} - \\dfrac{1}{6}$.",
      opcoes: [
        "$\\dfrac{3}{4}$",
        "$\\dfrac{5}{6}$",
        "$\\dfrac{7}{12}$",
        "$\\dfrac{11}{12}$"
      ],
      correta: 0
    },
    {
      enunciado: "Uma torneira enche $\\dfrac{3}{5}$ de um tanque em uma hora. Em quantas horas o tanque fica cheio?",
      opcoes: [
        "$\\dfrac{3}{5}$ h",
        "$\\dfrac{5}{3}$ h",
        "$\\dfrac{8}{5}$ h",
        "$2$ h"
      ],
      correta: 1
    },
    {
      enunciado: "Simplifique a express\xE3o $\\dfrac{\\tfrac{2}{3}}{\\tfrac{4}{9}}$.",
      opcoes: [
        "$\\dfrac{8}{27}$",
        "$\\dfrac{1}{3}$",
        "$\\dfrac{3}{2}$",
        "$\\dfrac{2}{3}$"
      ],
      correta: 2
    }
  ]
};
var RAZAO_PROPORCAO_ARTICLE = {
  titulo: "Raz\xE3o e Propor\xE7\xE3o",
  topico: "Aritm\xE9tica",
  conteudo: `## 1. O que \xE9 uma raz\xE3o?

**Raz\xE3o** entre dois n\xFAmeros $a$ e $b$ (com $b \\neq 0$) \xE9 o quociente $\\dfrac{a}{b}$, lido "$a$ est\xE1 para $b$". Tamb\xE9m escrito $a : b$.

\u2022 $a$ \xE9 o **antecedente**
\u2022 $b$ \xE9 o **consequente**

**Importante:** para fazer sentido como raz\xE3o, as duas grandezas devem estar na **mesma unidade** (ou ser adimensionais, como em escalas e densidades).

**Exemplos:**
\u2022 Escala: $1 : 50\\,000$ \u2014 cada 1 cm no mapa equivale a 50.000 cm no real.
\u2022 Densidade: $\\rho = \\dfrac{m}{V}$ (kg/m\xB3).
\u2022 Velocidade m\xE9dia: $v = \\dfrac{\\Delta s}{\\Delta t}$ (km/h).

---

## 2. Raz\xF5es equivalentes

Duas raz\xF5es s\xE3o **equivalentes** quando representam o mesmo quociente:

$$\\frac{2}{3} = \\frac{4}{6} = \\frac{10}{15}$$

---

## 3. O que \xE9 uma propor\xE7\xE3o?

**Propor\xE7\xE3o** \xE9 uma igualdade entre duas raz\xF5es:

$$\\frac{a}{b} = \\frac{c}{d}$$

L\xEA-se "$a$ est\xE1 para $b$ assim como $c$ est\xE1 para $d$".

\u2022 $a$ e $d$ s\xE3o os **extremos**
\u2022 $b$ e $c$ s\xE3o os **meios**

---

## 4. Propriedade Fundamental

> **Em toda propor\xE7\xE3o, o produto dos meios \xE9 igual ao produto dos extremos.**

$$\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$$

Esta \xE9 a famosa **regra do "cruzamento"** (ou multiplica\xE7\xE3o em cruz), muito usada para resolver equa\xE7\xF5es.

**Exemplo:** encontrar $x$ em $\\dfrac{x}{12} = \\dfrac{3}{4}$.

$$4x = 12 \\cdot 3 \\implies x = \\frac{36}{4} = 9$$

---

## 5. Propriedades \xFAteis

**5.1 Soma/subtra\xE7\xE3o de antecedentes e consequentes:**

$$\\frac{a}{b} = \\frac{c}{d} \\implies \\frac{a+c}{b+d} = \\frac{a-c}{b-d} = \\frac{a}{b}$$

**5.2 Invers\xE3o:**

$$\\frac{a}{b} = \\frac{c}{d} \\iff \\frac{b}{a} = \\frac{d}{c}$$

**5.3 Alternar:**

$$\\frac{a}{b} = \\frac{c}{d} \\iff \\frac{a}{c} = \\frac{b}{d}$$

---

## 6. Grandezas Diretamente Proporcionais

Duas grandezas $x$ e $y$ s\xE3o **diretamente proporcionais** quando seu **quociente** \xE9 constante:

$$\\frac{y}{x} = k \\implies y = k \\cdot x$$

Quando uma **dobra**, a outra **dobra**; quando uma **triplica**, a outra **triplica**.

**Exemplo:** pre\xE7o total \xD7 quantidade de produto (com pre\xE7o unit\xE1rio constante).

---

## 7. Grandezas Inversamente Proporcionais

Duas grandezas $x$ e $y$ s\xE3o **inversamente proporcionais** quando seu **produto** \xE9 constante:

$$x \\cdot y = k \\implies y = \\frac{k}{x}$$

Quando uma **dobra**, a outra \xE9 **reduzida \xE0 metade**.

**Exemplo:** velocidade \xD7 tempo de viagem (para dist\xE2ncia fixa); n\xFAmero de oper\xE1rios \xD7 tempo de obra (para a mesma tarefa).

---

## 8. Regra de Tr\xEAs Simples

**Direta** (grandezas diretamente proporcionais):

$$\\frac{a}{b} = \\frac{x}{y}$$

**Inversa** (grandezas inversamente proporcionais): invertem-se os termos do lado n\xE3o conhecido:

$$\\frac{a}{b} = \\frac{y}{x}$$

**Exemplo direta:** 5 kg de arroz custam R\\$ 25; quanto custam 12 kg?

$$\\frac{5}{25} = \\frac{12}{x} \\implies x = \\frac{12 \\cdot 25}{5} = 60 \\text{ reais}$$

**Exemplo inversa:** 6 oper\xE1rios constroem um muro em 12 dias. Em quantos dias 9 oper\xE1rios constroem o mesmo muro?

$$\\frac{6}{9} = \\frac{x}{12} \\implies x = \\frac{6 \\cdot 12}{9} = 8 \\text{ dias}$$

---

## 9. Regra de Tr\xEAs Composta

Envolve **tr\xEAs ou mais grandezas**. Passos:

1. Monte uma tabela relacionando as grandezas com a inc\xF3gnita $x$.
2. Analise se cada grandeza \xE9 **direta** ou **inversa** em rela\xE7\xE3o a $x$ (marque com setas).
3. Grandezas **diretas**: mant\xEAm a fra\xE7\xE3o como est\xE1.
4. Grandezas **inversas**: invertem a fra\xE7\xE3o correspondente.
5. Isole $x$.

**Exemplo:** 4 m\xE1quinas produzem 800 pe\xE7as em 5 dias. Quantas pe\xE7as 6 m\xE1quinas produzem em 8 dias?

| M\xE1quinas | Pe\xE7as | Dias |
|---|---|---|
| 4 | 800 | 5 |
| 6 | $x$ | 8 |

\u2022 M\xE1quinas \xD7 pe\xE7as: quanto mais m\xE1quinas, mais pe\xE7as \u2192 **direta**.
\u2022 Dias \xD7 pe\xE7as: quanto mais dias, mais pe\xE7as \u2192 **direta**.

$$\\frac{800}{x} = \\frac{4}{6} \\cdot \\frac{5}{8} = \\frac{20}{48} = \\frac{5}{12}$$

$$x = \\frac{800 \\cdot 12}{5} = 1920 \\text{ pe\xE7as}$$

---

## Resumo

| Conceito | F\xF3rmula / Regra |
|---|---|
| Raz\xE3o | $\\dfrac{a}{b}$, com $b \\neq 0$ |
| Propor\xE7\xE3o | $\\dfrac{a}{b} = \\dfrac{c}{d}$ |
| Prop. fundamental | $a \\cdot d = b \\cdot c$ |
| Diretamente prop. | $y = k \\cdot x$ |
| Inversamente prop. | $x \\cdot y = k$ |
| Regra de 3 simples | $\\dfrac{a}{b} = \\dfrac{x}{y}$ (direta) ou $\\dfrac{a}{b} = \\dfrac{y}{x}$ (inversa) |`,
  questoes: [
    {
      enunciado: "Se 8 oper\xE1rios constroem um muro em 15 dias, em quantos dias 12 oper\xE1rios construir\xE3o o mesmo muro, trabalhando no mesmo ritmo?",
      opcoes: [
        "8 dias",
        "10 dias",
        "12 dias",
        "22,5 dias"
      ],
      correta: 1
    },
    {
      enunciado: "Em um mapa, a dist\xE2ncia entre duas cidades \xE9 de 6 cm. Se a escala do mapa \xE9 1 : 500.000, a dist\xE2ncia real entre as cidades \xE9:",
      opcoes: [
        "3 km",
        "30 km",
        "60 km",
        "300 km"
      ],
      correta: 1
    },
    {
      enunciado: "Duas grandezas $x$ e $y$ s\xE3o inversamente proporcionais. Se $x = 6$ quando $y = 20$, qual \xE9 o valor de $y$ quando $x = 15$?",
      opcoes: [
        "4",
        "8",
        "12",
        "50"
      ],
      correta: 1
    }
  ]
};
var DIVISAO_PROPORCIONAL_ARTICLE = {
  titulo: "Divis\xE3o em Partes Proporcionais",
  topico: "Aritm\xE9tica",
  conteudo: `## 1. Introdu\xE7\xE3o

Dividir uma quantidade **em partes proporcionais** significa repartir essa quantidade de modo que **cada parte seja proporcional** a um n\xFAmero dado. \xC9 uma aplica\xE7\xE3o direta de propor\xE7\xE3o \u2014 muito cobrada em quest\xF5es de sociedade, heran\xE7a, premia\xE7\xE3o e divis\xE3o de lucros.

---

## 2. Divis\xE3o em Partes Diretamente Proporcionais

**Problema-padr\xE3o:** dividir o n\xFAmero $N$ em partes $x$, $y$, $z$ **diretamente proporcionais** a $a$, $b$, $c$.

Condi\xE7\xF5es:

$$\\frac{x}{a} = \\frac{y}{b} = \\frac{z}{c} = k \\qquad \\text{e} \\qquad x + y + z = N$$

**M\xE9todo da constante $k$:**

$$k = \\frac{N}{a + b + c}$$

Depois, $x = k \\cdot a$, $y = k \\cdot b$, $z = k \\cdot c$.

**Exemplo:** dividir R\\$ 1.800 entre tr\xEAs s\xF3cios, em partes diretamente proporcionais a 2, 3 e 4.

$$k = \\frac{1800}{2+3+4} = \\frac{1800}{9} = 200$$

Logo: $x = 400$, $y = 600$, $z = 800$. (Confere: $400+600+800 = 1800$ \u2713)

---

## 3. Divis\xE3o em Partes Inversamente Proporcionais

**Problema-padr\xE3o:** dividir $N$ em partes **inversamente proporcionais** a $a$, $b$, $c$.

Quando uma parte \xE9 inversamente proporcional a $a$, \xE9 **diretamente proporcional a $\\dfrac{1}{a}$**. Ent\xE3o:

$$\\frac{x}{1/a} = \\frac{y}{1/b} = \\frac{z}{1/c} = k$$

Logo: $x = \\dfrac{k}{a}$, $y = \\dfrac{k}{b}$, $z = \\dfrac{k}{c}$, com:

$$k = \\frac{N}{\\tfrac{1}{a} + \\tfrac{1}{b} + \\tfrac{1}{c}}$$

**Dica pr\xE1tica:** some $\\tfrac{1}{a} + \\tfrac{1}{b} + \\tfrac{1}{c}$ reduzindo ao MMC e divida $N$ pelo resultado.

**Exemplo:** dividir R\\$ 1.300 em partes inversamente proporcionais a 2, 3 e 4.

Inverter: $\\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}$. MMC(2,3,4) = 12.

$$\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} = \\frac{6+4+3}{12} = \\frac{13}{12}$$

$$k = \\frac{1300}{13/12} = 1300 \\cdot \\frac{12}{13} = 1200$$

Logo: $x = \\tfrac{1200}{2} = 600$, $y = \\tfrac{1200}{3} = 400$, $z = \\tfrac{1200}{4} = 300$. (Confere: $600+400+300 = 1300$ \u2713)

---

## 4. Divis\xE3o Composta

Dividir $N$ em partes **simultaneamente proporcionais** a mais de um crit\xE9rio.

**Exemplo:** dividir R\\$ 9.500 entre dois funcion\xE1rios A e B:
\u2022 Diretamente proporcional aos anos de servi\xE7o: 8 e 12
\u2022 Diretamente proporcional \xE0s horas trabalhadas: 40 e 50

Para cada funcion\xE1rio, multiplicam-se os fatores:

$$A : B = (8 \\cdot 40) : (12 \\cdot 50) = 320 : 600 = 8 : 15$$

$$k = \\frac{9500}{8+15} = \\frac{9500}{23}$$

Como $9500 / 23 \\approx 413{,}04$, vem: $A \\approx 3304{,}35$ e $B \\approx 6195{,}65$.

**Regra geral \u2014 grandezas diretas multiplicam, inversas dividem (ou usam o rec\xEDproco).**

---

## 5. Situa\xE7\xF5es t\xEDpicas em vestibular

### 5.1 Sociedade / Capital

> Tr\xEAs s\xF3cios investiram R\\$ 20.000, R\\$ 30.000 e R\\$ 50.000. Como dividir um lucro de R\\$ 20.000?

Diretamente proporcional ao capital: raz\xF5es $2 : 3 : 5$, $k = 20000/10 = 2000$.

\u2192 R\\$ 4.000, R\\$ 6.000, R\\$ 10.000.

### 5.2 Sociedade com tempos diferentes

> A entrou com R\\$ 10.000 por 6 meses; B entrou com R\\$ 15.000 por 4 meses.

Multiplicar capital \xD7 tempo: $A : B = 60000 : 60000 = 1 : 1$ \u2014 lucro igual.

### 5.3 Heran\xE7a

> Tr\xEAs herdeiros recebem em partes **inversamente** proporcionais \xE0s suas idades (18, 24, 36 anos) \u2014 o mais novo recebe mais.

---

## 6. Estrat\xE9gia para resolver qualquer exerc\xEDcio

1. **Identifique** se \xE9 direta ou inversa (releia o enunciado).
2. **Monte** as raz\xF5es $x/a = y/b = \\ldots = k$.
3. **Use** a equa\xE7\xE3o de soma $x + y + \\ldots = N$ para achar $k$.
4. **Multiplique** (direta) ou **divida por** (inversa) cada n\xFAmero de propor\xE7\xE3o.
5. **Confira:** a soma dos valores deve dar o total $N$.

---

## Resumo

| Tipo | F\xF3rmula de $k$ | Cada parte |
|---|---|---|
| Direta | $k = \\dfrac{N}{a+b+c}$ | $x = k \\cdot a$ |
| Inversa | $k = \\dfrac{N}{\\tfrac{1}{a}+\\tfrac{1}{b}+\\tfrac{1}{c}}$ | $x = \\dfrac{k}{a}$ |
| Composta | Multiplica diretas, inverte inversas, depois aplica direta. | \u2014 |`,
  questoes: [
    {
      enunciado: "Divida R\\$ 4.200 entre tr\xEAs pessoas em partes diretamente proporcionais a 2, 5 e 7. Quanto recebe a pessoa com propor\xE7\xE3o 5?",
      opcoes: [
        "R\\$ 600",
        "R\\$ 1.050",
        "R\\$ 1.500",
        "R\\$ 2.100"
      ],
      correta: 2
    },
    {
      enunciado: "Uma quantia de R\\$ 2.600 \xE9 dividida entre dois irm\xE3os em partes inversamente proporcionais \xE0s idades 10 e 15. O irm\xE3o mais velho recebe:",
      opcoes: [
        "R\\$ 1.040",
        "R\\$ 1.300",
        "R\\$ 1.560",
        "R\\$ 1.800"
      ],
      correta: 0
    },
    {
      enunciado: "Tr\xEAs s\xF3cios, A, B e C, montaram uma empresa com os capitais R\\$ 10.000, R\\$ 20.000 e R\\$ 30.000, respectivamente. Ao fim do ano, o lucro de R\\$ 18.000 foi distribu\xEDdo em partes diretamente proporcionais ao capital investido. A parte de B \xE9:",
      opcoes: [
        "R\\$ 3.000",
        "R\\$ 6.000",
        "R\\$ 9.000",
        "R\\$ 12.000"
      ],
      correta: 1
    }
  ]
};
var CONTAGEM_FATORIAL_ARTICLE = {
  titulo: "Princ\xEDpio Fundamental da Contagem e Fatorial",
  topico: "An\xE1lise Combinat\xF3ria",
  conteudo: `## 1. O que \xE9 contar sem contar?

Imagine que voc\xEA precise saber de quantas maneiras algo pode acontecer \u2014 **sem ter paci\xEAncia de listar todas**. A **An\xE1lise Combinat\xF3ria** entrega f\xF3rmulas e princ\xEDpios que resolvem esse tipo de problema.

O ponto de partida de tudo \xE9 o **Princ\xEDpio Fundamental da Contagem (PFC)**, tamb\xE9m chamado de **princ\xEDpio multiplicativo**.

---

## 2. Princ\xEDpio Fundamental da Contagem

> Se uma decis\xE3o $D_1$ pode ser tomada de $n_1$ maneiras, e, em seguida, uma decis\xE3o $D_2$ pode ser tomada de $n_2$ maneiras, ent\xE3o o n\xFAmero total de maneiras de tomar as duas decis\xF5es **sucessivamente** \xE9:
>
> $$n_1 \\cdot n_2$$

O princ\xEDpio se estende a **qualquer quantidade de etapas**:

$$N = n_1 \\cdot n_2 \\cdot n_3 \\cdot \\ldots \\cdot n_k$$

**Ideia-chave:** cada "decis\xE3o" \xE9 uma escolha independente entre alternativas. Quando est\xE3o encadeadas ("e depois"), multiplicamos; quando est\xE3o em paralelo ("ou"), somamos.

---

## 3. Exemplos pr\xE1ticos

### 3.1 Placas de carro (combinat\xF3ria b\xE1sica)

> Uma placa tem 3 letras (A\u2013Z, 26 letras) seguidas de 4 algarismos (0\u20139). Quantas placas diferentes existem?

$$N = 26 \\cdot 26 \\cdot 26 \\cdot 10 \\cdot 10 \\cdot 10 \\cdot 10 = 26^3 \\cdot 10^4 = 175\\,760\\,000$$

### 3.2 Card\xE1pio

> Um restaurante oferece 4 entradas, 6 pratos principais e 3 sobremesas. Quantos menus completos (entrada + prato + sobremesa) podem ser montados?

$$4 \\cdot 6 \\cdot 3 = 72 \\text{ menus}$$

### 3.3 Senha com letras distintas

> Quantas senhas de 4 letras distintas podem ser formadas com as 26 letras do alfabeto?

Primeira letra: 26 op\xE7\xF5es. Segunda: 25 (n\xE3o repete). Terceira: 24. Quarta: 23.

$$26 \\cdot 25 \\cdot 24 \\cdot 23 = 358\\,800$$

### 3.4 Senha com d\xEDgitos, sem restri\xE7\xE3o

> Quantas senhas de 4 d\xEDgitos existem se os d\xEDgitos podem se repetir?

$$10 \\cdot 10 \\cdot 10 \\cdot 10 = 10\\,000$$

### 3.5 Caminho em um tabuleiro

> De quantas formas ir de A at\xE9 B num grid 3\xD72 andando sempre para a direita ou para cima?

Cada caminho \xE9 uma sequ\xEAncia de 3 "direitas" (D) e 2 "cimas" (C), em alguma ordem. S\xE3o 5 passos dos quais 2 s\xE3o "C":

$$\\binom{5}{2} = 10 \\text{ caminhos}$$

(Aqui j\xE1 aparece o coeficiente binomial, que se apoia no PFC + fatorial.)

---

## 4. E quando algo **n\xE3o pode** acontecer? Use o complementar.

> Quantas senhas de 4 algarismos existem em que **pelo menos um** d\xEDgito \xE9 \xEDmpar?

Em vez de contar casos complicados, conte o **complementar**:

$$N_{\\text{total}} = 10^4 = 10\\,000$$

$$N_{\\text{nenhum \xEDmpar}} = 5^4 = 625 \\quad (\\text{s\xF3 d\xEDgitos pares: } 0,2,4,6,8)$$

$$N_{\\text{pelo menos um \xEDmpar}} = 10\\,000 - 625 = 9\\,375$$

---

## 5. Fatorial \u2014 a ferramenta que multiplica descendentes

### 5.1 Defini\xE7\xE3o

O **fatorial** de um n\xFAmero natural $n$ \xE9 o produto de todos os inteiros positivos de 1 at\xE9 $n$:

$$n! = n \\cdot (n-1) \\cdot (n-2) \\cdot \\ldots \\cdot 2 \\cdot 1$$

**Defini\xE7\xF5es especiais:** $\\;0! = 1\\;$ e $\\;1! = 1$.

### 5.2 Tabela dos primeiros fatoriais

| $n$ | $n!$ |
|---|---|
| 0 | 1 |
| 1 | 1 |
| 2 | 2 |
| 3 | 6 |
| 4 | 24 |
| 5 | 120 |
| 6 | 720 |
| 7 | 5 040 |
| 8 | 40 320 |
| 9 | 362 880 |
| 10 | 3 628 800 |

Perceba como $n!$ cresce **muito depressa**: $20! \\approx 2{,}4 \\cdot 10^{18}$.

### 5.3 Propriedade recursiva

$$n! = n \\cdot (n-1)!$$

Consequ\xEAncia \xFAtil em quest\xF5es com fatoriais no numerador e denominador:

$$\\frac{10!}{8!} = \\frac{10 \\cdot 9 \\cdot 8!}{8!} = 10 \\cdot 9 = 90$$

$$\\frac{(n+1)!}{(n-1)!} = (n+1) \\cdot n$$

---

## 6. Por que $0! = 1$?

Duas raz\xF5es justificam:

**Raz\xE3o alg\xE9brica** \u2014 para que $n! = n \\cdot (n-1)!$ funcione em $n=1$: $1! = 1 \\cdot 0! \\implies 0! = 1$.

**Raz\xE3o combinat\xF3ria** \u2014 existe **exatamente 1 maneira** de ordenar 0 objetos (a sequ\xEAncia vazia). Portanto o total de permuta\xE7\xF5es de zero elementos \xE9 1.

---

## 7. Ligando PFC e fatorial: permuta\xE7\xF5es

**Permuta\xE7\xF5es** s\xE3o arranjos ordenados de **todos** os $n$ elementos de um conjunto. Aplicando o PFC:

$$P_n = n \\cdot (n-1) \\cdot (n-2) \\cdot \\ldots \\cdot 1 = n!$$

**Exemplo:** de quantas maneiras 5 livros diferentes podem ser arranjados em uma prateleira?

$$P_5 = 5! = 120$$

E se quisermos arranjos de $p$ elementos em $n$ (sem repeti\xE7\xE3o)?

$$A_{n,p} = n \\cdot (n-1) \\cdot \\ldots \\cdot (n-p+1) = \\frac{n!}{(n-p)!}$$

(Isto \xE9 o **arranjo simples** \u2014 quando a ordem importa.)

Para **combina\xE7\xE3o simples** (quando a ordem **n\xE3o** importa):

$$C_{n,p} = \\binom{n}{p} = \\frac{n!}{p!\\,(n-p)!}$$

---

## 8. Dicas para a prova

\u2022 **Leia devagar**: "e" geralmente significa multiplica\xE7\xE3o (PFC); "ou" em casos disjuntos significa soma.
\u2022 **Ordem importa?** Se sim \u2192 arranjo (ou PFC direto). Se n\xE3o \u2192 combina\xE7\xE3o.
\u2022 **Pode repetir?** Elementos repetidos mudam o problema (permuta\xE7\xF5es com repeti\xE7\xE3o).
\u2022 **"Pelo menos um"** \u2014 pense no complementar.
\u2022 **Simplifique fatoriais** antes de calcular: em $\\tfrac{n!}{(n-2)!}$, n\xE3o calcule $n!$ cheio.

---

## Resumo

| Conceito | F\xF3rmula |
|---|---|
| PFC | $N = n_1 \\cdot n_2 \\cdot \\ldots \\cdot n_k$ |
| Fatorial | $n! = n \\cdot (n-1) \\cdot \\ldots \\cdot 1$ |
| Conven\xE7\xE3o | $0! = 1$ |
| Recurs\xE3o | $n! = n \\cdot (n-1)!$ |
| Permuta\xE7\xE3o simples | $P_n = n!$ |
| Arranjo simples | $A_{n,p} = \\dfrac{n!}{(n-p)!}$ |
| Combina\xE7\xE3o simples | $C_{n,p} = \\dfrac{n!}{p!\\,(n-p)!}$ |`,
  questoes: [
    {
      enunciado: "De quantas maneiras diferentes 6 amigos podem se sentar em 6 cadeiras em fila?",
      opcoes: [
        "36",
        "120",
        "360",
        "720"
      ],
      correta: 3
    },
    {
      enunciado: "Simplifique a express\xE3o $\\dfrac{(n+2)!}{n!}$.",
      opcoes: [
        "$n + 2$",
        "$(n+1)(n+2)$",
        "$n(n+1)(n+2)$",
        "$\\dfrac{n+2}{n}$"
      ],
      correta: 1
    },
    {
      enunciado: "Quantas senhas de 4 d\xEDgitos podem ser formadas usando apenas os algarismos de 0 a 9, permitindo repeti\xE7\xE3o, mas que tenham pelo menos um d\xEDgito par?",
      opcoes: [
        "625",
        "5 000",
        "9 375",
        "10 000"
      ],
      correta: 2
    }
  ]
};
var MATEMATICA_BASICA_ARTICLES = [
  FRACOES_ARTICLE,
  RAZAO_PROPORCAO_ARTICLE,
  DIVISAO_PROPORCIONAL_ARTICLE,
  CONTAGEM_FATORIAL_ARTICLE
];
var GEO_ESPACIAL_CARDS = [
  // ── Conceitos iniciais ──────────────────────────────────────────────────
  {
    front: "O que \xE9 um poliedro?",
    back: "S\xF3lido geom\xE9trico limitado por um **n\xFAmero finito de pol\xEDgonos planos**, chamados **faces**. As intersec\xE7\xF5es das faces formam as **arestas**, e os pontos de encontro das arestas formam os **v\xE9rtices**."
  },
  {
    front: "Rela\xE7\xE3o de Euler\n\nV\xE1lida em todo poliedro convexo, relaciona v\xE9rtices ($V$), arestas ($A$) e faces ($F$).",
    back: '$$V - A + F = 2$$\n\nVale tamb\xE9m para muitos poliedros n\xE3o convexos de g\xEAnero 0 (sem "furos").'
  },
  {
    front: "Poliedros de Plat\xE3o \u2014 quantos s\xE3o?\n\nCite-os.",
    back: "S\xE3o **5**: tetraedro regular, cubo (hexaedro), octaedro, dodecaedro e icosaedro.\n\nTodos t\xEAm faces regulares congruentes e o mesmo n\xFAmero de arestas em cada v\xE9rtice."
  },
  {
    front: "Poliedros de Plat\xE3o \u2014 faces, v\xE9rtices e arestas\n\nComplete a tabela.",
    back: "| Poliedro | $F$ | $V$ | $A$ |\n|---|---|---|---|\n| Tetraedro | 4 | 4 | 6 |\n| Cubo | 6 | 8 | 12 |\n| Octaedro | 8 | 6 | 12 |\n| Dodecaedro | 12 | 20 | 30 |\n| Icosaedro | 20 | 12 | 30 |"
  },
  {
    front: "Rela\xE7\xE3o entre arestas e faces em um poliedro\n\nSe $F_n$ = n\xFAmero de faces de $n$ lados, qual \xE9 a soma que d\xE1 $2A$?",
    back: "$$2A = \\sum_{n \\geq 3} n \\cdot F_n = 3F_3 + 4F_4 + 5F_5 + \\ldots$$\n\nCada aresta \xE9 compartilhada por exatamente 2 faces."
  },
  {
    front: "Teorema de Cavalieri\n\nEnuncie.",
    back: "Dois s\xF3lidos com **mesma altura** e cujas **sec\xE7\xF5es planas paralelas \xE0 base t\xEAm sempre \xE1reas iguais** possuem o **mesmo volume**.\n\nEste \xE9 o princ\xEDpio que justifica as f\xF3rmulas de volume de s\xF3lidos obl\xEDquos a partir dos retos."
  },
  // ── Prismas ─────────────────────────────────────────────────────────────
  {
    front: "Prisma \u2014 defini\xE7\xE3o",
    back: "S\xF3lido com **duas bases poligonais congruentes e paralelas**, ligadas por paralelogramos (faces laterais).\n\nReto: arestas laterais \u22A5 \xE0 base. Obl\xEDquo: n\xE3o perpendicular."
  },
  {
    front: "Volume do prisma\n\n\xC1rea da base $A_b$ e altura $h$.",
    back: "$$V = A_b \\cdot h$$\n\nVale para prismas **retos ou obl\xEDquos** (consequ\xEAncia de Cavalieri)."
  },
  {
    front: "\xC1rea total do prisma reto\n\n\xC1rea da base $A_b$ e \xE1rea lateral $A_l$.",
    back: "$$A_t = 2 \\cdot A_b + A_l$$\n\n$A_l = \\text{per\xEDmetro da base} \\cdot h$."
  },
  {
    front: "Paralelep\xEDpedo ret\xE2ngulo \u2014 diagonal\n\nArestas $a$, $b$, $c$.",
    back: "$$d = \\sqrt{a^2 + b^2 + c^2}$$\n\nAplica\xE7\xE3o dupla de Pit\xE1goras: primeiro na base ($d_b = \\sqrt{a^2+b^2}$), depois com a altura."
  },
  {
    front: "Paralelep\xEDpedo ret\xE2ngulo \u2014 volume e \xE1rea\n\nArestas $a$, $b$, $c$.",
    back: "$$V = a \\cdot b \\cdot c \\qquad A_t = 2(ab + ac + bc)$$"
  },
  {
    front: "Cubo \u2014 diagonal, volume e \xE1rea\n\nAresta $a$.",
    back: "$$d = a\\sqrt{3} \\qquad V = a^3 \\qquad A_t = 6a^2$$\n\nDiagonal de face: $d_f = a\\sqrt{2}$."
  },
  // ── Cilindro ───────────────────────────────────────────────────────────
  {
    front: "Cilindro \u2014 volume\n\nRaio da base $r$, altura $h$.",
    back: "$$V = \\pi r^2 \\cdot h$$\n\nVale para cilindros retos ou obl\xEDquos."
  },
  {
    front: "Cilindro reto \u2014 \xE1rea lateral, base e total\n\nRaio $r$, altura $h$.",
    back: "$$A_l = 2\\pi r h \\qquad A_b = \\pi r^2$$\n$$A_t = 2\\pi r h + 2\\pi r^2 = 2\\pi r (h + r)$$"
  },
  {
    front: "Cilindro equil\xE1tero",
    back: "Cilindro cuja **altura \xE9 igual ao di\xE2metro da base**: $h = 2r$.\n\nA sec\xE7\xE3o meridiana \xE9 um **quadrado** de lado $2r$."
  },
  {
    front: "Cilindro \u2014 superf\xEDcie lateral planificada",
    back: "A lateral de um cilindro reto, quando planificada, \xE9 um **ret\xE2ngulo** com:\n\n\u2022 Base = $2\\pi r$ (comprimento da circunfer\xEAncia)\n\u2022 Altura = $h$"
  },
  // ── Cone ───────────────────────────────────────────────────────────────
  {
    front: "Cone \u2014 volume\n\nRaio da base $r$, altura $h$.",
    back: "$$V = \\frac{1}{3}\\,\\pi r^2 \\cdot h$$\n\nTr\xEAs cones inscritos num cilindro de mesma base e altura enchem exatamente o cilindro."
  },
  {
    front: "Cone reto \u2014 geratriz\n\nRaio $r$, altura $h$.",
    back: "$$g = \\sqrt{r^2 + h^2}$$\n\nPit\xE1goras no tri\xE2ngulo ret\xE2ngulo formado pela altura, pelo raio e pela geratriz."
  },
  {
    front: "Cone reto \u2014 \xE1reas\n\nRaio $r$, geratriz $g$.",
    back: "$$A_l = \\pi r g \\qquad A_b = \\pi r^2 \\qquad A_t = \\pi r (g + r)$$"
  },
  {
    front: "Cone equil\xE1tero",
    back: "Cone cuja **geratriz \xE9 igual ao di\xE2metro da base**: $g = 2r$.\n\nA sec\xE7\xE3o meridiana \xE9 um **tri\xE2ngulo equil\xE1tero** de lado $2r$, portanto a altura vale $h = r\\sqrt{3}$."
  },
  {
    front: "Superf\xEDcie lateral do cone planificada \u2014 qual \xE9 o \xE2ngulo do setor?",
    back: "A lateral planificada \xE9 um **setor circular** de raio $g$. Seu \xE2ngulo central (em radianos) \xE9:\n\n$$\\theta = \\frac{2\\pi r}{g}$$\n\nEm graus: $\\theta = \\dfrac{360\xB0 \\cdot r}{g}$."
  },
  // ── Pirâmide ───────────────────────────────────────────────────────────
  {
    front: "Pir\xE2mide \u2014 volume\n\n\xC1rea da base $A_b$, altura $h$.",
    back: "$$V = \\frac{1}{3} A_b \\cdot h$$\n\nTr\xEAs pir\xE2mides de mesma base e altura iguais a um prisma enchem esse prisma."
  },
  {
    front: "Pir\xE2mide regular \u2014 ap\xF3tema da pir\xE2mide\n\nAp\xF3tema da base $a_b$, altura $h$.",
    back: "$$a_p = \\sqrt{a_b^2 + h^2}$$\n\nA ap\xF3tema da pir\xE2mide \xE9 a altura da face lateral (tri\xE2ngulo is\xF3sceles). Tamb\xE9m \xE9 a geratriz da face."
  },
  {
    front: "Pir\xE2mide regular \u2014 \xE1rea lateral",
    back: "$$A_l = \\frac{\\text{per\xEDmetro da base} \\cdot a_p}{2}$$\n\nTodas as faces laterais s\xE3o tri\xE2ngulos is\xF3sceles congruentes."
  },
  {
    front: "Tetraedro regular \u2014 altura\n\nAresta $a$.",
    back: "$$h = \\frac{a\\sqrt{6}}{3}$$\n\nObtido por Pit\xE1goras entre a aresta $a$ e a dist\xE2ncia do centro da base (baricentro) a um v\xE9rtice: $\\tfrac{a\\sqrt{3}}{3}$."
  },
  {
    front: "Tetraedro regular \u2014 volume\n\nAresta $a$.",
    back: "$$V = \\frac{a^3 \\sqrt{2}}{12}$$"
  },
  {
    front: "Tetraedro regular \u2014 \xE1rea total\n\nAresta $a$.",
    back: "$$A_t = a^2 \\sqrt{3}$$\n\n\xC9 a \xE1rea de 4 tri\xE2ngulos equil\xE1teros de lado $a$: $4 \\cdot \\dfrac{a^2\\sqrt{3}}{4}$."
  },
  // ── Esfera ─────────────────────────────────────────────────────────────
  {
    front: "Esfera \u2014 volume\n\nRaio $R$.",
    back: "$$V = \\frac{4}{3}\\pi R^3$$"
  },
  {
    front: "Esfera \u2014 \xE1rea da superf\xEDcie\n\nRaio $R$.",
    back: "$$S = 4 \\pi R^2$$\n\nEquivale \xE0 \xE1rea de 4 c\xEDrculos m\xE1ximos."
  },
  {
    front: "Sec\xE7\xE3o de uma esfera por um plano\n\nRaio $R$, dist\xE2ncia $d$ do centro ao plano ($d < R$).",
    back: "A intersec\xE7\xE3o \xE9 um **c\xEDrculo** de raio:\n\n$$r = \\sqrt{R^2 - d^2}$$"
  },
  {
    front: "Calota esf\xE9rica \u2014 \xE1rea",
    back: "$$A_{\\text{calota}} = 2\\pi R h$$\n\n$R$ = raio da esfera, $h$ = altura da calota. N\xE3o depende de onde ela seja retirada, apenas da altura."
  },
  {
    front: "Calota esf\xE9rica \u2014 volume",
    back: "$$V = \\frac{\\pi h^2 (3R - h)}{3}$$\n\n$R$ = raio da esfera, $h$ = altura da calota."
  },
  {
    front: "Fuso e cunha esf\xE9rica \u2014 \xE1reas e volumes\n\n\xC2ngulo $\\alpha$ (em graus).",
    back: "Fuso (parte da superf\xEDcie):\n$$A_{\\text{fuso}} = \\frac{\\alpha}{360\xB0} \\cdot 4\\pi R^2 = \\frac{\\pi R^2 \\alpha}{90\xB0}$$\n\nCunha (parte do volume):\n$$V_{\\text{cunha}} = \\frac{\\alpha}{360\xB0} \\cdot \\frac{4}{3}\\pi R^3 = \\frac{\\pi R^3 \\alpha}{270\xB0}$$"
  },
  // ── Troncos ────────────────────────────────────────────────────────────
  {
    front: "Tronco de cone \u2014 volume\n\nRaios $R$ (maior) e $r$ (menor), altura $h$.",
    back: "$$V = \\frac{\\pi h}{3}\\,\\bigl(R^2 + R\\,r + r^2\\bigr)$$"
  },
  {
    front: "Tronco de cone \u2014 \xE1rea lateral\n\nRaios $R$ e $r$, geratriz $g$.",
    back: "$$A_l = \\pi (R + r)\\,g$$\n\n\xC1rea total: $A_t = \\pi (R + r) g + \\pi R^2 + \\pi r^2$."
  },
  {
    front: "Tronco de pir\xE2mide \u2014 volume\n\n\xC1reas das bases $A_1$ (maior) e $A_2$ (menor), altura $h$.",
    back: "$$V = \\frac{h}{3}\\,\\bigl(A_1 + \\sqrt{A_1 A_2} + A_2\\bigr)$$"
  },
  // ── Sólidos de revolução ───────────────────────────────────────────────
  {
    front: "S\xF3lido de revolu\xE7\xE3o",
    back: "S\xF3lido gerado pela **rota\xE7\xE3o de uma figura plana em torno de um eixo** pertencente ao plano da figura.\n\nExemplos: rota\xE7\xE3o de um ret\xE2ngulo \u2192 cilindro; de um tri\xE2ngulo ret\xE2ngulo (um cateto no eixo) \u2192 cone; de um semic\xEDrculo (di\xE2metro no eixo) \u2192 esfera."
  },
  {
    front: "Qual s\xF3lido resulta de girar um ret\xE2ngulo em torno de um de seus lados?",
    back: "Um **cilindro reto** cujo raio \xE9 o lado **perpendicular** ao eixo e cuja altura \xE9 o lado **paralelo** ao eixo."
  },
  {
    front: "Qual s\xF3lido resulta de girar um tri\xE2ngulo ret\xE2ngulo em torno de um de seus catetos?",
    back: "Um **cone reto** cuja altura \xE9 o cateto no eixo e cujo raio \xE9 o outro cateto. A hipotenusa passa a ser a geratriz."
  },
  {
    front: "Qual s\xF3lido resulta de girar um semic\xEDrculo em torno de seu di\xE2metro?",
    back: "Uma **esfera** cujo raio \xE9 o raio do semic\xEDrculo."
  },
  // ── Relações métricas e diagonais ─────────────────────────────────────
  {
    front: "Diagonal de uma face do cubo \xD7 diagonal do cubo\n\nAresta $a$.",
    back: "Diagonal da face: $d_f = a\\sqrt{2}$.\n\nDiagonal do cubo: $d = a\\sqrt{3}$.\n\nRaz\xE3o: $\\dfrac{d}{d_f} = \\sqrt{\\dfrac{3}{2}}$."
  },
  {
    front: "Cilindro inscrito em um cubo\n\nAresta do cubo $a$. Qual \xE9 o volume do cilindro inscrito?",
    back: "O cilindro tem raio $r = a/2$ e altura $h = a$:\n\n$$V = \\pi \\left(\\tfrac{a}{2}\\right)^2 a = \\frac{\\pi a^3}{4}$$"
  },
  {
    front: "Esfera inscrita em um cubo\n\nAresta $a$.",
    back: "Raio $R = a/2$ (metade da aresta).\n\nVolume da esfera: $V = \\dfrac{4}{3}\\pi \\left(\\dfrac{a}{2}\\right)^3 = \\dfrac{\\pi a^3}{6}$."
  },
  {
    front: "Esfera circunscrita a um cubo\n\nAresta $a$.",
    back: "A esfera passa pelos 8 v\xE9rtices; seu di\xE2metro \xE9 a **diagonal do cubo**:\n\n$$2R = a\\sqrt{3} \\implies R = \\frac{a\\sqrt{3}}{2}$$"
  },
  {
    front: "Cone inscrito em um cilindro\n\nMesmo raio $r$ e mesma altura $h$. Raz\xE3o entre volumes?",
    back: "$$\\frac{V_{\\text{cone}}}{V_{\\text{cilindro}}} = \\frac{\\tfrac{1}{3}\\pi r^2 h}{\\pi r^2 h} = \\frac{1}{3}$$\n\nO cone ocupa 1/3 do cilindro de mesma base e altura."
  },
  // ── Princípios de contagem espacial / observações ─────────────────────
  {
    front: "Prisma hexagonal regular \u2014 quantas diagonais?\n\nConte s\xF3 diagonais do s\xF3lido.",
    back: "Total de diagonais do s\xF3lido de $n$ lados na base:\n\n$$D = n(n - 3)$$\n\nPara $n = 6$: $D = 6 \\cdot 3 = 18$ diagonais espaciais."
  },
  {
    front: "Prisma \u2014 qual \xE9 o total de arestas em fun\xE7\xE3o da base?\n\nBase com $n$ lados.",
    back: "$$A = 3n$$\n\n$n$ arestas na base superior, $n$ na inferior, $n$ laterais."
  },
  {
    front: "Pir\xE2mide \u2014 quantos v\xE9rtices, faces e arestas?\n\nBase com $n$ lados.",
    back: "V\xE9rtices: $V = n + 1$ (todos os da base mais o \xE1pice).\nFaces: $F = n + 1$ (a base + $n$ faces triangulares laterais).\nArestas: $A = 2n$ ($n$ da base + $n$ laterais).\n\nVerifique Euler: $(n+1) - 2n + (n+1) = 2$ \u2713."
  },
  {
    front: "Octaedro regular \u2014 volume\n\nAresta $a$.",
    back: "$$V = \\frac{a^3 \\sqrt{2}}{3}$$\n\nO octaedro pode ser visto como duas pir\xE2mides de base quadrada unidas pela base."
  },
  {
    front: "Volume do s\xF3lido formado girando um ret\xE2ngulo de lados $a$ e $b$ em torno do lado $a$",
    back: "Cilindro reto com raio $b$ e altura $a$:\n\n$$V = \\pi b^2 \\cdot a$$\n\nCompare: se o eixo for o lado $b$, o resultado seria $\\pi a^2 \\cdot b$ \u2014 diferente!"
  }
];

// server/index.ts
var app = express();
var PORT = process.env.PORT ? Number(process.env.PORT) : 3e3;
var isProd = process.env.NODE_ENV === "production";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  // 8 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Apenas imagens s\xE3o permitidas."));
  }
});
app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);
app.get("/admin/make-admin", async (req, res) => {
  const secret = req.query.secret;
  const email = req.query.email;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  if (!email) return res.status(400).send("Forne\xE7a ?email=teu@email.com");
  try {
    await db.update(users).set({ role: "admin" }).where(eq9(users.email, email.toLowerCase().trim()));
    res.send(`\u2705 ${email} \xE9 agora admin. Fa\xE7a logout e login novamente no site.`);
  } catch (err) {
    res.status(500).send(`Erro: ${err.message}`);
  }
});
var GEOMETRY_CARDS = [
  // ── Triângulos — relações e trigonometria ────────────────────────────────
  {
    front: "Rela\xE7\xF5es m\xE9tricas no tri\xE2ngulo ret\xE2ngulo\n\nCatetos $a$, $b$, hipotenusa $c$, altura $h$ relativa \xE0 hipotenusa (proje\xE7\xF5es $m$ e $n$).",
    back: "$$h^2 = m \\cdot n \\qquad a^2 = m \\cdot c \\qquad b^2 = n \\cdot c$$\n$$h \\cdot c = a \\cdot b$$\n\n$m$ = proje\xE7\xE3o de $a$ sobre $c$; $n$ = proje\xE7\xE3o de $b$ sobre $c$."
  },
  {
    front: "\xC1rea do tri\xE2ngulo \u2014 f\xF3rmula com seno\n\nDois lados $a$ e $b$ formam entre si o \xE2ngulo $C$. Qual \xE9 a \xE1rea?",
    back: "$$A = \\frac{a \\cdot b \\cdot \\operatorname{sen}(C)}{2}$$"
  },
  {
    front: "Lei dos Senos\n\nRelacione os lados e os \xE2ngulos opostos de qualquer tri\xE2ngulo.",
    back: "$$\\frac{a}{\\operatorname{sen} A} = \\frac{b}{\\operatorname{sen} B} = \\frac{c}{\\operatorname{sen} C} = 2R$$\n\n$R$ = raio da circunfer\xEAncia circunscrita."
  },
  {
    front: "Lei dos Cossenos\n\nRelacione o lado $c$ com $a$, $b$ e o \xE2ngulo $C$ oposto a $c$.",
    back: "$$c^2 = a^2 + b^2 - 2ab\\cos C$$\n\nGeneraliza Pit\xE1goras: quando $C = 90\xB0$, resulta $c^2 = a^2 + b^2$."
  },
  {
    front: "Tri\xE2ngulo equil\xE1tero \u2014 altura e \xE1rea\n\nLado $l$.",
    back: "$$h = \\frac{l\\sqrt{3}}{2} \\qquad A = \\frac{l^2\\sqrt{3}}{4}$$\n\nPit\xE1goras: $h^2 + \\left(\\dfrac{l}{2}\\right)^2 = l^2$."
  },
  {
    front: "Raio da circunfer\xEAncia inscrita no tri\xE2ngulo\n\n\xC1rea $A$, semiper\xEDmetro $s$.",
    back: "$$r = \\frac{A}{s}, \\qquad s = \\frac{a+b+c}{2}$$"
  },
  {
    front: "Raio da circunfer\xEAncia circunscrita no tri\xE2ngulo\n\nLados $a$, $b$, $c$, \xE1rea $A$.",
    back: "$$R = \\frac{abc}{4A}$$\n\nTamb\xE9m (Lei dos Senos): $R = \\dfrac{a}{2\\operatorname{sen} A}$."
  },
  {
    front: "Teorema da bissetriz interna\n\nA bissetriz do \xE2ngulo $A$ divide o lado oposto $BC$ nos segmentos $m$ (junto a $b$) e $n$ (junto a $c$).",
    back: "$$\\frac{m}{n} = \\frac{b}{c}$$\n\nA bissetriz interna divide o lado oposto proporcionalmente aos lados adjacentes."
  },
  {
    front: "Baricentro \u2014 propriedade da mediana\n\nComo o baricentro $G$ divide cada mediana do tri\xE2ngulo?",
    back: "O baricentro divide cada mediana na raz\xE3o $\\mathbf{2:1}$ a partir do v\xE9rtice.\n\n$$AG = \\frac{2}{3}\\,m_a$$\n\n$m_a$ = comprimento da mediana relativa ao v\xE9rtice $A$."
  },
  {
    front: "Triplas pitag\xF3ricas\n\nCite as triplas mais cobradas em vestibulares e suas varia\xE7\xF5es.",
    back: "$(3,\\,4,\\,5)$ \u2192 m\xFAltiplos: $(6,8,10)$, $(9,12,15)$\u2026\n\n$(5,\\,12,\\,13)$\n\n$(8,\\,15,\\,17)$\n\n$(7,\\,24,\\,25)$\n\nVerifique sempre: $a^2 + b^2 = c^2$."
  },
  // ── Trigonometria no plano ───────────────────────────────────────────────
  {
    front: "Rela\xE7\xF5es trigonom\xE9tricas no tri\xE2ngulo ret\xE2ngulo\n\nExpresse $\\operatorname{sen}$, $\\cos$ e $\\operatorname{tg}$ em termos dos lados.",
    back: "$$\\operatorname{sen}\\theta = \\frac{\\text{oposto}}{\\text{hipotenusa}} \\qquad \\cos\\theta = \\frac{\\text{adjacente}}{\\text{hipotenusa}} \\qquad \\operatorname{tg}\\theta = \\frac{\\text{oposto}}{\\text{adjacente}}$$"
  },
  {
    front: "Valores trigonom\xE9tricos not\xE1veis\n\n$\\operatorname{sen}$, $\\cos$ e $\\operatorname{tg}$ de $30\xB0$, $45\xB0$ e $60\xB0$.",
    back: "$$\\operatorname{sen}30\xB0 = \\tfrac{1}{2},\\quad \\cos30\xB0 = \\tfrac{\\sqrt{3}}{2},\\quad \\operatorname{tg}30\xB0 = \\tfrac{\\sqrt{3}}{3}$$\n$$\\operatorname{sen}45\xB0 = \\cos45\xB0 = \\tfrac{\\sqrt{2}}{2},\\quad \\operatorname{tg}45\xB0 = 1$$\n$$\\operatorname{sen}60\xB0 = \\tfrac{\\sqrt{3}}{2},\\quad \\cos60\xB0 = \\tfrac{1}{2},\\quad \\operatorname{tg}60\xB0 = \\sqrt{3}$$"
  },
  {
    front: "Identidade fundamental da trigonometria",
    back: "$$\\operatorname{sen}^2\\theta + \\cos^2\\theta = 1$$\n\nDerivada do Teorema de Pit\xE1goras no c\xEDrculo unit\xE1rio de raio 1."
  },
  {
    front: "Rela\xE7\xE3o entre $\\operatorname{tg}$, $\\operatorname{sen}$ e $\\cos$",
    back: "$$\\operatorname{tg}\\theta = \\frac{\\operatorname{sen}\\theta}{\\cos\\theta}$$\n\nDa identidade fundamental: $1 + \\operatorname{tg}^2\\theta = \\sec^2\\theta$."
  },
  // ── Semelhança ──────────────────────────────────────────────────────────
  {
    front: "Semelhan\xE7a de tri\xE2ngulos \u2014 crit\xE9rios\n\nCite os tr\xEAs crit\xE9rios que garantem semelhan\xE7a.",
    back: "AA \u2014 dois \xE2ngulos iguais\n\nLAL \u2014 dois lados proporcionais e o \xE2ngulo entre eles igual\n\nLLL \u2014 os tr\xEAs pares de lados proporcionais\n\nTri\xE2ngulos semelhantes t\xEAm lados correspondentes proporcionais e \xE2ngulos iguais."
  },
  {
    front: "Semelhan\xE7a \u2014 raz\xE3o entre per\xEDmetros e \xE1reas\n\nSe a raz\xE3o de semelhan\xE7a \xE9 $k$, qual \xE9 a raz\xE3o entre per\xEDmetros? E entre \xE1reas?",
    back: "$$\\frac{P_1}{P_2} = k \\qquad \\frac{A_1}{A_2} = k^2$$\n\nPer\xEDmetros na raz\xE3o $k$; \xE1reas na raz\xE3o $k^2$."
  },
  // ── Quadriláteros ────────────────────────────────────────────────────────
  {
    front: "Quadrado \u2014 diagonal\n\nLado $l$.",
    back: "$$d = l\\sqrt{2}$$\n\nPit\xE1goras: $d^2 = l^2 + l^2 = 2l^2$."
  },
  {
    front: "Ret\xE2ngulo \u2014 diagonal\n\nLados $a$ e $b$.",
    back: "$$d = \\sqrt{a^2 + b^2}$$"
  },
  {
    front: "Losango \u2014 rela\xE7\xE3o entre diagonais e lado\n\nDiagonais $d_1$ e $d_2$, lado $l$.",
    back: "$$l = \\sqrt{\\left(\\frac{d_1}{2}\\right)^2 + \\left(\\frac{d_2}{2}\\right)^2}$$\n\nAs diagonais do losango s\xE3o perpendiculares e bissetoras entre si."
  },
  {
    front: "Trap\xE9zio \u2014 base m\xE9dia\n\nQual \xE9 o comprimento do segmento m\xE9dio que une os pontos m\xE9dios dos lados n\xE3o paralelos?",
    back: "$$m = \\frac{B + b}{2}$$\n\n$B$ = base maior, $b$ = base menor. O segmento m\xE9dio \xE9 paralelo \xE0s bases."
  },
  // ── Polígonos regulares ──────────────────────────────────────────────────
  {
    front: "Pol\xEDgono regular \u2014 \xE2ngulo interno\n\n$n$ lados.",
    back: "$$\\theta_{\\text{int}} = \\frac{(n-2)\\cdot 180\xB0}{n}$$\n\nExemplos: tri\xE2ngulo $60\xB0$, quadrado $90\xB0$, hex\xE1gono $120\xB0$."
  },
  {
    front: "Pol\xEDgono regular \u2014 \xE2ngulo externo\n\n$n$ lados.",
    back: "$$\\theta_{\\text{ext}} = \\frac{360\xB0}{n}$$\n\nA soma de todos os \xE2ngulos externos de qualquer pol\xEDgono convexo \xE9 sempre $360\xB0$."
  },
  {
    front: "Pol\xEDgono regular \u2014 n\xFAmero de diagonais\n\n$n$ lados.",
    back: "$$D = \\frac{n(n-3)}{2}$$\n\nEscolhe-se 2 v\xE9rtices ($\\binom{n}{2}$ pares) e subtraem-se os $n$ lados."
  },
  {
    front: "Pol\xEDgono regular \u2014 \xE1rea\n\nLado $l$, ap\xF3tema $a$, $n$ lados.",
    back: "$$A = \\frac{n \\cdot l \\cdot a}{2} = \\frac{\\text{Per\xEDmetro} \\cdot a}{2}$$"
  },
  // ── Circunferência e círculo ─────────────────────────────────────────────
  {
    front: "\xC2ngulo inscrito em semic\xEDrculo\n\nUm tri\xE2ngulo tem como lado o di\xE2metro de uma circunfer\xEAncia. O que se pode afirmar do \xE2ngulo oposto?",
    back: "O \xE2ngulo inscrito que intercepta um semic\xEDrculo mede sempre $90\xB0$.\n\nConsequ\xEAncia: todo tri\xE2ngulo inscrito em um semic\xEDrculo \xE9 ret\xE2ngulo."
  },
  {
    front: "Pot\xEAncia de um ponto \u2014 duas cordas\n\nDuas cordas $AB$ e $CD$ se cruzam no ponto $P$ interno \xE0 circunfer\xEAncia.",
    back: "$$PA \\cdot PB = PC \\cdot PD$$\n\nO produto dos segmentos de uma corda \xE9 igual ao produto dos segmentos da outra."
  },
  {
    front: "Pot\xEAncia de um ponto \u2014 tangente e secante\n\nDo ponto externo $P$: tangente $PT$ e secante $PAB$.",
    back: "$$PT^2 = PA \\cdot PB$$\n\n$T$ = ponto de tang\xEAncia; $A$ e $B$ = interse\xE7\xF5es da secante com a circunfer\xEAncia."
  },
  {
    front: "Corda e dist\xE2ncia ao centro\n\nCorda de comprimento $2c$ a dist\xE2ncia $d$ do centro. Raio $r$.",
    back: "$$r^2 = d^2 + c^2$$\n\nO segmento do centro ao ponto m\xE9dio da corda \xE9 perpendicular \xE0 corda."
  },
  {
    front: "Comprimento da corda \u2014 \xE2ngulo central\n\nCorda que subtende \xE2ngulo central $\\theta$ em circunfer\xEAncia de raio $r$.",
    back: "$$\\ell = 2r\\operatorname{sen}\\!\\left(\\frac{\\theta}{2}\\right)$$"
  },
  {
    front: "\xC2ngulo entre duas cordas que se cruzam\n\nDuas cordas se intersectam dentro da circunfer\xEAncia. Os arcos opostos medem $\\alpha$ e $\\beta$.",
    back: "$$\\theta = \\frac{\\alpha + \\beta}{2}$$\n\nO \xE2ngulo no ponto de cruzamento \xE9 a m\xE9dia aritm\xE9tica dos arcos interceptados."
  },
  {
    front: "Posi\xE7\xE3o relativa de dois c\xEDrculos\n\nRaios $R \\geq r$, dist\xE2ncia entre centros $d$.",
    back: "$d > R+r$ \u2192 externos\n$d = R+r$ \u2192 tangentes externos\n$|R-r| < d < R+r$ \u2192 secantes\n$d = R-r$ \u2192 tangentes internos\n$d < R-r$ \u2192 internos\n$d = 0$ \u2192 conc\xEAntricos"
  }
];
var PROBABILIDADE_ARTICLE = {
  titulo: "Probabilidade \u2014 Conceitos B\xE1sicos e Opera\xE7\xF5es",
  topico: "Probabilidade e Estat\xEDstica",
  active: true,
  url_pdf: null,
  conteudo: `## 1. Espa\xE7o Amostral e Evento

O **espa\xE7o amostral** ($\\Omega$) \xE9 o conjunto de todos os resultados poss\xEDveis de um experimento aleat\xF3rio. Um **evento** ($A$) \xE9 qualquer subconjunto do espa\xE7o amostral.

**Exemplo:** No lan\xE7amento de um dado, $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$. O evento "sair n\xFAmero par" \xE9 $A = \\{2, 4, 6\\}$.

---

## 2. Defini\xE7\xE3o Cl\xE1ssica de Probabilidade

Se todos os resultados s\xE3o **equiprov\xE1veis** (igualmente prov\xE1veis):

$$P(A) = \\frac{n(A)}{n(\\Omega)}$$

onde $n(A)$ \xE9 o n\xFAmero de casos **favor\xE1veis** e $n(\\Omega)$ \xE9 o total de casos poss\xEDveis.

**Propriedades fundamentais:**
\u2022 $0 \\leq P(A) \\leq 1$
\u2022 $P(\\Omega) = 1$ (evento certo)
\u2022 $P(\\emptyset) = 0$ (evento imposs\xEDvel)

---

## 3. Probabilidade do Complementar

O complementar de $A$ (escrito $\\bar{A}$ ou $A^c$) \xE9 o evento "A **n\xE3o** ocorre":

$$P(\\bar{A}) = 1 - P(A)$$

**Dica importante:** quando o enunciado pede "pelo menos um", costuma ser mais f\xE1cil calcular $P(\\text{nenhum})$ e subtrair de 1.

**Exemplo:** A probabilidade de tirar pelo menos uma cara em dois lan\xE7amentos de moeda:

$$P(\\text{pelo menos uma cara}) = 1 - P(\\text{nenhuma cara}) = 1 - \\frac{1}{4} = \\frac{3}{4}$$

---

## 4. Regra da Adi\xE7\xE3o \u2014 Uni\xE3o de Eventos

Para quaisquer eventos $A$ e $B$:

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

O termo $P(A \\cap B)$ \xE9 subtra\xEDdo para **n\xE3o contar duas vezes** os resultados em comum.

**Eventos mutuamente exclusivos** ($A \\cap B = \\emptyset$): n\xE3o podem ocorrer ao mesmo tempo, logo:

$$P(A \\cup B) = P(A) + P(B)$$

**Exemplo:** Num baralho de 52 cartas, a probabilidade de sortear um \xE1s **ou** uma carta de copas:

$$P(\\text{\xE1s} \\cup \\text{copas}) = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13}$$

---

## 5. Probabilidade Condicional

A probabilidade de $A$ ocorrer **dado que** $B$ j\xE1 ocorreu \xE9:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$

**Exemplo:** Numa urna com 3 bolas vermelhas e 2 azuis, qual \xE9 a probabilidade de a segunda bola ser vermelha, dado que a primeira foi vermelha (sem reposi\xE7\xE3o)?

$$P(V_2 \\mid V_1) = \\frac{2}{4} = \\frac{1}{2}$$

---

## 6. Regra do Produto \u2014 Interse\xE7\xE3o de Eventos

Da defini\xE7\xE3o de probabilidade condicional, deduz-se:

$$P(A \\cap B) = P(A) \\cdot P(B \\mid A) = P(B) \\cdot P(A \\mid B)$$

**Eventos independentes:** $A$ e $B$ s\xE3o independentes quando a ocorr\xEAncia de um **n\xE3o afeta** a probabilidade do outro:

$$P(A \\mid B) = P(A) \\implies P(A \\cap B) = P(A) \\cdot P(B)$$

**Exemplo:** Lan\xE7ando dois dados, a probabilidade de obter 6 no primeiro **e** 6 no segundo:

$$P(6 \\cap 6) = \\frac{1}{6} \\cdot \\frac{1}{6} = \\frac{1}{36}$$

---

## 7. Distribui\xE7\xE3o Binomial

Quando um experimento com probabilidade de sucesso $p$ \xE9 repetido $n$ vezes de forma **independente**, a probabilidade de exatamente $k$ sucessos \xE9:

$$P(X = k) = \\binom{n}{k}\\, p^k\\,(1-p)^{n-k}$$

onde $\\displaystyle\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$ \xE9 o coeficiente binomial.

**Exemplo:** Jogando uma moeda honesta 4 vezes, a probabilidade de exatamente 3 caras:

$$P(X = 3) = \\binom{4}{3}\\left(\\frac{1}{2}\\right)^3\\left(\\frac{1}{2}\\right)^1 = 4 \\cdot \\frac{1}{8} \\cdot \\frac{1}{2} = \\frac{1}{4}$$

---

## Resumo das F\xF3rmulas

| Opera\xE7\xE3o | F\xF3rmula |
|---|---|
| Probabilidade cl\xE1ssica | $P(A) = \\dfrac{n(A)}{n(\\Omega)}$ |
| Complementar | $P(\\bar{A}) = 1 - P(A)$ |
| Uni\xE3o (geral) | $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ |
| Uni\xE3o (exclusivos) | $P(A \\cup B) = P(A) + P(B)$ |
| Condicional | $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$ |
| Interse\xE7\xE3o (geral) | $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$ |
| Interse\xE7\xE3o (independentes) | $P(A \\cap B) = P(A) \\cdot P(B)$ |
| Binomial | $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ |`,
  questoes: [
    {
      enunciado: "Num baralho com 52 cartas, qual \xE9 a probabilidade de sortear um \xE1s ou uma carta de copas?",
      opcoes: [
        "1/4",
        "4/13",
        "17/52",
        "1/13"
      ],
      correta: 1
    },
    {
      enunciado: "Dois eventos A e B s\xE3o independentes, com P(A) = 1/3 e P(B) = 1/2. A probabilidade de que pelo menos um deles ocorra \xE9:",
      opcoes: [
        "1/6",
        "5/6",
        "2/3",
        "1/2"
      ],
      correta: 2
    },
    {
      enunciado: "Numa turma de 30 alunos, 18 estudam Matem\xE1tica, 12 estudam F\xEDsica e 6 estudam ambas. A probabilidade de um aluno sorteado estudar apenas Matem\xE1tica \xE9:",
      opcoes: [
        "3/5",
        "1/2",
        "2/5",
        "1/5"
      ],
      correta: 2
    }
  ]
};
app.get("/admin/seed-review-probabilidade", async (req, res) => {
  const secret = req.query.secret;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  let conn;
  try {
    conn = await pool.getConnection();
    const [existing] = await conn.query(
      "SELECT id FROM review_contents WHERE titulo = ? LIMIT 1",
      [PROBABILIDADE_ARTICLE.titulo]
    );
    if (existing.length > 0) {
      return res.send(`\u26A0\uFE0F Artigo j\xE1 existe (id=${existing[0].id}). Nada inserido.`);
    }
    await conn.query(
      `INSERT INTO review_contents (titulo, topico, conteudo, url_pdf, questoes, active, created_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [
        PROBABILIDADE_ARTICLE.titulo,
        PROBABILIDADE_ARTICLE.topico,
        PROBABILIDADE_ARTICLE.conteudo,
        null,
        JSON.stringify(PROBABILIDADE_ARTICLE.questoes)
      ]
    );
    res.send(`\u2705 Artigo "${PROBABILIDADE_ARTICLE.titulo}" inserido com sucesso!`);
  } catch (err) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/admin/seed-flashcards", async (req, res) => {
  const secret = req.query.secret;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  const action = req.query.action ?? "list";
  let conn;
  try {
    conn = await pool.getConnection();
    if (action === "list") {
      const [decks] = await conn.query("SELECT id, title, active FROM flashcard_decks ORDER BY id");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write("=== BARALHOS ===\n");
      for (const d of decks) {
        const [cards] = await conn.query(
          "SELECT id, LEFT(front, 100) as front FROM flashcards WHERE deck_id = ? ORDER BY order_index, id",
          [d.id]
        );
        res.write(`
[${d.id}] ${d.title} (${cards.length} cards, active=${d.active})
`);
        for (const c of cards) res.write(`  #${c.id}: ${c.front.replace(/\n/g, " \u21B5 ")}
`);
      }
      res.write("\n\nUse ?action=insert&deckId=N para inserir os 30 novos cards.\n");
      return res.end();
    }
    if (action === "insert") {
      const deckId = Number(req.query.deckId);
      if (!deckId) return res.status(400).send("Forne\xE7a ?deckId=N (veja os IDs com ?action=list).");
      const [deckRows] = await conn.query("SELECT id, title FROM flashcard_decks WHERE id = ?", [deckId]);
      if (!deckRows.length) return res.status(404).send(`Deck ${deckId} n\xE3o encontrado.`);
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      const log = (m) => {
        console.log(m);
        res.write(m + "\n");
      };
      log(`Inserindo cards no baralho "${deckRows[0].title}" (id=${deckId})...
`);
      const [existing] = await conn.query(
        "SELECT LEFT(front, 200) as front FROM flashcards WHERE deck_id = ?",
        [deckId]
      );
      const existingFronts = new Set(existing.map((r) => r.front.trim().slice(0, 80)));
      const [lastIdx] = await conn.query(
        "SELECT COALESCE(MAX(order_index), -1) as maxIdx FROM flashcards WHERE deck_id = ?",
        [deckId]
      );
      let orderIndex = (lastIdx[0]?.maxIdx ?? -1) + 1;
      let inseridos = 0, pulados = 0;
      for (const card of GEOMETRY_CARDS) {
        const frontKey = card.front.trim().slice(0, 80);
        if (existingFronts.has(frontKey)) {
          log(`  [skip] ${frontKey.replace(/\n/g, " \u21B5 ").slice(0, 60)}`);
          pulados++;
          continue;
        }
        await conn.query(
          "INSERT INTO flashcards (deck_id, front, back, order_index, active, created_at) VALUES (?, ?, ?, ?, 1, NOW())",
          [deckId, card.front, card.back, orderIndex++]
        );
        log(`  \u2705 ${frontKey.replace(/\n/g, " \u21B5 ").slice(0, 70)}`);
        inseridos++;
      }
      log(`
Conclu\xEDdo: ${inseridos} inseridos, ${pulados} ignorados (j\xE1 existiam).`);
      return res.end();
    }
    res.status(400).send("action deve ser 'list' ou 'insert'.");
  } catch (err) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/admin/seed-review-matematica-basica", async (req, res) => {
  const secret = req.query.secret;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  let conn;
  try {
    conn = await pool.getConnection();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Aplicando seed/upsert dos 4 artigos de Matem\xE1tica B\xE1sica...\n\n");
    let inseridos = 0;
    let atualizados = 0;
    for (const art of MATEMATICA_BASICA_ARTICLES) {
      const [existing] = await conn.query(
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
        res.write(`  \u{1F504} Atualizado: "${art.titulo}" (id=${existing[0].id})
`);
        atualizados++;
      } else {
        await conn.query(
          `INSERT INTO review_contents (titulo, topico, conteudo, url_pdf, questoes, active, created_at)
           VALUES (?, ?, ?, ?, ?, 1, NOW())`,
          [art.titulo, art.topico, art.conteudo, null, JSON.stringify(art.questoes)]
        );
        res.write(`  \u2705 Inserido: "${art.titulo}"
`);
        inseridos++;
      }
    }
    res.write(`
Conclu\xEDdo: ${inseridos} inseridos, ${atualizados} atualizados.
`);
    res.end();
  } catch (err) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/admin/seed-flashcards-geoespacial", async (req, res) => {
  const secret = req.query.secret;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  let conn;
  try {
    conn = await pool.getConnection();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Iniciando seed de flashcards de Geometria Espacial...\n\n");
    const DECK_TITLE = "Geometria Espacial";
    let [decks] = await conn.query(
      "SELECT id FROM flashcard_decks WHERE title = ? LIMIT 1",
      [DECK_TITLE]
    );
    let deckId;
    if (decks.length > 0) {
      deckId = decks[0].id;
      res.write(`Baralho "${DECK_TITLE}" j\xE1 existia (id=${deckId}).
`);
    } else {
      const [insertRes] = await conn.query(
        `INSERT INTO flashcard_decks (title, description, color, active, created_at)
         VALUES (?, ?, ?, 1, NOW())`,
        [
          DECK_TITLE,
          "F\xF3rmulas e conceitos de s\xF3lidos: prismas, cilindros, cones, pir\xE2mides, esferas, troncos, Cavalieri, poliedros de Plat\xE3o e Euler.",
          "#00796B"
        ]
      );
      deckId = insertRes.insertId;
      res.write(`\u2705 Baralho "${DECK_TITLE}" criado (id=${deckId}).
`);
    }
    const [existing] = await conn.query(
      "SELECT LEFT(front, 200) as front FROM flashcards WHERE deck_id = ?",
      [deckId]
    );
    const existingFronts = new Set(existing.map((r) => r.front.trim().slice(0, 80)));
    const [lastIdx] = await conn.query(
      "SELECT COALESCE(MAX(order_index), -1) as maxIdx FROM flashcards WHERE deck_id = ?",
      [deckId]
    );
    let orderIndex = (lastIdx[0]?.maxIdx ?? -1) + 1;
    let inseridos = 0;
    let pulados = 0;
    for (const card of GEO_ESPACIAL_CARDS) {
      const frontKey = card.front.trim().slice(0, 80);
      if (existingFronts.has(frontKey)) {
        res.write(`  [skip] ${frontKey.replace(/\n/g, " \u21B5 ").slice(0, 60)}
`);
        pulados++;
        continue;
      }
      await conn.query(
        `INSERT INTO flashcards (deck_id, front, back, order_index, active, created_at)
         VALUES (?, ?, ?, ?, 1, NOW())`,
        [deckId, card.front, card.back, orderIndex++]
      );
      res.write(`  \u2705 ${frontKey.replace(/\n/g, " \u21B5 ").slice(0, 70)}
`);
      inseridos++;
    }
    res.write(`
Conclu\xEDdo: ${inseridos} cards inseridos, ${pulados} ignorados (j\xE1 existiam).
`);
    res.end();
  } catch (err) {
    res.status(500).send(`Erro: ${err.message}`);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/admin/import", async (req, res) => {
  const secret = req.query.secret;
  const IMPORT_SECRET = process.env.IMPORT_SECRET ?? "IMPORTAR2024";
  if (secret !== IMPORT_SECRET) return res.status(401).send("Senha incorrecta.");
  const year = Number(req.query.year ?? 2023);
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  const log = (msg) => {
    console.log(msg);
    res.write(msg + "\n");
  };
  log(`Iniciando importa\xE7\xE3o \u2014 ENEM ${year}...`);
  try {
    let estimateTRI2 = function(index2) {
      const r = index2 / 45;
      if (r < 0.25) return { a: 0.8, b: -1.5, c: 0.2, nivel: "Baixa" };
      if (r < 0.5) return { a: 1, b: -0.5, c: 0.2, nivel: "M\xE9dia" };
      if (r < 0.75) return { a: 1.2, b: 0.5, c: 0.2, nivel: "Alta" };
      return { a: 1.5, b: 1.5, c: 0.2, nivel: "Muito Alta" };
    };
    var estimateTRI = estimateTRI2;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    const allQuestions = [];
    while (hasMore) {
      await delay(1200);
      const url = `https://api.enem.dev/v1/exams/${year}/questions?limit=${limit}&offset=${offset}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        log(`Erro HTTP ${resp.status}`);
        break;
      }
      const data = await resp.json();
      const mathQs = data.questions.filter((q) => q.discipline === "matematica");
      allQuestions.push(...mathQs);
      log(`  P\xE1gina ${offset}: ${mathQs.length} quest\xF5es de matem\xE1tica`);
      hasMore = data.metadata.hasMore;
      offset += limit;
    }
    log(`
Total: ${allQuestions.length} quest\xF5es`);
    let inseridas = 0;
    let ignoradas = 0;
    let erros = 0;
    for (const q of allQuestions) {
      let normalizeImages2 = function(text2) {
        return text2.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "[Imagem: $2]");
      };
      var normalizeImages = normalizeImages2;
      const alternativas = {};
      for (const alt of q.alternatives ?? []) {
        if (alt.text && alt.file) {
          alternativas[alt.letter] = `${alt.text}
[Imagem: ${alt.file}]`;
        } else if (alt.file) {
          alternativas[alt.letter] = `[Imagem: ${alt.file}]`;
        } else {
          alternativas[alt.letter] = alt.text ?? "";
        }
      }
      if (Object.keys(alternativas).length < 2) {
        ignoradas++;
        log(`  [ignorada] Quest\xE3o ${q.index}/${q.year}: apenas ${Object.keys(alternativas).length} alternativa(s).`);
        continue;
      }
      const partes = [];
      if (q.context) partes.push(normalizeImages2(q.context.trim()));
      if (q.alternativesIntroduction) partes.push(normalizeImages2(q.alternativesIntroduction.trim()));
      const textoAtual = partes.join(" ");
      for (const imgUrl of q.files ?? []) {
        if (!textoAtual.includes(imgUrl)) {
          partes.push(`[Imagem: ${imgUrl}]`);
        }
      }
      const enunciado = partes.join("\n\n") || `Quest\xE3o ${q.index} \u2014 ENEM ${q.year}`;
      const tri = estimateTRI2(q.index);
      try {
        await db.insert(questions).values({
          fonte: "ENEM",
          ano: q.year,
          conteudo_principal: "Matem\xE1tica e suas Tecnologias",
          tags: ["Matem\xE1tica", "ENEM", `ENEM ${q.year}`],
          nivel_dificuldade: tri.nivel,
          param_a: tri.a,
          param_b: tri.b,
          param_c: tri.c,
          enunciado,
          url_imagem: null,
          // imagens agora ficam inline no enunciado
          alternativas,
          gabarito: (q.correctAlternative ?? "A").toUpperCase(),
          comentario_resolucao: null,
          active: true
        });
        inseridas++;
        if (inseridas % 5 === 0) log(`  ${inseridas} inseridas...`);
      } catch (err) {
        erros++;
        log(`  [erro] Quest\xE3o ${q.index}/${q.year}: ${err.message}`);
      }
    }
    log(`
Conclu\xEDdo: ${inseridas} inseridas, ${ignoradas} ignoradas (sem alternativas), ${erros} erros de banco.`);
  } catch (err) {
    log(`Erro: ${err.message}`);
  }
  res.end();
});
app.post("/api/upload-image", upload.single("file"), async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "N\xE3o autorizado." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({ error: "Cloudinary n\xE3o configurado. Adicione as vari\xE1veis no Railway." });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "questoes-enem", resource_type: "image" },
        (error, result2) => error ? reject(error) : resolve(result2)
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: `Erro no upload: ${err.message}` });
  }
});
var uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  // 20 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Apenas arquivos PDF s\xE3o permitidos."));
  }
});
app.post("/api/upload-pdf", uploadPdf.single("file"), async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ error: "N\xE3o autorizado." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({ error: "Cloudinary n\xE3o configurado." });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "revise-pdfs", resource_type: "image", format: "pdf" },
        (error, result2) => error ? reject(error) : resolve(result2)
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: `Erro no upload: ${err.message}` });
  }
});
app.use("/api/trpc", createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: !isProd ? ({ path: path2, error }) => console.error(`[tRPC] /${path2}:`, error.message) : void 0
}));
if (isProd) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}
async function runMigrations() {
  let conn;
  try {
    conn = await pool.getConnection();
    const [colRows] = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'questions' AND COLUMN_NAME = 'url_video'
    `);
    if (Array.isArray(colRows) && colRows.length > 0) {
      console.log("\u2705 Migration: url_video j\xE1 existe.");
    } else {
      await conn.query(`ALTER TABLE questions ADD COLUMN url_video VARCHAR(512) NULL AFTER comentario_resolucao`);
      console.log("\u2705 Migration: url_video adicionada.");
    }
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
    console.log("\u2705 Migration: study_schedule OK.");
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
    console.log("\u2705 Migration: flashcard_decks OK.");
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
    console.log("\u2705 Migration: flashcards OK.");
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
    console.log("\u2705 Migration: flashcard_progress OK.");
  } catch (err) {
    console.error("\u274C Migration falhou:", err?.message ?? err);
  } finally {
    if (conn) conn.release();
  }
}
runMigrations().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} http://localhost:${PORT} [${process.env.NODE_ENV ?? "development"}]`);
  });
});
