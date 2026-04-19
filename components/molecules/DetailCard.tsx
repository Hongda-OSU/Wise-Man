import { View, Text, TouchableOpacity, Keyboard, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
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
  const isKeyboardVisible = useKeyboardVisible();

  const handlePress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} accessibilityRole="button">
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
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
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
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
