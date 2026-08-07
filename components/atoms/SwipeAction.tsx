import { Text, TouchableOpacity, StyleSheet } from "react-native";
import type { ComponentType } from "react";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface SwipeActionProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  contentColor: string;
  /** Which edge the action is revealed from; decides where its rule sits. */
  side: "left" | "right";
  onPress: () => void;
}

export default function SwipeAction({
  icon: Icon,
  label,
  contentColor,
  side,
  onPress,
}: SwipeActionProps) {
  return (
    <TouchableOpacity
      style={[styles.container, side === "left" ? styles.ruledRight : styles.ruledLeft]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon size={14} color={contentColor} />
      <Text style={[styles.label, { color: contentColor }]}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // A cell in the same table, not a coloured slab: one neutral surface for both
  // actions, with meaning carried by the glyph.
  container: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: COLORS.elevated,
  },
  ruledRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.border,
  },
  ruledLeft: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.fine,
    letterSpacing: 0.6,
  },
});
