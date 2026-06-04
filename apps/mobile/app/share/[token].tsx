import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function ShareScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [report, setReport] = useState<{
    originalFilename: string;
    analysisSummary: string | null;
    analysisDetailed: string | null;
    suggestedQuestions: string[] | null;
    status: string;
    reportDate: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/share/${token}`);
        if (!res.ok) {
          setError('Link expired or invalid');
          return;
        }
        const json = await res.json();
        if (json.data) setReport(json.data);
        else setError('Invalid response');
      } catch {
        setError('Failed to load');
      }
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-destructive">{error ?? 'Not found'}</Text>
        <Text
          onPress={() => Linking.openURL(API_URL)}
          className="mt-lg text-primary"
        >
          Open Labby-dabby
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-lg">
      <Text className="text-2xl font-bold text-foreground">
        {report.originalFilename}
      </Text>
      <View className="mt-sm flex-row items-center gap-md">
        <Text
          className={`rounded px-2 py-0.5 text-xs font-semibold ${
            report.status === 'normal'
              ? 'bg-green-500/15 text-green-700'
              : report.status === 'abnormal'
                ? 'bg-amber-500/15 text-amber-700'
                : 'bg-red-500/15 text-red-700'
          }`}
        >
          {report.status}
        </Text>
        {report.reportDate && (
          <Text className="text-sm text-muted-foreground">
            {new Date(report.reportDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <Text className="mt-xl text-lg font-semibold text-foreground">
        Summary
      </Text>
      <Text className="mt-sm text-foreground">
        {report.analysisSummary ?? 'No summary available.'}
      </Text>

      {report.analysisDetailed && (
        <>
          <Text className="mt-xl text-lg font-semibold text-foreground">
            Detailed analysis
          </Text>
          <Text className="mt-sm text-foreground">
            {report.analysisDetailed}
          </Text>
        </>
      )}

      {report.suggestedQuestions && report.suggestedQuestions.length > 0 && (
        <>
          <Text className="mt-xl text-lg font-semibold text-foreground">
            Questions for your doctor
          </Text>
          {report.suggestedQuestions.map((q, i) => (
            <Text key={i} className="mt-sm text-muted-foreground">
              • {q}
            </Text>
          ))}
        </>
      )}

      <Text
        onPress={() => Linking.openURL(API_URL)}
        className="mt-xl text-sm text-primary"
      >
        Sign up for Labby-dabby →
      </Text>
    </ScrollView>
  );
}
