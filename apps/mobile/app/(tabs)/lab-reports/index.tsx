import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { fetchLabReports } from '@/src/lib/api';

export default function LabReportsScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<
    Array<{
      id: string;
      originalFilename: string;
      analysisSummary: string | null;
      status: string;
      reportDate: string | null;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const res = await fetchLabReports(token);
      if (res.data) setReports(res.data);
      setLoading(false);
    }
    load();
  }, [getToken]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-lg">
      <Text className="text-2xl font-bold text-foreground">Lab Reports</Text>
      <Text className="mt-sm text-muted-foreground">
        Upload and analyze via the web app.
      </Text>

      {reports.length === 0 ? (
        <Text className="mt-xl text-muted-foreground">
          No reports yet. Upload a PDF on the web app.
        </Text>
      ) : (
        <View className="mt-xl gap-md">
          {reports.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/lab-reports/${r.id}` as const)}
              className="rounded-lg border border-border bg-card p-lg"
            >
              <Text className="font-medium text-foreground">
                {r.originalFilename}
              </Text>
              <Text className="mt-sm text-sm text-muted-foreground" numberOfLines={2}>
                {r.analysisSummary ?? 'Processing...'}
              </Text>
              <View className="mt-sm flex-row items-center gap-md">
                <Text
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    r.status === 'normal'
                      ? 'bg-green-500/15 text-green-700'
                      : r.status === 'abnormal'
                        ? 'bg-amber-500/15 text-amber-700'
                        : 'bg-red-500/15 text-red-700'
                  }`}
                >
                  {r.status}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {r.reportDate
                    ? new Date(r.reportDate).toLocaleDateString()
                    : 'No date'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Text
        onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_API_URL ?? '')}
        className="mt-xl text-sm text-primary"
      >
        Open web app to upload →
      </Text>
    </ScrollView>
  );
}
