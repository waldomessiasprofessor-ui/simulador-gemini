import { createTRPCRouter } from "./trpc";
import { questionsRouter } from "./questions.router";
import { simulationsRouter } from "./simulations.router";
import { authRouter } from "./auth.router";
import { usersRouter } from "./users.router";
import { formulasRouter } from "./formulas.router";
import { agendaRouter } from "./agenda.router";
import { flashcardsRouter } from "./flashcards.router";
import { trilhasRouter } from "./trilhas.router";
import { tutorRouter } from "./tutor.router";
import { segundaFaseRouter } from "./segunda-fase.router";
import { goalsRouter } from "./goals.router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  questions: questionsRouter,
  simulations: simulationsRouter,
  users: usersRouter,
  formulas: formulasRouter,
  agenda: agendaRouter,
  flashcards: flashcardsRouter,
  trilhas: trilhasRouter,
  tutor: tutorRouter,
  segundaFase: segundaFaseRouter,
  goals: goalsRouter,
});

export type AppRouter = typeof appRouter;
