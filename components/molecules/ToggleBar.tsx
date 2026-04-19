import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface ToggleBarProps {
  active: TransactionType;
  onChange: (value: TransactionType) => void;
}

export default function ToggleBar({ active, onChange }: ToggleBarProps) {
  return (
    <View style={styles.track}>
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor:
              active === TRANSACTION_TYPES.expense ? COLORS.forestGreen : "transparent",
          },
        ]}
        onPress={() => onChange(TRANSACTION_TYPES.expense)}
        accessibilityRole="button"
        accessibilityState={{ selected: active === TRANSACTION_TYPES.expense }}
      >
        <Text
          style={[
            styles.label,
            { color: active === TRANSACTION_TYPES.expense ? COLORS.white : COLORS.textSecondary },
          ]}
        >
          Expense
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor:
              active === TRANSACTION_TYPES.income ? COLORS.forestGreen : "transparent",
          },
        ]}
        onPress={() => onChange(TRANSACTION_TYPES.income)}
        accessibilityRole="button"
        accessibilityState={{ selected: active === TRANSACTION_TYPES.income }}
      >
        <Text
          style={[
            styles.label,
            { color: active === TRANSACTION_TYPES.income ? COLORS.white : COLORS.textSecondary },
          ]}
        >
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    backgroundColor: COLORS.toggleBg,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    letterSpacing: -0.2,
  },
});
