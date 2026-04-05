import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import { COLORS } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.bgPrimary }}>
      <AppHeader />
    </SafeAreaView>
  );
}
