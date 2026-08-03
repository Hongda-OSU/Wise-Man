import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

function EmptyStateIcon() {
  return (
    <Svg width={110} height={110} viewBox="0 0 100 100" fill="none">
      {/* Card background */}
      <Path
        d="M73.3333 25H26.6667C21.1438 25 16.6667 29.4772 16.6667 35V65C16.6667 70.5228 21.1438 75 26.6667 75H73.3333C78.8562 75 83.3333 70.5228 83.3333 65V35C83.3333 29.4772 78.8562 25 73.3333 25Z"
        fill={COLORS.toggleBg}
      />
      {/* Card stripe */}
      <Path d="M83.3333 41.6667H16.6667V45H83.3333V41.6667Z" fill={COLORS.divider} />
      {/* Card lines */}
      <Path
        d="M46.6667 51.6667H25C24.0795 51.6667 23.3333 52.4128 23.3333 53.3333C23.3333 54.2538 24.0795 55 25 55H46.6667C47.5871 55 48.3333 54.2538 48.3333 53.3333C48.3333 52.4128 47.5871 51.6667 46.6667 51.6667Z"
        fill={COLORS.divider}
      />
      <Path
        d="M38.3333 60H25C24.0795 60 23.3333 60.7462 23.3333 61.6667C23.3333 62.5871 24.0795 63.3333 25 63.3333H38.3333C39.2538 63.3333 40 62.5871 40 61.6667C40 60.7462 39.2538 60 38.3333 60Z"
        fill={COLORS.divider}
      />
      {/* Green circle badge */}
      <Path
        d="M70.8333 50C79.1176 50 85.8333 43.2843 85.8333 35C85.8333 26.7157 79.1176 20 70.8333 20C62.5491 20 55.8333 26.7157 55.8333 35C55.8333 43.2843 62.5491 50 70.8333 50Z"
        fill={COLORS.forestGreen}
      />
      {/* Plus icon */}
      <Path
        d="M70.8333 28.3333V41.6667M64.1667 35H77.5"
        stroke={COLORS.warmWhite}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function TransactionsEmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <EmptyStateIcon />
      </View>

      <Text style={styles.title}>No transactions yet</Text>
      <Text style={styles.subtitle}>
        Track your income and expenses{"\n"}to start managing your finances
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/track")}
        accessibilityRole="button"
      >
        <Text style={styles.buttonLabel}>Get Started !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
    paddingTop: 32,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  button: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    backgroundColor: COLORS.forestGreen,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: 0.17,
    textShadowColor: COLORS.textPrimary,
    textShadowOffset: { width: 0.4, height: 0.4 },
    textShadowRadius: 0.1,
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: FONTS.serif,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: 0.65,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 48,
  },
  buttonLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.white,
  },
});
