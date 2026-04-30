import { z } from "zod";
import { eq, asc, sql, and, or, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure, protectedProcedure } from "./trpc";
import { users, simulations, simulationAnswers, questions } from "./schema";
import { hashPassword } from "./auth";

export const usersRouter = createTRPCRouter({

  // Lista todos os utilizadores com status de assinatura
  list: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          active: users.active,
          subscriptionExpiresAt: users.subscriptionExpiresAt,
          diagnosisLevel: users.diagnosisLevel,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.createdAt);

      const now = new Date();

      const withStatus = rows.map((u) => ({
        ...u,
        subscriptionStatus:
          u.role === "admin" ? "admin" :
          u.subscriptionExpiresAt === null ? "sem_assinatura" :
          u.subscriptionExpiresAt > now ? "ativa" : "expirada",
        daysRemaining:
          u.subscriptionExpiresAt && u.subscriptionExpiresAt > now
            ? Math.ceil((u.subscriptionExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null,
      }));

      if (!input.search) return withStatus;
      const q = input.search.toLowerCase();
      return withStatus.filter((u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }),

  // Define ou renova a assinatura de um utilizador
  setSubscription: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      // Número de meses a adicionar a partir de hoje (ou da expiração actual se ainda válida)
      months: z.number().int().min(1).max(24),
    }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({ id: users.id, subscriptionExpiresAt: users.subscriptionExpiresAt })
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Utilizador não encontrado." });

      const now = new Date();
      // Se ainda tem assinatura válida, renova a partir da expiração actual
      const base = user.subscriptionExpiresAt && user.subscriptionExpiresAt > now
        ? user.subscriptionExpiresAt
        : now;

      const newExpiry = new Date(base);
      newExpiry.setMonth(newExpiry.getMonth() + input.months);

      await ctx.db
        .update(users)
        .set({ subscriptionExpiresAt: newExpiry, active: true })
        .where(eq(users.id, input.id));

      return { success: true, expiresAt: newExpiry };
    }),

  // Remove a assinatura de um utilizador
  revokeSubscription: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ subscriptionExpiresAt: null, active: false })
        .where(eq(users.id, input.id));
      return { success: true };
    }),

  // Redefine a senha
  resetPassword: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select({ id: users.id }).from(users).where(eq(users.id, input.id)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Utilizador não encontrado." });

      const passwordHash = await hashPassword(input.newPassword);
      await ctx.db.update(users).set({ passwordHash }).where(eq(users.id, input.id));
      return { success: true };
    }),

  // Elimina utilizador
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Utilizador não encontrado." });
      if (user.role === "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Não é possível excluir um admin." });

      const userSims = await ctx.db.select({ id: simulations.id }).from(simulations).where(eq(simulations.userId, input.id));
      for (const sim of userSims) {
        await ctx.db.delete(simulationAnswers).where(eq(simulationAnswers.simulationId, sim.id));
      }
      await ctx.db.delete(simulations).where(eq(simulations.userId, input.id));
      await ctx.db.delete(users).where(eq(users.id, input.id));
      return { success: true };
    }),

  // ── Diagnóstico inicial ─────────────────────────────────────────────────────

  /** Retorna 20 questões para o diagnóstico.
   *
   * Estratégia:
   *  1. Busca questões marcadas com a tag "diagnostico" (pool curado).
   *  2. Divide em fáceis (param_b ≤ -0.5), médias (-0.5 < param_b ≤ 0.5) e
   *     difíceis (param_b > 0.5) e sorteia aleatoriamente dentro de cada faixa,
   *     respeitando a proporção 6/8/6 do pool atual (ou 10/5/5 se o pool for maior).
   *  3. Se o pool "diagnostico" tiver menos de 20 questões, completa com o banco geral.
   *
   * Isso garante que alunos diferentes recebam questões diferentes (via RAND())
   * quando o pool for expandido com novas questões.
   */
  getDiagnosticQuestions: protectedProcedure.query(async ({ ctx }) => {
    const cols = {
      id: questions.id,
      enunciado: questions.enunciado,
      alternativas: questions.alternativas,
      url_imagem: questions.url_imagem,
      conteudo_principal: questions.conteudo_principal,
      param_b: questions.param_b,
    };

    // ── Pool curado: questões com tag "diagnostico" ────────────────────────────
    const pool = await ctx.db
      .select(cols)
      .from(questions)
      .where(
        and(
          eq(questions.active, true),
          sql`JSON_CONTAINS(${questions.tags}, '"diagnostico"')`,
        )
      )
      .orderBy(sql`RAND()`);

    // Divide o pool por faixa de dificuldade
    const poolEasy = pool.filter(q => q.param_b <= -0.5);
    const poolMid  = pool.filter(q => q.param_b > -0.5 && q.param_b <= 0.5);
    const poolHard = pool.filter(q => q.param_b > 0.5);

    // Quantas questões queremos de cada faixa
    // Se o pool for suficientemente grande, usa 10/5/5; se não, usa o que há.
    const wantEasy = poolEasy.length >= 10 ? 10 : poolEasy.length;
    const wantMid  = poolMid.length  >= 5  ? 5  : poolMid.length;
    const wantHard = poolHard.length >= 5  ? 5  : poolHard.length;

    const picked = [
      ...poolEasy.slice(0, wantEasy),
      ...poolMid.slice(0, wantMid),
      ...poolHard.slice(0, wantHard),
    ];

    // ── Fallback: completa com banco geral se pool curado < 20 ────────────────
    const needed = 20 - picked.length;
    if (needed > 0) {
      const excludeIds = picked.map(q => q.id);
      const fill = await ctx.db
        .select(cols)
        .from(questions)
        .where(
          and(
            eq(questions.active, true),
            excludeIds.length > 0
              ? sql`${questions.id} NOT IN (${sql.raw(excludeIds.join(","))})`
              : sql`1=1`,
          )
        )
        .orderBy(sql`RAND()`)
        .limit(needed);
      picked.push(...fill);
    }

    return picked.slice(0, 20).map(({ id, enunciado, alternativas, url_imagem, conteudo_principal }) => ({
      id, enunciado, alternativas, url_imagem, conteudo_principal,
    }));
  }),

  /** Admin: reseta o diagnóstico de um aluno específico (para testes) */
  adminResetDiagnosis: adminProcedure
    .input(z.object({ userId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(users).set({
        diagnosisLevel: null as any,
        diagnosisScore: null as any,
        diagnosisCompletedAt: null as any,
      }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  /** Valida respostas e salva resultado do diagnóstico */
  completeDiagnosis: protectedProcedure
    .input(z.object({
      city: z.string().min(2).max(100),
      educationLevel: z.string().min(2).max(80),
      answers: z.record(z.string(), z.string()), // { questionId: letraEscolhida }
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const questionIds = Object.keys(input.answers).map(Number).filter(Boolean);

      if (questionIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhuma resposta enviada." });

      // Busca gabaritos no servidor
      const qRows = await ctx.db
        .select({ id: questions.id, gabarito: questions.gabarito })
        .from(questions)
        .where(inArray(questions.id, questionIds));

      const gabMap = new Map(qRows.map((q) => [q.id, q.gabarito]));
      let correct = 0;
      for (const [idStr, chosen] of Object.entries(input.answers)) {
        if (gabMap.get(Number(idStr)) === chosen) correct++;
      }

      const total = questionIds.length;
      // Classifica em 5 níveis baseado no número absoluto de acertos (0-20)
      const level =
        correct >= 17 ? "genio" :
        correct >= 13 ? "expert" :
        correct >= 9  ? "calculista" :
        correct >= 4  ? "aprendiz" : "curioso";

      await ctx.db.update(users).set({
        city: input.city,
        educationLevel: input.educationLevel,
        diagnosisLevel: level as any,
        diagnosisScore: correct,
        diagnosisCompletedAt: new Date(),
      }).where(eq(users.id, userId));

      return { level, correct, total };
    }),

  // ---------------------------------------------------------------------------
  // Adiciona XP ao aluno (chamado pelo frontend para ações diversas)
  // ---------------------------------------------------------------------------
  addXp: protectedProcedure
    .input(z.object({
      source: z.enum(["tutor", "trilha", "login", "flashcard"]),
      amount: z.number().int().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ xp: sql`xp + ${input.amount}` })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
