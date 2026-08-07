import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { TABS } from "@/constants/tabs";
import GlassSurface from "@/components/atoms/GlassSurface";
import TabButton from "@/components/molecules/TabButton";

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom - 14, 8) }]}>
      <GlassSurface style={styles.bar}>
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
            <Plus size={20} color={COLORS.onAction} strokeWidth={2.5} />
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
      </GlassSurface>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.action,
    alignItems: "center",
    justifyContent: "center",
  },
});
