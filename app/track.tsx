import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import FormRow from "@/components/molecules/FormRow";
import OptionSheet from "@/components/molecules/OptionSheet";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { formatAmountInput } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

const TYPE_OPTIONS = [
  { id: TRANSACTION_TYPES.expense, label: "Expense" },
  { id: TRANSACTION_TYPES.income, label: "Income" },
];

export default function TrackScreen() {
  const router = useRouter();
  const amountInput = useRef<TextInput>(null);
  const dismissFirst = useDismissKeyboardFirst();

  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sheet, setSheet] = useState<"type" | "category" | null>(null);

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const isExpense = type === TRANSACTION_TYPES.expense;

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const handleTypeChange = (next: string) => {
    if (next === type) return;
    setType(next as TransactionType);
    setCategoryId(null);
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setAmount(parts.length === 2 ? parts[0] + "." + parts[1].slice(0, 2) : cleaned);
  };

  const openSheet = (which: "type" | "category") => dismissFirst(() => setSheet(which));

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>New Transaction</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
      >
        {/* One row per field. Tap to type, tap to choose -- nothing else. */}
        <View style={styles.rows}>
          <FormRow
            label="TYPE"
            value={isExpense ? "Expense" : "Income"}
            chevron
            onPress={() => openSheet("type")}
          />

          <FormRow label="AMOUNT" onPress={() => dismissFirst(() => amountInput.current?.focus())}>
            <Text style={[styles.amount, !amount && styles.amountEmpty]}>
              {formatAmountInput(amount)}
            </Text>
          </FormRow>

          <FormRow
            label="CATEGORY"
            value={selectedCategory?.label ?? "Select"}
            muted={!selectedCategory}
            chevron
            onPress={() => openSheet("category")}
          />

          <FormRow label="ACCOUNT" value="Cash" chevron />
          <FormRow label="DATE" value={`Today, ${today}`} chevron />

          <FormRow label="NOTE">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.noteInput}
              returnKeyType="done"
            />
          </FormRow>
        </View>
      </ScrollView>

      {/* Anchored, not trailing the rows: the form is short and the action belongs
          at the bottom edge of the screen. */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => Keyboard.dismiss()}
          accessibilityRole="button"
        >
          <Text style={styles.confirmText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Off-screen: the amount row is the visible control, this holds the caret. */}
      <TextInput
        ref={amountInput}
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="decimal-pad"
        maxLength={13}
        caretHidden
        style={styles.hiddenInput}
      />

      <OptionSheet
        visible={sheet === "type"}
        title="TYPE"
        options={TYPE_OPTIONS}
        selectedId={type}
        onSelect={handleTypeChange}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "category"}
        title="CATEGORY"
        options={categories.map((c) => ({ id: c.id, label: c.label }))}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setSheet(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    letterSpacing: -0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  rows: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  amountEmpty: {
    color: COLORS.textSecondary,
  },
  noteInput: {
    width: "100%",
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    textAlign: "right",
    padding: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  confirmBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  confirmText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.onAccent,
    letterSpacing: -0.3,
  },
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
