import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "./trpc";
import { db } from "./db";
import { flashcardDecks, flashcards, flashcardProgress } from "./schema";
import { eq, and, asc, inArray, sql } from "drizzle-orm";

// =============================================================================
// SM-2 — algoritmo de repetição espaçada
// quality: 1 = não lembrei  |  3 = difícil  |  5 = fácil
// =============================================================================
function applySM2(
  quality: 1 | 3 | 5,
  prev: { easinessFactor: number; interval: number; repetitions: number }
): { easinessFactor: number; interval: number; repetitions: number; nextReview: Date } {
  let { easinessFactor, interval, repetitions } = prev;

  // Actualiza E-Factor (fórmula SM-2 original)
  easinessFactor = Math.max(
    1.3,
    easinessFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  if (quality < 3) {
    // Falhou — reinicia a sequência
    repetitions = 0;
    interval    = 1;
  } else {
    // Passou
    if (repetitions === 0)      interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { easinessFactor, interval, repetitions, nextReview };
}

// =============================================================================
// Router
// =============================================================================
export const flashcardsRouter = createTRPCRouter({

  // ── Decks (admin) ─────────────────────────────────────────────────────────

  listAllDecks: adminProcedure.query(async () => {
    const decks = await db.select().from(flashcardDecks).orderBy(asc(flashcardDecks.createdAt));
    // Conta cards por baralho
    const counts = await db
      .select({ deckId: flashcards.deckId, count: sql<number>`COUNT(*)` })
      .from(flashcards)
      .groupBy(flashcards.deckId);
    const countMap = new Map(counts.map(r => [r.deckId, Number(r.count)]));
    return decks.map(d => ({ ...d, cardCount: countMap.get(d.id) ?? 0 }));
  }),

  createDeck: adminProcedure
    .input(z.object({
      title:       z.string().min(1).max(255),
      description: z.string().optional(),
      color:       z.string().default("#009688"),
    }))
    .mutation(async ({ input }) => {
      const [res] = await db.insert(flashcardDecks).values({
        title: input.title, description: input.description ?? null, color: input.color,
      });
      return { id: (res as any).insertId as number };
    }),

  updateDeck: adminProcedure
    .input(z.object({
      id:          z.number(),
      title:       z.string().min(1).max(255).optional(),
      description: z.string().nullable().optional(),
      color:       z.string().optional(),
      active:      z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await db.update(flashcardDecks).set(rest).where(eq(flashcardDecks.id, id));
    }),

  deleteDeck: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(flashcardDecks).where(eq(flashcardDecks.id, input.id));
    }),

  // ── Cards (admin) ─────────────────────────────────────────────────────────

  listCards: adminProcedure
    .input(z.object({ deckId: z.number() }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(flashcards)
        .where(eq(flashcards.deckId, input.deckId))
        .orderBy(asc(flashcards.orderIndex), asc(flashcards.createdAt));
    }),

  createCard: adminProcedure
    .input(z.object({
      deckId:     z.number(),
      front:      z.string().min(1),
      back:       z.string().min(1),
      frontImage: z.string().url().nullable().optional(),
      backImage:  z.string().url().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      // Próximo índice de ordenação
      const last = await db
        .select({ idx: flashcards.orderIndex })
        .from(flashcards)
        .where(eq(flashcards.deckId, input.deckId))
        .orderBy(sql`order_index DESC`)
        .limit(1);
      const orderIndex = last.length > 0 ? last[0].idx + 1 : 0;

      const [res] = await db.insert(flashcards).values({
        deckId: input.deckId,
        front:  input.front,
        back:   input.back,
        frontImage: input.frontImage ?? null,
        backImage:  input.backImage  ?? null,
        orderIndex,
      });
      return { id: (res as any).insertId as number };
    }),

  updateCard: adminProcedure
    .input(z.object({
      id:         z.number(),
      front:      z.string().min(1).optional(),
      back:       z.string().min(1).optional(),
      frontImage: z.string().nullable().optional(),
      backImage:  z.string().nullable().optional(),
      active:     z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await db.update(flashcards).set(rest).where(eq(flashcards.id, id));
    }),

  deleteCard: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(flashcards).where(eq(flashcards.id, input.id));
    }),

  // ── Decks com progresso do aluno (tela de seleção) ────────────────────────

  listDecks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const now    = new Date();

    const decks = await db
      .select()
      .from(flashcardDecks)
      .where(eq(flashcardDecks.active, true))
      .orderBy(asc(flashcardDecks.createdAt));

    const result = await Promise.all(decks.map(async (deck) => {
      const cards = await db
        .select({ id: flashcards.id })
        .from(flashcards)
        .where(and(eq(flashcards.deckId, deck.id), eq(flashcards.active, true)));

      const totalCards = cards.length;
      if (totalCards === 0) return { ...deck, totalCards: 0, dueCount: 0, newCount: 0, masteredCount: 0, studyableCount: 0 };

      const cardIds = cards.map(c => c.id);
      const progRows = await db
        .select()
        .from(flashcardProgress)
        .where(and(eq(flashcardProgress.userId, userId), inArray(flashcardProgress.cardId, cardIds)));

      const progressMap = new Map(progRows.map(p => [p.cardId, p]));

      let dueCount = 0, newCount = 0, masteredCount = 0;
      for (const { id } of cards) {
        const p = progressMap.get(id);
        if (!p || !p.nextReview) newCount++;
        else if (p.nextReview <= now) dueCount++;
        else if (p.repetitions >= 3) masteredCount++;
      }

      return { ...deck, totalCards, dueCount, newCount, masteredCount, studyableCount: dueCount + newCount };
    }));

    return result;
  }),

  // ── Sessão de estudo ──────────────────────────────────────────────────────

  getStudySession: protectedProcedure
    .input(z.object({ deckId: z.number(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const now    = new Date();

      const [deck] = await db
        .select()
        .from(flashcardDecks)
        .where(eq(flashcardDecks.id, input.deckId))
        .limit(1);

      const allCards = await db
        .select()
        .from(flashcards)
        .where(and(eq(flashcards.deckId, input.deckId), eq(flashcards.active, true)))
        .orderBy(asc(flashcards.orderIndex), asc(flashcards.createdAt));

      if (allCards.length === 0) {
        return { deck: deck ?? null, cards: [], totalInDeck: 0, dueCount: 0, newCount: 0 };
      }

      const cardIds = allCards.map(c => c.id);
      const progRows = await db
        .select()
        .from(flashcardProgress)
        .where(and(eq(flashcardProgress.userId, userId), inArray(flashcardProgress.cardId, cardIds)));
      const progressMap = new Map(progRows.map(p => [p.cardId, p]));

      const due: typeof allCards = [];
      const nw:  typeof allCards = [];

      for (const card of allCards) {
        const p = progressMap.get(card.id);
        if (!p || !p.nextReview)      nw.push(card);
        else if (p.nextReview <= now) due.push(card);
      }

      const session = [...due, ...nw].slice(0, input.limit);

      // Próxima revisão agendada (para o estado "sem cards hoje")
      let nextScheduled: Date | null = null;
      if (due.length === 0 && nw.length === 0) {
        const upcoming = progRows
          .filter(p => p.nextReview && p.nextReview > now)
          .sort((a, b) => a.nextReview!.getTime() - b.nextReview!.getTime());
        nextScheduled = upcoming[0]?.nextReview ?? null;
      }

      return {
        deck: deck ?? null,
        cards: session.map(c => ({
          id: c.id,
          front: c.front, back: c.back,
          frontImage: c.frontImage, backImage: c.backImage,
          progress: progressMap.get(c.id) ?? null,
        })),
        totalInDeck: allCards.length,
        dueCount:    due.length,
        newCount:    nw.length,
        nextScheduled,
      };
    }),

  // ── Registar revisão (SM-2) ───────────────────────────────────────────────

  recordReview: protectedProcedure
    .input(z.object({
      cardId:  z.number(),
      quality: z.union([z.literal(1), z.literal(3), z.literal(5)]),
      // Tempo gasto nesta revisão (card exibido → usuário avaliou).
      // Opcional p/ compatibilidade, cap em 10min (evita outlier de aba aberta).
      timeSpentSeconds: z.number().int().min(0).max(600).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { cardId, quality, timeSpentSeconds } = input;

      const [existing] = await db
        .select()
        .from(flashcardProgress)
        .where(and(eq(flashcardProgress.userId, userId), eq(flashcardProgress.cardId, cardId)));

      const prev = existing
        ? { easinessFactor: existing.easinessFactor, interval: existing.interval, repetitions: existing.repetitions }
        : { easinessFactor: 2.5, interval: 0, repetitions: 0 };

      const { easinessFactor, interval, repetitions, nextReview } = applySM2(quality, prev);
      const now = new Date();

      if (existing) {
        await db.update(flashcardProgress)
          .set({
            easinessFactor, interval, repetitions, nextReview, lastReviewed: now,
            ...(timeSpentSeconds !== undefined ? { timeSpentSeconds } : {}),
          })
          .where(eq(flashcardProgress.id, existing.id));
      } else {
        await db.insert(flashcardProgress).values({
          userId, cardId, easinessFactor, interval, repetitions, nextReview, lastReviewed: now,
          ...(timeSpentSeconds !== undefined ? { timeSpentSeconds } : {}),
        });
      }

      return { interval, repetitions, nextReview };
    }),
});
