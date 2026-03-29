import { createTRPCRouter } from "./trpc";
import { questionsRouter } from "./questions.router";
import { simulationsRouter } from "./simulations.router";
import { authRouter } from "./auth.router";
import { usersRouter } from "./users.router";
import { formulasRouter } from "./formulas.router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  questions: questionsRouter,
  simulations: simulationsRouter,
  users: usersRouter,
  formulas: formulasRouter,
});

export type AppRouter = typeof appRouter;
