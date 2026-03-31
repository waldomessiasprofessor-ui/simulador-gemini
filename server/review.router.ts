import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { reviewContents, dailyReviews } from "./schema";
import type { NewReviewContent, NewDailyReview } from "./schema";

const QuestaoSchema = z.object({
  enunciado: z.string().min(5),
  opcoes: z.array(z.string()).length(4),
  correta: z.number().int().min(0).max(3),
});

const ReviewBaseSchema = z.object({
  titulo: z.string().min(3).max(200),
  conteudo: z.string().min(10),
  topico: z.string().optional(),
  questoes: z.array(QuestaoSchema).default([]),
  active: z.boolean().default(true),
});

export const reviewRouter = createTRPCRouter({

  // ── Admin: lista todos os textos ──────────────────────────────────────────
  adminList: adminProcedure
    .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.pageSize;
      const [rows, [{ count }]] = await Promise.all([
        ctx.db.select().from(reviewContents)
          .orderBy(desc(reviewContents.createdAt))
          .limit(input.pageSize).offset(offset),
        ctx.db.select({ count: sql<number>`COUNT(*)` }).from(reviewContents),
      ]);
      return { items: rows, total: Number(count), page: input.page, pageSize: input.pageSize };
    }),

  // ── Admin: cria texto ─────────────────────────────────────────────────────
  create: adminProcedure
    .input(ReviewBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(reviewContents).values(input as NewReviewContent);
      return { id: Number(result.insertId), success: true };
    }),

  // ── Admin: atualiza texto ─────────────────────────────────────────────────
  update: adminProcedure
    .input(ReviewBaseSchema.partial().extend({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(reviewContents).set(data as any).where(eq(reviewContents.id, id));
      return { success: true };
    }),

  // ── Admin: toggle active ──────────────────────────────────────────────────
  toggleActive: adminProcedure
    .input(z.object({ id: z.number().int().positive(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(reviewContents).set({ active: input.active }).where(eq(reviewContents.id, input.id));
      return { success: true };
    }),

  // ── Admin: deleta texto ───────────────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(reviewContents).where(eq(reviewContents.id, input.id));
      return { success: true };
    }),

  // ── Aluno: pega (ou cria) o Revise do dia ────────────────────────────────
  getDaily: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = new Date().toISOString().slice(0, 10);

    // Verifica se já existe revisão hoje
    const [existing] = await ctx.db
      .select()
      .from(dailyReviews)
      .where(and(eq(dailyReviews.userId, userId), eq(dailyReviews.reviewDate, today)))
      .limit(1);

    if (existing) {
      const [content] = await ctx.db
        .select().from(reviewContents).where(eq(reviewContents.id, existing.contentId)).limit(1);
      return { review: existing, content: content ?? null };
    }

    // Sorteia um conteúdo ativo aleatório que o aluno ainda não viu recentemente
    const seen = await ctx.db
      .select({ contentId: dailyReviews.contentId })
      .from(dailyReviews)
      .where(eq(dailyReviews.userId, userId));
    const seenIds = seen.map(s => s.contentId);

    const allActive = await ctx.db
      .select().from(reviewContents).where(eq(reviewContents.active, true))
      .orderBy(sql`RAND()`).limit(50);

    // Preferência: conteúdos não vistos; se já viu todos, recomeça
    const unseen = allActive.filter(c => !seenIds.includes(c.id));
    const chosen = unseen.length > 0 ? unseen[0] : allActive[0];

    if (!chosen) return { review: null, content: null };

    const newReview: NewDailyReview = {
      userId,
      reviewDate: today,
      contentId: chosen.id,
      answers: {},
      completed: false,
    };
    const [result] = await ctx.db.insert(dailyReviews).values(newReview);
    const review = { ...newReview, id: Number(result.insertId), correctCount: null, completedAt: null, createdAt: new Date() };

    return { review, content: chosen };
  }),

  // ── Aluno: salva resposta e finaliza se todas respondidas ─────────────────
  saveAnswer: protectedProcedure
    .input(z.object({
      reviewId: z.number().int().positive(),
      questionIndex: z.number().int().min(0).max(2),
      answer: z.number().int().min(0).max(3),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const [review] = await ctx.db
        .select().from(dailyReviews)
        .where(and(eq(dailyReviews.id, input.reviewId), eq(dailyReviews.userId, userId)))
        .limit(1);

      if (!review || review.completed) return { ok: false };

      const newAnswers = { ...(review.answers as Record<string, number>), [input.questionIndex]: input.answer };
      const allDone = [0, 1, 2].every(i => newAnswers[i] !== undefined);

      // Calcula acertos se terminou
      let correctCount: number | null = null;
      if (allDone) {
        const [content] = await ctx.db.select().from(reviewContents).where(eq(reviewContents.id, review.contentId)).limit(1);
        if (content) {
          const qs = content.questoes as Array<{ correta: number }>;
          correctCount = qs.filter((q, i) => newAnswers[i] === q.correta).length;
        }
      }

      await ctx.db.update(dailyReviews).set({
        answers: newAnswers,
        ...(allDone ? { completed: true, correctCount, completedAt: new Date() } : {}),
      }).where(eq(dailyReviews.id, input.reviewId));

      return { ok: true, allDone, correctCount };
    }),

  // ── Aluno: histórico de revisões ──────────────────────────────────────────
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: dailyReviews.id,
        reviewDate: dailyReviews.reviewDate,
        completed: dailyReviews.completed,
        correctCount: dailyReviews.correctCount,
        completedAt: dailyReviews.completedAt,
        titulo: reviewContents.titulo,
        topico: reviewContents.topico,
      })
      .from(dailyReviews)
      .leftJoin(reviewContents, eq(dailyReviews.contentId, reviewContents.id))
      .where(eq(dailyReviews.userId, ctx.user.id))
      .orderBy(desc(dailyReviews.reviewDate))
      .limit(30);
    return rows;
  }),
});
