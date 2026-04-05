import '../global.css';

import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

import { useAppFonts } from '@/hooks/useAppFonts';

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F0EFE9]">
        <ActivityIndicator color="#1A2E28" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="track" />
    </Stack>
  );
}
