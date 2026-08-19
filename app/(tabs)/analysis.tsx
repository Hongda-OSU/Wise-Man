import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import CategoryRankRow from "@/components/molecules/CategoryRankRow";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorNotice from "@/components/molecules/ErrorNotice";
import ListEyebrow from "@/components/molecules/ListEyebrow";
import MonthComparison from "@/components/molecules/MonthComparison";
import OptionSheet from "@/components/molecules/OptionSheet";
import MonthlyChart from "@/components/molecules/MonthlyChart";
import TabHeader from "@/components/molecules/TabHeader";
import TypeToggle from "@/components/molecules/TypeToggle";
import { COLORS } from "@/constants/colors";
import { listMonthlyTotals } from "@/db/transactions";
import type { MonthlyTotal } from "@/db/transactions";
import { useTransactionStore } from "@/stores/transactions";
import { recentMonths, shiftMonth } from "@/utils/dateUtils";
import { sumByCategory } from "@/utils/groupTransactions";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

// Half a year: enough for a shape to appear, few enough that the bars stay wide
// enough to read on a phone. The last two also feed the comparison above them.
const TREND_MONTHS = 6;

export default function AnalysisScreen() {
  const router = useRouter();
  const [monthSheetOpen, setMonthSheetOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPES.expense);
  const [totals, setTotals] = useState<MonthlyTotal[]>([]);

  const month = useTransactionStore((state) => state.month);
  const items = useTransactionStore((state) => state.items);
  const error = useTransactionStore((state) => state.error);
  const load = useTransactionStore((state) => state.load);
  const setMonth = useTransactionStore((state) => state.setMonth);

  // On focus and whenever the month changes. None of this is in the store, which
  // holds one month of rows at a time.
  useFocusEffect(
    useCallback(() => {
      load();
      listMonthlyTotals(month, TREND_MONTHS, type).then(setTotals);
    }, [load, month, type]),
  );

  const monthOptions = useMemo(() => recentMonths(12), []);
  const ranking = useMemo(() => sumByCategory(items, type), [items, type]);

  // Both figures from one query, so the two halves of the headline are worked out
  // the same way.
  const thisMonth = totals.at(-1)?.amountCents ?? 0;
  const lastMonth = totals.at(-2)?.amountCents ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* No add button: this screen creates nothing. */}
      <TabHeader title="Analysis" ruled={false} />

      <TypeToggle value={type} onChange={setType} />

      <MonthComparison
        month={month}
        previousMonth={shiftMonth(month, -1)}
        currentCents={thisMonth}
        previousCents={lastMonth}
        type={type}
        onPressMonth={() => setMonthSheetOpen(true)}
      />

      {totals.length > 0 ? <MonthlyChart months={totals} type={type} /> : null}

      {error ? <ErrorNotice message={error} /> : null}

      <ListEyebrow title={type === TRANSACTION_TYPES.income ? "INCOME" : "SPENDING"} />

      <FlatList
        data={ranking}
        keyExtractor={(item) => item.categoryId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState
            label={type === TRANSACTION_TYPES.income ? "NOTHING EARNED" : "NOTHING SPENT"}
            body="Nothing recorded on this side for the month yet."
            actionLabel="Add transaction"
            onAction={() => router.push("/track")}
          />
        }
        renderItem={({ item }) => <CategoryRankRow total={item} />}
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
  content: {
    paddingBottom: 120,
  },
});
