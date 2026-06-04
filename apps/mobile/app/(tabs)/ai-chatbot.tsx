import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { fetchChatHistory, sendChatMessage } from '@/src/lib/api';

export default function AIChatbotScreen() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<
    Array<{ id: string; role: string; content: string; createdAt: string }>
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const res = await fetchChatHistory(token);
      if (res.data) setMessages(res.data);
      setLoading(false);
    }
    load();
  }, [getToken]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: userMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    setSending(true);

    const token = await getToken();
    const res = await sendChatMessage(token, { content: userMessage });
    setSending(false);

    if (res.data) {
      setMessages((prev) => [
        ...prev,
        {
          id: res.data!.messageId,
          role: 'assistant',
          content: res.data!.content,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${res.error?.message ?? 'Failed to send'}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-background p-lg"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        <Text className="text-2xl font-bold text-foreground">AI Chatbot</Text>
        <Text className="mt-sm text-muted-foreground">
          Ask questions about your lab results.
        </Text>

        {messages.length === 0 ? (
          <Text className="mt-xl text-muted-foreground">
            Start a conversation. Ask about your lab results or general health
            questions.
          </Text>
        ) : (
          <View className="mt-xl gap-lg">
            {messages.map((m) => (
              <View
                key={m.id}
                className={
                  m.role === 'user'
                    ? 'items-end'
                    : 'items-start'
                }
              >
                <View
                  className={`max-w-[85%] rounded-lg px-md py-sm ${
                    m.role === 'user'
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                >
                  <Text
                    className={
                      m.role === 'user'
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }
                  >
                    {m.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View className="flex-row gap-md border-t border-border bg-background p-lg">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question..."
          placeholderTextColor="#64748b"
          editable={!sending}
          className="flex-1 rounded-lg border border-input bg-background px-md py-sm text-foreground"
        />
        <Pressable
          onPress={handleSend}
          disabled={sending || !input.trim()}
          className="rounded-lg bg-primary px-lg py-sm justify-center"
        >
          <Text className="font-medium text-primary-foreground">
            {sending ? '...' : 'Send'}
          </Text>
        </Pressable>
      </View>

      <Text className="px-lg pb-md text-xs text-muted-foreground">
        This AI provides general guidance only. Always consult your doctor.
      </Text>
    </KeyboardAvoidingView>
  );
}

