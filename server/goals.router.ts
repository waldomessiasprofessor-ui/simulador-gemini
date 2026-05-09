import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { studyGoals } from "./schema";

export const goalsRouter = createTRPCRouter({
  /** Retorna a meta semanal do aluno (ou defaults se não tiver configurado). */
  getGoal: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select()
      .from(studyGoals)
      .where(eq(studyGoals.userId, ctx.user.id))
      .limit(1);
    return row ?? { questionsPerWeek: 50, simulationsPerWeek: 1 };
  }),

  /** Salva (cria ou atualiza) a meta semanal do aluno. */
  setGoal: protectedProcedure
    .input(z.object({
      questionsPerWeek:   z.number().int().min(1).max(500),
      simulationsPerWeek: z.number().int().min(0).max(10),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.execute(sql`
        INSERT INTO study_goals (user_id, questions_per_week, simulations_per_week)
        VALUES (${ctx.user.id}, ${input.questionsPerWeek}, ${input.simulationsPerWeek})
        ON DUPLICATE KEY UPDATE
          questions_per_week   = VALUES(questions_per_week),
          simulations_per_week = VALUES(simulations_per_week),
          updated_at           = NOW()
      `);
      return { ok: true };
    }),
});
