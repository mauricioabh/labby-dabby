import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getNote, updateNote, deleteNote } from '@/actions/notes';
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
    const note = await getNote(id);
    if (!note) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Note not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: note });
  } catch (e) {
    console.error('GET /api/notes/[id]', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
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
    const body = await req.json();
    const result = await updateNote(id, body);
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }
    return NextResponse.json({ data: result.data });
  } catch (e) {
    console.error('PATCH /api/notes/[id]', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const result = await deleteNote(id);
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }
    return NextResponse.json({ data: result.data });
  } catch (e) {
    console.error('DELETE /api/notes/[id]', e);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
