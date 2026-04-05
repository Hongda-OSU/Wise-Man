import { Tabs } from 'expo-router';

import TabBar from '@/components/templates/TabBar';

export default function TabLayout() {
  return (
    <Tabs tabBar={() => <TabBar />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="analysis" />
    </Tabs>
  );
}
