import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import HomeHeader from "@/components/organisms/HomeHeader";
import ListEyebrow from "@/components/molecules/ListEyebrow";
import HomeMenu from "@/components/molecules/HomeMenu";
import ErrorNotice from "@/components/molecules/ErrorNotice";
import OptionSheet from "@/components/molecules/OptionSheet";
import TransactionList from "@/components/organisms/TransactionList";
import { COLORS } from "@/constants/colors";
import { useBillStore } from "@/stores/bills";
import { useTransactionStore } from "@/stores/transactions";
import { formatMonthLabel, recentMonths } from "@/utils/dateUtils";
import { groupByDay, sumByType } from "@/utils/groupTransactions";

export default function HomeScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [monthSheetOpen, setMonthSheetOpen] = useState(false);

  const month = useTransactionStore((state) => state.month);
  const items = useTransactionStore((state) => state.items);
  const error = useTransactionStore((state) => state.error);
  const load = useTransactionStore((state) => state.load);
  const setMonth = useTransactionStore((state) => state.setMonth);
  const remove = useTransactionStore((state) => state.remove);
  const seed = useTransactionStore((state) => state.seed);
  const clear = useTransactionStore((state) => state.clear);
  const loadBills = useBillStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  const sections = useMemo(() => groupByDay(items), [items]);
  const monthOptions = useMemo(() => recentMonths(12), []);
  const { income, expense, netBalance } = useMemo(() => sumByType(items), [items]);

  // Stripped from release builds, which leaves the menu -- and the button that
  // opens it -- with nothing in it, so neither is rendered.
  // Both write recurring bills too, and the Events tab stays mounted once it has
  // been opened, so it has to be told to re-read.
  const menuActions = __DEV__
    ? [
        {
          label: "Load sample data",
          onPress: async () => {
            await seed();
            await loadBills();
          },
        },
        {
          label: "Clear all data",
          onPress: async () => {
            await clear();
            await loadBills();
          },
        },
      ]
    : [];

  const openMenu = (top: number) => {
    setMenuTop(top);
    setMenuOpen(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader
        month={formatMonthLabel(month)}
        netBalance={netBalance}
        income={income}
        expense={expense}
        onPressMonth={() => setMonthSheetOpen(true)}
      />

      {error ? <ErrorNotice message={error} /> : null}

      {/* Outside the scroll container: the label stays put while the content
          moves under it. */}
      <ListEyebrow title="TRANSACTIONS" onOpenMenu={menuActions.length ? openMenu : undefined} />

      <TransactionList
        sections={sections}
        onEdit={(id) => router.push(`/transaction/${id}`)}
        onDelete={remove}
        onAdd={() => router.push("/track")}
      />

      <HomeMenu
        visible={menuOpen}
        top={menuTop}
        actions={menuActions}
        onClose={() => setMenuOpen(false)}
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
