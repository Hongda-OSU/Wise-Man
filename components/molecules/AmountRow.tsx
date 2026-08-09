import { useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import FormRow from "@/components/molecules/FormRow";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { groupAmountInput } from "@/utils/formatAmount";

interface AmountRowProps {
  label: string;
  /** A plain decimal string with no separators -- what toCents parses. */
  value: string;
  onChange: (value: string) => void;
  /** Allows a leading minus, for a credit account opened owing money. */
  allowNegative?: boolean;
}

/**
 * The money field, shared by every form that has one. Extracted at the third
 * copy: the grouping fix had to be made in two places at once, which is exactly
 * the bug this prevents next time.
 */
export default function AmountRow({
  label,
  value,
  onChange,
  allowNegative = false,
}: AmountRowProps) {
  const input = useRef<TextInput>(null);
  const dismissFirst = useDismissKeyboardFirst();

  const handleChange = (text: string) => {
    // Strips the grouping separators the field displays, so what is stored stays
    // a plain decimal string.
    const negative = allowNegative && text.trimStart().startsWith("-");
    const cleaned = text.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) return;

    const digits = parts.length === 2 ? `${parts[0]}.${parts[1].slice(0, 2)}` : cleaned;
    onChange(negative && digits ? `-${digits}` : digits);
  };

  const isNegative = value.startsWith("-");
  const magnitude = isNegative ? value.slice(1) : value;

  return (
    // The row focuses the field, so the target is the full width rather than the
    // few points the number happens to occupy.
    <FormRow label={label} onPress={() => dismissFirst(() => input.current?.focus())}>
      <View style={styles.field}>
        <Text style={[styles.amount, !value && styles.muted]}>{isNegative ? "-$" : "$"}</Text>
        <TextInput
          ref={input}
          value={groupAmountInput(magnitude)}
          onChangeText={handleChange}
          keyboardType={allowNegative ? "numbers-and-punctuation" : "decimal-pad"}
          placeholder="0.00"
          placeholderTextColor={COLORS.textSecondary}
          // Counts the separators too, so this is 13 digits plus the three commas
          // they can carry.
          maxLength={16}
          style={[styles.amount, styles.input]}
        />
      </View>
    </FormRow>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  muted: {
    color: COLORS.textSecondary,
  },
  // Hugs its content so the $ stays against the number; the placeholder keeps it
  // wide enough to hit when empty.
  input: {
    textAlign: "right",
    padding: 0,
  },
});
