import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', headerShown: true }}
      />
      <Tabs.Screen
        name="lab-reports"
        options={{ title: 'Lab Reports', headerShown: false }}
      />
      <Tabs.Screen
        name="ai-chatbot"
        options={{ title: 'AI Chatbot', headerShown: true }}
      />
      <Tabs.Screen
        name="notes"
        options={{ title: 'Notes', headerShown: true }}
      />
    </Tabs>
  );
}
