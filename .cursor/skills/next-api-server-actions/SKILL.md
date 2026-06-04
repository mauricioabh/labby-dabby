---
name: next-api-server-actions
description: Expert in Next.js App Router, API Routes, Server Actions, Zod validation, and server-side auth. Use when designing API routes, implementing Server Actions, validating inputs with Zod, handling auth on the server, or optimizing Server Components with fetch and cache.
---

# API Agent — Next.js API Routes + Server Actions

Apply these patterns whenever working with API routes, Server Actions, or server-side data flow.

## When to intervene

- Designing or implementing API Routes (Route Handlers)
- Implementing or refactoring Server Actions
- Validating request/input data (Zod)
- Handling authentication on the server (Clerk)
- Optimizing Server Components (fetch, cache, revalidate)
- Defining response shapes and error handling

---

## Always apply

1. **Validate all input with Zod** before touching the DB or external services.
2. **Verify auth with Clerk** before any mutation or sensitive read.
3. **Return a consistent shape**: `{ data, error }` (never mix patterns).
4. **Handle errors explicitly** — never silent try/catch; log and return structured errors.
5. **Use Next.js cache strategically** (fetch cache, unstable_cache, revalidate).
6. **Rate limit** public or unauthenticated endpoints.
7. **Type end-to-end** from DB/schema to client (no `any`).

---

## API Routes (Route Handlers)

### Structure and response type

- Path: `app/api/[scope]/route.ts` (e.g. `app/api/posts/route.ts`).
- Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE` as needed.
- Always return a consistent type: `{ data?: T; error?: { code: string; message: string } }`.

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = createPostSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.error.flatten().message } },
        { status: 400 }
      )
    }

    // DB or external call here
    const post = await createPost(parsed.data, userId)
    return NextResponse.json({ data: post })
  } catch (e) {
    console.error('POST /api/posts', e)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    )
  }
}
```

### Public endpoints: rate limiting

- Apply rate limiting to public or unauthenticated routes (e.g. login, signup, webhooks that don’t use Clerk).
- Use a store (e.g. Upstash Redis) or in-memory with a clear scope; document limits and window.

---

## Server Actions

### Order of operations

1. **Auth first** — `auth()` from Clerk; throw or return error if unauthenticated.
2. **Validate input** — Zod `parse` or `safeParse`; return `{ error }` on failure.
3. **Perform operation** — DB or external call.
4. **Return** `{ data }` or `{ error }`; never throw for expected validation/auth errors if the client should handle them.

```typescript
'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/db'
import { posts } from '@/db/schema'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
})

export type CreatePostResult =
  | { data: { id: string } }
  | { error: { code: string; message: string } }

export async function createPost(
  input: z.infer<typeof createPostSchema>
): Promise<CreatePostResult> {
  const { userId } = await auth()
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } }
  }

  const parsed = createPostSchema.safeParse(input)
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.message ?? 'Validation failed',
      },
    }
  }

  try {
    const [post] = await db
      .insert(posts)
      .values({ ...parsed.data, userId })
      .returning({ id: posts.id })
    return { data: { id: post.id } }
  } catch (e) {
    console.error('createPost', e)
    return { error: { code: 'INTERNAL_ERROR', message: 'Failed to create post' } }
  }
}
```

### Revalidation

- After mutations that affect list/detail pages, call `revalidatePath` or `revalidateTag` as appropriate so Server Components stay in sync.

---

## Zod validation

- Define schemas next to the action/route or in a shared `src/schemas/` (or similar).
- Use `safeParse` when returning errors to the client; use `parse` only when you intend to throw.
- For API routes, validate after `req.json()`; for Server Actions, validate the first argument.
- Export inferred types: `type CreatePostInput = z.infer<typeof createPostSchema>`.

---

## Server Components: fetch and cache

- Prefer `fetch` with Next.js options (`cache`, `next.revalidate`, `next.tags`) over ad-hoc caching.
- Use `unstable_cache` for non-fetch data (e.g. DB reads) when you need tag-based or time-based revalidation.
- Avoid over-caching mutable data; use short revalidate or tags and revalidate after mutations.

---

## Error handling

- **Never** empty catch blocks; always log and return a structured error or rethrow.
- Use HTTP status codes in API routes: 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 500 server error.
- In Server Actions, use the `{ error: { code, message } }` shape so the client can show messages or redirect.

---

## End-to-end typing

- Types from DB: use Drizzle inferred types (`typeof schema.$inferSelect`, `$inferInsert`).
- API/actions: define result types (e.g. `CreatePostResult`) and use them in route/action return types.
- Client: use the same types (import from server or from a shared `src/types/`) so request/response are typed from DB to UI.
