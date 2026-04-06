import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import SummaryCard from '@/components/organisms/SummaryCard';
import { COLORS } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.bgPrimary }} edges={['top']}>
      <AppHeader />
      <SummaryCard
        month="March 2026"
        netBalance={3240.50}
        income={5000}
        expense={1959.50}
      />
    </SafeAreaView>
  );
}
