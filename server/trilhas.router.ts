import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { trilhaVideos, trilhaProgress, trilhaDefinitions } from "./schema";

// Normalização simples: aceita string vazia para "trilha inteira".
const slugSchema = z.string().min(1).max(100);
const licaoSlugSchema = z.string().max(100).default("");
const urlSchema = z
  .string()
  .trim()
  .url("URL inválida")
  .max(512);

export const trilhasRouter = createTRPCRouter({
  // ── Vídeos de lições (acesso público restrito ao dono) ────────────────────

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

  getAllProgress: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(trilhaProgress)
      .where(eq(trilhaProgress.userId, ctx.user.id));
  }),

  saveProgress: protectedProcedure
    .input(z.object({
      trilhaSlug:   z.string().min(1).max(100),
      licaoSlug:    z.string().min(1).max(100),
      lastScorePct: z.number().int().min(0).max(100),
      totalTimeSec: z.number().int().min(0),
      finishedAt:   z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const finishedDate = new Date(input.finishedAt);
      await ctx.db.execute(sql`
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

  // ── Definições de conteúdo das trilhas ───────────────────────────────────
  // O admin edita as trilhas nesta tela; o conteúdo fica no banco e tem
  // prioridade sobre os arquivos TypeScript estáticos em src/trilhas/*.ts.

  /** Lista os slugs + metadados de todas as definições salvas (sem contentJson). */
  listDefinitions: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id:        trilhaDefinitions.id,
        slug:      trilhaDefinitions.slug,
        titulo:    trilhaDefinitions.titulo,
        area:      trilhaDefinitions.area,
        updatedAt: trilhaDefinitions.updatedAt,
      })
      .from(trilhaDefinitions);
  }),

  /** Retorna a definição completa (incluindo contentJson) de uma trilha. */
  getDefinition: protectedProcedure
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(trilhaDefinitions)
        .where(eq(trilhaDefinitions.slug, input.slug))
        .limit(1);
      return row ?? null;
    }),

  /** Upsert da definição completa — admin only. */
  saveDefinition: adminProcedure
    .input(
      z.object({
        slug:        slugSchema,
        titulo:      z.string().min(1).max(255),
        area:        z.string().min(1).max(255),
        descricao:   z.string().max(4000).default(""),
        contentJson: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Valida JSON antes de persistir
      try { JSON.parse(input.contentJson); } catch {
        throw new Error("contentJson inválido");
      }
      await ctx.db.execute(sql`
        INSERT INTO trilha_definitions (slug, titulo, area, descricao, content_json)
        VALUES (${input.slug}, ${input.titulo}, ${input.area}, ${input.descricao}, ${input.contentJson})
        ON DUPLICATE KEY UPDATE
          titulo       = VALUES(titulo),
          area         = VALUES(area),
          descricao    = VALUES(descricao),
          content_json = VALUES(content_json),
          updated_at   = NOW()
      `);
      return { ok: true };
    }),

  /** Remove a definição do banco (trilha volta a usar o arquivo TS estático). */
  deleteDefinition: adminProcedure
    .input(z.object({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(trilhaDefinitions)
        .where(eq(trilhaDefinitions.slug, input.slug));
      return { ok: true };
    }),
});
