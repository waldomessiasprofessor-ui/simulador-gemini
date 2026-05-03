/**
 * =============================================================================
 * Router de Simulados — tRPC
 * =============================================================================
 *
 * Fluxo de um simulado:
 *   1. start        → cria sessão, sorteia questões, retorna lista sem gabarito
 *   2. saveAnswer   → salva resposta de uma questão (pode chamar várias vezes)
 *   3. finish       → finaliza, calcula nota (TRI na Etapa 3, % nas demais),
 *                     verifica progressão de etapa
 *
 * Consultas:
 *   getActive       → retorna simulado em andamento do aluno (se existir)
 *   getResult       → detalhes completos de um simulado finalizado
 *   getHistory      → histórico paginado por etapa
 *   getProgress     → progresso nas 3 etapas (melhor nota, desbloqueio)
 * =============================================================================
 */

import { z } from "zod";
import { eq, and, desc, sql, inArray, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { questions, simulations, simulationAnswers, users, dailyChallenges, dailyReviews, flashcardProgress } from "./schema";
import type { NewSimulation, NewSimulationAnswer, NewDailyChallenge } from "./schema";
import {
  estimateTheta,
  thetaToEnemScore,
  checkStagePass,
  probabilityCorrect,
} from "./tri";
import type { QuestionResult } from "./tri";
import { resolveArea, MACRO_AREAS, getTopicsForArea } from "./macro-areas";
import type { MacroArea } from "./macro-areas";

// =============================================================================
// Constantes de configuração das etapas
// =============================================================================

const STAGE_CONFIG = {
  1: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 },
  2: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 },
  3: { total: 45, minPass: 0, timeLimitPerQuestion: 3 * 60 },
} as const;

type Stage = 1 | 2 | 3;

// =============================================================================
// Helpers internos
// =============================================================================

/** Sorteia N questões aleatórias activas do banco */
async function drawQuestions(db: any, count: number, excludeIds: number[] = [], fonte?: string) {
  // "CONCURSO" usa o pool geral (todas as questões ativas) — sem filtro de fonte
  const effectiveFonte = fonte === "CONCURSO" ? undefined : fonte;
  const whereClause = effectiveFonte
    ? and(eq(questions.active, true), eq(questions.fonte, effectiveFonte))
    : eq(questions.active, true);

  const rows = await db
    .select({
      id: questions.id,
      conteudo_principal: questions.conteudo_principal,
      nivel_dificuldade: questions.nivel_dificuldade,
      param_a: questions.param_a,
      param_b: questions.param_b,
      param_c: questions.param_c,
      enunciado: questions.enunciado,
      url_imagem: questions.url_imagem,
      alternativas: questions.alternativas,
      tags: questions.tags,
    })
    .from(questions)
    .where(whereClause)
    .orderBy(sql`RAND()`)
    .limit(count + (excludeIds.length > 0 ? excludeIds.length : 0));

  // Filtra excluídos em memória (mais simples que SQL dinâmico)
  const filtered = rows.filter((q: any) => !excludeIds.includes(q.id));
  return filtered.slice(0, count);
}

/** Lança TRPCError NOT_FOUND padronizado */
function notFound(entity: string): never {
  throw new TRPCError({ code: "NOT_FOUND", message: `${entity} não encontrado(a).` });
}

/** Lança TRPCError FORBIDDEN padronizado */
function forbidden(msg: string): never {
  throw new TRPCError({ code: "FORBIDDEN", message: msg });
}

// =============================================================================
// Router
// =============================================================================

export const simulationsRouter = createTRPCRouter({

  // ---------------------------------------------------------------------------
  // INICIA um novo simulado
  // ---------------------------------------------------------------------------
  start: protectedProcedure
    .input(
      z.object({
        stage: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        fonte: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { stage, fonte } = input;
      const userId = ctx.user.id;
      const config = STAGE_CONFIG[stage];
      // ENEM e CONCURSO usam 45 questões; outros vestibulares usam 12
      const total = (fonte && fonte !== "ENEM" && fonte !== "CONCURSO") ? 12 : config.total;

      // --- Verifica conflito apenas na mesma fonte ---
      const [existing] = await ctx.db
        .select({ id: simulations.id })
        .from(simulations)
        .where(
          and(
            eq(simulations.userId, userId),
            eq(simulations.status, "in_progress"),
            eq(simulations.fonte, fonte ?? "ENEM"),
            sql`${simulations.stage} > 0`,
          )
        )
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Você já tem um simulado desta banca em andamento. Finalize-o antes de iniciar outro.",
        });
      }

      // Etapa única: qualquer aluno pode iniciar diretamente

      // --- Sorteia questões ---
      const drawn = await drawQuestions(ctx.db, total, [], fonte);

      if (drawn.length < total) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Banco de questões insuficiente. Necessário: ${total}, disponível: ${drawn.length}.`,
        });
      }

      // --- Cria sessão de simulado ---
      const newSim: NewSimulation = {
        userId,
        stage,
        fonte: fonte ?? "ENEM",
        totalQuestions: total,
        status: "in_progress",
      };

      const [result] = await ctx.db.insert(simulations).values(newSim);
      const simulationId = Number(result.insertId);

      // --- Cria slots de resposta (pré-alocados, sem resposta ainda) ---
      const answerSlots: NewSimulationAnswer[] = drawn.map((q: any, idx: number) => ({
        simulationId,
        questionId: q.id,
        questionOrder: idx + 1,
      }));

      await ctx.db.insert(simulationAnswers).values(answerSlots);

      return {
        simulationId,
        stage,
        totalQuestions: config.total,
        minPassRequired: config.minPass,
        timeLimitPerQuestion: config.timeLimitPerQuestion,
        questions: drawn, // sem gabarito
      };
    }),

  // ---------------------------------------------------------------------------
  // SALVA RESPOSTA de uma questão
  // ---------------------------------------------------------------------------
  saveAnswer: protectedProcedure
    .input(
      z.object({
        simulationId: z.number().int().positive(),
        questionId: z.number().int().positive(),
        selectedAnswer: z.string().length(1).toUpperCase(),
        timeSpentSeconds: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // --- Verifica que o simulado pertence ao aluno e está em andamento ---
      const [sim] = await ctx.db
        .select()
        .from(simulations)
        .where(
          and(
            eq(simulations.id, input.simulationId),
            eq(simulations.userId, userId),
            eq(simulations.status, "in_progress")
          )
        )
        .limit(1);

      if (!sim) notFound("Simulado activo");

      // --- Busca o slot de resposta e o gabarito ---
      const [answerRow] = await ctx.db
        .select({
          id: simulationAnswers.id,
          questionId: simulationAnswers.questionId,
          gabarito: questions.gabarito,
        })
        .from(simulationAnswers)
        .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
        .where(
          and(
            eq(simulationAnswers.simulationId, input.simulationId),
            eq(simulationAnswers.questionId, input.questionId)
          )
        )
        .limit(1);

      if (!answerRow) notFound("Questão neste simulado");

      const isCorrect =
        input.selectedAnswer.toUpperCase() === answerRow.gabarito.toUpperCase();

      // --- Persiste resposta ---
      await ctx.db
        .update(simulationAnswers)
        .set({
          selectedAnswer: input.selectedAnswer.toUpperCase(),
          isCorrect,
          timeSpentSeconds: input.timeSpentSeconds,
          answeredAt: new Date(),
        })
        .where(eq(simulationAnswers.id, answerRow.id));

      return { isCorrect };
    }),

  // ---------------------------------------------------------------------------
  // FINALIZA simulado e calcula pontuação
  // ---------------------------------------------------------------------------
  finish: protectedProcedure
    .input(
      z.object({
        simulationId: z.number().int().positive(),
        totalTimeSeconds: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // --- Carrega simulado ---
      const [sim] = await ctx.db
        .select()
        .from(simulations)
        .where(
          and(
            eq(simulations.id, input.simulationId),
            eq(simulations.userId, userId),
            eq(simulations.status, "in_progress")
          )
        )
        .limit(1);

      if (!sim) notFound("Simulado activo");

      const stage = sim.stage as Stage;
      const config = STAGE_CONFIG[stage];

      // --- Carrega todas as respostas com parâmetros TRI ---
      const answers = await ctx.db
        .select({
          questionId: simulationAnswers.questionId,
          selectedAnswer: simulationAnswers.selectedAnswer,
          isCorrect: simulationAnswers.isCorrect,
          timeSpentSeconds: simulationAnswers.timeSpentSeconds,
          param_a: questions.param_a,
          param_b: questions.param_b,
          param_c: questions.param_c,
          gabarito: questions.gabarito,
          conteudo_principal: questions.conteudo_principal,
          nivel_dificuldade: questions.nivel_dificuldade,
        })
        .from(simulationAnswers)
        .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
        .where(eq(simulationAnswers.simulationId, input.simulationId));

      const correctCount = answers.filter((a) => a.isCorrect === true).length;

      // --- Calcula pontuação ---
      let score: number;
      let triTheta: number | null = null;
      let enemScore: number | null = null;

      if (stage === 3) {
        // Etapa 3: Cálculo TRI completo
        const triResults: QuestionResult[] = answers.map((a) => ({
          questionId: a.questionId,
          params: { a: a.param_a, b: a.param_b, c: a.param_c },
          correct: a.isCorrect,
        }));

        const { theta, standardError } = estimateTheta(triResults);
        triTheta = theta;
        enemScore = thetaToEnemScore(theta);
        score = enemScore;
      } else {
        // Etapas 1 e 2: percentual simples
        score =
          sim.totalQuestions && sim.totalQuestions > 0
            ? Math.round((correctCount / sim.totalQuestions) * 100)
            : 0;
      }

      // --- Verifica progressão de etapa ---
      const stageResult = checkStagePass(stage, correctCount);

      // --- Calcula XP do simulado ---
      const xpEarned = stage === 3
        ? Math.round((score ?? 0) / 10)           // TRI: até 100 XP (score 0-1000)
        : correctCount * 2;                        // Etapas 1&2: 2 XP por acerto

      // --- Actualiza simulado como concluído ---
      await ctx.db
        .update(simulations)
        .set({
          status: "completed",
          correctCount,
          score,
          triTheta,
          totalTimeSeconds: input.totalTimeSeconds,
          completedAt: new Date(),
        })
        .where(eq(simulations.id, input.simulationId));

      // --- Credita XP ao aluno ---
      if (xpEarned > 0) {
        await ctx.db.update(users).set({ xp: sql`xp + ${xpEarned}` }).where(eq(users.id, userId));
      }

      // --- Monta feedback por questão com tempo ---
      const avgTime =
        answers.filter((a) => a.timeSpentSeconds != null).length > 0
          ? Math.round(
              answers.reduce((s, a) => s + (a.timeSpentSeconds ?? 0), 0) /
                answers.length
            )
          : 0;

      const timeWarning =
        avgTime > config.timeLimitPerQuestion
          ? `Você gastou em média ${Math.round(avgTime / 60)} min por questão. O ideal é até ${config.timeLimitPerQuestion / 60} min.`
          : null;

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
          nivel_dificuldade: a.nivel_dificuldade,
        })),
      };
    }),

  // ---------------------------------------------------------------------------
  // SIMULADO ACTIVO do aluno (para retomar após reload)
  // ---------------------------------------------------------------------------
  getActive: protectedProcedure
    .input(z.object({ fonte: z.string().optional() }))
    .query(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const effectiveFonte = input.fonte ?? "ENEM";

    const [sim] = await ctx.db
      .select()
      .from(simulations)
      .where(
        and(
          eq(simulations.userId, userId),
          eq(simulations.status, "in_progress"),
          eq(simulations.fonte, effectiveFonte),
        )
      )
      .limit(1);

    if (!sim) return null;

    // Carrega questões e respostas já dadas
    const answers = await ctx.db
      .select({
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
        tags: questions.tags,
      })
      .from(simulationAnswers)
      .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
      .where(eq(simulationAnswers.simulationId, sim.id))
      .orderBy(simulationAnswers.questionOrder);

    const stage = sim.stage as Stage;
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
        selectedAnswer: a.selectedAnswer, // null se ainda não respondida
        conteudo_principal: a.conteudo_principal,
        nivel_dificuldade: a.nivel_dificuldade,
        param_a: a.param_a,
        param_b: a.param_b,
        param_c: a.param_c,
        enunciado: a.enunciado,
        url_imagem: a.url_imagem,
        alternativas: a.alternativas,
        tags: a.tags,
      })),
    };
  }),

  // ---------------------------------------------------------------------------
  // RESULTADO DETALHADO de um simulado finalizado
  // ---------------------------------------------------------------------------
  getResult: protectedProcedure
    .input(z.object({ simulationId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [sim] = await ctx.db
        .select()
        .from(simulations)
        .where(
          and(
            eq(simulations.id, input.simulationId),
            eq(simulations.userId, userId),
            eq(simulations.status, "completed")
          )
        )
        .limit(1);

      if (!sim) notFound("Simulado");

      const answers = await ctx.db
        .select({
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
          url_imagem: questions.url_imagem,
        })
        .from(simulationAnswers)
        .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
        .where(eq(simulationAnswers.simulationId, sim.id))
        .orderBy(simulationAnswers.questionOrder);

      // Estatísticas por dificuldade
      const byDifficulty: Record<string, { correct: number; total: number }> = {};
      for (const a of answers) {
        const diff = a.nivel_dificuldade ?? "Média";
        if (!byDifficulty[diff]) byDifficulty[diff] = { correct: 0, total: 0 };
        byDifficulty[diff].total++;
        if (a.isCorrect) byDifficulty[diff].correct++;
      }

      // Estatísticas por tópico
      const byTopic: Record<string, { correct: number; total: number }> = {};
      for (const a of answers) {
        const topic = a.conteudo_principal;
        if (!byTopic[topic]) byTopic[topic] = { correct: 0, total: 0 };
        byTopic[topic].total++;
        if (a.isCorrect) byTopic[topic].correct++;
      }

      const stage = sim.stage as Stage;
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
        answers,
      };
    }),

  // ---------------------------------------------------------------------------
  // HISTÓRICO — últimas N tentativas por etapa
  // ---------------------------------------------------------------------------
  getHistory: protectedProcedure
    .input(
      z.object({
        stage: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const filters = [
        eq(simulations.userId, userId),
        eq(simulations.status, "completed"),
        sql`${simulations.stage} > 0`, // Exclui sessões de treino livre (stage=0)
      ];
      if (input.stage) filters.push(eq(simulations.stage, input.stage));

      const rows = await ctx.db
        .select({
          id: simulations.id,
          stage: simulations.stage,
          score: simulations.score,
          triTheta: simulations.triTheta,
          correctCount: simulations.correctCount,
          totalQuestions: simulations.totalQuestions,
          totalTimeSeconds: simulations.totalTimeSeconds,
          completedAt: simulations.completedAt,
        })
        .from(simulations)
        .where(and(...filters))
        .orderBy(desc(simulations.completedAt))
        .limit(input.limit);

      return rows;
    }),

  // ---------------------------------------------------------------------------
  // PROGRESSO nas 3 etapas (para o dashboard)
  // ---------------------------------------------------------------------------
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const completed = await ctx.db
      .select({
        stage: simulations.stage,
        score: simulations.score,
        triTheta: simulations.triTheta,
        correctCount: simulations.correctCount,
        totalQuestions: simulations.totalQuestions,
        completedAt: simulations.completedAt,
      })
      .from(simulations)
      .where(
        and(eq(simulations.userId, userId), eq(simulations.status, "completed"))
      )
      .orderBy(desc(simulations.completedAt));

    const stageStats = ([1, 2, 3] as Stage[]).map((stage) => {
      const attempts = completed.filter((s) => s.stage === stage);
      const config = STAGE_CONFIG[stage];

      const best = attempts.reduce(
        (max, a) => ((a.correctCount ?? 0) > (max?.correctCount ?? -1) ? a : max),
        null as (typeof attempts)[0] | null
      );

      const passed = best != null && (best.correctCount ?? 0) >= config.minPass;
      const unlocked = true; // Acesso livre sem progressão por etapas

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
        recentAttempts: attempts.slice(0, 5),
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
    const now = new Date();

    // ── 1. Questões respondidas via simulationAnswers (simulado + saves de treino) ──
    const answered = await ctx.db
      .select({
        answeredAt: simulationAnswers.answeredAt,
        isCorrect: simulationAnswers.isCorrect,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .where(
        and(
          eq(simulations.userId, userId),
          sql`${simulationAnswers.answeredAt} IS NOT NULL`,
        )
      );

    // ── 2. Questões respondidas no desafio diário ──────────────────────────
    const challenges = await ctx.db
      .select({
        answers: dailyChallenges.answers,
        questionIds: dailyChallenges.questionIds,
        challengeDate: dailyChallenges.challengeDate,
        completedAt: dailyChallenges.completedAt,
        completed: dailyChallenges.completed,
        correctCount: dailyChallenges.correctCount,
      })
      .from(dailyChallenges)
      .where(eq(dailyChallenges.userId, userId));

    // ── 3. Simulados completos (para score e streak base) ──────────────────
    const completedSims = await ctx.db
      .select({
        completedAt: simulations.completedAt,
        totalQuestions: simulations.totalQuestions,
        correctCount: simulations.correctCount,
      })
      .from(simulations)
      .where(and(eq(simulations.userId, userId), eq(simulations.status, "completed")))
      .orderBy(desc(simulations.completedAt));

    // ── Semana atual (seg a dom) ───────────────────────────────────────────
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // ── Helper: data de uma string ou Date → chave "YYYY-M-D" ─────────────
    function dayKey(d: Date | string | null): string {
      if (!d) return "";
      const dt = typeof d === "string" ? new Date(d + "T12:00:00") : new Date(d);
      return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    }

    function sameDay(d: Date | string | null, ref: Date): boolean {
      if (!d) return false;
      const dt = typeof d === "string" ? new Date(d + "T12:00:00") : new Date(d);
      return dt.getFullYear() === ref.getFullYear() &&
             dt.getMonth() === ref.getMonth() &&
             dt.getDate() === ref.getDate();
    }

    // ── Constrói mapa dia → { questoes, acertos } combinando todas as fontes ──
    const dayMap = new Map<string, { questoes: number; acertos: number }>();

    function addToDay(key: string, q: number, c: number) {
      if (!key) return;
      const existing = dayMap.get(key) ?? { questoes: 0, acertos: 0 };
      dayMap.set(key, { questoes: existing.questoes + q, acertos: existing.acertos + c });
    }

    // Fonte 1: simulationAnswers
    for (const a of answered) {
      const key = dayKey(a.answeredAt);
      addToDay(key, 1, a.isCorrect ? 1 : 0);
    }

    // Fonte 2: desafio diário — conta respostas dadas (não só quando completo)
    for (const ch of challenges) {
      const ans = ch.answers as Record<string, string>;
      const ids = ch.questionIds as number[];
      const countAnswered = Object.keys(ans).length;
      if (countAnswered === 0) continue;
      // data do desafio como chave
      const key = ch.challengeDate; // YYYY-MM-DD — precisa normalizar
      const dt = new Date(ch.challengeDate + "T12:00:00");
      const nKey = dayKey(dt);
      // correctCount só disponível após completar; senão estimamos 0
      const correct = ch.completed ? (ch.correctCount ?? 0) : 0;
      addToDay(nKey, countAnswered, correct);
    }

    // ── Streak: dias consecutivos com qualquer atividade ──────────────────
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      if (dayMap.has(key) && (dayMap.get(key)!.questoes > 0)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // ── Semana: agrega os 7 dias ──────────────────────────────────────────
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });

    const dailyData = days.map((day) => {
      const label = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][day.getDay() === 0 ? 6 : day.getDay() - 1];
      const key = dayKey(day);
      const { questoes, acertos } = dayMap.get(key) ?? { questoes: 0, acertos: 0 };
      return { label, questoes, acertos, pct: questoes > 0 ? Math.round((acertos / questoes) * 100) : 0 };
    });

    const weeklyData = dailyData.reduce((acc, d) => ({
      questoes: acc.questoes + d.questoes,
      acertos: acc.acertos + d.acertos,
    }), { questoes: 0, acertos: 0 });

    const weeklyAccuracy = weeklyData.questoes > 0
      ? Math.round((weeklyData.acertos / weeklyData.questoes) * 100)
      : 0;

    // ── Totais gerais (vida toda) ─────────────────────────────────────────
    const allEntries = Array.from(dayMap.values());
    const totalQuestions = allEntries.reduce((s, d) => s + d.questoes, 0);
    const totalCorrect   = allEntries.reduce((s, d) => s + d.acertos, 0);
    const totalAccuracy  = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      streak,
      weeklyQuestions: weeklyData.questoes,
      weeklyAccuracy,
      totalSimulations: completedSims.length,
      dailyData,
      // Gerais
      totalQuestions,
      totalAccuracy,
    };
  }),

  // ---------------------------------------------------------------------------
  // RANKING — top 20 alunos por melhor nota TRI na Etapa 3
  // ---------------------------------------------------------------------------
  getRanking: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        userId: simulations.userId,
        score: simulations.score,
        correctCount: simulations.correctCount,
        completedAt: simulations.completedAt,
        userName: users.name,
      })
      .from(simulations)
      .innerJoin(users, eq(simulations.userId, users.id))
      .where(and(eq(simulations.stage, 3), eq(simulations.status, "completed")))
      .orderBy(desc(simulations.score))
      .limit(100);

    // Pega melhor resultado por aluno
    const bestByUser = new Map<number, typeof rows[0]>();
    for (const row of rows) {
      const existing = bestByUser.get(row.userId);
      if (!existing || (row.score ?? 0) > (existing.score ?? 0)) {
        bestByUser.set(row.userId, row);
      }
    }

    const ranking = Array.from(bestByUser.values())
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 20)
      .map((r, idx) => ({
        position: idx + 1,
        userId: r.userId,
        userName: r.userName,
        score: r.score,
        correctCount: r.correctCount,
        completedAt: r.completedAt,
        isMe: r.userId === ctx.user.id,
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

    // Fonte 1: simulationAnswers (simulados + treino livre salvo)
    const simRows = await ctx.db
      .select({
        conteudo: questions.conteudo_principal,
        tags: questions.tags,
        isCorrect: simulationAnswers.isCorrect,
        timeSpent: simulationAnswers.timeSpentSeconds,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
      .where(and(
        eq(simulations.userId, userId),
        sql`${simulationAnswers.isCorrect} IS NOT NULL`,
      ));

    // Agrupa por ÁREA MACRO (cada questão credita a uma única área)
    type Agg = { total: number; correct: number; timeSum: number; timeCount: number };
    const map = new Map<string, Agg>();

    for (const r of simRows) {
      const area = resolveArea(r.conteudo, r.tags);
      if (!area) continue; // questão sem mapeamento é ignorada
      const entry = map.get(area) ?? { total: 0, correct: 0, timeSum: 0, timeCount: 0 };
      entry.total++;
      if (r.isCorrect) entry.correct++;
      if (r.timeSpent != null && r.timeSpent > 0) {
        entry.timeSum += r.timeSpent;
        entry.timeCount++;
      }
      map.set(area, entry);
    }

    // Fonte 2: dailyChallenges completos (sem dados de tempo)
    const challenges = await ctx.db
      .select({
        answers: dailyChallenges.answers,
        questionIds: dailyChallenges.questionIds,
        completed: dailyChallenges.completed,
      })
      .from(dailyChallenges)
      .where(and(eq(dailyChallenges.userId, userId), eq(dailyChallenges.completed, true)));

    if (challenges.length > 0) {
      const allQIds = [...new Set(challenges.flatMap(c => c.questionIds as number[]))];
      if (allQIds.length > 0) {
        const qDetails = await ctx.db
          .select({
            id: questions.id,
            conteudo: questions.conteudo_principal,
            tags: questions.tags,
            gabarito: questions.gabarito,
          })
          .from(questions)
          .where(inArray(questions.id, allQIds));
        const qMap = new Map(qDetails.map(q => [q.id, q]));

        for (const ch of challenges) {
          const answers = ch.answers as Record<string, string>;
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

    // Ordem fixa das 8 áreas (eixos do radar não "pulam" entre renders).
    // Inclui áreas com 0 respostas também — mostra o contorno completo das
    // 8 áreas no radar; sem isso, o radar mudaria de forma a cada simulado.
    return MACRO_AREAS.map((area) => {
      const v = map.get(area) ?? { total: 0, correct: 0, timeSum: 0, timeCount: 0 };
      const pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
      return {
        conteudo: area,
        total: v.total,
        correct: v.correct,
        pct,
        accuracy: pct, // alias (página Desempenho usa "accuracy")
        avgTime: v.timeCount > 0 ? Math.round(v.timeSum / v.timeCount) : null,
      };
    });
  }),

  // ---------------------------------------------------------------------------
  // DESEMPENHO POR PERFORMANCE — 5 eixos normalizados 0–100
  // Complementa o radar por área. Mede HÁBITO/VOLUME, não acurácia:
  //   • Velocidade  → tempo médio por questão (invertido: menos = mais pontos)
  //   • Questões    → total de questões respondidas (simulado + desafio)
  //   • Estudos     → conteúdos do Revise visitados
  //   • Fixação     → flashcards revisados com boa avaliação (qualidade ≥ 3)
  //   • Dedicação   → tempo total na plataforma (soma de todas as fontes)
  // Escala 0–100 baseada em metas fixas (ajuste as constantes abaixo).
  // ---------------------------------------------------------------------------
  getPerformanceStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ── Metas (aluno ENEM dedicado atinge em ~8 meses) ────────────────────────
    const META_VELOCIDADE_MIN = 150; // ≤2,5 min/questão → 100%
    const META_VELOCIDADE_MAX = 360; // ≥6 min/questão → 0%
    const META_QUESTOES   = 1000;    // 1000 questões → 100%
    const META_TRILHAS    = 30;      // 30 lições de trilha → 100% (calculado no cliente via localStorage)
    const META_FIXACAO    = 500;     // 500 flashcards c/ boa avaliação → 100%
    const META_DEDICACAO_HORAS = 50; // 50h cumulativas na plataforma → 100%

    function clamp01(x: number): number {
      if (!isFinite(x)) return 0;
      return Math.max(0, Math.min(1, x));
    }
    const pct = (x: number) => Math.round(clamp01(x) * 100);

    // ── Fonte 1: respostas em simulationAnswers ───────────────────────────────
    const simAgg = await ctx.db
      .select({
        answeredCount: sql<number>`COUNT(*)`,
        totalTime:     sql<number>`COALESCE(SUM(${simulationAnswers.timeSpentSeconds}), 0)`,
        timedCount:    sql<number>`SUM(CASE WHEN ${simulationAnswers.timeSpentSeconds} > 0 THEN 1 ELSE 0 END)`,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .where(and(
        eq(simulations.userId, userId),
        sql`${simulationAnswers.isCorrect} IS NOT NULL`,
      ));

    const simAnswered = Number(simAgg[0]?.answeredCount ?? 0);
    const simTimeSum  = Number(simAgg[0]?.totalTime ?? 0);
    const simTimed    = Number(simAgg[0]?.timedCount ?? 0);

    // Tempo total das sessões completas (inclui ócio entre questões — proxy
    // melhor para "dedicação" do que a soma das questões cronometradas).
    const simSessionAgg = await ctx.db
      .select({ total: sql<number>`COALESCE(SUM(${simulations.totalTimeSeconds}), 0)` })
      .from(simulations)
      .where(and(eq(simulations.userId, userId), eq(simulations.status, "completed")));
    const simSessionTime = Number(simSessionAgg[0]?.total ?? 0);

    // ── Fonte 2: desafios diários completos ──────────────────────────────────
    const dcAgg = await ctx.db
      .select({
        qSum:    sql<number>`COALESCE(SUM(JSON_LENGTH(${dailyChallenges.questionIds})), 0)`,
        timeSum: sql<number>`COALESCE(SUM(${dailyChallenges.totalTimeSeconds}), 0)`,
      })
      .from(dailyChallenges)
      .where(and(eq(dailyChallenges.userId, userId), eq(dailyChallenges.completed, true)));

    const dcQuestions = Number(dcAgg[0]?.qSum ?? 0);
    const dcTime      = Number(dcAgg[0]?.timeSum ?? 0);

    // ── Fonte 3: Revise — quantidade de textos + tempo de leitura ────────────
    const drAgg = await ctx.db
      .select({
        count:   sql<number>`COUNT(*)`,
        timeSum: sql<number>`COALESCE(SUM(${dailyReviews.totalTimeSeconds}), 0)`,
      })
      .from(dailyReviews)
      .where(eq(dailyReviews.userId, userId));

    const drCount = Number(drAgg[0]?.count ?? 0);
    const drTime  = Number(drAgg[0]?.timeSum ?? 0);

    // ── Fonte 4: Flashcards — revisões bem-sucedidas + tempo ─────────────────
    // Conta a SOMA de repetições (cada "fácil"/"bom" acumula +1 no campo).
    const fcAgg = await ctx.db
      .select({
        goodCount: sql<number>`COALESCE(SUM(${flashcardProgress.repetitions}), 0)`,
        timeSum:   sql<number>`COALESCE(SUM(${flashcardProgress.timeSpentSeconds}), 0)`,
      })
      .from(flashcardProgress)
      .where(eq(flashcardProgress.userId, userId));

    const fcGood = Number(fcAgg[0]?.goodCount ?? 0);
    const fcTime = Number(fcAgg[0]?.timeSum ?? 0);

    // ── Cálculo dos 5 eixos ──────────────────────────────────────────────────

    const avgSecPerQuestion = simTimed > 0 ? simTimeSum / simTimed : null;
    let velocidade = 0;
    if (avgSecPerQuestion !== null) {
      if (avgSecPerQuestion <= META_VELOCIDADE_MIN) velocidade = 100;
      else if (avgSecPerQuestion >= META_VELOCIDADE_MAX) velocidade = 0;
      else {
        const frac = 1 - (avgSecPerQuestion - META_VELOCIDADE_MIN) /
                         (META_VELOCIDADE_MAX - META_VELOCIDADE_MIN);
        velocidade = Math.round(clamp01(frac) * 100);
      }
    }

    const questoesTotal = simAnswered + dcQuestions;
    const questoes = pct(questoesTotal / META_QUESTOES);
    // Trilhas: calculado no cliente via localStorage — servidor retorna 0 como base
    const trilhas  = 0;
    const fixacao  = pct(fcGood / META_FIXACAO);

    // Dedicação inclui tempo do Revise (drTime) para não perder o histórico
    const totalTimeSeconds = simSessionTime + dcTime + drTime + fcTime;
    const dedicacaoHoras   = totalTimeSeconds / 3600;
    const dedicacao = pct(dedicacaoHoras / META_DEDICACAO_HORAS);

    return [
      { eixo: "Velocidade", pct: velocidade, raw: avgSecPerQuestion !== null ? Math.round(avgSecPerQuestion) : null, meta: META_VELOCIDADE_MIN, unidade: "s/questão" },
      { eixo: "Resoluções", pct: questoes,   raw: questoesTotal,                         meta: META_QUESTOES,           unidade: "resoluções" },
      { eixo: "Trilhas",    pct: trilhas,    raw: 0,                                     meta: META_TRILHAS,            unidade: "lições" },
      { eixo: "Fixação",    pct: fixacao,    raw: fcGood,                                meta: META_FIXACAO,            unidade: "cards" },
      { eixo: "Dedicação",  pct: dedicacao,  raw: Math.round(dedicacaoHoras * 10) / 10,  meta: META_DEDICACAO_HORAS,    unidade: "horas" },
    ];
  }),

  // ---------------------------------------------------------------------------
  // TREINO LIVRE — sorteia N questões de um tópico com gabarito imediato
  // ---------------------------------------------------------------------------
  startFreeTraining: protectedProcedure
    .input(z.object({
      area: z.string().optional(),  // nome da MacroArea (ex: "Álgebra")
      count: z.number().int().min(1).max(20).default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const filters: any[] = [eq(questions.active, true)];
      if (input.area && (MACRO_AREAS as readonly string[]).includes(input.area)) {
        // Filtra por todos os conteudo_principal que pertencem à área macro
        const topics = getTopicsForArea(input.area as MacroArea);
        if (topics.length > 0) {
          filters.push(inArray(questions.conteudo_principal, topics));
        }
      }

      const rows = await ctx.db
        .select({
          id: questions.id,
          enunciado: questions.enunciado,
          url_imagem: questions.url_imagem,
          url_video: questions.url_video,
          alternativas: questions.alternativas,
          gabarito: questions.gabarito,
          comentario_resolucao: questions.comentario_resolucao,
          conteudo_principal: questions.conteudo_principal,
          nivel_dificuldade: questions.nivel_dificuldade,
          tags: questions.tags,
        })
        .from(questions)
        .where(and(...filters))
        .orderBy(sql`RAND()`)
        .limit(input.count);

      // Abandona qualquer sessão de treino pendente
      await ctx.db
        .update(simulations)
        .set({ status: "abandoned" })
        .where(and(
          eq(simulations.userId, userId),
          eq(simulations.status, "in_progress"),
          sql`${simulations.stage} = 0`,
        ));

      // Cria registro de simulação para treino (stage = 0) para rastrear no stats
      const [result] = await ctx.db.insert(simulations).values({
        userId,
        stage: 0 as any,
        totalQuestions: rows.length,
        status: "in_progress",
      });
      const simulationId = Number(result.insertId);

      return { simulationId, questions: rows };
    }),

  // Salva uma resposta de treino livre no banco
  saveTrainingAnswer: protectedProcedure
    .input(z.object({
      simulationId: z.number().int().positive(),
      questionId: z.number().int().positive(),
      selectedAnswer: z.string().length(1),
      isCorrect: z.boolean(),
      order: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verifica que o simulado pertence ao usuário
      const [sim] = await ctx.db
        .select({ id: simulations.id })
        .from(simulations)
        .where(and(
          eq(simulations.id, input.simulationId),
          eq(simulations.userId, ctx.user.id),
        ))
        .limit(1);

      if (!sim) return { success: false };

      await ctx.db.insert(simulationAnswers).values({
        simulationId: input.simulationId,
        questionId: input.questionId,
        selectedAnswer: input.selectedAnswer,
        isCorrect: input.isCorrect,
        questionOrder: input.order,
        answeredAt: new Date(),
      });

      return { success: true };
    }),

  // Finaliza sessão de treino livre
  finishTrainingSession: protectedProcedure
    .input(z.object({
      simulationId: z.number().int().positive(),
      correctCount: z.number().int().min(0),
      totalTimeSeconds: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(simulations)
        .set({
          status: "completed",
          correctCount: input.correctCount,
          totalTimeSeconds: input.totalTimeSeconds,
          completedAt: new Date(),
        })
        .where(and(
          eq(simulations.id, input.simulationId),
          eq(simulations.userId, ctx.user.id),
        ));

      // Credita 1 XP por acerto no treino
      if (input.correctCount > 0) {
        await ctx.db.update(users).set({ xp: sql`xp + ${input.correctCount}` }).where(eq(users.id, ctx.user.id));
      }

      return { success: true };
    }),

  // Tópicos disponíveis para treino livre
  // Para cada tópico T (valor distinto de conteudo_principal), o total é o número
  // de questões em que conteudo_principal = T **ou** T aparece em tags — assim uma
  // questão cadastrada como "Aritmética" com tag "Razão, proporção e regra de
  // três" conta no tópico "Razão, proporção e regra de três" (e não só em
  // "Aritmética"). Usa COUNT(DISTINCT id) para evitar dupla contagem.
  getTopics: protectedProcedure.query(async ({ ctx }) => {
    const rows: any = await ctx.db.execute(sql`
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

    // drizzle.execute pode retornar [rows, fields] dependendo do driver — normaliza
    const list = Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    return (list as any[]).map((r: any) => ({
      conteudo: r.conteudo as string,
      total: Number(r.total),
    }));
  }),


  // ---------------------------------------------------------------------------
  // DESAFIO DIÁRIO — 3 questões randômicas sem repetição
  // ---------------------------------------------------------------------------
  getDailyChallenge: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    // Usa Horário de Brasília (UTC-3, sem horário de verão desde 2019)
    // Garante reset à meia-noite local do aluno, não às 21h/00h UTC
    const today = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Verifica se já existe desafio de hoje (pega o mais recente)
    const [existing] = await ctx.db
      .select()
      .from(dailyChallenges)
      .where(and(eq(dailyChallenges.userId, userId), eq(dailyChallenges.challengeDate, today)))
      .orderBy(desc(dailyChallenges.id))
      .limit(1);

    if (existing) {
      // Carrega as questões do desafio mantendo a ordem original do sorteio
      const qs = await ctx.db
        .select({
          id: questions.id,
          enunciado: questions.enunciado,
          url_imagem: questions.url_imagem,
          url_video: questions.url_video,
          alternativas: questions.alternativas,
          gabarito: questions.gabarito,
          comentario_resolucao: questions.comentario_resolucao,
          conteudo_principal: questions.conteudo_principal,
          nivel_dificuldade: questions.nivel_dificuldade,
        })
        .from(questions)
        .where(inArray(questions.id, existing.questionIds));

      // Reordena na mesma sequência do sorteio original
      const ordered = existing.questionIds
        .map((id: number) => qs.find((q) => q.id === id))
        .filter(Boolean);

      return {
        challengeId: existing.id,
        date: today,
        completed: existing.completed,
        correctCount: existing.correctCount,
        answers: existing.answers as Record<string, string>,
        questions: ordered,
      };
    }

    // Busca questões que o aluno nunca respondeu nos desafios
    const pastChallenges = await ctx.db
      .select({ questionIds: dailyChallenges.questionIds })
      .from(dailyChallenges)
      .where(eq(dailyChallenges.userId, userId));

    const usedIds = new Set<number>(pastChallenges.flatMap((c) => c.questionIds));

    // Sorteia 3 questões não usadas
    let drawn = await ctx.db
      .select({
        id: questions.id,
        enunciado: questions.enunciado,
        url_imagem: questions.url_imagem,
        url_video: questions.url_video,
        alternativas: questions.alternativas,
        gabarito: questions.gabarito,
        comentario_resolucao: questions.comentario_resolucao,
        conteudo_principal: questions.conteudo_principal,
        nivel_dificuldade: questions.nivel_dificuldade,
      })
      .from(questions)
      .where(eq(questions.active, true))
      .orderBy(sql`RAND()`)
      .limit(100);

    const filtered = drawn.filter((q) => !usedIds.has(q.id)).slice(0, 3);
    // Se acabaram questões novas, recomeça do banco inteiro
    const final = filtered.length >= 3 ? filtered : drawn.slice(0, 3);

    const newChallenge: NewDailyChallenge = {
      userId,
      challengeDate: today,
      questionIds: final.map((q) => q.id),
      answers: {},
      completed: false,
    };

    const [result] = await ctx.db.insert(dailyChallenges).values(newChallenge);

    return {
      challengeId: Number(result.insertId),
      date: today,
      completed: false,
      correctCount: null,
      answers: {},
      questions: final,
    };
  }),

  saveDailyAnswer: protectedProcedure
    .input(z.object({
      challengeId: z.number().int().positive(),
      questionId: z.number().int().positive(),
      selectedAnswer: z.string().length(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [challenge] = await ctx.db
        .select()
        .from(dailyChallenges)
        .where(and(eq(dailyChallenges.id, input.challengeId), eq(dailyChallenges.userId, userId)))
        .limit(1);

      if (!challenge || challenge.completed) return { ok: false };

      const [q] = await ctx.db
        .select({ gabarito: questions.gabarito })
        .from(questions)
        .where(eq(questions.id, input.questionId))
        .limit(1);

      const newAnswers = { ...(challenge.answers as Record<string, string>), [input.questionId]: input.selectedAnswer.toUpperCase() };
      const allAnswered = challenge.questionIds.every((id: number) => newAnswers[id]);

      // Se todas as questões foram respondidas, busca os gabaritos de todas elas
      // para calcular correctCount correto (não só o da questão atual).
      let correctCount: number | undefined;
      if (allAnswered) {
        const allQs = await ctx.db
          .select({ id: questions.id, gabarito: questions.gabarito })
          .from(questions)
          .where(inArray(questions.id, challenge.questionIds));
        correctCount = allQs.filter((qq) => newAnswers[qq.id] === qq.gabarito).length;
      }

      await ctx.db
        .update(dailyChallenges)
        .set({
          answers: newAnswers,
          ...(allAnswered ? {
            completed: true,
            completedAt: new Date(),
            correctCount,
          } : {}),
        })
        .where(eq(dailyChallenges.id, input.challengeId));

      return { ok: true, isCorrect: input.selectedAnswer.toUpperCase() === q?.gabarito };
    }),

  finishDailyChallenge: protectedProcedure
    .input(z.object({
      challengeId: z.number().int().positive(),
      // Opcional p/ compat com clientes antigos. Cap em 2h (evita aba aberta).
      totalTimeSeconds: z.number().int().min(0).max(7200).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [challenge] = await ctx.db
        .select()
        .from(dailyChallenges)
        .where(and(eq(dailyChallenges.id, input.challengeId), eq(dailyChallenges.userId, userId)))
        .limit(1);

      if (!challenge) return { ok: false };

      const answers = challenge.answers as Record<string, string>;

      // Busca gabaritos
      const qs = await ctx.db
        .select({ id: questions.id, gabarito: questions.gabarito })
        .from(questions)
        .where(inArray(questions.id, challenge.questionIds));

      const correctCount = qs.filter((q) => answers[q.id] === q.gabarito).length;

      await ctx.db
        .update(dailyChallenges)
        .set({
          completed: true,
          correctCount,
          completedAt: new Date(),
          ...(input.totalTimeSeconds !== undefined ? { totalTimeSeconds: input.totalTimeSeconds } : {}),
        })
        .where(eq(dailyChallenges.id, input.challengeId));

      // Credita 15 XP pelo desafio diário
      await ctx.db.update(users).set({ xp: sql`xp + 15` }).where(eq(users.id, userId));

      return { ok: true, correctCount, total: challenge.questionIds.length };
    }),

  // ---------------------------------------------------------------------------
  // NOVO DESAFIO — força criação de novo desafio (permite repetir ilimitadamente)
  // ---------------------------------------------------------------------------
  newDailyChallenge: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Busca todos os IDs já usados pelo aluno para evitar repetição imediata
    const pastChallenges = await ctx.db
      .select({ questionIds: dailyChallenges.questionIds })
      .from(dailyChallenges)
      .where(eq(dailyChallenges.userId, userId));

    const usedIds = new Set<number>(pastChallenges.flatMap((c) => c.questionIds));

    const drawn = await ctx.db
      .select({
        id: questions.id,
        enunciado: questions.enunciado,
        url_imagem: questions.url_imagem,
        url_video: questions.url_video,
        alternativas: questions.alternativas,
        gabarito: questions.gabarito,
        comentario_resolucao: questions.comentario_resolucao,
        conteudo_principal: questions.conteudo_principal,
        nivel_dificuldade: questions.nivel_dificuldade,
      })
      .from(questions)
      .where(eq(questions.active, true))
      .orderBy(sql`RAND()`)
      .limit(100);

    const filtered = drawn.filter((q) => !usedIds.has(q.id)).slice(0, 3);
    const final = filtered.length >= 3 ? filtered : drawn.slice(0, 3);

    const newChallenge: NewDailyChallenge = {
      userId,
      challengeDate: today,
      questionIds: final.map((q) => q.id),
      answers: {},
      completed: false,
    };

    const [result] = await ctx.db.insert(dailyChallenges).values(newChallenge);

    return {
      challengeId: Number(result.insertId),
      date: today,
      completed: false,
      correctCount: null,
      answers: {},
      questions: final,
    };
  }),

  getDailyHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const rows = await ctx.db
      .select({
        id: dailyChallenges.id,
        challengeDate: dailyChallenges.challengeDate,
        completed: dailyChallenges.completed,
        correctCount: dailyChallenges.correctCount,
        completedAt: dailyChallenges.completedAt,
      })
      .from(dailyChallenges)
      .where(eq(dailyChallenges.userId, userId))
      .orderBy(desc(dailyChallenges.challengeDate))
      .limit(30);
    return rows;
  }),


  // ---------------------------------------------------------------------------
  // QUESTÕES ERRADAS — histórico de erros do aluno para revisão
  // Inclui erros de: simulados, treino livre e desafio diário
  // ---------------------------------------------------------------------------
  getWrongAnswers: protectedProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // ── Fonte 1: simulationAnswers (simulados + treino livre salvo) ──────────
      const simRows = await ctx.db
        .select({
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
          nivel_dificuldade: questions.nivel_dificuldade,
        })
        .from(simulationAnswers)
        .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
        .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
        .where(
          and(
            eq(simulations.userId, userId),
            eq(simulations.status, "completed"),
            eq(simulationAnswers.isCorrect, false),
          )
        )
        .orderBy(desc(simulationAnswers.answeredAt));

      // ── Fonte 2: desafio diário (erros em challenges completos) ──────────────
      const completedChallenges = await ctx.db
        .select()
        .from(dailyChallenges)
        .where(and(
          eq(dailyChallenges.userId, userId),
          eq(dailyChallenges.completed, true),
        ));

      type WrongRow = (typeof simRows)[number];
      let dailyRows: WrongRow[] = [];

      if (completedChallenges.length > 0) {
        // Coleta todos os itens respondidos nos desafios
        const dailyItems: Array<{
          questionId: number;
          selectedAnswer: string;
          challengeId: number;
          answeredAt: Date | null;
        }> = [];

        for (const ch of completedChallenges) {
          const answers = ch.answers as Record<string, string>;
          for (const [qIdStr, selected] of Object.entries(answers)) {
            dailyItems.push({
              questionId: parseInt(qIdStr),
              selectedAnswer: selected,
              challengeId: ch.id,
              answeredAt: ch.completedAt,
            });
          }
        }

        if (dailyItems.length > 0) {
          const uniqueQIds = [...new Set(dailyItems.map((w) => w.questionId))];
          const qDetails = await ctx.db
            .select({
              id: questions.id,
              enunciado: questions.enunciado,
              url_imagem: questions.url_imagem,
              alternativas: questions.alternativas,
              gabarito: questions.gabarito,
              comentario_resolucao: questions.comentario_resolucao,
              conteudo_principal: questions.conteudo_principal,
              nivel_dificuldade: questions.nivel_dificuldade,
            })
            .from(questions)
            .where(inArray(questions.id, uniqueQIds));

          const qMap = new Map(qDetails.map((q) => [q.id, q]));
          let syntheticId = -1;

          for (const item of dailyItems) {
            const q = qMap.get(item.questionId);
            if (!q) continue;
            if (item.selectedAnswer === q.gabarito) continue; // acerto, ignora

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
              nivel_dificuldade: q.nivel_dificuldade,
            });
          }
        }
      }

      // ── Merge e paginação em memória ─────────────────────────────────────────
      const allRows = [...simRows, ...dailyRows].sort((a, b) => {
        const da = a.answeredAt ? new Date(a.answeredAt as any).getTime() : 0;
        const db2 = b.answeredAt ? new Date(b.answeredAt as any).getTime() : 0;
        return db2 - da;
      });

      const total = allRows.length;
      const rows = allRows.slice(input.offset, input.offset + input.limit);

      return { rows, total };
    }),

  // ---------------------------------------------------------------------------
  // ABANDONA simulado em andamento
  // ---------------------------------------------------------------------------
  abandon: protectedProcedure
    .input(z.object({ simulationId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      await ctx.db
        .update(simulations)
        .set({ status: "abandoned" })
        .where(
          and(
            eq(simulations.id, input.simulationId),
            eq(simulations.userId, userId),
            eq(simulations.status, "in_progress")
          )
        );

      return { success: true };
    }),

  // ---------------------------------------------------------------------------
  // ATIVIDADE POR DIA — alimenta o mini-calendário do Dashboard
  // Retorna até 62 dias (2 meses) de atividade agrupada por data.
  // Dot verde  = questões certas  |  dot vermelho = questões erradas
  // ---------------------------------------------------------------------------
  getActivityCalendar: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 62);

    // ── Fonte 1: simulationAnswers por data de resposta (consistente com getStats) ─
    // Usa answeredAt (data de cada resposta individual), não completedAt do simulado.
    // Isso garante que questões respondidas hoje apareçam no calendário hoje,
    // mesmo que o simulado ainda não tenha sido finalizado.
    const answerRows = await ctx.db
      .select({
        date:    sql<string>`DATE(${simulationAnswers.answeredAt})`,
        correct: sql<number>`COALESCE(SUM(CASE WHEN ${simulationAnswers.isCorrect} = 1 THEN 1 ELSE 0 END), 0)`,
        total:   sql<number>`COUNT(*)`,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .where(
        and(
          eq(simulations.userId, userId),
          sql`${simulationAnswers.answeredAt} IS NOT NULL`,
          sql`${simulationAnswers.isCorrect} IS NOT NULL`,
          gte(simulationAnswers.answeredAt, cutoff),
        )
      )
      .groupBy(sql`DATE(${simulationAnswers.answeredAt})`);

    // ── Fonte 2: desafios diários (não passam por simulationAnswers) ──────────
    const chalRows = await ctx.db
      .select({
        date:    sql<string>`${dailyChallenges.challengeDate}`,
        correct: sql<number>`COALESCE(SUM(${dailyChallenges.correctCount}), 0)`,
        total:   sql<number>`COALESCE(SUM(JSON_LENGTH(${dailyChallenges.questionIds})), 0)`,
      })
      .from(dailyChallenges)
      .where(
        and(
          eq(dailyChallenges.userId, userId),
          eq(dailyChallenges.completed, true),
          gte(dailyChallenges.challengeDate, cutoff.toISOString().slice(0, 10)),
        )
      )
      .groupBy(dailyChallenges.challengeDate);

    // ── Merge por data ────────────────────────────────────────────────────────
    const map = new Map<string, { correct: number; wrong: number }>();

    for (const r of answerRows) {
      if (!r.date) continue;
      const prev = map.get(r.date) ?? { correct: 0, wrong: 0 };
      const c = Number(r.correct);
      const t = Number(r.total);
      map.set(r.date, { correct: prev.correct + c, wrong: prev.wrong + Math.max(0, t - c) });
    }
    for (const r of chalRows) {
      const key = typeof r.date === "string" ? r.date : new Date(r.date as any).toISOString().slice(0, 10);
      const prev = map.get(key) ?? { correct: 0, wrong: 0 };
      const c = Number(r.correct);
      const t = Number(r.total);
      map.set(key, { correct: prev.correct + c, wrong: prev.wrong + Math.max(0, t - c) });
    }

    return Array.from(map.entries()).map(([date, v]) => ({ date, ...v }));
  }),
});
