import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/templates/AppHeader';
import HomeHeader from '@/components/organisms/HomeHeader';
import TransactionList from '@/components/organisms/TransactionList';
import { COLORS } from '@/constants/colors';
import { MOCK_TRANSACTIONS_EMPTY as MOCK_TRANSACTIONS } from '@/mocks/transactions';

export default function HomeScreen() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const { income, expense, netBalance } = useMemo(() => {
    const allTransactions = MOCK_TRANSACTIONS.flatMap((s) => s.data);
    const income = allTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = allTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, netBalance: income - expense };
  }, []);

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
        listHeader={
          <HomeHeader
            view={view}
            onViewChange={setView}
            month="March 2026"
            income={income}
            expense={expense}
            netBalance={netBalance}
          />
        }
      />
    </SafeAreaView>
  );
}
