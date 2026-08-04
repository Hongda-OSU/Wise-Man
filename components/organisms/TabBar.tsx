import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DollarSign } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { TABS } from "@/constants/tabs";
import TabButton from "@/components/molecules/TabButton";

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
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
      </View>
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
    backgroundColor: COLORS.surface,
    borderRadius: 34,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  trackSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
