import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { fetchLabReport } from '@/src/lib/api';

export default function LabReportDetailScreen() {
  const { getToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<{
    originalFilename: string;
    analysisSummary: string | null;
    analysisDetailed: string | null;
    suggestedQuestions: string[] | null;
    status: string;
    reportDate: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const token = await getToken();
      const res = await fetchLabReport(id, token);
      if (res.data) setReport(res.data);
      setLoading(false);
    }
    load();
  }, [id, getToken]);

  if (loading || !report) {
    return (
      <View className="flex-1 items-center justify-center p-lg">
        <Text className="text-muted-foreground">
          {loading ? 'Loading...' : 'Report not found'}
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
          <Text className="mt-sm whitespace-pre-wrap text-foreground">
            {report.analysisDetailed}
          </Text>
        </>
      )}

      {report.suggestedQuestions &&
        report.suggestedQuestions.length > 0 && (
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
    </ScrollView>
  );
}
