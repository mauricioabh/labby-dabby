import { db } from '@/db';
import { users } from '@/db/schema';

export async function upsertAppUser(input: {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}): Promise<void> {
  const now = new Date();
  await db
    .insert(users)
    .values({
      id: input.id,
      email: input.email,
      name: input.name,
      imageUrl: input.imageUrl,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: input.email,
        name: input.name,
        imageUrl: input.imageUrl,
        updatedAt: now,
      },
    });
}
