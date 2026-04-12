import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { simulationAnswers, questions, simulations } from "./schema";

// Frequência de cada tópico no ENEM — distribuição real do banco (360 questões)
const ENEM_WEIGHTS: Record<string, number> = {
  "Grandezas Proporcionais":     0.25,
  "Geometria Espacial":          0.11,
  "Funções":                     0.09,
  "Estatística":                 0.09,
  "Geometria Plana":             0.08,
  "Probabilidades":              0.06,
  "Aritmética":                  0.05,
  "Análise Combinatória":        0.04,
  "Médias":                      0.04,
  "Trigonometria":               0.03,
  "Noções de Lógica Matemática": 0.02,
  "Geometria Analítica":         0.02,
  "Logarítmos":                  0.02,
  "Conjuntos Numéricos":         0.02,
  "Progressão Aritmética":       0.02,
  "Progressão Geométrica":       0.02,
  "Equações":                    0.01,
  "Construções Geométricas":     0.01,
  "Inequações":                  0.01,
  "Matrizes":                    0.01,
  "Potenciação":                 0.01,
  "Sistemas Lineares":           0.01,
  "Conjuntos":                   0.005,
  "Equações polinomiais":        0.005,
  "Matemática Financeira":       0.005,
};

const ENEM_PRIORITY_ORDER = Object.keys(ENEM_WEIGHTS);
const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

export const agendaRouter = createTRPCRouter({

  getSchedule: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ── 1. Desempenho do aluno por tópico (via join simulation_answers → simulations) ──
    const rows = await ctx.db
      .select({
        topic:   questions.conteudo_principal,
        total:   sql<number>`COUNT(*)`,
        correct: sql<number>`SUM(CASE WHEN ${simulationAnswers.isCorrect} = 1 THEN 1 ELSE 0 END)`,
      })
      .from(simulationAnswers)
      .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
      .innerJoin(questions,   eq(simulationAnswers.questionId,   questions.id))
      .where(eq(simulations.userId, userId))
      .groupBy(questions.conteudo_principal);

    // Mapa: tópico → accuracy (0–1)
    const accuracy: Record<string, number> = {};
    for (const r of rows) {
      const total   = Number(r.total);
      const correct = Number(r.correct);
      if (total > 0) accuracy[r.topic] = correct / total;
    }

    // ── 2. Score de prioridade: peso_ENEM × (1 − accuracy) ─────────────────
    const scored = ENEM_PRIORITY_ORDER.map((topic) => {
      const weight  = ENEM_WEIGHTS[topic] ?? 0.005;
      const acc     = accuracy[topic] ?? 0;
      const score   = weight * (1 - acc);
      const hasData = topic in accuracy;

      let status: "sem_dados" | "fraco" | "regular" | "forte";
      if (!hasData)      status = "sem_dados";
      else if (acc < 0.4) status = "fraco";
      else if (acc < 0.7) status = "regular";
      else                status = "forte";

      return { topic, score, weight, accuracy: acc, hasData, status };
    });

    // Ordena por score desc; empate → peso ENEM desc
    scored.sort((a, b) => b.score - a.score || b.weight - a.weight);

    // ── 3. Distribui em janelas de 5 tópicos por semana ─────────────────────
    const now        = new Date();
    const startYear  = new Date(now.getFullYear(), 0, 1);
    const weekOfYear = Math.floor((now.getTime() - startYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const windowStart = (weekOfYear * 5) % Math.max(scored.length, 1);

    const weekTopics = Array.from({ length: 5 }, (_, i) =>
      scored[(windowStart + i) % scored.length]
    );

    // ── 4. Índice do dia atual (0=Seg … 4=Sex, null = fim de semana) ────────
    const todayDow         = now.getDay(); // 0=Dom … 6=Sáb
    const todayWeekdayIdx  = todayDow >= 1 && todayDow <= 5 ? todayDow - 1 : null;

    const schedule = weekTopics.map((item, i) => ({
      weekday:      WEEKDAYS[i],
      weekdayIdx:   i,
      isToday:      i === todayWeekdayIdx,
      topic:        item.topic,
      enemPct:      Math.round(item.weight * 100),
      userAccuracy: item.hasData ? Math.round(item.accuracy * 100) : null,
      status:       item.status,
    }));

    return {
      schedule,
      weekOf:          now.toISOString().slice(0, 10),
      practicedTopics: Object.keys(accuracy).length,
      totalTopics:     ENEM_PRIORITY_ORDER.length,
      allTopicsRanked: scored.map((s) => ({
        topic:        s.topic,
        enemPct:      Math.round(s.weight * 100),
        userAccuracy: s.hasData ? Math.round(s.accuracy * 100) : null,
        status:       s.status,
      })),
    };
  }),
});
