import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface TabHeaderProps {
  title: string;
  onAdd: () => void;
  /** Omit when something else below supplies the rule, as the figure band does. */
  ruled?: boolean;
}

/** A tab's title and its one action. Home has its own -- it carries a brand row. */
export default function TabHeader({ title, onAdd, ruled = true }: TabHeaderProps) {
  return (
    <View style={[styles.row, ruled && styles.ruled]}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.action}
        onPress={onAdd}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Add to ${title}`}
      >
        <Plus size={19} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  // Stands in for Home's header band, so the table below starts against a line
  // rather than floating.
  ruled: {
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
