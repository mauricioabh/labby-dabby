'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deleteNote } from '@/actions/notes';
import { CreateNoteModal } from '@/components/notes/create-note-modal';
import type { Note } from '@/db/schema';

interface NotesListProps {
  initialNotes: Note[];
  initialSearch?: string;
  className?: string;
}

export function NotesList({
  initialNotes,
  initialSearch = '',
  className,
}: NotesListProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState(initialSearch);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search ? `/notes?q=${encodeURIComponent(search)}` : '/notes');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    const result = await deleteNote(id);
    if ('data' in result) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-md">
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-sm">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <CreateNoteModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      <div className="mt-xl">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="py-2xl text-center">
              <p className="text-muted-foreground">
                No notes yet. Create your first note to get started.
              </p>
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="mt-lg"
              >
                <Plus className="mr-sm h-4 w-4" />
                New Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-md">
            {notes.map((note) => (
              <li key={note.id}>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-md">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/notes/${note.id}`}
                        className="flex items-center gap-sm hover:underline"
                      >
                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <CardTitle>{note.title}</CardTitle>
                      </Link>
                      <CardDescription className="mt-xs line-clamp-2">
                        {note.content.slice(0, 150)}
                        {note.content.length > 150 ? '...' : ''}
                      </CardDescription>
                      {note.tags && note.tags.length > 0 && (
                        <div className="mt-sm flex flex-wrap gap-xs">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-xs">
                      <Link href={`/notes/${note.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
