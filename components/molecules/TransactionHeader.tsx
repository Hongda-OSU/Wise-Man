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

export default function TransactionHeader({
  view,
  onViewChange,
}: TransactionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-8 mt-7 mb-3">
      <Text style={styles.title}>TRANSACTIONS</Text>
      <View
        className="flex-row items-center rounded-xl p-1"
        style={styles.segmentTrack}
      >
        {VIEW_SEGMENTS.map(({ key, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            className="rounded-lg w-12 h-9 items-center justify-center"
            style={{
              backgroundColor: view === key ? COLORS.white : "transparent",
            }}
            onPress={() => onViewChange(key as HomeViewMode)}
            accessibilityRole="button"
          >
            <Icon
              size={18}
              color={view === key ? COLORS.textPrimary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  segmentTrack: {
    backgroundColor: COLORS.toggleBg,
  },
});
