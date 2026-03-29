import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { formulas } from "./schema";

export const formulasRouter = createTRPCRouter({

  // Listagem para todos os alunos — agrupa por secao
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(formulas)
      .where(eq(formulas.active, true))
      .orderBy(asc(formulas.secao), asc(formulas.ordem), asc(formulas.id));

    // Agrupa por secao
    const grouped: Record<string, { cor: string; formulas: typeof rows }> = {};
    for (const f of rows) {
      if (!grouped[f.secao]) grouped[f.secao] = { cor: f.cor, formulas: [] };
      grouped[f.secao].formulas.push(f);
    }
    return grouped;
  }),

  // Admin: listagem completa (incluindo inactivas)
  listAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(formulas).orderBy(asc(formulas.secao), asc(formulas.ordem));
  }),

  // Admin: criar fórmula
  create: adminProcedure
    .input(z.object({
      secao: z.string().min(1).max(100),
      cor: z.string().default("#01738d"),
      titulo: z.string().min(1).max(200),
      formula: z.string().min(1),
      descricao: z.string().min(1),
      ordem: z.number().int().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(formulas).values({ ...input, active: true });
      return { id: Number(result.insertId), success: true };
    }),

  // Admin: editar fórmula
  update: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      secao: z.string().min(1).max(100).optional(),
      cor: z.string().optional(),
      titulo: z.string().min(1).max(200).optional(),
      formula: z.string().min(1).optional(),
      descricao: z.string().min(1).optional(),
      ordem: z.number().int().optional(),
      active: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(formulas).set(data).where(eq(formulas.id, id));
      return { success: true };
    }),

  // Admin: excluir fórmula
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(formulas).where(eq(formulas.id, input.id));
      return { success: true };
    }),
});
