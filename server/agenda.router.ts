import { eq, sql, and } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { simulationAnswers, questions, simulations, studySchedule } from "./schema";

// Frequência de cada tópico no ENEM — distribuição real do banco (360 questões)
export const ENEM_TOPICS: { topic: string; weight: number }[] = [
  { topic: "Grandezas Proporcionais",     weight: 0.25 },
  { topic: "Geometria Espacial",          weight: 0.11 },
  { topic: "Funções",                     weight: 0.09 },
  { topic: "Estatística",                 weight: 0.09 },
  { topic: "Geometria Plana",             weight: 0.08 },
  { topic: "Probabilidades",              weight: 0.06 },
  { topic: "Aritmética",                  weight: 0.05 },
  { topic: "Análise Combinatória",        weight: 0.04 },
  { topic: "Médias",                      weight: 0.04 },
  { topic: "Trigonometria",               weight: 0.03 },
  { topic: "Noções de Lógica Matemática", weight: 0.02 },
  { topic: "Geometria Analítica",         weight: 0.02 },
  { topic: "Logarítmos",                  weight: 0.02 },
  { topic: "Conjuntos Numéricos",         weight: 0.02 },
  { topic: "Progressão Aritmética",       weight: 0.02 },
  { topic: "Progressão Geométrica",       weight: 0.02 },
  { topic: "Equações",                    weight: 0.01 },
  { topic: "Construções Geométricas",     weight: 0.01 },
  { topic: "Inequações",                  weight: 0.01 },
  { topic: "Matrizes",                    weight: 0.01 },
  { topic: "Potenciação",                 weight: 0.01 },
  { topic: "Sistemas Lineares",           weight: 0.01 },
  { topic: "Conjuntos",                   weight: 0.005 },
  { topic: "Equações polinomiais",        weight: 0.005 },
  { topic: "Matemática Financeira",       weight: 0.005 },
];

// Compatibilidade: dados antigos podem ser string simples, novos são JSON array
function parseTopics(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return raw ? [raw] : [];
  }
}

export const agendaRouter = createTRPCRouter({

  // ── Cronograma salvo pelo aluno ───────────────────────────────────────────

  // Helpers para parse/stringify de topics (suporta legado string simples)
  getMySchedule: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(studySchedule)
      .where(eq(studySchedule.userId, ctx.user.id))
      .orderBy(studySchedule.dayOfWeek, studySchedule.startTime);

    return rows.map((r) => ({
      ...r,
      topics: parseTopics(r.topic),
    }));
  }),

  addSlot: protectedProcedure
    .input(z.object({
      dayOfWeek: z.number().int().min(1).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime:   z.string().regex(/^\d{2}:\d{2}$/),
      topics:    z.array(z.string().min(1).max(100)).min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(studySchedule).values({
        userId:    ctx.user.id,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime:   input.endTime,
        topic:     JSON.stringify(input.topics),
      });
      return { success: true };
    }),

  removeSlot: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(studySchedule).where(
        and(eq(studySchedule.id, input.id), eq(studySchedule.userId, ctx.user.id))
      );
      return { success: true };
    }),

  // ── Desempenho por tópico (para sugestões) ───────────────────────────────

  getTopicStats: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        topic:   questions.conteudo_principal,
        total:   sql<number>`COUNT(*)`,
        correct: sql<number>`SUM(CASE WHEN ${simulationAnswers.isCorrect} = 1 THEN 1 ELSE 0 END)`,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .innerJoin(questions,   eq(simulationAnswers.questionId,   questions.id))
      .where(eq(simulations.userId, ctx.user.id))
      .groupBy(questions.conteudo_principal);

    const accuracy: Record<string, number> = {};
    for (const r of rows) {
      const total = Number(r.total);
      if (total > 0) accuracy[r.topic] = Number(r.correct) / total;
    }

    return ENEM_TOPICS.map((t) => {
      const acc     = accuracy[t.topic] ?? null;
      const hasData = t.topic in accuracy;
      let status: "sem_dados" | "fraco" | "regular" | "forte" =
        !hasData ? "sem_dados" : acc! < 0.4 ? "fraco" : acc! < 0.7 ? "regular" : "forte";
      return {
        topic:        t.topic,
        enemPct:      Math.round(t.weight * 100),
        userAccuracy: hasData ? Math.round(acc! * 100) : null,
        status,
      };
    });
  }),
});
