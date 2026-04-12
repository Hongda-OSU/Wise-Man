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

export default function NoteCard({
  note,
  onChangeNote,
  onFocus,
}: NoteCardProps) {
  return (
    <View className="bg-white rounded-2xl px-4 py-6">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View
            className="items-center justify-center"
            style={[styles.iconBox, { backgroundColor: DETAIL_NOTE.iconBg }]}
          >
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
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
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
