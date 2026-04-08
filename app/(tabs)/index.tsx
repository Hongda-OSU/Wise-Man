import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import HomeHeader from '@/components/organisms/HomeHeader';
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
      <TransactionList
        sections={MOCK_TRANSACTIONS}
        onEdit={handleEdit}
        onDelete={handleDelete}
        listHeader={<HomeHeader view={view} onViewChange={setView} />}
      />
    </SafeAreaView>
  );
}
