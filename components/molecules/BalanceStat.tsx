import { View, Text, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import { formatCurrency } from '@/utils/formatCurrency';

interface BalanceStatProps {
  type: 'income' | 'expense';
  amount: number;
}

export default function BalanceStat({ type, amount }: BalanceStatProps) {
  const isIncome = type === 'income';
  const color = isIncome ? COLORS.income : COLORS.expense;
  const label = isIncome ? 'Income' : 'Expense';
  const Icon = isIncome ? ArrowUp : ArrowDown;

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-1">
        <Icon size={12} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>${formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  amount: {
    fontFamily: FONTS.moneyBold,
    fontSize: 16,
    letterSpacing: -0.8,
  },
});
