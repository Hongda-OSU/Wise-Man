import { Modal, Pressable, View, Text, ScrollView, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

export interface SheetOption {
  id: string;
  label: string;
}

interface OptionSheetProps {
  visible: boolean;
  title: string;
  options: SheetOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function OptionSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: OptionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close" />

      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>

        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            const selected = option.id === selectedId;
            return (
              <Pressable
                key={option.id}
                style={styles.row}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
                {selected ? <Check size={16} color={COLORS.textPrimary} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
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
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "62%",
    backgroundColor: COLORS.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    paddingBottom: 28,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textSecondary,
    letterSpacing: -0.3,
  },
  labelSelected: {
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
});
