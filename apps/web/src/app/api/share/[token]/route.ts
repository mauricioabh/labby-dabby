import { NextResponse } from 'next/server';
import { getShareByToken } from '@/actions/shares';
import { db } from '@/db';
import { labReports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const share = await getShareByToken(token);
    if (!share) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Link expired or invalid' } },
        { status: 404 }
      );
    }

    const [report] = await db
      .select()
      .from(labReports)
      .where(eq(labReports.id, share.labReportId))
      .limit(1);

    if (!report) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Report not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        originalFilename: report.originalFilename,
        analysisSummary: report.analysisSummary,
        analysisDetailed: report.analysisDetailed,
        suggestedQuestions: report.suggestedQuestions,
        status: report.status,
        reportDate: report.reportDate,
      },
    });
  } catch (e) {
    console.error('GET /api/share/[token]', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
