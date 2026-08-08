import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface ErrorNoticeProps {
  message: string;
}

/**
 * A failed read or write, shown rather than swallowed. The stores catch their
 * errors so the app does not crash, which without this made a failure look
 * exactly like having no data.
 */
export default function ErrorNotice({ message }: ErrorNoticeProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>SOMETHING WENT WRONG</Text>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // The same ruled block as the empty states, so it sits in the grid rather than
  // floating over it as a toast.
  block: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.expense,
    letterSpacing: 0.6,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
});
