import { Text, TouchableOpacity, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface CalendarDayCellProps {
  day: number;
  income: number;
  expense: number;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function CalendarDayCell({
  day,
  income,
  expense,
  isSelected,
  onPress,
  accessibilityLabel,
}: CalendarDayCellProps) {
  return (
    <TouchableOpacity
      style={[styles.cell, isSelected ? styles.cellSelected : styles.cellDefault]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>{day}</Text>
      <Text style={income ? styles.amountIncome : styles.amountZero} numberOfLines={1}>
        {income ? `+${Math.round(income)}` : "$0"}
      </Text>
      <Text style={expense ? styles.amountExpense : styles.amountZero} numberOfLines={1}>
        {expense ? `-${Math.round(expense)}` : "$0"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 44,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  cellDefault: {
    backgroundColor: COLORS.white,
  },
  cellSelected: {
    backgroundColor: COLORS.forestGreen,
  },
  dayNumber: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textPrimary,
  },
  dayNumberSelected: {
    color: COLORS.white,
  },
  amountIncome: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.income,
    marginTop: 1,
  },
  amountExpense: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.expense,
    marginTop: 1,
  },
  amountZero: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
