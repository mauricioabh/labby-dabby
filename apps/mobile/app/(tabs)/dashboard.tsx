import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { fetchDashboardStats } from '@/src/lib/api';

export default function DashboardScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<{
    total: number;
    normal: number;
    abnormal: number;
    critical: number;
    recent: Array<{
      id: string;
      originalFilename: string;
      status: string;
      reportDate: string | null;
      createdAt: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const res = await fetchDashboardStats(token);
      if (res.data) setStats(res.data);
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
      <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
      <Text className="mt-sm text-muted-foreground">
        Your lab report analysis at a glance.
      </Text>

      {stats && (
        <>
          <View className="mt-xl flex-row flex-wrap gap-md">
            <View className="flex-1 min-w-[140px] rounded-lg border border-border bg-card p-lg">
              <Text className="text-sm text-muted-foreground">Total</Text>
              <Text className="text-2xl font-bold">{stats.total}</Text>
            </View>
            <View className="flex-1 min-w-[140px] rounded-lg border border-border bg-card p-lg">
              <Text className="text-sm text-muted-foreground">Normal</Text>
              <Text className="text-2xl font-bold text-green-600">
                {stats.normal}
              </Text>
            </View>
            <View className="flex-1 min-w-[140px] rounded-lg border border-border bg-card p-lg">
              <Text className="text-sm text-muted-foreground">Abnormal</Text>
              <Text className="text-2xl font-bold text-amber-600">
                {stats.abnormal}
              </Text>
            </View>
            <View className="flex-1 min-w-[140px] rounded-lg border border-border bg-card p-lg">
              <Text className="text-sm text-muted-foreground">Critical</Text>
              <Text className="text-2xl font-bold text-red-600">
                {stats.critical}
              </Text>
            </View>
          </View>

          <Text className="mt-xl text-lg font-semibold text-foreground">
            Recent reports
          </Text>
          {stats.recent.length === 0 ? (
            <Text className="mt-md text-muted-foreground">
              No reports yet. Upload via the web app to get started.
            </Text>
          ) : (
            <View className="mt-md gap-md">
              {stats.recent.map((r) => (
                <Text
                  key={r.id}
                  onPress={() => router.push(`/lab-reports/${r.id}` as const)}
                  className="rounded-lg border border-border bg-card p-lg text-foreground"
                >
                  {r.originalFilename} • {r.status}
                </Text>
              ))}
            </View>
          )}

          <Text
            onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_API_URL ?? '')}
            className="mt-xl text-sm text-primary"
          >
            Open web app to upload reports →
          </Text>
        </>
      )}
    </ScrollView>
  );
}

