import { Modal, Pressable, View, Text, StyleSheet } from "react-native";
import { List, CalendarDays, Check, Database } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { HOME_VIEW_MODES } from "@/types/ui";
import type { HomeViewMode } from "@/types/ui";

interface ViewMenuProps {
  visible: boolean;
  /** Window-space y the panel hangs from, measured off the button that opened it. */
  top: number;
  value: HomeViewMode;
  onSelect: (view: HomeViewMode) => void;
  onClose: () => void;
  /** TEMPORARY. Delete along with mocks/ once the store reads from SQLite. */
  sampleDataLabel: string;
  onToggleSampleData: () => void;
}

const OPTIONS = [
  { key: HOME_VIEW_MODES.list, icon: List, label: "List" },
  { key: HOME_VIEW_MODES.calendar, icon: CalendarDays, label: "Calendar" },
] as const;

export default function ViewMenu({
  visible,
  top,
  value,
  onSelect,
  onClose,
  sampleDataLabel,
  onToggleSampleData,
}: ViewMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close menu" />

      <View style={[styles.panel, { top }]}>
        {OPTIONS.map(({ key, icon: Icon, label }, index) => {
          const selected = value === key;
          return (
            <Pressable
              key={key}
              style={[styles.row, index > 0 && styles.rowDivided]}
              onPress={() => {
                onSelect(key);
                onClose();
              }}
              accessibilityRole="menuitem"
              accessibilityState={{ selected }}
            >
              <Icon size={17} color={selected ? COLORS.textPrimary : COLORS.textSecondary} />
              <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
              {selected ? <Check size={16} color={COLORS.textPrimary} /> : null}
            </Pressable>
          );
        })}

        {/* TEMPORARY. Stands in for a seeded database until the store lands. */}
        <Pressable
          style={[styles.row, styles.rowDivided]}
          onPress={() => {
            onToggleSampleData();
            onClose();
          }}
          accessibilityRole="menuitem"
        >
          <Database size={17} color={COLORS.textSecondary} />
          <Text style={styles.label}>{sampleDataLabel}</Text>
        </Pressable>
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
  labelSelected: {
    color: COLORS.textPrimary,
  },
});
