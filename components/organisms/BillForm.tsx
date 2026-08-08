import { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import FormRow from "@/components/molecules/FormRow";
import OptionSheet from "@/components/molecules/OptionSheet";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { formatDayHeading, upcomingDays } from "@/utils/dateUtils";
import { toCents } from "@/utils/formatAmount";
import { CADENCES, CADENCE_LABELS } from "@/types/bill";
import type { Bill, Cadence, NewBill } from "@/types/bill";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

const TYPE_OPTIONS = [
  { id: TRANSACTION_TYPES.expense, label: "Expense" },
  { id: TRANSACTION_TYPES.income, label: "Income" },
];

const CADENCE_OPTIONS = Object.values(CADENCES).map((id) => ({ id, label: CADENCE_LABELS[id] }));

// A month ahead: enough to land on any day of the month, and a bill starting
// further out than that is rare enough to set once it is closer.
const UPCOMING_DATES = upcomingDays(31);

/** Keeps an existing bill's own start date selectable when it is in the past. */
function dateOptions(current: string) {
  if (UPCOMING_DATES.some((option) => option.id === current)) return UPCOMING_DATES;
  return [{ id: current, label: formatDayHeading(current) }, ...UPCOMING_DATES];
}

type Sheet = "type" | "category" | "cadence" | "date";

interface BillFormProps {
  /** Absent when creating. */
  initial?: Bill;
  submitLabel: string;
  onSubmit: (input: NewBill) => Promise<void>;
  /** Renders a destructive action under the submit button when given. */
  onDelete?: () => Promise<void>;
}

export default function BillForm({ initial, submitLabel, onSubmit, onDelete }: BillFormProps) {
  const amountInput = useRef<TextInput>(null);
  const dismissFirst = useDismissKeyboardFirst();

  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<TransactionType>(initial?.type ?? TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState(initial ? (initial.amountCents / 100).toFixed(2) : "");
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [cadence, setCadence] = useState<Cadence>(initial?.cadence ?? CADENCES.monthly);
  const [startDate, setStartDate] = useState(initial?.startDate ?? UPCOMING_DATES[0].id);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [busy, setBusy] = useState(false);

  const categories = type === TRANSACTION_TYPES.expense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
  const isExpense = type === TRANSACTION_TYPES.expense;

  const dates = dateOptions(startDate);
  const selectedDate = dates.find((d) => d.id === startDate) ?? dates[0];

  const amountCents = toCents(amount);
  const canSubmit = name.trim().length > 0 && amountCents > 0 && categoryId !== null && !busy;

  const openSheet = (which: Sheet) => dismissFirst(() => setSheet(which));

  const handleTypeChange = (next: string) => {
    if (next === type) return;
    setType(next as TransactionType);
    // The two category lists share only "other", so a carried-over id is wrong.
    setCategoryId(null);
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    setAmount(parts.length === 2 ? parts[0] + "." + parts[1].slice(0, 2) : cleaned);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onSubmit({
      name: name.trim(),
      type,
      amountCents,
      categoryId,
      accountId: initial?.accountId ?? "cash",
      cadence,
      startDate,
    });
  };

  // No setBusy: the caller confirms first, and latching the form would leave it
  // disabled forever if the confirmation is dismissed.
  const handleDelete = async () => {
    if (busy || !onDelete) return;
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
        {/* One row per field, the same as the transaction form. */}
        <Text style={styles.sectionTitle}>BILL</Text>
        <View style={styles.rows}>
          <FormRow label="NAME">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Rent"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.nameInput}
              maxLength={40}
              returnKeyType="done"
            />
          </FormRow>

          <FormRow
            label="TYPE"
            value={isExpense ? "Expense" : "Income"}
            chevron
            onPress={() => openSheet("type")}
          />

          {/* The row focuses the field, so the target is the full width rather
              than the few points the number occupies. */}
          <FormRow label="AMOUNT" onPress={() => dismissFirst(() => amountInput.current?.focus())}>
            <View style={styles.amountField}>
              <Text style={[styles.amount, !amount && styles.amountMuted]}>$</Text>
              <TextInput
                ref={amountInput}
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
        </View>

        <Text style={styles.sectionTitle}>SCHEDULE</Text>
        <View style={styles.rows}>
          <FormRow
            label="REPEATS"
            value={CADENCE_LABELS[cadence]}
            chevron
            onPress={() => openSheet("cadence")}
          />

          {/* Labelled FIRST DUE, not START: every later occurrence is measured
              from this date, so it is also the day of the month. */}
          <FormRow
            label="FIRST DUE"
            value={selectedDate.label}
            chevron
            onPress={() => openSheet("date")}
          />

          {/* No chevron: there is no account model yet, so the row must not claim
              to open one. */}
          <FormRow label="ACCOUNT" value="Cash" />
        </View>
      </ScrollView>

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
        visible={sheet === "category"}
        title="CATEGORY"
        options={categories.map((c) => ({ id: c.id, label: c.label }))}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "cadence"}
        title="REPEATS"
        options={CADENCE_OPTIONS}
        selectedId={cadence}
        onSelect={(next) => setCadence(next as Cadence)}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "date"}
        title="FIRST DUE"
        options={dates}
        selectedId={startDate}
        onSelect={setStartDate}
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
  nameInput: {
    width: "100%",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    textAlign: "right",
    padding: 0,
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
  amountInput: {
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
  confirmBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.overlayStrong,
  },
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
