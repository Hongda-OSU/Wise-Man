import { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Star } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import type { CategoryConfig } from "@/constants/categories";
import { formatAmountDisplay } from "@/utils/formatCurrency";

interface AmountCardProps {
  selectedCategory: CategoryConfig | null;
  amount: string;
  onAmountChange: (value: string) => void;
}

export default function AmountCard({
  selectedCategory,
  amount,
  onAmountChange,
}: AmountCardProps) {
  const inputRef = useRef<TextInput>(null);

  const displayAmount = formatAmountDisplay(amount);

  const selectedPill = selectedCategory && (
    <>
      <selectedCategory.icon size={12} color={COLORS.white} />
      <Text style={styles.pillLabel}>{selectedCategory.label}</Text>
    </>
  );

  const placeholderPill = (
    <>
      <Star size={12} color="rgba(255,255,255,0.55)" />
      <Text style={styles.pillPlaceholder}>Select a category</Text>
    </>
  );

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    const sanitized =
      parts.length === 2 ? parts[0] + "." + parts[1].slice(0, 2) : cleaned;
    onAmountChange(sanitized);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      className="rounded-[20px] overflow-hidden items-center p-6"
      style={styles.card}
    >
      {/* Decorative circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      {/* Category pill */}
      <View
        className="flex-row items-center gap-2 px-3 py-1 rounded-full mb-4 mt-1"
        style={styles.pill}
      >
        {selectedCategory ? selectedPill : placeholderPill}
      </View>

      {/* Amount */}
      <View className="mb-5 w-full items-center justify-center h-[70px]">
        <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>
          {displayAmount}
        </Text>
      </View>

      {/* Hint */}
      <Text className="mb-4" style={styles.hint}>
        TAP TO ENTER AMOUNT
      </Text>

      {/* Hidden input */}
      <TextInput
        ref={inputRef}
        value={amount}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        maxLength={13}
        style={styles.hiddenInput}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.forestGreen,
    shadowColor: COLORS.forestGreen,
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
    backgroundColor: "rgba(255,255,255,0.04)",
    top: -40,
    left: -30,
  },
  circleBottomRight: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -70,
    right: -55,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  pillLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.white,
  },
  pillPlaceholder: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
  },
  amount: {
    fontFamily: FONTS.moneyExtraBold,
    fontSize: 50,
    color: COLORS.white,
    letterSpacing: -2,
  },
  hint: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
