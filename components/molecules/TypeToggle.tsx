import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

interface TypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

const OPTIONS: { type: TransactionType; label: string }[] = [
  { type: TRANSACTION_TYPES.expense, label: "EXPENSE" },
  { type: TRANSACTION_TYPES.income, label: "INCOME" },
];

/**
 * Which side of the ledger the screen is about. Built from the same two cells and
 * hairline divider as the figures on Home, rather than as a pill or a switch, so
 * it reads as part of the same table -- the selected one is simply the one that
 * is lit, underscored so the state survives being read in a hurry.
 */
export default function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <View style={styles.row}>
      {OPTIONS.map(({ type, label }, index) => {
        const selected = type === value;

        return (
          <View key={type} style={styles.cellWrap}>
            {index > 0 ? <View style={styles.divider} /> : null}

            <TouchableOpacity
              style={styles.cell}
              onPress={() => onChange(type)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
              <View style={[styles.rule, selected && styles.ruleSelected]} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  cellWrap: {
    flex: 1,
    flexDirection: "row",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
    gap: 10,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  labelSelected: {
    color: COLORS.textPrimary,
  },
  // Sits on the container's own bottom hairline, so the selected cell looks like
  // it is holding the rule down rather than carrying an extra decoration.
  rule: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: "transparent",
  },
  ruleSelected: {
    backgroundColor: COLORS.textPrimary,
  },
});
