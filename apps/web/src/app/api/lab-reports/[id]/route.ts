import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getLabReport } from '@/actions/lab-reports';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';

const bearer = { acceptsToken: ['session_token', 'oauth_token'] as const };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await auth({
      acceptsToken: ['session_token', 'oauth_token'],
    });
    const userId = (authResult as { userId?: string } | null)?.userId ?? null;
    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } },
        { status: 401 }
      );
    }

    await ensureUserInDatabase(bearer);

    const { id } = await params;
    const report = await getLabReport(id);
    if (!report) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Report not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: report });
  } catch (e) {
    console.error('GET /api/lab-reports/[id]', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
