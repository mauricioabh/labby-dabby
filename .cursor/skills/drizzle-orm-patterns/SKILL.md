---
name: drizzle-orm-patterns
description: Applies Drizzle ORM and NeonDB connection, schema, query, and server-action patterns. Use when writing or editing code that uses Drizzle with NeonDB, defining tables/schema, writing queries, or server actions that touch the database.
---

# Drizzle ORM Patterns

Apply these patterns whenever writing code with Drizzle + NeonDB.

## Connection setup

```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

## Schema patterns

- Use `pgTable` from `drizzle-orm/pg-core`.
- Always include `id`, `createdAt`, and `updatedAt` on tables.

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(), // e.g. Clerk user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Infer types from schema; do not duplicate
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

## Query patterns

- Prefer `db.query` for reads and relations.

```typescript
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: { posts: true },
})

// Always handle null
if (!user) throw new Error('User not found')
```

## Server Actions pattern

```typescript
'use server'
import { auth } from '@clerk/nextjs/server'

export async function createPost(input: CreatePostInput) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const validated = createPostSchema.parse(input)

  return await db
    .insert(posts)
    .values({
      ...validated,
      userId,
    })
    .returning()
}
```

- Auth first with Clerk; validate input with Zod; then perform the DB operation.
