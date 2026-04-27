import { z } from "zod";
import { eq, asc, sql } from "drizzle-orm";
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

  /** Retorna 20 questões para o diagnóstico em 3 faixas de dificuldade:
   *  1-10  → questões fáceis (param_b ≤ -0.5): base sólida, estilo trilhas
   *  11-15 → média dificuldade com potências, radicais e frações (param_b -0.5 a 0.5)
   *  16-20 → difíceis do banco ENEM/REPVET (param_b > 0.5)
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

    // ── Faixa 1: 10 questões fáceis (param_b ≤ -0.5) ──────────────────────────
    const easy = await ctx.db
      .select(cols)
      .from(questions)
      .where(and(eq(questions.active, true), sql`${questions.param_b} <= -0.5`))
      .orderBy(sql`RAND()`)
      .limit(10);

    // ── Faixa 2: 5 questões médias sobre potências / radicais / frações ────────
    const midTopics = [
      "Potências e raízes", "Frações", "Operações com Frações",
      "Operações com frações", "Aritmética", "Notação científica",
      "Conjuntos numéricos", "Conjuntos Numéricos",
    ];
    const midConditions = midTopics.map(t => sql`${questions.conteudo_principal} = ${t}`);
    // também aceita se tags contiver alguma das palavras-chave
    const tagKeywords = ["potênci", "radical", "raiz", "fração", "frações"];
    const tagConditions = tagKeywords.map(k => sql`JSON_SEARCH(LOWER(${questions.tags}), 'one', ${`%${k}%`}) IS NOT NULL`);

    const mid = await ctx.db
      .select(cols)
      .from(questions)
      .where(
        and(
          eq(questions.active, true),
          sql`${questions.param_b} > -0.5 AND ${questions.param_b} <= 0.5`,
          sql`(${sql.join([...midConditions, ...tagConditions], sql` OR `)})`,
        )
      )
      .orderBy(sql`RAND()`)
      .limit(5);

    // ── Faixa 3: 5 questões difíceis ENEM/REPVET (param_b > 0.5) ──────────────
    const hard = await ctx.db
      .select(cols)
      .from(questions)
      .where(
        and(
          eq(questions.active, true),
          sql`${questions.param_b} > 0.5`,
          sql`${questions.fonte} IN ('ENEM', 'REPVET')`,
        )
      )
      .orderBy(sql`RAND()`)
      .limit(5);

    // Fallbacks: se alguma faixa não tiver questões suficientes, completa com genéricas
    const fallback = async (needed: number, exclude: number[]) => {
      if (needed <= 0) return [];
      return ctx.db.select(cols).from(questions)
        .where(and(eq(questions.active, true), sql`${questions.id} NOT IN (${exclude.join(",") || 0})`))
        .orderBy(sql`RAND()`).limit(needed);
    };

    const usedIds = [...easy, ...mid, ...hard].map(q => q.id);
    const easyFill  = easy.length  < 10 ? await fallback(10 - easy.length,  usedIds) : [];
    const midFill   = mid.length   < 5  ? await fallback(5  - mid.length,   [...usedIds, ...easyFill.map(q => q.id)]) : [];
    const hardFill  = hard.length  < 5  ? await fallback(5  - hard.length,  [...usedIds, ...easyFill.map(q => q.id), ...midFill.map(q => q.id)]) : [];

    const final = [
      ...[...easy, ...easyFill].slice(0, 10),
      ...[...mid,  ...midFill ].slice(0, 5),
      ...[...hard, ...hardFill].slice(0, 5),
    ];

    return final.map(({ id, enunciado, alternativas, url_imagem, conteudo_principal }) => ({
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
        .where(sql`${questions.id} IN ${questionIds}`);

      const gabMap = new Map(qRows.map((q) => [q.id, q.gabarito]));
      let correct = 0;
      for (const [idStr, chosen] of Object.entries(input.answers)) {
        if (gabMap.get(Number(idStr)) === chosen) correct++;
      }

      const total = questionIds.length;
      const pct = total > 0 ? correct / total : 0;
      const level =
        pct >= 0.75 ? "avancado" :
        pct >= 0.40 ? "intermediario" : "iniciante";

      await ctx.db.update(users).set({
        city: input.city,
        educationLevel: input.educationLevel,
        diagnosisLevel: level as any,
        diagnosisScore: correct,
        diagnosisCompletedAt: new Date(),
      }).where(eq(users.id, userId));

      return { level, correct, total };
    }),
});
