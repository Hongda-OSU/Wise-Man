import { useEffect } from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import { useAppFonts } from "@/hooks/useAppFonts";
import { useBillStore } from "@/stores/bills";
import { COLORS } from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const { success: migrated, error: migrationError } = useMigrations(db, migrations);
  const ready = (fontsLoaded || fontError !== null) && (migrated || migrationError !== undefined);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  // Recurring bills post themselves, and this is the only moment guaranteed to
  // happen before any screen reads: Home would otherwise show a month missing its
  // rent until the Events tab had been opened. Gated on the migration, or the
  // table it writes to does not exist yet.
  useEffect(() => {
    if (migrated) {
      useBillStore.getState().load();
    }
  }, [migrated]);

  // Hold the native splash rather than flashing a spinner over it. A font that fails to
  // load still counts as ready: the app renders in the system font instead of hanging.
  // A failed migration counts as ready too, so the failure is visible in the app rather
  // than as a splash screen that never goes away.
  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="track" />
        <Stack.Screen name="transaction/[id]" />
        <Stack.Screen name="bill/new" />
        <Stack.Screen name="bill/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
