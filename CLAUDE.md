# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (tsx watch + Vite HMR)
npm run build      # Build frontend (Vite) + server (esbuild) → dist/
npm start          # Run production server from dist/index.js
npm run check      # TypeScript type check (no emit)
npm run format     # Prettier formatting
npm run test       # Run Vitest tests
npm run db:push    # Push Drizzle ORM schema to database
npm run clean      # Remove dist/
```

Data/admin scripts (run with `node`):
```bash
node setup-db.mjs           # Initialize database tables
node create-admin.mjs       # Create admin user
node seed-formulas.mjs      # Populate formulas reference table
node import-questions.mjs   # Import ENEM questions from external API
```

## Architecture

Full-stack ENEM math exam simulator. The frontend is React 19 + Vite, the backend is Express + tRPC, and the database layer uses Drizzle ORM with MySQL.

### Communication Layer (tRPC)

All client-server communication goes through tRPC. The router is assembled in `server/router.ts` and mounted on Express in `server/index.ts`. The client is configured in `src/lib/trpc.ts` using TanStack React Query for caching.

Procedure types defined in `server/trpc.ts`:
- `publicProcedure` — unauthenticated access
- `protectedProcedure` — requires valid JWT cookie
- `adminProcedure` — requires `role = 'admin'`

Auth uses JWT tokens stored in HTTP-only cookies, with crypto in `server/auth.ts` (scrypt for passwords, jose for JWT).

### Backend Routers

| File | Responsibility |
|------|---------------|
| `server/auth.router.ts` | Login, register, logout |
| `server/questions.router.ts` | Question bank CRUD, filtering |
| `server/simulations.router.ts` | Simulation flow: start → answer → finish, TRI scoring (1049 lines) |
| `server/users.router.ts` | User management, subscription dates |
| `server/review.router.ts` | Daily review content with embedded questions |
| `server/formulas.router.ts` | Math formula reference |

Express also has two admin-only REST endpoints (not tRPC): `/admin/make-admin` and `/admin/import` for bulk ENEM question import.

### TRI (IRT 3PL) Scoring

`server/tri.ts` implements the 3-Parameter Logistic Item Response Theory model. Each question has `a` (discrimination), `b` (difficulty), and `c` (guessing) parameters. The algorithm estimates theta (ability) via maximum likelihood, then converts it to an ENEM 0–1000 score. This is the scoring engine for all simulations.

### Frontend Structure

- `src/App.tsx` — Wouter router, all page routes
- `src/main.tsx` — React entry, tRPC + React Query providers
- Page components are flat in `src/` (e.g., `Simulador.tsx`, `Dashboard.tsx`, `AdminQuestoes.tsx`)
- Math rendering: KaTeX via a `LatexRenderer` component; images in questions use `[Imagem: url]` markup

### Database Schema (`server/schema.ts`)

Key tables: `users`, `questions`, `simulations`, `simulation_answers`, `daily_challenges`, `review_contents`, `daily_reviews`, `formulas`. All managed via Drizzle ORM.

### Build

`npm run build` runs `vite build` (frontend → `dist/public/`) then `node build.mjs` (esbuild bundles server → `dist/index.js`). The production server serves the static frontend from `dist/public/`.
