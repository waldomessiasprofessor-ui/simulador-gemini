import { z } from "zod";
import { createTRPCRouter as router, protectedProcedure } from "./trpc";
import { discursiveQuestions, discursiveProgress, users } from "./schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const segundaFaseRouter = router({
  // Lista questões dissertativas (com último resultado do aluno)
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

      // Último resultado do aluno para cada questão
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

  // Salva autocorreção e concede XP
  saveProgress: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        resultado: z.enum(["acertei", "quase", "errei"]),
      })
    )
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

  // Estatísticas de autocorreção do aluno
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        resultado: discursiveProgress.resultado,
        count: sql<number>`count(*)`.mapWith(Number),
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
});
