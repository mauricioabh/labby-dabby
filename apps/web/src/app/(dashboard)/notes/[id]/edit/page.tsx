import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getNote } from '@/actions/notes';
import { NoteForm } from '@/components/notes/note-form';

export default async function NoteEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();

  return (
    <div className="mx-auto max-w-3xl px-lg py-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Edit note
      </h1>
      <p className="mt-sm text-muted-foreground">
        Update your note title, content, and tags.
      </p>
      <NoteForm note={note} className="mt-xl" />
    </div>
  );
}
