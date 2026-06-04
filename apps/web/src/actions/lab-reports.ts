'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { labReports } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { analyzeLabReport } from '@/lib/gemini';
import { sendLabReportEmail } from '@/lib/resend';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';

export type LabReportActionResult =
  | { data: { id: string } }
  | { error: { code: string; message: string } };

export async function processLabReportUpload(
  fileUrl: string,
  originalFilename: string,
  userEmail?: string
): Promise<LabReportActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  await ensureUserInDatabase();

  try {
    const { extractTextFromPdfUrl } = await import('@/lib/pdf');
    const extractedText = await extractTextFromPdfUrl(fileUrl);
    if (!extractedText?.trim()) {
      return {
        error: {
          code: 'EXTRACTION_FAILED',
          message: 'Could not extract text from PDF. The file may be scanned or corrupted.',
        },
      };
    }

    const analysis = await analyzeLabReport(extractedText);

    const [report] = await db
      .insert(labReports)
      .values({
        userId,
        fileUrl,
        originalFilename,
        extractedText,
        analysisSummary: analysis.summary,
        analysisDetailed: analysis.detailed,
        suggestedQuestions: analysis.suggestedQuestions,
        status: analysis.status,
        reportDate: analysis.reportDate,
      })
      .returning({ id: labReports.id });

    if (!report) {
      return { error: { code: 'INTERNAL_ERROR', message: 'Failed to save report' } };
    }

    if (userEmail) {
      await sendLabReportEmail(userEmail, analysis.summary, report.id);
    }

    revalidatePath('/dashboard');
    revalidatePath('/lab-reports');

    return { data: { id: report.id } };
  } catch (err) {
    console.error('processLabReportUpload', err);
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Failed to process report',
      },
    };
  }
}

export async function getLabReport(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const [report] = await db
    .select()
    .from(labReports)
    .where(and(eq(labReports.id, id), eq(labReports.userId, userId)))
    .limit(1);

  return report ?? null;
}

export async function getLabReports() {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select()
    .from(labReports)
    .where(eq(labReports.userId, userId))
    .orderBy(desc(labReports.createdAt));
}

export async function getDashboardStats() {
  const { userId } = await auth();
  if (!userId) return null;

  const reports = await db
    .select({ status: labReports.status })
    .from(labReports)
    .where(eq(labReports.userId, userId));

  const total = reports.length;
  const normal = reports.filter((r) => r.status === 'normal').length;
  const abnormal = reports.filter((r) => r.status === 'abnormal').length;
  const critical = reports.filter((r) => r.status === 'critical').length;

  const recent = await db
    .select()
    .from(labReports)
    .where(eq(labReports.userId, userId))
    .orderBy(desc(labReports.createdAt))
    .limit(5);

  return { total, normal, abnormal, critical, recent };
}

export type AnalyzePastedResult =
  | { data: { summary: string; detailed: string; suggestedQuestions: string[] } }
  | { error: { code: string; message: string } };

export async function analyzePastedLabText(
  text: string
): Promise<AnalyzePastedResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  if (!text?.trim()) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please paste your lab values.',
      },
    };
  }

  try {
    const analysis = await analyzeLabReport(text.trim());
    return {
      data: {
        summary: analysis.summary,
        detailed: analysis.detailed,
        suggestedQuestions: analysis.suggestedQuestions,
      },
    };
  } catch (err) {
    console.error('analyzePastedLabText', err);
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Analysis failed',
      },
    };
  }
}
