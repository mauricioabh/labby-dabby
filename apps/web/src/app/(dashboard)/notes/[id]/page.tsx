import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getNote } from '@/actions/notes';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui';

export default async function NoteDetailPage({
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
      <div className="mb-xl">
        <Link
          href="/notes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Notes
        </Link>
      </div>

      <div className="flex items-start justify-between gap-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {note.title}
          </h1>
          {note.tags && note.tags.length > 0 && (
            <div className="mt-md flex flex-wrap gap-xs">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="mt-sm text-sm text-muted-foreground">
            Updated {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <Link href={`/notes/${note.id}/edit`} className={buttonVariants()}>
          Edit
        </Link>
      </div>

      <div className="mt-xl whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-xl">
        {note.content}
      </div>
    </div>
  );
}
