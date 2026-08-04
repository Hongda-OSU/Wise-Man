import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

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
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <View style={[styles.pill, active && styles.pillActive]}>
        <Icon size={20} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  pill: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
  },
  pillActive: {
    backgroundColor: COLORS.elevated,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
  },
});
