import { useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "@/components/organisms/HomeHeader";
import TransactionListHeader from "@/components/molecules/TransactionListHeader";
import ViewMenu from "@/components/molecules/ViewMenu";
import TransactionList from "@/components/organisms/TransactionList";
import CalendarView from "@/components/organisms/CalendarView";
import { COLORS } from "@/constants/colors";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";
import { HOME_VIEW_MODES } from "@/types/ui";
import type { HomeViewMode } from "@/types/ui";

export default function HomeScreen() {
  const [view, setView] = useState<HomeViewMode>(HOME_VIEW_MODES.list);
  // Kept apart from `menuOpen` so the panel holds its position through the
  // closing fade instead of jumping to the top of the screen on the way out.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);

  const openMenu = (top: number) => {
    setMenuTop(top);
    setMenuOpen(true);
  };

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader month="March 2026" netBalance={netBalance} income={income} expense={expense} />

      {/* Outside the scroll container: the label and its menu stay put while the
          content moves under them. */}
      <TransactionListHeader onOpenMenu={openMenu} />

      {view === HOME_VIEW_MODES.list ? (
        <TransactionList sections={MOCK_TRANSACTIONS} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <CalendarView sections={MOCK_TRANSACTIONS} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ViewMenu
        visible={menuOpen}
        top={menuTop}
        value={view}
        onSelect={setView}
        onClose={() => setMenuOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
