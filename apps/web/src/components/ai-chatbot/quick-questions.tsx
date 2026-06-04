'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QUICK_QUESTIONS = [
  'What do my lab results mean?',
  'Explain my cholesterol levels',
  'What is a normal blood pressure?',
];

export function QuickQuestions({ reportId }: { reportId?: string }) {
  const router = useRouter();

  const handleQuestion = (q: string) => {
    const params = new URLSearchParams();
    params.set('q', q);
    if (reportId) params.set('reportId', reportId);
    router.push(`/ai-chatbot?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Questions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-sm">
        {QUICK_QUESTIONS.map((q) => (
          <Button
            key={q}
            variant="secondary"
            className="w-full justify-start text-left"
            onClick={() => handleQuestion(q)}
          >
            {q}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
