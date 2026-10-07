# Problem 5 — Task CRUD API

A simple CRUD backend service for managing tasks, built with **Express 5 + TypeScript + Postgres + Drizzle ORM**.

## Features

- Full task CRUD: create, read (single + list), update, delete
- List filtering (`title` search, `completed` flag), sorting, and pagination
- Request validation with **zod** (body, query, and params)
- **Auto-generated OpenAPI 3.0 spec** — the same zod schemas used for validation
  generate the Swagger document, so docs can't drift from behavior
- Interactive Swagger UI + raw JSON spec endpoints
- Security middlewares: `helmet`, `cors`, `express-rate-limit`, `hpp`
- Structured JSON error responses (`VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, …)
- Drizzle migrations + a 50-task seed script
- Docker support for dev (database only) and prod (app + database)

## Tech Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Runtime    | Node.js 22, TypeScript (strict)                     |
| Framework  | Express 5                                           |
| Database   | Postgres 16 + Drizzle ORM (`postgres-js` driver)    |
| Validation | zod 4                                               |
| API docs   | `swagger-ui-express` + `@asteasolutions/zod-to-openapi` |
| Dev tools  | `tsx`, `drizzle-kit`, Docker Compose               |

## Project Structure

```
src/
├── app.ts                    # Express app: middlewares, routes, docs
├── server.ts                 # Bootstrap + graceful shutdown
├── controllers/              # HTTP layer (req/res mapping)
├── services/                 # Business logic + Drizzle queries
├── models/                   # Domain types/enums
├── routes/                   # Route definitions + validation wiring
├── schemas/                  # zod schemas (validation + OpenAPI source)
├── docs/
│   ├── openapi.ts            # Spec generated from the zod registry
│   └── generate-spec.ts      # Dumps the spec to ./openapi.json
├── db/
│   ├── schema.ts             # Drizzle table definitions
│   ├── index.ts              # DB client
│   └── seed.ts               # 50-task seed data
├── middlewares/              # Validation + error handling
└── utils/                    # AppError, catchAsync
drizzle/                      # Generated SQL migrations
```

## Prerequisites

- Node.js 22+ and npm
- Docker (for Postgres), or a local Postgres 16 instance

## Quick Start

### 1. Start Postgres (dev)

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts `problem5-db-dev` on port `5432` with user/password `postgres` and
database `crude_server`.

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable       | Default                                              | Description        |
| -------------- | ---------------------------------------------------- | ------------------ |
| `NODE_ENV`     | `development`                                        | Runtime environment |
| `PORT`         | `3000`                                               | HTTP port           |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/crude_server` | Postgres connection string |

### 3. Install, migrate, seed, run

```bash
npm install
npm run db:migrate   # apply Drizzle migrations
npm run db:seed      # load ~50 sample tasks (resets the table)
npm run dev          # start with hot reload (tsx watch)
```

Server: `http://localhost:3000` · Swagger UI: `http://localhost:3000/api-docs`

### Production (Docker, app + DB)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## NPM Scripts

| Script            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Start with hot reload                                    |
| `npm run build`   | Type-check and compile to `dist/`                        |
| `npm start`       | Run the compiled app (needs `build` first)               |
| `npm run db:generate` | Generate a migration from schema changes             |
| `npm run db:migrate`  | Apply pending migrations                             |
| `npm run db:push`     | Push schema directly (dev prototyping, skips migrations) |
| `npm run db:seed`     | Truncate `tasks` and insert ~50 sample rows          |
| `npm run docs:generate` | Write the OpenAPI spec to `./openapi.json` (no DB needed) |

## API Documentation (Swagger)

The full endpoint reference lives in Swagger — it is generated from the same
zod schemas that validate requests, so it never goes stale.

- Interactive UI: `GET /api-docs`
- Raw spec: `GET /api-docs.json`
- Static file: `npm run docs:generate` → `./openapi.json` (importable into Postman / Swagger Editor / codegen tools)

How it works: endpoint schemas live in `src/schemas/task.schemas.ts` and are
registered on an `OpenAPIRegistry` in `src/docs/openapi.ts`. The same schemas
run as Express middleware (`validateBody` / `validateQuery` / `validateParams`),
so the documented contract and the enforced contract are literally the same code.

Operational notes: JSON bodies are limited to `10kb`; `/api/*` is
rate-limited to 100 requests per 15 minutes per IP; CORS allows
`http://localhost:3000`.

## Database

- Schema: `src/db/schema.ts` — `tasks` table with `task_status` / `task_priority`
  enums and indexes on `status`, `priority`, `created_at`.
- After editing the schema: `npm run db:generate` (creates SQL in `drizzle/`),
  then `npm run db:migrate`.
- `npm run db:seed` truncates `tasks` (resets IDs) and inserts 12 curated tasks
  plus 38 generated ones (~40% completed, mixed priorities, staggered timestamps
  for realistic sorting/pagination).
