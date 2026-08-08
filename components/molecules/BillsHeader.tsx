import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface BillsHeaderProps {
  onAdd: () => void;
}

/**
 * No figures. A monthly total meant averaging a yearly bill across twelve
 * months, and a headline that size read as money on hand -- which is what the
 * same position on Home actually means.
 */
export default function BillsHeader({ onAdd }: BillsHeaderProps) {
  return (
    <View style={styles.topRow}>
      <Text style={styles.title}>Events</Text>

      <TouchableOpacity
        style={styles.action}
        onPress={onAdd}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Add recurring bill"
      >
        <Plus size={19} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    // Stands in for the header band's rule on Home, so the table below still
    // starts against a line rather than floating.
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 19,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  // Matches the capsule buttons on Home, minus the capsule: there is one action
  // here, and a container around a single glyph is furniture.
  action: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
