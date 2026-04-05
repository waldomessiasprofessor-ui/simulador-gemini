import { z } from "zod";
import { eq, and, sql, asc, desc, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { questions, simulationAnswers } from "./schema";
import type { NewQuestion } from "./schema";
import Anthropic from "@anthropic-ai/sdk";

const NivelDificuldadeEnum = z.enum(["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"]);

const QuestionBaseSchema = z.object({
  fonte: z.string().max(50).default("ENEM"),
  ano: z.number().int().min(2000).max(2100).optional(),
  conteudo_principal: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  nivel_dificuldade: NivelDificuldadeEnum.default("Média"),
  param_a: z.number().min(0.1).max(4.0).default(1.0),
  param_b: z.number().min(-4.0).max(4.0).default(0.0),
  param_c: z.number().min(0.0).max(0.5).default(0.2),
  enunciado: z.string().min(5),
  url_imagem: z.string().url().nullable().optional(),
  alternativas: z.record(z.string().min(1).max(5), z.any()),
  gabarito: z.string().length(1),
  comentario_resolucao: z.string().optional(),
});

export const questionsRouter = createTRPCRouter({

  list: protectedProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
      conteudo: z.string().optional(),
      fonte: z.string().optional(),
      nivel_dificuldade: NivelDificuldadeEnum.optional(),
      activeOnly: z.boolean().default(true),
      orderBy: z.enum(["id", "conteudo_principal", "nivel_dificuldade", "createdAt"]).default("conteudo_principal"),
      orderDir: z.enum(["asc", "desc"]).default("asc"),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, activeOnly, orderBy, orderDir } = input;
      const offset = (page - 1) * pageSize;

      const filters: any[] = [];
      if (activeOnly) filters.push(eq(questions.active, true));
      if (input.conteudo) filters.push(sql`${questions.conteudo_principal} LIKE ${'%' + input.conteudo + '%'}`);
      if (input.fonte) filters.push(eq(questions.fonte, input.fonte));
      if (input.nivel_dificuldade) filters.push(eq(questions.nivel_dificuldade, input.nivel_dificuldade));

      const where = filters.length > 0 ? and(...filters) : undefined;
      const orderColumn = orderBy === "conteudo_principal" ? questions.conteudo_principal
        : orderBy === "nivel_dificuldade" ? questions.nivel_dificuldade
        : orderBy === "createdAt" ? questions.createdAt
        : questions.id;
      const orderFn = orderDir === "asc" ? asc : desc;

      const [rows, [{ count }]] = await Promise.all([
        ctx.db.select().from(questions).where(where).orderBy(orderFn(orderColumn)).limit(pageSize).offset(offset),
        ctx.db.select({ count: sql<number>`COUNT(*)` }).from(questions).where(where),
      ]);

      return {
        questions: rows,
        pagination: { total: Number(count), page, pageSize, totalPages: Math.ceil(Number(count) / pageSize) },
      };
    }),

  getByIdAdmin: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });
      return q;
    }),

  create: adminProcedure
    .input(QuestionBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(questions).values({
        ...input,
        gabarito: input.gabarito.toUpperCase(),
        url_imagem: input.url_imagem ?? null,
        active: true,
      } as NewQuestion);
      return { id: Number(result.insertId), success: true };
    }),

  update: adminProcedure
    .input(QuestionBaseSchema.partial().extend({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updateData: Partial<NewQuestion> = { ...data } as any;
      if (data.gabarito) updateData.gabarito = data.gabarito.toUpperCase();
      if (data.url_imagem !== undefined) updateData.url_imagem = data.url_imagem ?? null;
      await ctx.db.update(questions).set(updateData).where(eq(questions.id, id));
      return { success: true };
    }),

  toggleActive: adminProcedure
    .input(z.object({ id: z.number().int().positive(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(questions).set({ active: input.active }).where(eq(questions.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(simulationAnswers).where(eq(simulationAnswers.questionId, input.id));
      await ctx.db.delete(questions).where(eq(questions.id, input.id));
      return { success: true };
    }),

  deleteAll: adminProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.delete(simulationAnswers);
      await ctx.db.delete(questions);
      return { success: true };
    }),

  // ─── Auditoria com Gemini ──────────────────────────────────────────────────

  auditQuestion: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "GEMINI_API_KEY não configurada no servidor. Adicione a variável no Railway." });

      const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });

      const alts = Object.entries(q.alternativas as Record<string, any>)
        .sort()
        .map(([k, v]) => `${k}) ${typeof v === "object" ? v.text ?? "" : v}`)
        .join("\n");

      const TAGS_VALIDAS = [
        "Análise Combinatória", "Áreas de Figuras Planas", "Conversão de Unidades",
        "Equações e Inequações", "Escala", "Estatística",
        "Função Composta", "Função do Primeiro Grau", "Função Exponencial", "Função Logarítmica", "Função Quadrática",
        "Funções de 1º e 2º Grau", "Geometria Espacial", "Geometria Plana",
        "Leitura de Gráficos e Tabelas", "Logaritmos", "Matemática Financeira",
        "Medidas de Tendência Central", "Noções de Lógica Matemática", "Operações Básicas",
        "Porcentagem", "Probabilidade", "Progressão Aritmética", "Progressão Geométrica",
        "Razão, Proporção e Regra de Três", "Sequências", "Trigonometria",
        "Visualização Espacial/Projeção Ortogonal",
      ];

      const tagsAtuais = Array.isArray(q.tags) && q.tags.length > 0
        ? (q.tags as string[]).join(", ")
        : "Nenhuma tag definida";

      const systemInstruction = `Você é um especialista em elaboração de questões para o ENEM e vestibulares brasileiros.

REGRAS ABSOLUTAS DE FORMATAÇÃO — nunca as ignore:
1. Responda SEMPRE em português do Brasil. Nunca em inglês.
2. Toda expressão matemática DEVE estar em LaTeX com delimitadores $ ou $$.
   - Inline: $P = \\frac{1}{2}$, $x^2 + 3x - 4 = 0$, $\\frac{3}{4}$
   - Bloco:  $$P(A) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}$$
3. PROIBIDO escrever fórmulas em texto puro: nunca "1/2", "x^2", "(1/2)^3" — sempre dentro de $.
4. PROIBIDO usar crases, backticks ou marcação markdown (**, *, _) nos campos de texto.
5. Moeda brasileira: escreva sempre "R$ 675,00" como texto simples — NUNCA use "R\\$" nem coloque valores monetários dentro de $ $.
6. O campo "comentario_resolucao_reescrito" deve ser uma resolução passo a passo completa em português, com expressões matemáticas em $...$ ou $$...$$, e texto corrido sem markdown.`;

      const prompt = `QUESTÃO #${q.id}
Fonte: ${q.fonte} · Ano: ${q.ano ?? "Não informado"}
Conteúdo declarado: ${q.conteudo_principal}
Tags atuais: ${tagsAtuais}
Dificuldade declarada: ${q.nivel_dificuldade}

ENUNCIADO:
${q.enunciado}

ALTERNATIVAS:
${alts}

GABARITO DECLARADO: ${q.gabarito}
RESOLUÇÃO EXISTENTE: ${q.comentario_resolucao ?? "Não informada"}

TAGS DISPONÍVEIS NO SISTEMA (use APENAS estas, escolha as que realmente se aplicam):
${TAGS_VALIDAS.join(", ")}

Responda em JSON puro (sem markdown, sem bloco de código) com exatamente esta estrutura:
{
  "disciplina": "Matemática" | "Física" | "Química" | "Outra",
  "disciplina_justificativa": "Breve explicação em português",
  "gabarito_correto": true | false,
  "gabarito_sugerido": "A" | "B" | "C" | "D" | "E" | null,
  "dificuldade_real": "Muito Baixa" | "Baixa" | "Média" | "Alta" | "Muito Alta",
  "dificuldade_compativel": true | false,
  "tags_sugeridas": ["array com as tags da lista acima que se aplicam"],
  "tags_atuais_corretas": true | false,
  "nota_qualidade": 1 a 10,
  "problemas": ["lista de problemas em português, ou array vazio se nenhum"],
  "sugestoes": ["lista de sugestões em português"],
  "parecer": "Texto de 2-3 frases em português com avaliação geral",
  "enunciado_reescrito": "Enunciado melhorado em português com LaTeX correto, ou null",
  "comentario_resolucao_reescrito": "Resolução passo a passo COMPLETA em português com LaTeX ($...$ e $$...$$) para TODA expressão matemática, ou null"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Erro na API Gemini: ${err}` });
      }

      const data = await res.json();

      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason && finishReason !== "STOP") {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Gemini encerrou com motivo: ${finishReason}. Tente novamente ou simplifique a questão.` });
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!rawText) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gemini não retornou conteúdo. Verifique a cota da API ou tente novamente." });
      }

      // Tenta parsear direto; se falhar (LaTeX com \frac, \cdot etc. não escapado),
      // corrige barras invertidas preservando os escapes válidos de JSON (\n \r \t \b \\).
      const parseJson = (text: string) => {
        try { return JSON.parse(text); } catch { return null; }
      };

      const fixLatexBackslashes = (raw: string) => {
        // Protege APENAS os escapes JSON que o Gemini realmente usa em texto corrido:
        //   \\ (barra literal), \" (aspas), \n (quebra de parágrafo)
        // Todo o resto (\t \b \f \r) em contexto matemático é LaTeX:
        //   \t → \times \theta \tau | \b → \beta \bar | \f → \frac | \r → \rho
        // Deixamos esses serem corrigidos para \\ + letra, que é o escape correto em JSON.
        return raw
          .replace(/\\\\/g, "\x00DS\x00")  // protege \\ (já correto)
          .replace(/\\"/g,   "\x00QT\x00") // protege \" (aspas escapadas)
          .replace(/\\n/g,   "\x00NL\x00") // protege \n (Gemini usa para parágrafos)
          .replace(/\\/g,    "\\\\")        // escapa todas as \ restantes (são LaTeX)
          .replace(/\x00DS\x00/g, "\\\\")  // restaura \\
          .replace(/\x00QT\x00/g, '\\"')   // restaura \"
          .replace(/\x00NL\x00/g, "\\n");  // restaura \n
      };

      const audit = parseJson(rawText) ?? parseJson(fixLatexBackslashes(rawText));
      if (!audit) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gemini retornou resposta que não pôde ser interpretada. Tente novamente." });
      }
      return { success: true, audit, questionId: q.id };
    }),

  // ─── Auditoria com Claude ──────────────────────────────────────────────────

  auditQuestionClaude: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ANTHROPIC_API_KEY não configurada no servidor. Adicione a variável no Railway." });

      const [q] = await ctx.db.select().from(questions).where(eq(questions.id, input.id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });

      const alts = Object.entries(q.alternativas as Record<string, any>)
        .sort()
        .map(([k, v]) => `${k}) ${typeof v === "object" ? v.text ?? "" : v}`)
        .join("\n");

      const TAGS_VALIDAS = [
        "Razão, Proporção e Regra de Três", "Porcentagem", "Escala", "Operações Básicas",
        "Conversão de Unidades", "Geometria Espacial", "Geometria Plana",
        "Visualização Espacial/Projeção Ortogonal", "Trigonometria", "Leitura de Gráficos e Tabelas",
        "Medidas de Tendência Central", "Estatística", "Probabilidade", "Funções de 1º e 2º Grau",
        "Função do Primeiro Grau", "Função Quadrática", "Função Exponencial", "Função Logarítmica",
        "Equações e Inequações", "Sequências", "Progressão Aritmética", "Progressão Geométrica",
        "Matemática Financeira", "Análise Combinatória", "Logaritmos",
        "Noções de Lógica Matemática", "Áreas de Figuras Planas",
      ];

      const tagsAtuais = Array.isArray(q.tags) && q.tags.length > 0
        ? (q.tags as string[]).join(", ")
        : "Nenhuma tag definida";

      const latexInstructions = `
REGRAS OBRIGATÓRIAS DE FORMATAÇÃO (siga sem exceção):
- Responda SEMPRE em português do Brasil.
- Use LaTeX para todas as expressões matemáticas.
- Fórmulas inline: $f(x)$, $T^2 - 4$, $P = \\frac{1}{2}$
- Fórmulas em bloco (equações centralizadas): $$V = T^2 - 4$$
- NUNCA use crases, backticks (\`) ou markdown para math. Apenas $ e $$.
- NUNCA escreva fórmulas em texto puro como "T^2-4" — sempre com $.
- Textos normais (parecer, problemas, sugestões) em português corrido, sem LaTeX desnecessário.`;

      const prompt = `Você é um especialista em elaboração de questões para o ENEM e vestibulares brasileiros. Analise a questão abaixo com rigor técnico e pedagógico.

${latexInstructions}

QUESTÃO #${q.id}
Fonte: ${q.fonte} · Ano: ${q.ano ?? "Não informado"}
Conteúdo declarado: ${q.conteudo_principal}
Tags atuais: ${tagsAtuais}
Dificuldade declarada: ${q.nivel_dificuldade}

ENUNCIADO:
${q.enunciado}

ALTERNATIVAS:
${alts}

GABARITO DECLARADO: ${q.gabarito}
RESOLUÇÃO: ${q.comentario_resolucao ?? "Não informada"}

TAGS DISPONÍVEIS NO SISTEMA (use APENAS estas, escolha as que realmente se aplicam):
${TAGS_VALIDAS.join(", ")}

Responda em JSON puro (sem markdown, sem bloco de código) com exatamente esta estrutura:
{
  "disciplina": "Matemática" | "Física" | "Química" | "Outra",
  "disciplina_justificativa": "Breve explicação em português",
  "gabarito_correto": true | false,
  "gabarito_sugerido": "A" | "B" | "C" | "D" | "E" | null,
  "dificuldade_real": "Muito Baixa" | "Baixa" | "Média" | "Alta" | "Muito Alta",
  "dificuldade_compativel": true | false,
  "tags_sugeridas": ["array com as tags da lista acima que se aplicam"],
  "tags_atuais_corretas": true | false,
  "nota_qualidade": 1 a 10,
  "problemas": ["lista de problemas em português, ou array vazio se nenhum"],
  "sugestoes": ["lista de sugestões em português"],
  "parecer": "Texto de 2-3 frases em português com avaliação geral",
  "enunciado_reescrito": "Enunciado melhorado em português com LaTeX correto, ou null",
  "comentario_resolucao_reescrito": "Resolução passo a passo em português com LaTeX correto ($...$ e $$...$$), ou null"
}`;

      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const rawText = message.content[0].type === "text" ? message.content[0].text : "";
      const clean = rawText.replace(/```json|```/g, "").trim();

      try {
        const audit = JSON.parse(clean);
        return { success: true, audit, questionId: q.id };
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Claude retornou uma resposta em formato inválido. Tente novamente." });
      }
    }),

  // ─── Aplica correções sugeridas pela auditoria ─────────────────────────────

  applyAuditFixes: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      gabarito: z.string().length(1).optional(),
      nivel_dificuldade: NivelDificuldadeEnum.optional(),
      enunciado: z.string().min(5).optional(),
      comentario_resolucao: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;

      const [q] = await ctx.db.select({ id: questions.id }).from(questions).where(eq(questions.id, id)).limit(1);
      if (!q) throw new TRPCError({ code: "NOT_FOUND", message: "Questão não encontrada." });

      const NIVEIS_VALIDOS = ["Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta"] as const;

      const updateData: Record<string, any> = {};
      if (fields.gabarito)           updateData.gabarito = fields.gabarito.toUpperCase();
      if (fields.nivel_dificuldade && NIVEIS_VALIDOS.includes(fields.nivel_dificuldade as any))
                                     updateData.nivel_dificuldade = fields.nivel_dificuldade;
      if (fields.enunciado)          updateData.enunciado = fields.enunciado;
      if (fields.comentario_resolucao !== undefined) updateData.comentario_resolucao = fields.comentario_resolucao;
      if (fields.tags !== undefined) updateData.tags = fields.tags;

      if (Object.keys(updateData).length === 0) return { success: true, applied: [] };

      await ctx.db.update(questions).set(updateData).where(eq(questions.id, id));
      return { success: true, applied: Object.keys(updateData) };
    }),
});
