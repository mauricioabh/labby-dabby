import { auth, currentUser } from '@clerk/nextjs/server';
import { upsertAppUser } from '@/lib/upsert-app-user';

export type BearerAuthOptions = {
  acceptsToken: ReadonlyArray<'session_token' | 'oauth_token'>;
};

/**
 * Keeps `users` in sync with Clerk (replaces dev dependency on webhooks).
 * Safe to call on every authed request; uses idempotent upsert.
 */
export async function ensureUserInDatabase(
  options?: BearerAuthOptions
): Promise<void> {
  const authResult =
    options?.acceptsToken?.length && options.acceptsToken.length > 0
      ? await auth({
          acceptsToken: [...options.acceptsToken],
        })
      : await auth();

  const userId =
    authResult && typeof authResult === 'object' && 'userId' in authResult
      ? (authResult as { userId: string | null }).userId
      : null;

  if (!userId) return;

  const user = await currentUser();

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    `${userId.replace(/[^a-zA-Z0-9]/g, '_')}@users.clerk.local`;

  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || null
    : null;

  const imageUrl = user?.imageUrl ?? null;

  await upsertAppUser({ id: userId, email, name, imageUrl });
}
