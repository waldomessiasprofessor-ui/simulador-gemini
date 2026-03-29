import { createTRPCRouter } from "./trpc";
import { questionsRouter } from "./questions.router";
import { simulationsRouter } from "./simulations.router";
import { authRouter } from "./auth.router";
import { usersRouter } from "./users.router";
import { reviewRouter } from "./review.router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  questions: questionsRouter,
  simulations: simulationsRouter,
  users: usersRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
