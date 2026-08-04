import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import TransactionTypeToggle from "@/components/molecules/TransactionTypeToggle";
import AmountCard from "@/components/organisms/AmountCard";
import CategoryGrid from "@/components/organisms/CategoryGrid";
import DetailsSection from "@/components/organisms/DetailsSection";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

export default function TrackScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  const handleTypeChange = (value: TransactionType) => {
    Keyboard.dismiss();
    setType(value);
    setCategoryId(null);
    setAmount("");
    setNote("");
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {type === TRANSACTION_TYPES.expense ? "Add Expense" : "Add Income"}
        </Text>
        <View style={styles.navSpacer} />
      </View>

      {/* Toggle */}
      <TransactionTypeToggle active={type} onChange={handleTypeChange} />

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
      >
        <AmountCard
          selectedCategory={selectedCategory}
          amount={amount}
          onAmountChange={setAmount}
        />
        <CategoryGrid
          categories={categories}
          selectedId={categoryId}
          onSelect={(id) => {
            setCategoryId((prev) => (prev === id ? null : id));
            Keyboard.dismiss();
          }}
        />
        <DetailsSection
          note={note}
          onChangeNote={setNote}
          onNoteFocus={() =>
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300)
          }
        />

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmBtn} accessibilityRole="button">
          <Text style={styles.confirmText}>
            {type === TRANSACTION_TYPES.expense ? "Add Expense" : "Add Income"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
  },
  backButton: {
    flex: 1,
  },
  navSpacer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  confirmBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  confirmText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.onAccent,
    letterSpacing: -0.3,
  },
});
