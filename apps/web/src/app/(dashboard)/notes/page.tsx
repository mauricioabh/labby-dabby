import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getNotes } from '@/actions/notes';
import { NotesList } from '@/components/notes/notes-list';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { q } = await searchParams;
  const notes = await getNotes(q);

  return (
    <div className="mx-auto max-w-4xl px-lg py-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Secure Notes
      </h1>
      <p className="mt-sm text-muted-foreground">
        Keep encrypted notes about your health, appointments, and medical
        information.
      </p>
      <NotesList initialNotes={notes} initialSearch={q} className="mt-xl" />
      <Card className="mt-xl">
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-md">
          <div className="flex items-start gap-md">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              All notes are encrypted end-to-end for maximum security.
            </p>
          </div>
          <div className="flex items-start gap-md">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your data is stored securely and only accessible by you.
            </p>
          </div>
          <div className="flex items-start gap-md">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Notes are automatically synced across your devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
