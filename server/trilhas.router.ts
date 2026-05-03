import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { trilhaVideos, trilhaProgress } from "./schema";

// Normalização simples: aceita string vazia para "trilha inteira".
const slugSchema = z.string().min(1).max(100);
const licaoSlugSchema = z.string().max(100).default("");
const urlSchema = z
  .string()
  .trim()
  .url("URL inválida")
  .max(512);

export const trilhasRouter = createTRPCRouter({
  // Buscar URL de uma trilha/lição específica (retorna null se não houver).
  // Usado pela tela Trilha.tsx.
  get: protectedProcedure
    .input(z.object({ trilhaSlug: slugSchema, licaoSlug: licaoSlugSchema }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(trilhaVideos)
        .where(
          and(
            eq(trilhaVideos.trilhaSlug, input.trilhaSlug),
            eq(trilhaVideos.licaoSlug, input.licaoSlug),
          ),
        )
        .limit(1);
      return row ?? null;
    }),

  // Admin: lista todos os vídeos cadastrados (para a tela de administração).
  listAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(trilhaVideos);
  }),

  // Admin: upsert — cria se não existe, atualiza se já existe.
  upsert: adminProcedure
    .input(
      z.object({
        trilhaSlug: slugSchema,
        licaoSlug: licaoSlugSchema,
        urlYoutube: urlSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(trilhaVideos)
        .where(
          and(
            eq(trilhaVideos.trilhaSlug, input.trilhaSlug),
            eq(trilhaVideos.licaoSlug, input.licaoSlug),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        await ctx.db
          .update(trilhaVideos)
          .set({ urlYoutube: input.urlYoutube })
          .where(eq(trilhaVideos.id, existing[0].id));
        return { id: existing[0].id, success: true, updated: true };
      }

      const [result] = await ctx.db.insert(trilhaVideos).values(input);
      return { id: Number(result.insertId), success: true, updated: false };
    }),

  // Admin: remover vídeo
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(trilhaVideos).where(eq(trilhaVideos.id, input.id));
      return { success: true };
    }),

  // ── Progresso de trilha (aluno) ───────────────────────────────────────────

  // Retorna todas as linhas de progresso do usuário logado.
  // Usado por TrilhaIndex (para exibir checkmarks) e por Dashboard (merge com
  // dados de performance).
  getAllProgress: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(trilhaProgress)
      .where(eq(trilhaProgress.userId, ctx.user.id));
  }),

  // Upsert: salva (ou atualiza) o resultado de uma lição após o aluno
  // terminar os exercícios. Mantém o melhor score se o aluno refizer.
  saveProgress: protectedProcedure
    .input(z.object({
      trilhaSlug:   z.string().min(1).max(100),
      licaoSlug:    z.string().min(1).max(100),
      lastScorePct: z.number().int().min(0).max(100),
      totalTimeSec: z.number().int().min(0),
      finishedAt:   z.number(), // timestamp ms
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const finishedDate = new Date(input.finishedAt);

      // Tenta atualizar primeiro (mais eficiente que SELECT + INSERT)
      const [result] = await ctx.db.execute(sql`
        INSERT INTO trilha_progress
          (user_id, trilha_slug, licao_slug, finished_at, last_score_pct, total_time_sec)
        VALUES
          (${userId}, ${input.trilhaSlug}, ${input.licaoSlug},
           ${finishedDate}, ${input.lastScorePct}, ${input.totalTimeSec})
        ON DUPLICATE KEY UPDATE
          finished_at    = VALUES(finished_at),
          last_score_pct = GREATEST(COALESCE(last_score_pct, 0), VALUES(last_score_pct)),
          total_time_sec = total_time_sec + VALUES(total_time_sec),
          updated_at     = NOW()
      `);
      return { ok: true };
    }),

  // Marca a leitura de conteúdo como concluída para uma lição.
  saveLeitura: protectedProcedure
    .input(z.object({
      trilhaSlug: z.string().min(1).max(100),
      licaoSlug:  z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await ctx.db.execute(sql`
        INSERT INTO trilha_progress
          (user_id, trilha_slug, licao_slug, leitura_concluida, total_time_sec)
        VALUES
          (${userId}, ${input.trilhaSlug}, ${input.licaoSlug}, 1, 0)
        ON DUPLICATE KEY UPDATE
          leitura_concluida = 1,
          updated_at        = NOW()
      `);
      return { ok: true };
    }),
});
