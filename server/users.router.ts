import { z } from "zod";
import { eq, asc, sql, and, or, inArray, desc, gt, isNotNull } from "drizzle-orm";
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
          diagnosisScore: users.diagnosisScore,
          diagnosisCompletedAt: users.diagnosisCompletedAt,
          xp: users.xp,
          city: users.city,
          educationLevel: users.educationLevel,
          studyGoal: users.studyGoal,
          mathSelfLevel: users.mathSelfLevel,
          mathDifficulty: users.mathDifficulty,
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
      .orderBy(sql`RAND()`)
      .limit(300);

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
      studyGoal: z.string().max(200).optional(),
      mathSelfLevel: z.string().max(120).optional(),
      mathDifficulty: z.string().max(600).optional(),
      answers: z.record(z.string(), z.string()), // { questionId: letraEscolhida }
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const questionIds = Object.keys(input.answers).map(Number).filter(Boolean);

      if (questionIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhuma resposta enviada." });

      // Busca gabaritos + tópico no servidor
      const qRows = await ctx.db
        .select({ id: questions.id, gabarito: questions.gabarito, conteudo: questions.conteudo_principal })
        .from(questions)
        .where(inArray(questions.id, questionIds));

      const gabMap = new Map(qRows.map((q) => [q.id, { gabarito: q.gabarito, conteudo: q.conteudo }]));
      let correct = 0;
      const results: Array<{ questionId: number; conteudo: string; isCorrect: boolean }> = [];
      for (const [idStr, chosen] of Object.entries(input.answers)) {
        const qid = Number(idStr);
        const qInfo = gabMap.get(qid);
        const isCorrect = qInfo?.gabarito === chosen;
        if (isCorrect) correct++;
        results.push({ questionId: qid, conteudo: qInfo?.conteudo ?? "Matemática", isCorrect });
      }

      const total = questionIds.length;
      // Classifica em 5 níveis baseado no número absoluto de acertos (0-20)
      const level =
        correct >= 17 ? "genio" :
        correct >= 13 ? "expert" :
        correct >= 9  ? "calculista" :
        correct >= 4  ? "aprendiz" : "curioso";

      // XP: 2 pontos por acerto no diagnóstico
      const xpEarned = correct * 2;

      await ctx.db.update(users).set({
        city: input.city,
        educationLevel: input.educationLevel,
        studyGoal: input.studyGoal ?? null,
        mathSelfLevel: input.mathSelfLevel ?? null,
        mathDifficulty: input.mathDifficulty ?? null,
        diagnosisLevel: level as any,
        diagnosisScore: correct,
        diagnosisCompletedAt: new Date(),
        xp: sql`xp + ${xpEarned}`,
      }).where(eq(users.id, userId));

      return { level, correct, total, xpEarned, results };
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

  // ---------------------------------------------------------------------------
  // Leaderboard global — 3 rankings: XP, nota TRI, aproveitamento
  // ---------------------------------------------------------------------------
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const myId = ctx.user.id;

    // ── 1. Ranking por XP ──────────────────────────────────────────────────
    const xpTop = await ctx.db
      .select({ id: users.id, name: users.name, xp: users.xp })
      .from(users)
      .where(and(eq(users.active, true), gt(users.xp, 0)))
      .orderBy(desc(users.xp))
      .limit(20);

    const xpRanking = xpTop.map((u, i) => ({
      position: i + 1,
      userId: u.id,
      userName: u.name,
      xp: u.xp ?? 0,
      isMe: u.id === myId,
    }));

    // Posição do aluno no ranking XP se não estiver no top-20
    let myXpRank: { position: number; xp: number } | null = null;
    if (!xpRanking.find(r => r.isMe)) {
      const [me] = await ctx.db
        .select({ xp: users.xp })
        .from(users)
        .where(eq(users.id, myId))
        .limit(1);
      if (me) {
        const [above] = await ctx.db
          .select({ cnt: sql<number>`COUNT(*)` })
          .from(users)
          .where(and(eq(users.active, true), gt(users.xp, me.xp ?? 0)));
        myXpRank = { position: Number(above.cnt) + 1, xp: me.xp ?? 0 };
      }
    }

    // ── 2. Ranking por nota TRI (melhor simulação completa de cada aluno) ──
    const simRows = await ctx.db
      .select({
        userId: simulations.userId,
        userName: users.name,
        score: simulations.score,
        correctCount: simulations.correctCount,
        totalQuestions: simulations.totalQuestions,
        completedAt: simulations.completedAt,
        stage: simulations.stage,
      })
      .from(simulations)
      .innerJoin(users, eq(simulations.userId, users.id))
      .where(and(
        eq(simulations.status, "completed"),
        isNotNull(simulations.score),
        eq(users.active, true),
      ))
      .orderBy(desc(simulations.score))
      .limit(200);

    // Melhor resultado por aluno
    const bestByUser = new Map<number, typeof simRows[0] & { simCount: number; totalCorrect: number; totalQ: number }>();
    for (const row of simRows) {
      const existing = bestByUser.get(row.userId);
      if (!existing) {
        bestByUser.set(row.userId, { ...row, simCount: 1, totalCorrect: row.correctCount ?? 0, totalQ: row.totalQuestions ?? 0 });
      } else {
        existing.simCount++;
        existing.totalCorrect += row.correctCount ?? 0;
        existing.totalQ += row.totalQuestions ?? 0;
        if ((row.score ?? 0) > (existing.score ?? 0)) {
          existing.score = row.score;
          existing.correctCount = row.correctCount;
          existing.totalQuestions = row.totalQuestions;
          existing.completedAt = row.completedAt;
        }
      }
    }

    const totalRanked = bestByUser.size;

    const triRanking = Array.from(bestByUser.values())
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 20)
      .map((r, i) => ({
        position: i + 1,
        userId: r.userId,
        userName: r.userName,
        score: r.score,
        completedAt: r.completedAt,
        simCount: r.simCount,
        isMe: r.userId === myId,
      }));

    const myTriEntry = triRanking.find(r => r.isMe);
    const myTriPercentile = myTriEntry
      ? Math.round(((totalRanked - myTriEntry.position) / Math.max(1, totalRanked)) * 100)
      : null;

    // ── 3. Ranking por aproveitamento (% acerto médio, mín. 1 simulação) ──
    const perfRanking = Array.from(bestByUser.values())
      .filter(r => r.totalQ > 0)
      .map(r => ({
        userId: r.userId,
        userName: r.userName,
        avgPct: Math.round((r.totalCorrect / r.totalQ) * 100),
        simCount: r.simCount,
        bestScore: r.score,
        isMe: r.userId === myId,
      }))
      .sort((a, b) => b.avgPct - a.avgPct)
      .slice(0, 20)
      .map((r, i) => ({ ...r, position: i + 1 }));

    return { xpRanking, triRanking, perfRanking, totalRanked, myXpRank, myTriPercentile };
  }),
});
