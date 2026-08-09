import { useEffect } from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "@/db/client";
import { ensureDefaultAccount } from "@/db/accounts";
import migrations from "@/db/migrations/migrations";
import { useAppFonts } from "@/hooks/useAppFonts";
import { useAccountStore } from "@/stores/accounts";
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

  // Both gated on the migration, or the tables they touch do not exist yet.
  //
  // Bills post themselves, and this is the only moment guaranteed to happen
  // before any screen reads: Home would otherwise show a month missing its rent
  // until the Events tab had been opened. Accounts load here for a different
  // reason -- the transaction and bill forms read them straight from the store,
  // so the list has to be there before either form can open.
  useEffect(() => {
    if (!migrated) return;

    // The account has to exist before anything reads: both stores and both forms
    // assume there is one to fall back to.
    ensureDefaultAccount().then(() => {
      useAccountStore.getState().load();
      useBillStore.getState().load();
    });
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
        <Stack.Screen name="account/new" />
        <Stack.Screen name="account/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
