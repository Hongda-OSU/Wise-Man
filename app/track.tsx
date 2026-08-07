import { useState } from "react";
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
import { recentDays } from "@/utils/dateUtils";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

const TYPE_OPTIONS = [
  { id: TRANSACTION_TYPES.expense, label: "Expense" },
  { id: TRANSACTION_TYPES.income, label: "Income" },
];

// Two weeks back covers entering something you forgot; anything older is rare
// enough to belong in an edit rather than in this list.
const DATE_OPTIONS = recentDays(14);

export default function TrackScreen() {
  const router = useRouter();
  const dismissFirst = useDismissKeyboardFirst();

  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(DATE_OPTIONS[0].id);
  const [sheet, setSheet] = useState<"type" | "category" | "date" | null>(null);

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const isExpense = type === TRANSACTION_TYPES.expense;

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

  const selectedDate = DATE_OPTIONS.find((d) => d.id === date) ?? DATE_OPTIONS[0];

  const openSheet = (which: "type" | "category" | "date") => dismissFirst(() => setSheet(which));

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

          <FormRow label="AMOUNT">
            <View style={styles.amountField}>
              <Text style={[styles.amount, !amount && styles.amountMuted]}>$</Text>
              <TextInput
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.textSecondary}
                maxLength={13}
                style={[styles.amount, styles.amountInput]}
              />
            </View>
          </FormRow>

          <FormRow
            label="CATEGORY"
            value={selectedCategory?.label ?? "Select"}
            muted={!selectedCategory}
            chevron
            onPress={() => openSheet("category")}
          />

          {/* No chevron: there is no account model yet, so the row must not
              claim to open one. */}
          <FormRow label="ACCOUNT" value="Cash" />
          <FormRow
            label="DATE"
            value={selectedDate.label}
            chevron
            onPress={() => openSheet("date")}
          />

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

      <OptionSheet
        visible={sheet === "type"}
        title="TYPE"
        options={TYPE_OPTIONS}
        selectedId={type}
        onSelect={handleTypeChange}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "date"}
        title="DATE"
        options={DATE_OPTIONS}
        selectedId={date}
        onSelect={setDate}
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
  amountField: {
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
  amountMuted: {
    color: COLORS.textSecondary,
  },
  // Hugs its content so the $ stays against the number; the placeholder keeps it
  // wide enough to hit when empty.
  amountInput: {
    textAlign: "right",
    padding: 0,
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
});
