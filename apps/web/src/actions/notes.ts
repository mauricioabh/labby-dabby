'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { eq, and, desc, sql, or, ilike } from 'drizzle-orm';
import { createNoteSchema, updateNoteSchema } from '@/schemas';

export type NoteActionResult =
  | { data: { id: string } }
  | { error: { code: string; message: string } };

export async function createNote(input: {
  title: string;
  content: string;
  tags?: string[];
}): Promise<NoteActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  const parsed = createNoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.message ?? 'Validation failed',
      },
    };
  }

  try {
    const [note] = await db
      .insert(notes)
      .values({
        userId,
        title: parsed.data.title,
        content: parsed.data.content,
        tags: parsed.data.tags,
      })
      .returning({ id: notes.id });

    if (!note) {
      return { error: { code: 'INTERNAL_ERROR', message: 'Failed to create note' } };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
    return { data: { id: note.id } };
  } catch (err) {
    console.error('createNote', err);
    return {
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create note' },
    };
  }
}

export async function updateNote(
  id: string,
  input: { title?: string; content?: string; tags?: string[] }
): Promise<NoteActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  const parsed = updateNoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.message ?? 'Validation failed',
      },
    };
  }

  try {
    const [updated] = await db
      .update(notes)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning({ id: notes.id });

    if (!updated) {
      return { error: { code: 'NOT_FOUND', message: 'Note not found' } };
    }

    revalidatePath('/notes');
    revalidatePath(`/notes`);
    return { data: { id: updated.id } };
  } catch (err) {
    console.error('updateNote', err);
    return {
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update note' },
    };
  }
}

export async function deleteNote(id: string): Promise<NoteActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  try {
    const [deleted] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning({ id: notes.id });

    if (!deleted) {
      return { error: { code: 'NOT_FOUND', message: 'Note not found' } };
    }

    revalidatePath('/notes');
    revalidatePath('/dashboard');
    return { data: { id: deleted.id } };
  } catch (err) {
    console.error('deleteNote', err);
    return {
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete note' },
    };
  }
}

export async function getNotes(search?: string) {
  const { userId } = await auth();
  if (!userId) return [];

  const baseQuery = db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt));

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    return db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, term),
            ilike(notes.content, term)
          )!
        )
      )
      .orderBy(desc(notes.updatedAt));
  }

  return baseQuery;
}

export async function getRecentNotes(limit = 5) {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt))
    .limit(limit);
}

export async function getNote(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .limit(1);

  return note ?? null;
}
