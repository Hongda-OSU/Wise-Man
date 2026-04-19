import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatCurrency } from "@/utils/formatCurrency";
import { TRANSACTION_TYPES } from "@/types/transaction";
import BalanceStat from "@/components/molecules/BalanceStat";
import BalanceProgressBar from "@/components/molecules/BalanceProgressBar";

interface SummaryCardProps {
  month: string;
  netBalance: number;
  income: number;
  expense: number;
}

export default function SummaryCard({
  month,
  netBalance,
  income,
  expense,
}: SummaryCardProps) {
  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.monthRow}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.meta}>{month}</Text>
        </View>
        <Text style={styles.meta}>NET BALANCE</Text>
      </View>

      {/* Net balance amount */}
      <Text style={styles.amount}>${formatCurrency(netBalance)}</Text>

      {/* Progress bar */}
      <BalanceProgressBar income={income} netBalance={netBalance} expense={expense} />

      {/* Income / Expense row */}
      <View style={styles.statsRow}>
        <BalanceStat type={TRANSACTION_TYPES.income} amount={income} />
        <BalanceStat type={TRANSACTION_TYPES.expense} amount={expense} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.forestGreen,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 24,
    overflow: "hidden",
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.65,
  },
  amount: {
    fontFamily: FONTS.moneyBold,
    fontSize: FONT_SIZES.display,
    color: COLORS.white,
    letterSpacing: -2,
    marginBottom: 16,
  },
});
