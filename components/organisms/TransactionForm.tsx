import { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import FormRow from "@/components/molecules/FormRow";
import OptionSheet from "@/components/molecules/OptionSheet";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { formatDayHeading, recentDays } from "@/utils/dateUtils";
import { groupAmountInput, toCents } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { NewTransaction, Transaction, TransactionType } from "@/types/transaction";

const TYPE_OPTIONS = [
  { id: TRANSACTION_TYPES.expense, label: "Expense" },
  { id: TRANSACTION_TYPES.income, label: "Income" },
];

// Two weeks back covers entering something you forgot; anything older is rare
// enough to belong in an edit rather than in this list.
const RECENT_DATES = recentDays(14);

/** Keeps an older transaction's own date selectable when editing it. */
function dateOptions(current: string) {
  if (RECENT_DATES.some((option) => option.id === current)) return RECENT_DATES;
  return [{ id: current, label: formatDayHeading(current) }, ...RECENT_DATES];
}

interface TransactionFormProps {
  /** Absent when creating. */
  initial?: Transaction;
  submitLabel: string;
  onSubmit: (input: NewTransaction) => Promise<void>;
  /** Renders a destructive action under the submit button when given. */
  onDelete?: () => Promise<void>;
}

export default function TransactionForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: TransactionFormProps) {
  const amountInput = useRef<TextInput>(null);
  const dismissFirst = useDismissKeyboardFirst();

  const [type, setType] = useState<TransactionType>(initial?.type ?? TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState(
    initial ? (initial.amountCents / 100).toFixed(2) : "", //
  );
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [note, setNote] = useState(initial?.note ?? "");
  const [date, setDate] = useState(initial?.date ?? RECENT_DATES[0].id);
  const [sheet, setSheet] = useState<"type" | "category" | "date" | null>(null);
  const [busy, setBusy] = useState(false);

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const isExpense = type === TRANSACTION_TYPES.expense;

  const dates = dateOptions(date);
  const selectedDate = dates.find((d) => d.id === date) ?? dates[0];

  const amountCents = toCents(amount);
  const canSubmit = amountCents > 0 && categoryId !== null && !busy;

  const openSheet = (which: "type" | "category" | "date") => dismissFirst(() => setSheet(which));

  const handleTypeChange = (next: string) => {
    if (next === type) return;
    setType(next as TransactionType);
    // The two lists share only "other", so a carried-over id would be wrong.
    setCategoryId(null);
  };

  const handleAmountChange = (text: string) => {
    // Strips the grouping separators the field displays, so state stays a plain
    // decimal string that toCents can parse.
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setAmount(parts.length === 2 ? parts[0] + "." + parts[1].slice(0, 2) : cleaned);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onSubmit({
      type,
      amountCents,
      categoryId,
      accountId: initial?.accountId ?? "cash",
      date,
      note: note.trim() || undefined,
    });
  };

  const handleDelete = async () => {
    if (busy || !onDelete) return;
    setBusy(true);
    await onDelete();
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
      >
        {/* One row per field. Tap to type, tap to choose -- nothing else. */}
        <Text style={styles.sectionTitle}>TRANSACTION</Text>
        <View style={styles.rows}>
          <FormRow
            label="TYPE"
            value={isExpense ? "Expense" : "Income"}
            chevron
            onPress={() => openSheet("type")}
          />

          {/* The row focuses the field, so the target is the full width rather
              than the few points the number happens to occupy. */}
          <FormRow label="AMOUNT" onPress={() => dismissFirst(() => amountInput.current?.focus())}>
            <View style={styles.amountField}>
              <Text style={[styles.amount, !amount && styles.amountMuted]}>$</Text>
              <TextInput
                ref={amountInput}
                value={groupAmountInput(amount)}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.textSecondary}
                // Counts the separators too, so this is the old 13 digits plus
                // the three commas they can carry.
                maxLength={16}
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
        </View>

        <Text style={styles.sectionTitle}>DETAILS</Text>
        <View style={styles.rows}>
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
            {/* Wraps instead of scrolling a long note out of sight; Return closes
                the keyboard rather than breaking the line. */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.noteInput}
              multiline
              scrollEnabled={false}
              maxLength={120}
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
            />
          </FormRow>
        </View>
      </ScrollView>

      {/* Anchored, not trailing the rows: the form is short and the action belongs
          at the bottom edge of the screen. */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !canSubmit && styles.confirmBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Text style={[styles.confirmText, !canSubmit && styles.confirmTextDisabled]}>
            {submitLabel}
          </Text>
        </TouchableOpacity>

        {onDelete ? (
          // No outline: destroying a record should not look like the thing you
          // came here to press.
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            disabled={busy}
            accessibilityRole="button"
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        ) : null}
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
        options={dates}
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
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  // The same eyebrow over a ruled block that the home screen and the sheets use.
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
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
    // Stops a wrapped note running back into the label; it breaks earlier and
    // keeps a clear column between the two.
    width: "76%",
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
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  // Outlined rather than filled: a white slab outweighed the whole form it
  // belongs to.
  confirmBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.overlayStrong,
  },
  // Dimmed rather than hidden until there is an amount and a category, so the
  // button says what is missing by being unavailable.
  confirmBtnDisabled: {
    borderColor: COLORS.border,
  },
  confirmText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  confirmTextDisabled: {
    color: COLORS.textSecondary,
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },
  deleteText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.expense,
    letterSpacing: -0.3,
  },
});
