import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import AmountRow from "@/components/molecules/AmountRow";
import FormRow from "@/components/molecules/FormRow";
import OptionSheet from "@/components/molecules/OptionSheet";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { useAccountStore } from "@/stores/accounts";
import { formatDayHeading, recentDays } from "@/utils/dateUtils";
import { toCents } from "@/utils/formatAmount";
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

type Sheet = "type" | "category" | "date" | "account" | null;

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
  const dismissFirst = useDismissKeyboardFirst();

  const [type, setType] = useState<TransactionType>(initial?.type ?? TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState(
    initial ? (initial.amountCents / 100).toFixed(2) : "", //
  );
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [note, setNote] = useState(initial?.note ?? "");
  const [date, setDate] = useState(initial?.date ?? RECENT_DATES[0].id);
  const [chosenAccountId, setChosenAccountId] = useState<string | null>(initial?.accountId ?? null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [busy, setBusy] = useState(false);

  // Already loaded by the root layout, so this stays a synchronous read. The
  // fallback is the first account rather than a hardcoded "cash": that id is
  // what the migration seeds, not something the app may assume still exists.
  const accounts = useAccountStore((state) => state.items);
  const accountId = chosenAccountId ?? accounts[0]?.account.id ?? null;
  const selectedAccount = accounts.find((item) => item.account.id === accountId)?.account ?? null;

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const isExpense = type === TRANSACTION_TYPES.expense;

  const dates = dateOptions(date);
  const selectedDate = dates.find((d) => d.id === date) ?? dates[0];

  const amountCents = toCents(amount);
  const canSubmit = amountCents > 0 && categoryId !== null && selectedAccount !== null && !busy;

  const openSheet = (which: Sheet) => dismissFirst(() => setSheet(which));

  const handleTypeChange = (next: string) => {
    if (next === type) return;
    setType(next as TransactionType);
    // The two lists share only "other", so a carried-over id would be wrong.
    setCategoryId(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onSubmit({
      type,
      amountCents,
      categoryId,
      accountId: selectedAccount.id,
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

          <AmountRow label="AMOUNT" value={amount} onChange={setAmount} />

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
          <FormRow
            label="ACCOUNT"
            value={selectedAccount?.name ?? "Select"}
            muted={!selectedAccount}
            chevron
            onPress={() => openSheet("account")}
          />
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
      <OptionSheet
        visible={sheet === "account"}
        title="ACCOUNT"
        options={accounts.map(({ account }) => ({ id: account.id, label: account.name }))}
        selectedId={accountId}
        onSelect={setChosenAccountId}
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
