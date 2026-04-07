import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import SummaryCard from '@/components/organisms/SummaryCard';
import TransactionHeader from '@/components/molecules/TransactionHeader';
import TransactionList from '@/components/organisms/TransactionList';
import { COLORS } from '@/constants/colors';
import { MOCK_TRANSACTIONS } from '@/mocks/transactions';

export default function HomeScreen() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id);
  };

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
      <TransactionList
        sections={MOCK_TRANSACTIONS}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}
