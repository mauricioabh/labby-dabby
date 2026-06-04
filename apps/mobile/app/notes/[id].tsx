import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { fetchNote } from '@/src/lib/api';

export default function NoteDetailScreen() {
  const { getToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<{
    title: string;
    content: string;
    tags: string[] | null;
    updatedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const token = await getToken();
      const res = await fetchNote(id, token);
      if (res.data) setNote(res.data);
      setLoading(false);
    }
    load();
  }, [id, getToken]);

  if (loading || !note) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-muted-foreground">
          {loading ? 'Loading...' : 'Note not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-lg">
      <Text className="text-2xl font-bold text-foreground">{note.title}</Text>
      {note.tags && note.tags.length > 0 && (
        <View className="mt-md flex-row flex-wrap gap-xs">
          {note.tags.map((tag) => (
            <Text
              key={tag}
              className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </Text>
          ))}
        </View>
      )}
      <Text className="mt-sm text-sm text-muted-foreground">
        Updated {new Date(note.updatedAt).toLocaleDateString()}
      </Text>
      <Text className="mt-xl text-foreground">{note.content}</Text>
    </ScrollView>
  );
}
