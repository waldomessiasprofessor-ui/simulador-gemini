import { createTRPCRouter } from "./trpc";
import { questionsRouter } from "./questions.router";
import { simulationsRouter } from "./simulations.router";
import { authRouter } from "./auth.router";
import { usersRouter } from "./users.router";
import { reviewRouter } from "./review.router";
import { formulasRouter } from "./formulas.router";
import { agendaRouter } from "./agenda.router";
import { flashcardsRouter } from "./flashcards.router";
import { trilhasRouter } from "./trilhas.router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  questions: questionsRouter,
  simulations: simulationsRouter,
  users: usersRouter,
  review: reviewRouter,
  formulas: formulasRouter,
  agenda: agendaRouter,
  flashcards: flashcardsRouter,
  trilhas: trilhasRouter,
});

export type AppRouter = typeof appRouter;
