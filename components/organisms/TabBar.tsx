import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DollarSign } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";

import { COLORS } from "@/constants/colors";
import { TABS } from "@/constants/tabs";
import TabButton from "@/components/molecules/TabButton";

// Liquid Glass is iOS 26 and up. Everything else gets a blur, which is the same idea
// with less depth, and Android falls back again to a translucent fill inside BlurView.
const Bar = isLiquidGlassAvailable()
  ? (props: { children: React.ReactNode }) => (
      <GlassView glassEffectStyle="regular" colorScheme="dark" style={styles.bar} {...props} />
    )
  : (props: { children: React.ReactNode }) => (
      <BlurView intensity={40} tint="dark" style={styles.bar} {...props} />
    );

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom - 14, 8) }]}>
      <Bar>
        {TABS.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}

        <View style={styles.trackSlot}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => router.push("/track")}
            accessibilityRole="button"
            accessibilityLabel="Track transaction"
          >
            <DollarSign size={24} color={COLORS.onAccent} />
          </TouchableOpacity>
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
      </Bar>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
  },
  // A floating capsule rather than a full-width bar with a notch, so the centre action
  // sits inside the bar instead of breaking out of it.
  bar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 34,
    // Clips the blur to the capsule; without it BlurView paints its own square corners.
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  trackSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
