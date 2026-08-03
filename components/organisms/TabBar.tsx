import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { DollarSign } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { TABS } from "@/constants/tabs";
import TabButton from "@/components/molecules/TabButton";

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const mid = width / 2;
  const notchHalf = 66;
  const path = `M 0 100 L 0 20 L ${mid - notchHalf} 20 C ${mid - notchHalf / 2} 20 ${mid - notchHalf / 2} 2 ${mid} 2 C ${mid + notchHalf / 2} 2 ${mid + notchHalf / 2} 20 ${mid + notchHalf} 20 L ${width} 20 L ${width} 100 Z`;

  return (
    <View style={styles.container}>
      <Svg width={width} height={100} viewBox={`0 0 ${width} 100`} style={StyleSheet.absoluteFill}>
        <Path d={path} fill="white" stroke={COLORS.toggleBg} strokeWidth="0.5" />
      </Svg>

      <View style={styles.row}>
        {TABS.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}

        <View style={styles.trackCenter}>
          <TouchableOpacity
            style={[styles.trackButton, styles.trackShadow]}
            onPress={() => router.push("/track")}
            accessibilityRole="button"
            accessibilityLabel="Track transaction"
          >
            <DollarSign size={26} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.trackLabel}>Track</Text>
        </View>

        {TABS.slice(2).map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 24,
    height: "100%",
  },
  trackCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  trackButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.forestGreen,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
  },
  trackShadow: {
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  trackLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
  },
});
