import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, Text, ScrollView, StyleSheet } from "react-native";
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

// Further than any sheet is tall, so it always starts fully off-screen.
const TRAVEL = 520;

export default function OptionSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: OptionSheetProps) {
  const [progress] = useState(() => new Animated.Value(0));
  // Kept mounted through the closing animation, which the Modal alone cannot do.
  const [mounted, setMounted] = useState(visible);

  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (!mounted) return;

    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? 220 : 170,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, mounted, progress]);

  if (!mounted) return null;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TRAVEL, 0],
  });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      {/* The scrim fades and the sheet slides. Animating the Modal itself would
          drag the scrim up with the sheet as one black slab. */}
      <Animated.View style={[styles.scrim, { opacity: progress }]}>
        <Pressable style={styles.scrimFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
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
      </Animated.View>
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
  scrimFill: {
    flex: 1,
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
