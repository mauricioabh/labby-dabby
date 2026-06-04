'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { db } from '@/db';
import { reportShares, labReports } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createShareSchema } from '@/schemas';

export type ShareActionResult =
  | { data: { shareToken: string; shareUrl: string } }
  | { error: { code: string; message: string } };

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function createShare(input: {
  labReportId: string;
  recipientEmail?: string;
  expiresInDays?: number;
}): Promise<ShareActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  const parsed = createShareSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.message ?? 'Validation failed',
      },
    };
  }

  try {
    const [report] = await db
      .select()
      .from(labReports)
      .where(and(eq(labReports.id, parsed.data.labReportId), eq(labReports.userId, userId)))
      .limit(1);

    if (!report) {
      return { error: { code: 'NOT_FOUND', message: 'Report not found' } };
    }

    const shareToken = randomBytes(24).toString('base64url');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (parsed.data.expiresInDays ?? 7));

    await db.insert(reportShares).values({
      labReportId: parsed.data.labReportId,
      userId,
      shareToken,
      recipientEmail: parsed.data.recipientEmail,
      expiresAt,
    });

    revalidatePath(`/lab-reports/${parsed.data.labReportId}`);
    return {
      data: {
        shareToken,
        shareUrl: `${appUrl}/share/${shareToken}`,
      },
    };
  } catch (err) {
    console.error('createShare', err);
    return {
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create share link' },
    };
  }
}

export async function getShareByToken(token: string) {
  const [share] = await db
    .select()
    .from(reportShares)
    .where(eq(reportShares.shareToken, token))
    .limit(1);

  if (!share || new Date() > share.expiresAt) return null;
  return share;
}
