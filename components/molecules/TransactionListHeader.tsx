import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface TransactionListHeaderProps {
  /** Receives the window-space y the menu should hang from. */
  onOpenMenu: (top: number) => void;
}

export default function TransactionListHeader({ onOpenMenu }: TransactionListHeaderProps) {
  const button = useRef<View>(null);

  const open = () => {
    button.current?.measureInWindow((_x, y, _width, height) => onOpenMenu(y + height + 6));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRANSACTIONS</Text>
      <TouchableOpacity
        ref={button}
        style={styles.menuButton}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Change view"
      >
        <MoreHorizontal size={15} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    // The button is 32 wide, so 4 puts the bare glyph's centre on the 20pt gutter.
    paddingRight: 4,
    marginTop: 14,
    marginBottom: 6,
  },
  // Same eyebrow as the labels in the header band, so the two rows read as one system.
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  // No chrome: 32pt keeps a tappable target around a glyph that carries itself.
  menuButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
