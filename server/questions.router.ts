import { z } from "zod";
import { eq, and, sql, asc, desc, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { questions, simulationAnswers } from "./schema";
import type { NewQuestion } from "./schema";

const NivelDificuldadeEnum = z.enum(["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"]);

const QuestionBaseSchema = z.object({
  fonte: z.string().max(50).default("ENEM"),
  ano: z.number().int().min(2000).max(2100).optional(),
  conteudo_principal: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  nivel_dificuldade: NivelDificuldadeEnum.default("Média"),
  param_a: z.number().min(0.1).max(4.0).default(1.0),
  param_b: z.number().min(-4.0).max(4.0).default(0.0),
  param_c: z.number().min(0.0).max(0.5).default(0.2),
  enunciado: z.string().min(5),
  url_imagem: z.string().url().nullable().optional(),
  alternativas: z.record(z.string().min(1).max(5), z.any()),
  gabarito: z.string().length(1),
  comentario_resolucao: z.string().optional(),
});

export const questionsRouter = createTRPCRouter({

  list: protectedProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
      conteudo: z.string().optional(),
      nivel_dificuldade: NivelDificuldadeEnum.optional(),
      activeOnly: z.boolean().default(true),
      orderBy: z.enum(["id", "conteudo_principal", "nivel_dificuldade", "createdAt"]).default("conteudo_principal"),
      orderDir: z.enum(["asc", "desc"]).default("asc"),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, activeOnly, orderBy, orderDir } = input;
      const offset = (page - 1) * pageSize;

      const filters: any[] = [];
      if (activeOnly) filters.push(eq(questions.active, true));
      if (input.conteudo) filters.push(sql`${questions.conteudo_principal} LIKE ${'%' + input.conteudo + '%'}`);
      if (input.nivel_dificuldade) filters.push(eq(questions.nivel_dificuldade, input.nivel_dificuldade));

      const where = filters.length > 0 ? and(...filters) : undefined;
      const orderColumn = orderBy === "conteudo_principal" ? questions.conteudo_principal
        : orderBy === "nivel_dificuldade" ? questions.nivel_dificuldade
        : orderBy === "createdAt" ? questions.createdAt
        : questions.id;
      const orderFn = orderDir === "asc" ? asc : desc;

      const [rows, [{ count }]] = await Promise.all([
        ctx.db.select().from(questions).where(where).orderBy(orderFn(orderColumn)).limit(pageSize).offset(offset),
        ctx.db.select({ count: sql<number>`COUNT(*)` }).from(questions).where(where),
      ]);

      return {
        questions: rows,
        pagination: { total: Number(count), page, pageSize, totalPages: Math.ceil(Number(count) / pageSize) },
      };
    }),

  getByIdAdmin: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });
      return q;
    }),

  create: adminProcedure
    .input(QuestionBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(questions).values({
        ...input,
        gabarito: input.gabarito.toUpperCase(),
        url_imagem: input.url_imagem ?? null,
        active: true,
      } as NewQuestion);
      return { id: Number(result.insertId), success: true };
    }),

  update: adminProcedure
    .input(QuestionBaseSchema.partial().extend({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updateData: Partial<NewQuestion> = { ...data } as any;
      if (data.gabarito) updateData.gabarito = data.gabarito.toUpperCase();
      if (data.url_imagem !== undefined) updateData.url_imagem = data.url_imagem ?? null;
      await ctx.db.update(questions).set(updateData).where(eq(questions.id, id));
      return { success: true };
    }),

  toggleActive: adminProcedure
    .input(z.object({ id: z.number().int().positive(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(questions).set({ active: input.active }).where(eq(questions.id, input.id));
      return { success: true };
    }),

  // Elimina UMA questão — apaga respostas primeiro para contornar FK restrict
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(simulationAnswers).where(eq(simulationAnswers.questionId, input.id));
      await ctx.db.delete(questions).where(eq(questions.id, input.id));
      return { success: true };
    }),

  // Elimina TODAS as questões — apaga respostas primeiro
  deleteAll: adminProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.delete(simulationAnswers);
      await ctx.db.delete(questions);
      return { success: true };
    }),

  // Auditoria com Gemini
  auditQuestion: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "GEMINI_API_KEY não configurada no servidor. Adicione a variável no Railway." });

      const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });

      const alts = Object.entries(q.alternativas as Record<string, any>)
        .sort()
        .map(([k, v]) => `${k}) ${typeof v === "object" ? v.text ?? "" : v}`)
        .join("\n");

      const prompt = `Você é um especialista em elaboração de questões para o ENEM. Analise a questão abaixo com rigor técnico e pedagógico.

QUESTÃO #${q.id}
Conteúdo: ${q.conteudo_principal}
Dificuldade declarada: ${q.nivel_dificuldade}
Ano: ${q.ano ?? "Não informado"}

ENUNCIADO:
${q.enunciado}

ALTERNATIVAS:
${alts}

GABARITO DECLARADO: ${q.gabarito}
RESOLUÇÃO: ${q.comentario_resolucao ?? "Não informada"}

Responda em JSON puro (sem markdown) com exatamente esta estrutura:
{
  "gabarito_correto": true | false,
  "gabarito_sugerido": "A" | "B" | "C" | "D" | "E" | null,
  "dificuldade_real": "Muito Baixa" | "Baixa" | "Média" | "Alta" | "Muito Alta",
  "dificuldade_compativel": true | false,
  "nota_qualidade": 1 a 10,
  "problemas": ["lista de problemas encontrados, ou array vazio se nenhum"],
  "sugestoes": ["lista de sugestões de melhoria"],
  "parecer": "Texto curto de 2-3 frases com avaliação geral"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Erro na API Gemini: ${err}` });
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const clean = rawText.replace(/```json|```/g, "").trim();

      try {
        const audit = JSON.parse(clean);
        return { success: true, audit, questionId: q.id };
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "O Gemini retornou uma resposta em formato inválido. Tente novamente." });
      }
    }),
});
