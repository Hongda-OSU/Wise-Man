import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";

import TabBar from "@/components/organisms/TabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => (
        <View style={styles.tabBarContainer}>
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

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
