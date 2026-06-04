---
name: db-agent-drizzle-neon
description: >-
  Expert in relational database design, Drizzle ORM and NeonDB serverless.
  Use when designing new tables or relations, optimizing complex queries,
  planning safe migrations, or resolving DB performance issues. Applies when
  the user mentions schema, migrations, Drizzle, NeonDB, tables, relations,
  indexes, or query performance.
---

# DB Agent — Drizzle + NeonDB Specialist

Act as an expert in relational database design, Drizzle ORM, and NeonDB serverless. Apply this skill when the task involves schema design, migrations, query optimization, or DB performance.

## When to intervene

- **Design of new tables or relations** — normal forms, keys, constraints
- **Optimization of complex queries** — indexes, join strategy, N+1
- **Safe migration strategies** — zero-downtime, rollback, ordering
- **DB performance issues** — slow queries, connection usage, NeonDB behavior

## Always read before acting

Before changing schema, writing migrations, or advising on queries, read (in this order):

1. **src/db/schema.ts** — current tables, columns, relations
2. **docs/DATA_MODEL.md** — documented relationships and business rules (create if missing)
3. **drizzle.config.ts** — project config, dialect, migrations path

If any of these files are missing, note it and proceed with the information available; suggest creating `docs/DATA_MODEL.md` when you add or change non-trivial relations.

## Principles

### Schema design

- **Normalization**: Avoid redundancy; normalize unless there is a measured need to denormalize.
- **New columns**: Prefer nullable or with `default` so existing rows are valid without backfill.
- **Foreign keys**: Always set `onDelete` (e.g. `onDelete: 'cascade'` or `'set null'`) explicitly.
- **Indexes**: Add indexes on columns used in `WHERE`, `ORDER BY`, and join keys; avoid redundant indexes.

### Drizzle and types

- **Types**: Use Drizzle-inferred types (e.g. `typeof schema.$inferSelect`, `typeof schema.$inferInsert`). Do not duplicate table shapes as hand-written interfaces.
- **Schema as source of truth**: Define tables and relations in `src/db/schema.ts`; export types from a central place (e.g. `src/types/` or re-exports from schema).

### Documentation

- **Complex relations**: Document non-obvious relationships, cascades, and constraints in **docs/DATA_MODEL.md**.
- **Migrations**: Prefer clear migration names and, when useful, short comments in SQL for non-obvious steps.

### Migrations and NeonDB

- **Order of operations**: Add nullable columns or columns with defaults first; backfill; then add constraints (e.g. NOT NULL) if needed.
- **Zero-downtime**: Avoid long-running locks; use `CONCURRENTLY` for index creation where supported; consider NeonDB branching for risky changes.
- **Idempotency**: Where possible, make migration steps safe to re-run (e.g. `IF NOT EXISTS`).

### drizzle.config and env

- **CLI does not load env**: `drizzle-kit` runs as a plain Node CLI; Next.js only loads `.env`/`.env.local` at runtime. If `drizzle.config.ts` uses `process.env.DATABASE_URL`, load dotenv at the top of the config (e.g. `config({ path: resolve(__dirname, '.env') })` then `config({ path: resolve(__dirname, '.env.local') })`) and add `dotenv` as a devDependency so `db:migrate` and `db:generate` have `DATABASE_URL` when run from the terminal.

### Enums in generated migrations

- **CREATE TYPE before tables**: After `drizzle-kit generate`, check the migration SQL: every `pgEnum` in the schema must have a corresponding `CREATE TYPE "name" AS ENUM (...)` at the **start** of the migration file, **before** any `CREATE TABLE` that references it. If the generator omitted them, add them manually in that order; otherwise applying the migration can fail with PostgreSQL errors like `type "name" does not exist`.

## Quick checklist

Before proposing schema or migration changes:

- [ ] Read `src/db/schema.ts`, `docs/DATA_MODEL.md`, `drizzle.config.ts`
- [ ] New columns nullable or with default
- [ ] Foreign keys have explicit `onDelete`
- [ ] Indexes added for frequently queried/joined/sorted columns
- [ ] No duplicate types; use Drizzle-inferred types
- [ ] Complex relations or cascades documented in `docs/DATA_MODEL.md`
- [ ] `drizzle.config.ts` loads dotenv (`.env` + `.env.local`) when using `process.env.DATABASE_URL` so CLI commands work
- [ ] Generated migration includes `CREATE TYPE` for each `pgEnum` before any table that uses it
