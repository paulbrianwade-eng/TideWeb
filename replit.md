# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### BIGG at Home (`artifacts/bigg-at-home`)
- **Type**: React + Vite (frontend-only, no backend)
- **Preview path**: `/`
- **Description**: Mobile-first workout tracker for a personalized weekly BIGG routine
- **Features**:
  - Home screen with horizontally scrollable day cards (today shown first)
  - Day detail page with exercise blocks, checkboxes, and progress bar
  - Weekly streak tracker
  - Exercise completion persistence via localStorage
  - Full 7-day routine with equipment substitutions
- **Colors**: `#C8FF00` (lime), `#0A0A0A` (dark), `#F2F2F2` (background)
- **Font**: Archivo Black for display, Inter/system for body
- **Language**: Spanish

### TIDE (`artifacts/tide`)
- **Type**: React + Vite (frontend-only, no backend)
- **Preview path**: `/tide`
- **Description**: High-performance training system for Patricio — 7 screens, exercise library, live session tracker
- **Architecture**:
  - `src/types/index.ts` — data model (Workout, Exercise, Session, Metric, etc.)
  - `src/data/` — program.ts (weekly schedule), exercises.ts (43 exercises), defaults.ts (initial profile)
  - `src/lib/` — adaptations, date helpers, prescription, records, storage
  - `src/state/AppContext.tsx` — global state via useReducer, auto-saved to localStorage
  - `src/components/` — AppShell, navigation, ExerciseSetTracker, RestTimer, WorkoutSummaryModal, OnePagerView
  - `src/screens/` — Today, Calendar, Progress, Nutrition, Library, Session, Settings
- **Features**:
  - Today screen: readiness indicators, session card with MAREA (tide) RPE indicator, adaptive adjustments panel
  - Session mode: block-by-block, per-set load/reps tracking, rest timer, substitute/technique buttons
  - Summary: RPE, feel, coach note, personal record detection, history
  - Calendar: weekly + monthly view, daily cards, activity changes
  - Progress: editable metrics (body comp, strength, athletic, engine, recovery)
  - Nutrition: day-type macros, meal plan, water + creatine tracker
  - Library: 43 exercises with technique, errors, regression, progression; add to session
  - Settings: editable profile, demo data reset
- **State**: single `tide.state.v1` key in localStorage
- **Colors**: `#0B0D0F` (base/night), `#15191D` (surface), `#C7F000` (accent/lime), `#58E0C8` (foam)
- **Font**: Space Grotesk (display), Inter (body), IBM Plex Mono (mono/data)
- **Program anchor**: `PROGRAM_START` in `src/data/program.ts` — set to `'today'` by default; change to `'YYYY-MM-DD'` to fix the start date
- **Language**: Spanish

### API Server (`artifacts/api-server`)
- **Type**: Express API
- **Preview path**: `/api`
- **Description**: Shared backend Express server

### Canvas (`artifacts/mockup-sandbox`)
- **Type**: Design / mockup sandbox
- **Preview path**: `/__mockup`
