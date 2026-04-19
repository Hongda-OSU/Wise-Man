import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import type { ComponentType } from "react";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface SwipeActionProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  backgroundColor: string;
  style?: ViewStyle;
  onPress: () => void;
}

export default function SwipeAction({
  icon: Icon,
  label,
  backgroundColor,
  style,
  onPress,
}: SwipeActionProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon size={18} color={COLORS.white} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.white,
    marginTop: 4,
  },
});
