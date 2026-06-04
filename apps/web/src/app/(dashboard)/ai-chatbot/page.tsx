import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getChatHistory } from '@/actions/chat';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatInterface } from '@/components/ai-chatbot/chat-interface';
import { QuickQuestions } from '@/components/ai-chatbot/quick-questions';

export default async function AIChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ reportId?: string; q?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { reportId, q } = await searchParams;
  const initialMessages = await getChatHistory(reportId);

  return (
    <div className="mx-auto max-w-4xl px-lg py-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        AI Health Chatbot
      </h1>
      <p className="mt-sm text-muted-foreground">
        Get instant answers to your medical questions with AI-powered assistance.
      </p>
      <ChatInterface
        className="mt-xl"
        reportId={reportId}
        initialQuestion={q}
        initialMessages={initialMessages.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          createdAt: m.createdAt,
        }))}
      />
      <div className="mt-xl grid gap-lg sm:grid-cols-3">
        <QuickQuestions reportId={reportId} />
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get personalized health recommendations based on your lab results
              and medical history.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ask about medications, symptoms, conditions, and general health
              topics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
