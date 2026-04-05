import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F0EFE9]">
      <AppHeader />
    </SafeAreaView>
  );
}
