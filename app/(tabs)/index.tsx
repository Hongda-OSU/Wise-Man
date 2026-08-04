import { useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/organisms/AppHeader";
import SummaryCard from "@/components/organisms/SummaryCard";
import TransactionListHeader from "@/components/molecules/TransactionListHeader";
import TransactionList from "@/components/organisms/TransactionList";
import CalendarView from "@/components/organisms/CalendarView";
import { COLORS } from "@/constants/colors";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import { HOME_VIEW_MODES } from "@/types/ui";
import type { HomeViewMode } from "@/types/ui";

export default function HomeScreen() {
  const [view, setView] = useState<HomeViewMode>(HOME_VIEW_MODES.list);

  const { income, expense, netBalance } = useMemo(() => {
    const allTransactions = MOCK_TRANSACTIONS.flatMap((s) => s.data);
    const income = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, netBalance: income - expense };
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete transaction:", id);
  };

  const header = (
    <>
      <SummaryCard month="March 2026" netBalance={netBalance} income={income} expense={expense} />
      <TransactionListHeader view={view} onViewChange={setView} />
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />
      {view === HOME_VIEW_MODES.list ? (
        <TransactionList
          sections={MOCK_TRANSACTIONS}
          onEdit={handleEdit}
          onDelete={handleDelete}
          listHeader={header}
        />
      ) : (
        <CalendarView
          sections={MOCK_TRANSACTIONS}
          onEdit={handleEdit}
          onDelete={handleDelete}
          listHeader={header}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
