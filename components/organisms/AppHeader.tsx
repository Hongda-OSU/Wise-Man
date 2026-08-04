import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Wise Man</Text>

      {/* Grouped rather than two loose glyphs, so the controls read as one cluster. */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Search size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          {/* Relative, not the @/ alias: that resolves for modules but not for
              Metro's asset lookup. */}
          <Image source={require("../../assets/splash-icon.png")} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  // The monogram tile is gone: at 36pt its letterforms were unreadable, and it
  // repeated the wordmark sitting right beside it.
  appName: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 6,
    paddingVertical: 5,
    gap: 4,
  },
  action: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: COLORS.border,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
