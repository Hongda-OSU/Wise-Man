import { Stack } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAppFonts } from "@/hooks/useAppFonts";
import { COLORS } from "@/constants/colors";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.forestGreen} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bgPrimary },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="track" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgPrimary,
  },
});
