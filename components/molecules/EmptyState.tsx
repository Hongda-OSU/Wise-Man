import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface EmptyStateProps {
  /** Eyebrow, already uppercase. */
  label: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}

/**
 * A ruled block where the rows would be, so a table reads as empty rather than
 * as missing, with the one action that would fill it.
 */
export default function EmptyState({ label, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View>
      <View style={styles.block}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>

      <TouchableOpacity style={styles.action} onPress={onAction} accessibilityRole="button">
        <Text style={styles.actionLabel}>{actionLabel}</Text>
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
    borderBottomColor: COLORS.border,
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
