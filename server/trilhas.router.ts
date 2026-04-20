import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { trilhaVideos } from "./schema";

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
});
