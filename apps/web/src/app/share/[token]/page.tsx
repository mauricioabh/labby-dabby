import { notFound } from 'next/navigation';
import { getShareByToken } from '@/actions/shares';
import { db } from '@/db';
import { labReports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await getShareByToken(token);
  if (!share) notFound();

  const [report] = await db
    .select()
    .from(labReports)
    .where(eq(labReports.id, share.labReportId))
    .limit(1);

  if (!report) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-lg">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Labby-dabby
          </Link>
          <p className="text-sm text-muted-foreground">
            Shared report • View only
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-lg py-xl">
        <div className="mb-xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {report.originalFilename}
          </h1>
          <div className="mt-sm flex items-center gap-md">
            <Badge variant={report.status}>{report.status}</Badge>
            {report.reportDate && (
              <span className="text-sm text-muted-foreground">
                Report date: {new Date(report.reportDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              AI-generated summary in plain language.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground">
              {report.analysisSummary ?? 'No summary available.'}
            </p>
          </CardContent>
        </Card>

        {report.analysisDetailed && (
          <Card className="mt-xl">
            <CardHeader>
              <CardTitle>Detailed analysis</CardTitle>
              <CardDescription>
                Category-by-category breakdown of results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-foreground">
                {report.analysisDetailed}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="mt-xl text-center text-sm text-muted-foreground">
          This link expires on{' '}
          {new Date(share.expiresAt).toLocaleDateString()}.{' '}
          <Link href="/" className="text-primary hover:underline">
            Sign up for Labby-dabby
          </Link>{' '}
          to upload and analyze your own reports.
        </p>
      </main>
    </div>
  );
}
