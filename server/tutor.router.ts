import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "./trpc";
import { questions, simulations, simulationAnswers, dailyChallenges } from "./schema";
import { resolveArea, MACRO_AREAS } from "./macro-areas";

const SYSTEM_PROMPT = `Você é o Tutor Vetor, um assistente especializado em matemática para o ENEM e vestibulares brasileiros (UNICAMP, FUVEST, UNESP).

Regras invioláveis:
- Responda SEMPRE em português do Brasil
- Use LaTeX para toda expressão matemática: inline com $...$ e bloco com $$...$$
  Exemplos: "a fórmula é $x = \\frac{-b}{2a}$" e blocos isolados com $$\\int_0^1 x^2\\,dx = \\frac{1}{3}$$
- Seja didático, paciente e encorajador — o aluno pode estar com dificuldade
- Explique passo a passo; não entregue a resposta final de imediato quando o aluno estiver tentando resolver
- Se o aluno errar, oriente o raciocínio com perguntas guiadas antes de corrigir
- Use exemplos concretos e analogias simples quando introduzir um conceito novo
- Respostas objetivas: completas, mas sem enrolação
- Foque nos conteúdos do ENEM: funções (1º, 2º grau, exponencial, logarítmica), geometria plana e espacial, trigonometria, probabilidade, estatística, progressões, matemática financeira, análise combinatória
- Se perguntado sobre algo fora de matemática/vestibular, redirecione com leveza

Tom: próximo, motivador, como um professor particular que acredita no aluno.`;

// ── Helper: chama a API GROQ ──────────────────────────────────────────────────

async function callGroq(
  apiKey: string,
  systemContent: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  maxTokens = 1024,
): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature: 0.65,
    }),
  });

  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Erro ao contactar o tutor (${res.status}). Tente novamente.`,
    });
  }

  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Helper: coleta dados do aluno para diagnóstico ────────────────────────────

async function collectStudentData(ctx: any) {
  const userId = ctx.user.id;

  // 1. Últimos 10 simulados concluídos
  const recentSims = await ctx.db
    .select({
      stage: simulations.stage,
      score: simulations.score,
      correctCount: simulations.correctCount,
      totalQuestions: simulations.totalQuestions,
      totalTimeSeconds: simulations.totalTimeSeconds,
      completedAt: simulations.completedAt,
    })
    .from(simulations)
    .where(and(eq(simulations.userId, userId), eq(simulations.status, "completed"), sql`${simulations.stage} > 0`))
    .orderBy(desc(simulations.completedAt))
    .limit(10);

  // 2. Desempenho por área macro (simulationAnswers)
  const simRows = await ctx.db
    .select({
      conteudo: questions.conteudo_principal,
      tags: questions.tags,
      isCorrect: simulationAnswers.isCorrect,
    })
    .from(simulationAnswers)
    .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
    .innerJoin(questions, eq(simulationAnswers.questionId, questions.id))
    .where(and(
      eq(simulations.userId, userId),
      sql`${simulationAnswers.isCorrect} IS NOT NULL`,
    ));

  type Agg = { total: number; correct: number };
  const areaMap = new Map<string, Agg>();

  for (const r of simRows) {
    const area = resolveArea(r.conteudo, r.tags);
    if (!area) continue;
    const e = areaMap.get(area) ?? { total: 0, correct: 0 };
    e.total++;
    if (r.isCorrect) e.correct++;
    areaMap.set(area, e);
  }

  // 3. Desafios diários concluídos
  const challenges = await ctx.db
    .select({
      answers: dailyChallenges.answers,
      questionIds: dailyChallenges.questionIds,
      correctCount: dailyChallenges.correctCount,
      completed: dailyChallenges.completed,
      challengeDate: dailyChallenges.challengeDate,
    })
    .from(dailyChallenges)
    .where(and(eq(dailyChallenges.userId, userId), eq(dailyChallenges.completed, true)))
    .orderBy(desc(dailyChallenges.challengeDate))
    .limit(30);

  // Acrescenta área dos desafios no mapa
  if (challenges.length > 0) {
    const allQIds = [...new Set(challenges.flatMap((c: any) => c.questionIds as number[]))];
    if (allQIds.length > 0) {
      const qDetails = await ctx.db
        .select({ id: questions.id, conteudo: questions.conteudo_principal, tags: questions.tags, gabarito: questions.gabarito })
        .from(questions)
        .where(inArray(questions.id, allQIds));
      const qMap = new Map(qDetails.map((q: any) => [q.id, q]));
      for (const ch of challenges) {
        const answers = ch.answers as Record<string, string>;
        for (const [qIdStr, selected] of Object.entries(answers)) {
          const q = qMap.get(parseInt(qIdStr)) as any;
          if (!q) continue;
          const area = resolveArea(q.conteudo, q.tags);
          if (!area) continue;
          const hit = selected === q.gabarito;
          const e = areaMap.get(area) ?? { total: 0, correct: 0 };
          e.total++;
          if (hit) e.correct++;
          areaMap.set(area, e);
        }
      }
    }
  }

  // 4. Totais gerais
  const allAnswered = await ctx.db
    .select({ isCorrect: simulationAnswers.isCorrect })
    .from(simulationAnswers)
    .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
    .where(and(eq(simulations.userId, userId), sql`${simulationAnswers.isCorrect} IS NOT NULL`));

  const totalAnswered = allAnswered.length;
  const totalCorrect = allAnswered.filter((a: any) => a.isCorrect).length;

  // 5. Streak de dias consecutivos com atividade
  const answered = await ctx.db
    .select({ answeredAt: simulationAnswers.answeredAt })
    .from(simulationAnswers)
    .innerJoin(simulations, eq(simulationAnswers.simulationId, simulations.id))
    .where(and(eq(simulations.userId, userId), sql`${simulationAnswers.answeredAt} IS NOT NULL`));

  function dayKey(d: Date | string | null): string {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d + "T12:00:00") : new Date(d);
    return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
  }
  const activeDays = new Set(answered.map((a: any) => dayKey(a.answeredAt)));

  const now = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (activeDays.has(dayKey(d))) streak++;
    else if (i > 0) break;
  }

  return {
    studentName: ctx.user.name as string,
    recentSims,
    areaMap,
    totalAnswered,
    totalCorrect,
    challengesCompleted: challenges.length,
    streak,
  };
}

// ── Formata dados do aluno como texto para o prompt de diagnóstico ────────────

function buildDiagnosticContext(data: Awaited<ReturnType<typeof collectStudentData>>): string {
  const {
    studentName,
    recentSims,
    areaMap,
    totalAnswered,
    totalCorrect,
    challengesCompleted,
    streak,
  } = data;

  const globalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Áreas por desempenho
  const areaLines = MACRO_AREAS.map((area) => {
    const v = areaMap.get(area);
    if (!v || v.total === 0) return `  - ${area}: sem dados`;
    const pct = Math.round((v.correct / v.total) * 100);
    const label = pct >= 75 ? "✅ bom" : pct >= 50 ? "⚠️ regular" : "❌ fraco";
    return `  - ${area}: ${pct}% de acerto (${v.correct}/${v.total} questões) ${label}`;
  }).join("\n");

  // Últimos simulados
  const simLines = recentSims.length === 0
    ? "  Nenhum simulado realizado ainda."
    : recentSims.slice(0, 5).map((s: any, i: number) => {
        const pct = s.totalQuestions > 0 ? Math.round(((s.correctCount ?? 0) / s.totalQuestions) * 100) : 0;
        const score = s.score ? ` (nota TRI: ${Math.round(s.score)})` : "";
        const date = s.completedAt ? new Date(s.completedAt).toLocaleDateString("pt-BR") : "";
        return `  ${i + 1}. Etapa ${s.stage} — ${s.correctCount ?? 0}/${s.totalQuestions} acertos (${pct}%)${score} em ${date}`;
      }).join("\n");

  return `DADOS DO ALUNO: ${studentName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VISÃO GERAL
  Total de questões respondidas: ${totalAnswered}
  Aproveitamento geral: ${globalAccuracy}%
  Desafios diários concluídos: ${challengesCompleted}
  Sequência atual de dias estudando: ${streak} dia(s)

📅 ÚLTIMOS SIMULADOS
${simLines}

🎯 DESEMPENHO POR ÁREA (simulados + desafios diários)
${areaLines}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// ── Router ────────────────────────────────────────────────────────────────────

export const tutorRouter = createTRPCRouter({
  // ── Chat livre ──────────────────────────────────────────────────────────────
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().max(4000),
          })
        ).max(30),
        context: z.string().max(3000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tutor não configurado. Contate o administrador." });

      const systemContent = input.context
        ? `${SYSTEM_PROMPT}\n\n---\nO aluno está olhando para a seguinte questão:\n${input.context}\n---`
        : SYSTEM_PROMPT;

      const content = await callGroq(apiKey, systemContent, input.messages);
      return { content };
    }),

  // ── Diagnóstico personalizado ────────────────────────────────────────────────
  diagnose: protectedProcedure.mutation(async ({ ctx }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Tutor não configurado. Contate o administrador." });

    const data = await collectStudentData(ctx);
    const dataContext = buildDiagnosticContext(data);

    const systemContent = `${SYSTEM_PROMPT}

Você recebeu os dados de desempenho do aluno abaixo. Com base EXCLUSIVAMENTE nesses dados reais, elabore um diagnóstico personalizado estruturado da seguinte forma:

1. **Resumo geral** — 2-3 frases avaliando o desempenho global (questões respondidas, aproveitamento, regularidade de estudo)
2. **Pontos fortes** — liste as áreas com ≥ 70% de acerto e elogie o progresso
3. **Pontos de atenção** — liste as áreas com < 50% de acerto (ou sem dados) e explique por que merecem atenção no ENEM
4. **Plano de ação prático** — 3 recomendações concretas e priorizadas para as próximas semanas
5. **Mensagem motivacional** — 1-2 frases encorajadoras personalizadas para ${data.studentName}

Use emojis moderadamente para tornar o texto agradável. Use LaTeX para qualquer expressão matemática que mencionar.
Se o aluno tiver poucos dados (< 20 questões), adapte o diagnóstico para incentivar o início dos estudos.`;

    const content = await callGroq(
      apiKey,
      systemContent,
      [{ role: "user", content: dataContext }],
      1500,
    );

    return { content, studentData: dataContext };
  }),
});
