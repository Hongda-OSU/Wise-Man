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

type Sheet = "type" | "category" | "cadence" | "date" | "account";

interface BillFormProps {
  /** Absent when creating. */
  initial?: Bill;
  submitLabel: string;
  onSubmit: (input: NewBill) => Promise<void>;
  /** Renders a destructive action under the submit button when given. */
  onDelete?: () => Promise<void>;
}

export default function BillForm({ initial, submitLabel, onSubmit, onDelete }: BillFormProps) {
  const dismissFirst = useDismissKeyboardFirst();

  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<TransactionType>(initial?.type ?? TRANSACTION_TYPES.expense);
  const [amount, setAmount] = useState(initial ? (initial.amountCents / 100).toFixed(2) : "");
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [cadence, setCadence] = useState<Cadence>(initial?.cadence ?? CADENCES.monthly);
  const [startDate, setStartDate] = useState(initial?.startDate ?? UPCOMING_DATES[0].id);
  const [chosenAccountId, setChosenAccountId] = useState<string | null>(initial?.accountId ?? null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
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

  const dates = dateOptions(startDate);
  const selectedDate = dates.find((d) => d.id === startDate) ?? dates[0];

  const amountCents = toCents(amount);
  const canSubmit =
    name.trim().length > 0 &&
    amountCents > 0 &&
    categoryId !== null &&
    selectedAccount !== null &&
    !busy;

  const openSheet = (which: Sheet) => dismissFirst(() => setSheet(which));

  const handleTypeChange = (next: string) => {
    if (next === type) return;
    setType(next as TransactionType);
    // The two category lists share only "other", so a carried-over id is wrong.
    setCategoryId(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onSubmit({
      name: name.trim(),
      type,
      amountCents,
      categoryId,
      accountId: selectedAccount.id,
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

          <AmountRow label="AMOUNT" value={amount} onChange={setAmount} />

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

          {/* Where each occurrence will be posted. */}
          <FormRow
            label="ACCOUNT"
            value={selectedAccount?.name ?? "Select"}
            muted={!selectedAccount}
            chevron
            onPress={() => openSheet("account")}
          />
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
        visible={sheet === "account"}
        title="ACCOUNT"
        options={accounts.map(({ account }) => ({ id: account.id, label: account.name }))}
        selectedId={accountId}
        onSelect={setChosenAccountId}
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
