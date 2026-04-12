import { View, Text, TextInput, StyleSheet } from "react-native";
import { SquarePen, ChevronRight } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface NoteCardProps {
  note: string;
  onChangeNote: (text: string) => void;
}

export default function NoteCard({ note, onChangeNote }: NoteCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="items-center justify-center" style={styles.iconBox}>
            <SquarePen size={14} color="#7A4AE8" />
          </View>
          <Text style={styles.label}>NOTE</Text>
        </View>
        <ChevronRight size={16} color={COLORS.textSecondary} />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          value={note}
          onChangeText={onChangeNote}
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
    backgroundColor: "#F0E8FF",
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
