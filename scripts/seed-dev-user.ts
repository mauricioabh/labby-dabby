/**
 * Creates or updates a Clerk user + Neon `users` row for local testing.
 * Requires apps/web/.env.local: CLERK_SECRET_KEY, DATABASE_URL
 *
 * Run from repo root: npm run seed:dev-user
 */
import path from 'path';
import { config } from 'dotenv';
import { createClerkClient } from '@clerk/backend';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../apps/web/src/db/schema';

const ROOT = path.resolve(__dirname, '..');
config({ path: path.join(ROOT, 'apps', 'web', '.env.local') });
config({ path: path.join(ROOT, 'apps', 'web', '.env') });

const DEV_EMAIL = 'mauricioabh@gmail.com';
const DEV_PASSWORD = 'test1';

async function main() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  if (!secretKey) {
    throw new Error('Missing CLERK_SECRET_KEY (set in apps/web/.env.local)');
  }
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL (set in apps/web/.env.local)');
  }

  const clerk = createClerkClient({ secretKey });

  const existingList = await clerk.users.getUserList({
    emailAddress: [DEV_EMAIL],
    limit: 5,
  });

  let clerkUserId: string;
  let name: string | null = null;
  let imageUrl: string | null = null;

  if (existingList.data.length > 0) {
    const u = existingList.data[0];
    clerkUserId = u.id;
    name = [u.firstName, u.lastName].filter(Boolean).join(' ') || null;
    imageUrl = u.imageUrl || null;
    await clerk.users.updateUser(u.id, {
      password: DEV_PASSWORD,
      skipPasswordChecks: true,
    });
    console.log('Clerk user exists; password updated:', clerkUserId);
  } else {
    const created = await clerk.users.createUser({
      emailAddress: [DEV_EMAIL],
      password: DEV_PASSWORD,
      skipPasswordChecks: true,
      firstName: 'Mauricio',
      lastName: 'Dev',
    });
    clerkUserId = created.id;
    name = [created.firstName, created.lastName].filter(Boolean).join(' ') || null;
    imageUrl = created.imageUrl || null;
    console.log('Clerk user created:', clerkUserId);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);
  await db
    .insert(users)
    .values({
      id: clerkUserId,
      email: DEV_EMAIL,
      name,
      imageUrl,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: DEV_EMAIL,
        name,
        imageUrl,
        updatedAt: new Date(),
      },
    });

  console.log('Neon `users` row synced for', DEV_EMAIL);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
