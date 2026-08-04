import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface TabButtonProps {
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  active: boolean;
  onPress: () => void;
}

export default function TabButton({ label, icon: Icon, active, onPress }: TabButtonProps) {
  const color = active ? COLORS.textPrimary : COLORS.textSecondary;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} accessibilityRole="button">
      <Icon size={22} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
  },
});
