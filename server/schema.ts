import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
  index,
  json,
  text,
  float,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// =============================================================================
// Tabela: users
// =============================================================================

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["student", "admin"]).notNull().default("student"),
  active: boolean("active").notNull().default(true),
  // Controlo de assinatura — null = sem expiração (admin/free)
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Tabela: questions
// =============================================================================

export const questions = mysqlTable(
  "questions",
  {
    id: int("id").primaryKey().autoincrement(),
    fonte: varchar("fonte", { length: 50 }).notNull().default("ENEM"),
    ano: int("ano"),
    conteudo_principal: varchar("conteudo_principal", { length: 100 }).notNull(),
    tags: json("tags").$type<string[]>().notNull().default([]),
    nivel_dificuldade: mysqlEnum("nivel_dificuldade", [
      "Muito Baixa", "Baixa", "Média", "Alta", "Muito Alta",
    ]).notNull().default("Média"),
    param_a: float("param_a").notNull().default(1.0),
    param_b: float("param_b").notNull().default(0.0),
    param_c: float("param_c").notNull().default(0.2),
    enunciado: text("enunciado").notNull(),
    url_imagem: varchar("url_imagem", { length: 512 }),
    alternativas: json("alternativas").$type<Record<string, any>>().notNull(),
    gabarito: varchar("gabarito", { length: 1 }).notNull(),
    comentario_resolucao: text("comentario_resolucao"),
    url_video: varchar("url_video", { length: 512 }),
    active: boolean("active").notNull().default(true),
    auditada: boolean("auditada").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    idxConteudo: index("idx_conteudo_principal").on(t.conteudo_principal),
    idxActive: index("idx_active").on(t.active),
  })
);

// =============================================================================
// Tabela: simulations
// =============================================================================

export const simulations = mysqlTable(
  "simulations",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    stage: int("stage").notNull().default(1),
    score: float("score"),
    triTheta: float("tri_theta"),
    correctCount: int("correct_count"),
    totalQuestions: int("total_questions"),
    totalTimeSeconds: int("total_time_seconds"),
    status: mysqlEnum("status", ["in_progress", "completed", "abandoned"])
      .notNull().default("in_progress"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    idxUser: index("idx_user_id").on(t.userId),
    idxUserStage: index("idx_user_stage").on(t.userId, t.stage),
  })
);

// =============================================================================
// Tabela: simulation_answers
// =============================================================================

export const simulationAnswers = mysqlTable(
  "simulation_answers",
  {
    id: int("id").primaryKey().autoincrement(),
    simulationId: int("simulation_id").notNull().references(() => simulations.id, { onDelete: "cascade" }),
    questionId: int("question_id").notNull().references(() => questions.id, { onDelete: "restrict" }),
    selectedAnswer: varchar("selected_answer", { length: 1 }),
    isCorrect: boolean("is_correct"),
    timeSpentSeconds: int("time_spent_seconds"),
    questionOrder: int("question_order").notNull(),
    answeredAt: timestamp("answered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxSimulation: index("idx_simulation_id").on(t.simulationId),
  })
);

// =============================================================================
// Relações
// =============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  simulations: many(simulations),
}));

export const simulationsRelations = relations(simulations, ({ one, many }) => ({
  user: one(users, { fields: [simulations.userId], references: [users.id] }),
  answers: many(simulationAnswers),
}));

export const simulationAnswersRelations = relations(simulationAnswers, ({ one }) => ({
  simulation: one(simulations, { fields: [simulationAnswers.simulationId], references: [simulations.id] }),
  question: one(questions, { fields: [simulationAnswers.questionId], references: [questions.id] }),
}));


// =============================================================================
// Tabela: daily_challenges — 3 questões diárias por aluno
// =============================================================================

export const dailyChallenges = mysqlTable(
  "daily_challenges",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    challengeDate: varchar("challenge_date", { length: 10 }).notNull(), // YYYY-MM-DD
    questionIds: json("question_ids").$type<number[]>().notNull(),
    answers: json("answers").$type<Record<string, string>>().notNull().default({}),
    completed: boolean("completed").notNull().default(false),
    correctCount: int("correct_count"),
    totalTimeSeconds: int("total_time_seconds"), // tempo total gasto no desafio (p/ radar de performance)
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUserDate: index("idx_user_date").on(t.userId, t.challengeDate),
  })
);

export const dailyChallengesRelations = relations(dailyChallenges, ({ one }) => ({
  user: one(users, { fields: [dailyChallenges.userId], references: [users.id] }),
}));

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type NewDailyChallenge = typeof dailyChallenges.$inferInsert;


// =============================================================================
// Tabela: review_contents — textos do "Revise" (gerenciados pelo admin)
// =============================================================================

export const reviewContents = mysqlTable(
  "review_contents",
  {
    id: int("id").primaryKey().autoincrement(),
    titulo: varchar("titulo", { length: 200 }).notNull(),
    conteudo: text("conteudo").notNull().default(""), // suporta LaTeX; vazio quando usa PDF
    url_pdf: varchar("url_pdf", { length: 500 }),     // URL Cloudinary do PDF (opcional)
    topico: varchar("topico", { length: 100 }),
    questoes: json("questoes").$type<Array<{
      enunciado: string;
      opcoes: string[];   // sempre 4 opções [A, B, C, D]
      correta: number;    // índice 0-3
    }>>().notNull().default([]),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    idxActive: index("idx_review_active").on(t.active),
  })
);

// =============================================================================
// Tabela: daily_reviews — progresso do aluno no Revise diário
// =============================================================================

export const dailyReviews = mysqlTable(
  "daily_reviews",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id").notNull().references(() => users.id),
    reviewDate: varchar("review_date", { length: 10 }).notNull(), // YYYY-MM-DD
    contentId: int("content_id").notNull().references(() => reviewContents.id),
    answers: json("answers").$type<Record<string, number>>().notNull().default({}),
    completed: boolean("completed").notNull().default(false),
    correctCount: int("correct_count"),
    totalTimeSeconds: int("total_time_seconds"), // tempo total gasto no Revise (p/ radar de performance)
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUserDate: index("idx_review_user_date").on(t.userId, t.reviewDate),
  })
);

export const dailyReviewsRelations = relations(dailyReviews, ({ one }) => ({
  user: one(users, { fields: [dailyReviews.userId], references: [users.id] }),
  content: one(reviewContents, { fields: [dailyReviews.contentId], references: [reviewContents.id] }),
}));

export type ReviewContent = typeof reviewContents.$inferSelect;
export type NewReviewContent = typeof reviewContents.$inferInsert;
export type DailyReview = typeof dailyReviews.$inferSelect;
export type NewDailyReview = typeof dailyReviews.$inferInsert;

// =============================================================================
// Tipos
// =============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Simulation = typeof simulations.$inferSelect;
export type NewSimulation = typeof simulations.$inferInsert;
export type SimulationAnswer = typeof simulationAnswers.$inferSelect;
export type NewSimulationAnswer = typeof simulationAnswers.$inferInsert;

// =============================================================================
// Tabela: formulas
// =============================================================================

export const formulas = mysqlTable("formulas", {
  id:       int("id").primaryKey().autoincrement(),
  secao:    varchar("secao", { length: 100 }).notNull(),
  cor:      varchar("cor", { length: 20 }).notNull().default("#01738d"),
  titulo:   varchar("titulo", { length: 200 }).notNull(),
  formula:  text("formula").notNull(),
  descricao: text("descricao").notNull(),
  ordem:    int("ordem").notNull().default(0),
  active:   boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Formula = typeof formulas.$inferSelect;
export type NewFormula = typeof formulas.$inferInsert;

// =============================================================================
// Tabela: study_schedule — cronograma semanal por aluno
// =============================================================================

export const studySchedule = mysqlTable("study_schedule", {
  id:         int("id").primaryKey().autoincrement(),
  userId:     int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dayOfWeek:  int("day_of_week").notNull(), // 1=Seg … 6=Sáb
  startTime:  varchar("start_time", { length: 5 }).notNull(),  // "08:00"
  endTime:    varchar("end_time",   { length: 5 }).notNull(),  // "10:00"
  topic:      text("topic").notNull(), // JSON array de strings: ["Funções","Geometria Plana"]
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

export type StudySlot    = typeof studySchedule.$inferSelect;
export type NewStudySlot = typeof studySchedule.$inferInsert;

// =============================================================================
// Tabela: flashcard_decks — baralhos de flashcards
// =============================================================================

export const flashcardDecks = mysqlTable("flashcard_decks", {
  id:          int("id").primaryKey().autoincrement(),
  title:       varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  color:       varchar("color", { length: 20 }).notNull().default("#009688"),
  active:      boolean("active").notNull().default(true),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Tabela: flashcards — cards dentro dos baralhos
// =============================================================================

export const flashcards = mysqlTable("flashcards", {
  id:         int("id").primaryKey().autoincrement(),
  deckId:     int("deck_id").notNull().references(() => flashcardDecks.id, { onDelete: "cascade" }),
  front:      text("front").notNull(),
  back:       text("back").notNull(),
  frontImage: varchar("front_image", { length: 512 }),
  backImage:  varchar("back_image",  { length: 512 }),
  orderIndex: int("order_index").notNull().default(0),
  active:     boolean("active").notNull().default(true),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

// =============================================================================
// Tabela: flashcard_progress — progresso SM-2 por usuário × card
// =============================================================================

export const flashcardProgress = mysqlTable(
  "flashcard_progress",
  {
    id:             int("id").primaryKey().autoincrement(),
    userId:         int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    cardId:         int("card_id").notNull().references(() => flashcards.id, { onDelete: "cascade" }),
    easinessFactor: float("easiness_factor").notNull().default(2.5),
    interval:       int("interval").notNull().default(0),      // dias até próxima revisão
    repetitions:    int("repetitions").notNull().default(0),   // revisões bem-sucedidas consecutivas
    nextReview:     timestamp("next_review"),                  // null = card novo, nunca visto
    lastReviewed:   timestamp("last_reviewed"),
    timeSpentSeconds: int("time_spent_seconds"),               // tempo gasto na última revisão (p/ radar)
    createdAt:      timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUserCard: index("idx_fc_user_card").on(t.userId, t.cardId),
    idxNextReview: index("idx_fc_next_review").on(t.userId, t.nextReview),
  })
);

export type FlashcardDeck      = typeof flashcardDecks.$inferSelect;
export type NewFlashcardDeck   = typeof flashcardDecks.$inferInsert;
export type Flashcard          = typeof flashcards.$inferSelect;
export type NewFlashcard       = typeof flashcards.$inferInsert;
export type FlashcardProgress  = typeof flashcardProgress.$inferSelect;
