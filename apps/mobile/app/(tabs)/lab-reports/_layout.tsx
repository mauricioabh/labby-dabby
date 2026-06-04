import { Stack } from 'expo-router';

export default function LabReportsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Lab Reports' }} />
      <Stack.Screen name="[id]" options={{ title: 'Report' }} />
    </Stack>
  );
}
