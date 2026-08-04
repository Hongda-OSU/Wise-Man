import { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";

import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import type { CategoryConfig } from "@/constants/categories";
import { formatAmountInput } from "@/utils/formatAmount";

interface AmountCardProps {
  selectedCategory: CategoryConfig | null;
  amount: string;
  onAmountChange: (value: string) => void;
}

export default function AmountCard({ selectedCategory, amount, onAmountChange }: AmountCardProps) {
  const inputRef = useRef<TextInput>(null);
  const dismissFirst = useDismissKeyboardFirst();

  const displayAmount = formatAmountInput(amount);

  const selectedPill = selectedCategory && (
    <>
      <selectedCategory.icon size={12} color={COLORS.textPrimary} />
      <Text style={styles.pillLabel}>{selectedCategory.label}</Text>
    </>
  );

  const placeholderPill = (
    <>
      <Star size={12} color={COLORS.overlayStrong} />
      <Text style={styles.pillPlaceholder}>Select a category</Text>
    </>
  );

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    const sanitized = parts.length === 2 ? parts[0] + "." + parts[1].slice(0, 2) : cleaned;
    onAmountChange(sanitized);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => dismissFirst(() => inputRef.current?.focus())}
      style={styles.card}
    >
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      <View style={styles.pill}>{selectedCategory ? selectedPill : placeholderPill}</View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>
          {displayAmount}
        </Text>
      </View>

      <Text style={styles.hint}>TAP TO ENTER AMOUNT</Text>

      <TextInput
        ref={inputRef}
        value={amount}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        maxLength={13}
        caretHidden
        style={styles.hiddenInput}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.elevated,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    padding: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  circleTopLeft: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.overlaySoft,
    top: -40,
    left: -30,
  },
  circleBottomRight: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.overlaySoft,
    bottom: -70,
    right: -55,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 16,
    marginTop: 4,
    backgroundColor: COLORS.overlayMuted,
  },
  pillLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textPrimary,
  },
  pillPlaceholder: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  amount: {
    fontFamily: FONTS.displayExtraBold,
    fontSize: 50,
    color: COLORS.textPrimary,
    letterSpacing: -2,
  },
  hint: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  // Invisible without opacity 0, which UIKit can refuse first responder on.
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    color: "transparent",
    backgroundColor: "transparent",
  },
});
