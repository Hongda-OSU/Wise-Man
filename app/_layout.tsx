import '../global.css';

import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppFonts } from '@/hooks/useAppFonts';

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 items-center justify-center bg-[#F0EFE9]">
          <ActivityIndicator color="#1A2E28" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F0EFE9' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="track" />
      </Stack>
    </GestureHandlerRootView>
  );
}
