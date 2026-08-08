import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface BillsEmptyStateProps {
  onAdd: () => void;
}

export default function BillsEmptyState({ onAdd }: BillsEmptyStateProps) {
  return (
    <View>
      {/* A ruled block where the rows would be, matching the empty ledger. */}
      <View style={styles.block}>
        <Text style={styles.label}>NOTHING RECURRING</Text>
        <Text style={styles.body}>Rent, a subscription, a paycheque — anything that repeats.</Text>
      </View>

      <TouchableOpacity style={styles.action} onPress={onAdd} accessibilityRole="button">
        <Text style={styles.actionLabel}>Add a recurring bill</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  action: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.overlayStrong,
  },
  actionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
});
