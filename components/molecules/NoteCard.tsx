import { View, Text, TextInput, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { DETAIL_NOTE } from "@/constants/details";

interface NoteCardProps {
  note: string;
  onChangeNote: (text: string) => void;
  onFocus?: () => void;
}

export default function NoteCard({ note, onChangeNote, onFocus }: NoteCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: DETAIL_NOTE.iconBg }]}>
            <DETAIL_NOTE.icon size={14} color={DETAIL_NOTE.iconColor} />
          </View>
          <Text style={styles.label}>{DETAIL_NOTE.label}</Text>
        </View>
        <ChevronRight size={16} color={COLORS.textSecondary} />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          value={note}
          onChangeText={onChangeNote}
          onFocus={onFocus}
          placeholder="What's this transaction for?"
          placeholderTextColor={COLORS.textSecondary}
          multiline
          scrollEnabled={false}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  inputArea: {
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 12,
    padding: 12,
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    padding: 0,
  },
});
