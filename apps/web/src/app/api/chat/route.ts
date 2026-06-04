import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getChatHistory, sendChatMessage } from '@/actions/chat';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';

const bearer = { acceptsToken: ['session_token', 'oauth_token'] as const };

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('reportId') ?? undefined;
    const history = await getChatHistory(reportId);
    return NextResponse.json({ data: history });
  } catch (e) {
    console.error('GET /api/chat', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const result = await sendChatMessage(body);
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.code === 'VALIDATION_ERROR' ? 400 : 401 }
      );
    }
    return NextResponse.json({ data: result.data });
  } catch (e) {
    console.error('POST /api/chat', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
