import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import { formatCurrency } from '@/utils/formatCurrency';
import BalanceStat from '@/components/molecules/BalanceStat';
import BalanceProgressBar from '@/components/molecules/BalanceProgressBar';

interface SummaryCardProps {
  month: string;
  netBalance: number;
  income: number;
  expense: number;
}

export default function SummaryCard({ month, netBalance, income, expense }: SummaryCardProps) {
  return (
    <View className="mx-5 mt-4 rounded-[20px] px-7 py-6 overflow-hidden" style={styles.card}>
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.meta}>{month}</Text>
        </View>
        <Text style={styles.meta}>NET BALANCE</Text>
      </View>

      {/* Net balance amount */}
      <Text className="mb-4" style={styles.amount}>${formatCurrency(netBalance)}</Text>

      {/* Progress bar */}
      <BalanceProgressBar income={income} netBalance={netBalance} expense={expense} />

      {/* Income / Expense row */}
      <View className="flex-row justify-between">
        <BalanceStat type="income" amount={income} />
        <BalanceStat type="expense" amount={expense} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.forestGreen,
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
  },
});
