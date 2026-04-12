import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface DetailCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  onPress?: () => void;
}

export default function DetailCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  onPress,
}: DetailCardProps) {
  return (
    <TouchableOpacity
      className="flex-1 bg-white rounded-2xl p-4"
      onPress={onPress}
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="items-center justify-center"
          style={[styles.iconBox, { backgroundColor: iconBg }]}
        >
          <Icon size={14} color={iconColor} />
        </View>
        <ChevronRight size={16} color={COLORS.textSecondary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
});
