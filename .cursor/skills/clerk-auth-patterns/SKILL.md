---
name: clerk-auth-patterns
description: Applies Clerk authentication patterns for Next.js: proxy/middleware with route protection, server/client components, Show component for conditional UI (Clerk v7), webhook for syncing users to the database, and role-based access via metadata. Use when implementing or modifying auth with Clerk, protecting routes, reading current user, or syncing Clerk users to NeonDB.
---

# Clerk Auth Patterns

Apply these patterns whenever working with authentication.

## When to use

- Adding or changing auth (Clerk) in the app
- Protecting routes or API handlers
- Reading the current user in server or client components
- Syncing Clerk users to the `users` table in NeonDB
- Implementing or checking roles (e.g. admin) via Clerk metadata

---

## Proxy (Next 16) o Middleware (Next 15)

- **Next.js 16:** Archivo `src/proxy.ts` (no `middleware.ts`). Misma API con `clerkMiddleware`.
- **Next.js 15:** Archivo `middleware.ts` en raíz o `src/`.

```typescript
// src/proxy.ts (Next 16) o middleware.ts (Next 15)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
```

---

## UI condicional por auth (Clerk v7)

En Clerk v7 usar `<Show>` en lugar de `SignedIn`/`SignedOut`:

```tsx
import { Show } from '@clerk/nextjs'

<Show when="signed-out">
  <Link href="/sign-in">Sign in</Link>
</Show>
<Show when="signed-in">
  <Link href="/dashboard">Dashboard</Link>
</Show>
```

---

## Server Component

Use `auth()` and optionally `currentUser()`; redirect when unauthenticated.

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  return <div>Hello {user?.firstName}</div>
}
```

---

## Client Component

Use `useUser` or `useAuth`; handle loading before rendering user data.

```typescript
'use client'
import { useUser, useAuth } from '@clerk/nextjs'

export function UserButton() {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return <Skeleton />
  return <div>{user?.firstName}</div>
}
```

---

## Webhook: sync user with DB

Always create this webhook so Clerk users are synced to the `users` table in NeonDB.

- **Path**: `app/api/webhooks/clerk/route.ts`
- **Behavior**: On `user.created` / `user.updated`, upsert the user into the `users` table (id, email, name, etc.). Verify the webhook signature with `WEBHOOK_SECRET` before processing.
- Use the project’s Drizzle schema and server-action/DB patterns when implementing the upsert.

---

## Roles with metadata

Read and enforce roles from Clerk session metadata.

```typescript
// Leer rol del usuario
const { sessionClaims } = await auth()
const role = sessionClaims?.metadata?.role

// Proteger por rol
if (role !== 'admin') redirect('/dashboard')
```

Set `metadata.role` in the Clerk Dashboard (User → Metadata) or via the Clerk API when assigning roles.
