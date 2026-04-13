import { Tabs } from 'expo-router';
import { View } from 'react-native';

import TabBar from '@/components/templates/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => (
        <View className="absolute bottom-0 left-0 right-0 bg-transparent">
          <TabBar />
        </View>
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="analysis" />
    </Tabs>
  );
}
