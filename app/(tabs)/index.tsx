import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import HomeHeader from "@/components/organisms/HomeHeader";
import TransactionListHeader from "@/components/molecules/TransactionListHeader";
import ViewMenu from "@/components/molecules/ViewMenu";
import OptionSheet from "@/components/molecules/OptionSheet";
import TransactionList from "@/components/organisms/TransactionList";
import CalendarView from "@/components/organisms/CalendarView";
import { COLORS } from "@/constants/colors";
import { useTransactionStore } from "@/stores/transactions";
import { formatMonthLabel, recentMonths } from "@/utils/dateUtils";
import { groupByDay, sumByType } from "@/utils/groupTransactions";
import { HOME_VIEW_MODES } from "@/types/ui";
import type { HomeViewMode } from "@/types/ui";

export default function HomeScreen() {
  const router = useRouter();
  const [view, setView] = useState<HomeViewMode>(HOME_VIEW_MODES.list);
  // Kept apart from `menuOpen` so the panel holds its position through the
  // closing fade instead of jumping to the top of the screen on the way out.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [monthSheetOpen, setMonthSheetOpen] = useState(false);

  const month = useTransactionStore((state) => state.month);
  const items = useTransactionStore((state) => state.items);
  const load = useTransactionStore((state) => state.load);
  const setMonth = useTransactionStore((state) => state.setMonth);
  const remove = useTransactionStore((state) => state.remove);
  const seed = useTransactionStore((state) => state.seed);
  const clear = useTransactionStore((state) => state.clear);

  useEffect(() => {
    load();
  }, [load]);

  const sections = useMemo(() => groupByDay(items), [items]);
  const monthOptions = useMemo(() => recentMonths(12), []);
  const { income, expense, netBalance } = useMemo(() => sumByType(items), [items]);

  const openMenu = (top: number) => {
    setMenuTop(top);
    setMenuOpen(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/transaction/${id}`);
  };

  // Stripped from release builds. Reinstalling drops the database, and there is
  // no point retyping a dozen transactions to look at a populated screen.
  const devActions = __DEV__
    ? [
        { label: "Load sample data", onPress: seed },
        { label: "Clear all data", onPress: clear },
      ]
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader
        month={formatMonthLabel(month)}
        netBalance={netBalance}
        income={income}
        expense={expense}
        onPressMonth={() => setMonthSheetOpen(true)}
      />

      {/* Outside the scroll container: the label and its menu stay put while the
          content moves under them. */}
      <TransactionListHeader onOpenMenu={openMenu} />

      {view === HOME_VIEW_MODES.list ? (
        <TransactionList sections={sections} onEdit={handleEdit} onDelete={remove} />
      ) : (
        <CalendarView
          sections={sections}
          month={month}
          onMonthChange={setMonth}
          onEdit={handleEdit}
          onDelete={remove}
        />
      )}

      <ViewMenu
        visible={menuOpen}
        top={menuTop}
        value={view}
        onSelect={setView}
        onClose={() => setMenuOpen(false)}
        extraActions={devActions}
      />

      <OptionSheet
        visible={monthSheetOpen}
        title="MONTH"
        options={monthOptions}
        selectedId={month}
        onSelect={setMonth}
        onClose={() => setMonthSheetOpen(false)}
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
