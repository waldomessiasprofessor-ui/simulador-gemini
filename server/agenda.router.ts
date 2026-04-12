import { eq, and, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { simulationAnswers, questions, dailyChallenges } from "./schema";

// Frequência de cada tópico no ENEM — baseado na distribuição real do banco de questões
// Fonte: print fornecido pelo professor (360 questões analisadas)
const ENEM_WEIGHTS: Record<string, number> = {
  "Grandezas Proporcionais":       0.25,
  "Geometria Espacial":            0.11,
  "Funções":                       0.09,
  "Estatística":                   0.09,
  "Geometria Plana":               0.08,
  "Probabilidades":                0.06,
  "Aritmética":                    0.05,
  "Análise Combinatória":          0.04,
  "Médias":                        0.04,
  "Trigonometria":                 0.03,
  "Noções de Lógica Matemática":   0.02,
  "Geometria Analítica":           0.02,
  "Logarítmos":                    0.02,
  "Conjuntos Numéricos":           0.02,
  "Progressão Aritmética":         0.02,
  "Progressão Geométrica":         0.02,
  "Equações":                      0.01,
  "Construções Geométricas":       0.01,
  "Inequações":                    0.01,
  "Matrizes":                      0.01,
  "Potenciação":                   0.01,
  "Sistemas Lineares":             0.01,
  "Conjuntos":                     0.005,
  "Equações polinomiais":          0.005,
  "Matemática Financeira":         0.005,
};

// Prioridade padrão (ordem ENEM) usada quando o aluno não tem histórico
const ENEM_PRIORITY_ORDER = Object.keys(ENEM_WEIGHTS);

// Nomes dos dias da semana (Seg–Sex)
const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

export const agendaRouter = createTRPCRouter({

  getSchedule: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ── 1. Busca desempenho do aluno por tópico (simulados + treino + desafios) ──
    const simStats = await ctx.db
      .select({
        topic: questions.conteudo_principal,
        total:   sql<number>`COUNT(*)`,
        correct: sql<number>`SUM(CASE WHEN ${simulationAnswers.isCorrect} = 1 THEN 1 ELSE 0 END)`,
      })
      .from(simulationAnswers)
      .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
      .where(eq(simulationAnswers.userId, userId))
      .groupBy(questions.conteudo_principal);

    // Mapa: tópico → accuracy (0–1)
    const accuracy: Record<string, number> = {};
    for (const row of simStats) {
      const total = Number(row.total);
      const correct = Number(row.correct);
      if (total > 0) accuracy[row.topic] = correct / total;
    }

    // ── 2. Calcula score de prioridade para cada tópico ──────────────────────
    // score = peso_ENEM × (1 − accuracy)
    // Tópico sem histórico → accuracy = 0 (prioridade máxima pelo peso ENEM)
    const scored = ENEM_PRIORITY_ORDER.map((topic) => {
      const weight = ENEM_WEIGHTS[topic] ?? 0.005;
      const acc    = accuracy[topic] ?? 0;
      const score  = weight * (1 - acc);
      const pct    = ENEM_WEIGHTS[topic] ?? 0;

      // Badge de desempenho
      let status: "sem_dados" | "fraco" | "regular" | "forte";
      if (!(topic in accuracy))      status = "sem_dados";
      else if (acc < 0.4)            status = "fraco";
      else if (acc < 0.7)            status = "regular";
      else                           status = "forte";

      return { topic, score, weight, accuracy: acc, pct, status, hasData: topic in accuracy };
    });

    // Ordena por score desc, depois por peso ENEM desc (desempate)
    scored.sort((a, b) => b.score - a.score || b.weight - a.weight);

    // ── 3. Distribui os top-25 em semanas de 5 tópicos (Seg–Sex) ────────────
    // Semana da ano (0-indexed) determina qual janela de 5 mostrar
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const weekOfYear = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const windowStart = (weekOfYear * 5) % Math.max(scored.length, 1);

    // Pega 5 tópicos a partir da janela, com wrap
    const weekTopics = Array.from({ length: 5 }, (_, i) =>
      scored[(windowStart + i) % scored.length]
    );

    // ── 4. Dia atual (0=Dom, 1=Seg … 5=Sex, 6=Sáb) ──────────────────────────
    const todayDow = now.getDay(); // 0=Sun … 6=Sat
    // Mapeia para índice Seg-Sex (0=Seg … 4=Sex), null se fim de semana
    const todayWeekdayIdx = todayDow >= 1 && todayDow <= 5 ? todayDow - 1 : null;

    const schedule = weekTopics.map((item, i) => ({
      weekday: WEEKDAYS[i],
      weekdayIdx: i,
      isToday: i === todayWeekdayIdx,
      topic: item.topic,
      enemPct: Math.round(item.pct * 100),
      userAccuracy: item.hasData ? Math.round(item.accuracy * 100) : null,
      status: item.status,
      priorityScore: Math.round(item.score * 1000) / 1000,
    }));

    // ── 5. Resumo geral: quantos tópicos o aluno já praticou ─────────────────
    const totalTopics = ENEM_PRIORITY_ORDER.length;
    const practicedTopics = Object.keys(accuracy).length;

    return {
      schedule,
      weekOf: now.toISOString().slice(0, 10),
      practicedTopics,
      totalTopics,
      allTopicsRanked: scored.map((s) => ({
        topic: s.topic,
        enemPct: Math.round(s.pct * 100),
        userAccuracy: s.hasData ? Math.round(s.accuracy * 100) : null,
        status: s.status,
      })),
    };
  }),
});
