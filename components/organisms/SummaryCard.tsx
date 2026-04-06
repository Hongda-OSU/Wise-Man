import { View, Text, StyleSheet } from 'react-native';
import { Calendar, ArrowUp, ArrowDown } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import { formatCurrency } from '@/utils/formatCurrency';

interface SummaryCardProps {
  month: string;
  netBalance: number;
  income: number;
  expense: number;
}

export default function SummaryCard({ month, netBalance, income, expense }: SummaryCardProps) {

  return (
    <View className="mx-5 rounded-[20px] px-7 py-6 overflow-hidden" style={styles.card}>
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.caption, color: COLORS.textSecondary, letterSpacing: -0.65 }}>
            {month}
          </Text>
        </View>
        <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.caption, color: COLORS.textSecondary, letterSpacing: -0.65 }}>
          NET BALANCE
        </Text>
      </View>

      {/* Net balance amount */}
      <Text style={{ fontFamily: FONTS.moneyBold, fontSize: 44, color: COLORS.white, letterSpacing: -2, marginBottom: 16 }}>
        ${formatCurrency(netBalance)}
      </Text>

      {/* Progress bar */}
      <View className="h-1.5 rounded-full mb-4 overflow-hidden flex-row" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
        <View
          className="h-full"
          style={{
            width: `${(netBalance / income) * 100}%`,
            backgroundColor: COLORS.income,
            borderTopLeftRadius: 999,
            borderBottomLeftRadius: 999,
          }}
        />
        <View
          className="h-full"
          style={{
            width: `${(expense / income) * 100}%`,
            backgroundColor: COLORS.expense,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
          }}
        />
      </View>

      {/* Income / Expense row */}
      <View className="flex-row justify-between">
        <View className="gap-1">
          <View className="flex-row items-center gap-1">
            <ArrowUp size={12} color={COLORS.income} />
            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.caption, color: COLORS.textSecondary }}>
              Income
            </Text>
          </View>
          <Text style={{ fontFamily: FONTS.moneyBold, fontSize: 16, color: COLORS.income, letterSpacing: -0.8 }}>
            ${formatCurrency(income)}
          </Text>
        </View>

        <View className="gap-1">
          <View className="flex-row items-center gap-1">
            <ArrowDown size={12} color={COLORS.expense} />
            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.caption, color: COLORS.textSecondary }}>
              Expense
            </Text>
          </View>
          <Text style={{ fontFamily: FONTS.moneyBold, fontSize: 16, color: COLORS.expense, letterSpacing: -0.8 }}>
            ${formatCurrency(expense)}
          </Text>
        </View>
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
});
