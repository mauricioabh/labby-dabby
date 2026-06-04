'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { chatMessages, labReports } from '@/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { chatMessageSchema } from '@/schemas';
import { chatWithContext } from '@/lib/gemini';

export type ChatActionResult =
  | { data: { messageId: string; content: string } }
  | { error: { code: string; message: string } };

export async function sendChatMessage(input: {
  content: string;
  labReportId?: string;
}): Promise<ChatActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { error: { code: 'UNAUTHORIZED', message: 'Sign in required' } };
  }

  const parsed = chatMessageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.message ?? 'Validation failed',
      },
    };
  }

  try {
    let reportContext: string | null = null;
    if (parsed.data.labReportId) {
      const [report] = await db
        .select({
          extractedText: labReports.extractedText,
          analysisSummary: labReports.analysisSummary,
          analysisDetailed: labReports.analysisDetailed,
        })
        .from(labReports)
        .where(
          and(
            eq(labReports.id, parsed.data.labReportId),
            eq(labReports.userId, userId)
          )
        )
        .limit(1);
      if (report) {
        reportContext = [
          report.extractedText,
          report.analysisSummary,
          report.analysisDetailed,
        ]
          .filter(Boolean)
          .join('\n\n');
      }
    }

    const history = await db
      .select({ role: chatMessages.role, content: chatMessages.content })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          parsed.data.labReportId
            ? eq(chatMessages.labReportId, parsed.data.labReportId)
            : isNull(chatMessages.labReportId)
        )
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(20);

    const historyReversed = history.reverse().map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }));

    const assistantReply = await chatWithContext(
      parsed.data.content,
      reportContext,
      historyReversed
    );

    await db.insert(chatMessages).values([
      {
        userId,
        labReportId: parsed.data.labReportId ?? null,
        role: 'user',
        content: parsed.data.content,
      },
      {
        userId,
        labReportId: parsed.data.labReportId ?? null,
        role: 'assistant',
        content: assistantReply,
      },
    ]);

    const [lastMsg] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);

    revalidatePath('/ai-chatbot');
    return {
      data: {
        messageId: lastMsg?.id ?? '',
        content: assistantReply,
      },
    };
  } catch (err) {
    console.error('sendChatMessage', err);
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Failed to send message',
      },
    };
  }
}

export async function getChatHistory(labReportId?: string) {
  const { userId } = await auth();
  if (!userId) return [];

  const condition = labReportId
    ? and(
        eq(chatMessages.userId, userId),
        eq(chatMessages.labReportId, labReportId)
      )
    : and(eq(chatMessages.userId, userId), isNull(chatMessages.labReportId));

  return db
    .select()
    .from(chatMessages)
    .where(condition)
    .orderBy(chatMessages.createdAt);
}
