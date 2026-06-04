import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Share2, MessageCircle } from 'lucide-react';
import { getLabReport } from '@/actions/lab-reports';
import { ShareReportButton } from '@/components/lab-reports/share-report-button';
import { AILabAssistant } from '@/components/lab-reports/ai-lab-assistant';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui';

export default async function LabReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  const report = await getLabReport(id);
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-4xl px-lg py-xl">
      <div className="mb-xl">
        <Link
          href="/lab-reports"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Lab Reports
        </Link>
      </div>

      <div className="flex flex-col gap-lg sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {report.originalFilename}
          </h1>
          <div className="mt-sm flex flex-wrap items-center gap-md">
            <Badge variant={report.status}>{report.status}</Badge>
            {report.reportDate && (
              <span className="text-sm text-muted-foreground">
                Report date: {new Date(report.reportDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-md">
          <ShareReportButton reportId={report.id} />
          <Link
            href={`/ai-chatbot?reportId=${report.id}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            <MessageCircle className="mr-sm h-4 w-4" />
            Ask about this report
          </Link>
        </div>
      </div>

      <Card className="mt-xl">
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
              Category-by-category breakdown of your results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-foreground">
              {report.analysisDetailed}
            </div>
          </CardContent>
        </Card>
      )}

      {report.suggestedQuestions && report.suggestedQuestions.length > 0 && (
        <Card className="mt-xl">
          <CardHeader>
            <CardTitle>Follow-Up Questions for Your Clinician</CardTitle>
            <CardDescription>
              Suggested questions based on your results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-sm">
              {report.suggestedQuestions.map((q, i) => (
                <li key={i} className="text-muted-foreground">
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="mt-xl">
        <AILabAssistant />
      </div>
    </div>
  );
}
