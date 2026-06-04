import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDashboardStats } from '@/actions/lab-reports';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';

const bearer = { acceptsToken: ['session_token', 'oauth_token'] as const };

export async function GET() {
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

    const stats = await getDashboardStats();
    if (!stats) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } },
        { status: 401 }
      );
    }

    return NextResponse.json({ data: stats });
  } catch (e) {
    console.error('GET /api/dashboard/stats', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
