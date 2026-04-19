import { View, Text, StyleSheet } from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatCurrency } from "@/utils/formatCurrency";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

interface BalanceStatProps {
  type: TransactionType;
  amount: number;
}

export default function BalanceStat({ type, amount }: BalanceStatProps) {
  const isIncome = type === TRANSACTION_TYPES.income;
  const color = isIncome ? COLORS.income : COLORS.expense;
  const label = isIncome ? "Income" : "Expense";
  const Icon = isIncome ? ArrowUp : ArrowDown;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon size={12} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>${formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  amount: {
    fontFamily: FONTS.moneyBold,
    fontSize: FONT_SIZES.body,
    letterSpacing: -0.8,
  },
});
