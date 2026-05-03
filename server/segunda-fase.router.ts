import { z } from "zod";
import { createTRPCRouter as router, protectedProcedure, adminProcedure } from "./trpc";
import { discursiveQuestions, discursiveProgress, users } from "./schema";
import { eq, and, desc, sql, asc } from "drizzle-orm";

const ImagemSchema = z.object({
  posicao:  z.string(),
  descricao: z.string(),
  url:      z.string().optional(),
});

const DiscursiveBaseSchema = z.object({
  fonte:              z.string().default("UNICAMP"),
  ano:                z.number().int().optional(),
  numero_prova:       z.number().int().optional(),
  conteudo_principal: z.string().min(1),
  tags:               z.array(z.string()).default([]),
  nivel_dificuldade:  z.enum(["Muito Baixa","Baixa","Média","Alta","Muito Alta"]).default("Média"),
  enunciado:          z.string().min(1),
  imagens:            z.array(ImagemSchema).default([]),
  resolucao:          z.string().min(1),
  url_youtube:        z.string().optional(),
});

export const segundaFaseRouter = router({

  // ── Aluno: lista questões ativas com último resultado ──────────────────────
  getQuestions: protectedProcedure
    .input(z.object({ fonte: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(discursiveQuestions)
        .where(
          and(
            eq(discursiveQuestions.active, true),
            input.fonte ? eq(discursiveQuestions.fonte, input.fonte) : undefined,
          )
        )
        .orderBy(discursiveQuestions.ano, discursiveQuestions.numero_prova);

      if (rows.length === 0) return [];

      const progress = await ctx.db
        .select()
        .from(discursiveProgress)
        .where(eq(discursiveProgress.userId, ctx.user.id))
        .orderBy(desc(discursiveProgress.createdAt));

      const lastResult: Record<number, string> = {};
      for (const p of progress) {
        if (!lastResult[p.questionId]) lastResult[p.questionId] = p.resultado;
      }

      return rows.map((q) => ({
        ...q,
        ultimoResultado: (lastResult[q.id] ?? null) as "acertei" | "quase" | "errei" | null,
      }));
    }),

  // ── Aluno: salva autocorreção + XP ────────────────────────────────────────
  saveProgress: protectedProcedure
    .input(z.object({
      questionId: z.number(),
      resultado:  z.enum(["acertei", "quase", "errei"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const xpEarned = input.resultado === "acertei" ? 3 : input.resultado === "quase" ? 1 : 0;

      await ctx.db.insert(discursiveProgress).values({
        userId:     ctx.user.id,
        questionId: input.questionId,
        resultado:  input.resultado,
        xpEarned,
      });

      if (xpEarned > 0) {
        await ctx.db
          .update(users)
          .set({ xp: sql`xp + ${xpEarned}` })
          .where(eq(users.id, ctx.user.id));
      }

      return { xpEarned };
    }),

  // ── Aluno: estatísticas de autocorreção ───────────────────────────────────
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        resultado: discursiveProgress.resultado,
        count:     sql<number>`count(*)`.mapWith(Number),
      })
      .from(discursiveProgress)
      .where(eq(discursiveProgress.userId, ctx.user.id))
      .groupBy(discursiveProgress.resultado);

    const stats = { acertei: 0, quase: 0, errei: 0, total: 0 };
    for (const r of rows) {
      stats[r.resultado as keyof typeof stats] = r.count;
      stats.total += r.count;
    }
    return stats;
  }),

  // ── Admin: lista todas as questões (ativas e inativas) ────────────────────
  adminGetAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(discursiveQuestions)
      .orderBy(discursiveQuestions.fonte, asc(discursiveQuestions.ano), asc(discursiveQuestions.numero_prova));
  }),

  // ── Admin: cria questão ───────────────────────────────────────────────────
  adminCreate: adminProcedure
    .input(DiscursiveBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(discursiveQuestions)
        .values({ ...input, active: true });
      return { id: (result as any).insertId as number };
    }),

  // ── Admin: atualiza questão ───────────────────────────────────────────────
  adminUpdate: adminProcedure
    .input(DiscursiveBaseSchema.extend({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db
        .update(discursiveQuestions)
        .set(data)
        .where(eq(discursiveQuestions.id, id));
      return { ok: true };
    }),

  // ── Admin: ativa / desativa ────────────────────────────────────────────────
  adminToggleActive: adminProcedure
    .input(z.object({ id: z.number().int().positive(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(discursiveQuestions)
        .set({ active: input.active })
        .where(eq(discursiveQuestions.id, input.id));
      return { ok: true };
    }),

  // ── Admin: exclui questão (progresso excluído em cascata pelo FK) ───────────
  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(discursiveQuestions)
        .where(eq(discursiveQuestions.id, input.id));
      return { ok: true };
    }),
});
