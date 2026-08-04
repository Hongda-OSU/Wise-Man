import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import type { ComponentType } from "react";

import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface SwipeActionProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  backgroundColor: string;
  contentColor: string;
  style?: ViewStyle;
  onPress: () => void;
}

export default function SwipeAction({
  icon: Icon,
  label,
  backgroundColor,
  contentColor,
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
      <Icon size={18} color={contentColor} />
      <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
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
    marginTop: 4,
  },
});
