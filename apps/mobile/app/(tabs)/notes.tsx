import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { fetchNotes, deleteNote } from '@/src/lib/api';

export default function NotesScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
      tags: string[] | null;
      updatedAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadNotes = async () => {
    const token = await getToken();
    const res = await fetchNotes(token, search || undefined);
    if (res.data) setNotes(res.data);
  };

  useEffect(() => {
    loadNotes().finally(() => setLoading(false));
  }, [getToken, search]);

  const handleDelete = async (id: string) => {
    const token = await getToken();
    const res = await deleteNote(id, token);
    if (res.data) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
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
    <ScrollView className="flex-1 bg-background p-lg">
      <Text className="text-2xl font-bold text-foreground">Notes</Text>
      <Text className="mt-sm text-muted-foreground">
        Your health notes with tags.
      </Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search notes..."
        placeholderTextColor="#64748b"
        className="mt-lg rounded-lg border border-input bg-background px-md py-sm text-foreground"
      />

      {notes.length === 0 ? (
        <Text className="mt-xl text-muted-foreground">
          No notes yet. Create via the web app.
        </Text>
      ) : (
        <View className="mt-xl gap-md">
          {notes.map((note) => (
            <Pressable
              key={note.id}
              onPress={() => router.push(`/notes/${note.id}` as const)}
              className="rounded-lg border border-border bg-card p-lg"
            >
              <Text className="font-medium text-foreground">{note.title}</Text>
              <Text
                className="mt-sm text-sm text-muted-foreground"
                numberOfLines={2}
              >
                {note.content.slice(0, 100)}
                {note.content.length > 100 ? '...' : ''}
              </Text>
              {note.tags && note.tags.length > 0 && (
                <View className="mt-sm flex-row flex-wrap gap-xs">
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
            </Pressable>
          ))}
        </View>
      )}

      <Text
        onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_API_URL ?? '')}
        className="mt-xl text-sm text-primary"
      >
        Open web app to create notes →
      </Text>
    </ScrollView>
  );
}

