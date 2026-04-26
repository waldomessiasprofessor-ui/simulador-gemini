import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "./trpc";

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

export const tutorRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().max(4000),
          })
        ).max(30),
        // Contexto opcional: enunciado da questão que o aluno está vendo
        context: z.string().max(3000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tutor não configurado. Contate o administrador.",
        });
      }

      const systemContent = input.context
        ? `${SYSTEM_PROMPT}\n\n---\nO aluno está olhando para a seguinte questão:\n${input.context}\n---`
        : SYSTEM_PROMPT;

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
            ...input.messages,
          ],
          max_tokens: 1024,
          temperature: 0.65,
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erro ao contactar o tutor (${res.status}). Tente novamente.`,
        });
      }

      const data = (await res.json()) as any;
      const content: string = data.choices?.[0]?.message?.content ?? "";
      return { content };
    }),
});
