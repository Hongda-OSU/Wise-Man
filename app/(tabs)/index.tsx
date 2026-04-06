import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import SummaryCard from '@/components/organisms/SummaryCard';
import TransactionHeader from '@/components/molecules/TransactionHeader';
import { COLORS } from '@/constants/colors';

export default function HomeScreen() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.bgPrimary }} edges={['top']}>
      <AppHeader />
      <SummaryCard
        month="March 2026"
        netBalance={3240.50}
        income={5000}
        expense={1959.50}
      />
      <TransactionHeader view={view} onViewChange={setView} />
    </SafeAreaView>
  );
}
