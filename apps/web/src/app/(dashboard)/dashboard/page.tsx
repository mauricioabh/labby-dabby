import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  StickyNote,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { getDashboardStats } from '@/actions/lab-reports';
import { getRecentNotes } from '@/actions/notes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [stats, recentNotes] = await Promise.all([
    getDashboardStats(),
    getRecentNotes(5),
  ]);
  if (!stats) return null;

  const { recent } = stats;

  return (
    <div className="mx-auto max-w-6xl px-lg py-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-sm text-muted-foreground">
        Your lab report analysis at a glance.
      </p>

      <div className="mt-xl grid gap-xl lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Lab Reports</CardTitle>
            <Link
              href="/lab-reports"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              <Upload className="mr-sm h-4 w-4" />
              Upload
            </Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reports yet. Upload your first lab report to get started.
              </p>
            ) : (
              <ul className="space-y-md">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/lab-reports/${r.id}`}
                      className="flex items-center gap-md rounded-lg p-md transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {r.originalFilename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.reportDate
                            ? new Date(r.reportDate).toLocaleDateString()
                            : new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notes</CardTitle>
            <Link
              href="/notes"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              <StickyNote className="mr-sm h-4 w-4" />
              New Note
            </Link>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notes yet. Create your first note to get started.
              </p>
            ) : (
              <ul className="space-y-md">
                {recentNotes.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/notes/${n.id}`}
                      className="flex items-center gap-md rounded-lg p-md transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <StickyNote className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
