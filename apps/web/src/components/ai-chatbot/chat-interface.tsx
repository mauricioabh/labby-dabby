'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage } from '@/actions/chat';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your AI health assistant. I can help you understand your lab results, answer medical questions, and provide health information. How can I assist you today?",
  createdAt: new Date(),
};

export function ChatInterface({
  className,
  reportId,
  initialMessages,
  initialQuestion,
}: {
  className?: string;
  reportId?: string;
  initialMessages: ChatMessage[];
  initialQuestion?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length > 0 ? initialMessages : [WELCOME_MESSAGE]
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialQuestionSent, setInitialQuestionSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(
      initialMessages.length > 0 ? initialMessages : [WELCOME_MESSAGE]
    );
  }, [reportId, initialMessages]);

  useEffect(() => {
    if (!initialQuestion?.trim() || initialQuestionSent || loading) return;
    setInitialQuestionSent(true);
    void (async () => {
      const text = initialQuestion.trim();
      setMessages((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          role: 'user',
          content: text,
          createdAt: new Date(),
        },
      ]);
      setLoading(true);
      const result = await sendChatMessage({
        content: text,
        labReportId: reportId,
      });
      setLoading(false);
      if ('error' in result) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: `Error: ${result.error.message}`,
            createdAt: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: result.data.messageId,
            role: 'assistant',
            content: result.data.content,
            createdAt: new Date(),
          },
        ]);
      }
    })();
  }, [initialQuestion, initialQuestionSent, loading, reportId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmitMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date(),
      },
    ]);
    setLoading(true);

    const result = await sendChatMessage({
      content: text,
      labReportId: reportId,
    });
    setLoading(false);

    if ('error' in result) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${result.error.message}`,
          createdAt: new Date(),
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: result.data.messageId,
        role: 'assistant',
        content: result.data.content,
        createdAt: new Date(),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    await handleSubmitMessage(userMessage);
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-card ${className ?? ''}`}
    >
      <div className="flex items-center gap-sm border-b border-border px-lg py-md">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold text-foreground">Chat with AI Assistant</h3>
          <p className="text-xs text-muted-foreground">
            Ask questions about your health, lab results, medications, or general
            wellness.
          </p>
        </div>
      </div>
      <div className="flex max-h-[500px] flex-1 flex-col overflow-y-auto p-lg">
        {messages.length === 0 && !initialQuestion ? (
          <p className="py-xl text-center text-muted-foreground">
            Start a conversation. Ask about your lab results or general health
            questions.
          </p>
        ) : (
          <div className="space-y-lg">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-md py-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-md border-t border-border p-lg"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      <p className="px-lg pb-md text-xs text-muted-foreground">
        This AI assistant is for informational purposes only and does not
        replace professional medical advice.
      </p>
    </div>
  );
}
