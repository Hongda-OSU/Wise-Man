import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { TransactionType } from '@/types/transaction';
import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

interface ToggleBarProps {
  active: TransactionType;
  onChange: (value: TransactionType) => void;
}

export default function ToggleBar({ active, onChange }: ToggleBarProps) {
  return (
    <View className="flex-row rounded-xl p-1" style={styles.track}>
      <TouchableOpacity
        className="flex-1 items-center justify-center rounded-lg py-3"
        style={{ backgroundColor: active === 'expense' ? COLORS.forestGreen : 'transparent' }}
        onPress={() => onChange('expense')}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'expense' }}
      >
        <Text style={[styles.label, { color: active === 'expense' ? COLORS.white : COLORS.textSecondary }]}>
          Expense
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center rounded-lg py-2"
        style={{ backgroundColor: active === 'income' ? COLORS.forestGreen : 'transparent' }}
        onPress={() => onChange('income')}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'income' }}
      >
        <Text style={[styles.label, { color: active === 'income' ? COLORS.white : COLORS.textSecondary }]}>
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: COLORS.toggleBg,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    letterSpacing: -0.2,
  },
});
