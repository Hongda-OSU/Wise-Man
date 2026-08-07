import { Modal, Pressable, View, Text, StyleSheet } from "react-native";
import { Wrench } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

export interface MenuAction {
  label: string;
  onPress: () => void;
}

interface HomeMenuProps {
  visible: boolean;
  /** Window-space y the panel hangs from, measured off the button that opened it. */
  top: number;
  actions: MenuAction[];
  onClose: () => void;
}

export default function HomeMenu({ visible, top, actions, onClose }: HomeMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close menu" />

      <View style={[styles.panel, { top }]}>
        {actions.map(({ label, onPress }, index) => (
          <Pressable
            key={label}
            style={[styles.row, index > 0 && styles.rowDivided]}
            onPress={() => {
              onPress();
              onClose();
            }}
            accessibilityRole="menuitem"
          >
            <Wrench size={17} color={COLORS.textSecondary} />
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.scrim,
  },
  panel: {
    position: "absolute",
    // Right-aligned to the same 20pt gutter the rest of the screen uses.
    right: 20,
    width: 190,
    backgroundColor: COLORS.elevated,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  label: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textSecondary,
  },
});
