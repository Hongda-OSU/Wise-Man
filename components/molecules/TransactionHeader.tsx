import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { List, CalendarDays } from "lucide-react-native";

import { HOME_VIEW_MODES } from "@/types/ui";
import type { HomeViewMode } from "@/types/ui";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface TransactionHeaderProps {
  view: HomeViewMode;
  onViewChange: (view: HomeViewMode) => void;
}

const VIEW_SEGMENTS = [
  { key: HOME_VIEW_MODES.list, icon: List },
  { key: HOME_VIEW_MODES.calendar, icon: CalendarDays },
];

export default function TransactionHeader({ view, onViewChange }: TransactionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRANSACTIONS</Text>
      <View style={styles.segmentTrack}>
        {VIEW_SEGMENTS.map(({ key, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.segment,
              { backgroundColor: view === key ? COLORS.white : "transparent" },
            ]}
            onPress={() => onViewChange(key as HomeViewMode)}
            accessibilityRole="button"
          >
            <Icon size={18} color={view === key ? COLORS.textPrimary : COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    marginTop: 28,
    marginBottom: 6,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  segmentTrack: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 4,
    backgroundColor: COLORS.toggleBg,
  },
  segment: {
    width: 48,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
