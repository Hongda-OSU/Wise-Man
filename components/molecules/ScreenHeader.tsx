import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface ScreenHeaderProps {
  title: string;
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {/* Balances the back button so the title sits on the screen's centre line. */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 18,
  },
  backButton: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
});
