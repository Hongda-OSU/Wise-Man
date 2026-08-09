import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import AmountRow from "@/components/molecules/AmountRow";
import FormRow from "@/components/molecules/FormRow";
import OptionSheet from "@/components/molecules/OptionSheet";
import { useDismissKeyboardFirst } from "@/hooks/useDismissKeyboardFirst";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { toCents } from "@/utils/formatAmount";
import { ACCOUNT_KINDS, ACCOUNT_KIND_LABELS, ACCOUNT_KIND_ORDER } from "@/types/account";
import type { Account, AccountKind, NewAccount } from "@/types/account";

const KIND_OPTIONS = ACCOUNT_KIND_ORDER.map((id) => ({ id, label: ACCOUNT_KIND_LABELS[id] }));

interface AccountFormProps {
  /** Absent when creating. */
  initial?: Account;
  submitLabel: string;
  onSubmit: (input: NewAccount) => Promise<void>;
  /** Renders a destructive action under the submit button when given. */
  onDelete?: () => Promise<void>;
}

export default function AccountForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: AccountFormProps) {
  const dismissFirst = useDismissKeyboardFirst();

  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<AccountKind>(initial?.kind ?? ACCOUNT_KINDS.cash);
  const [opening, setOpening] = useState(
    initial ? (initial.openingBalanceCents / 100).toFixed(2) : "",
  );
  const [kindSheetOpen, setKindSheetOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // An opening balance of zero is a real answer, so only the name is required.
  const canSubmit = name.trim().length > 0 && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await onSubmit({
      name: name.trim(),
      kind,
      openingBalanceCents: toCents(opening),
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
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.rows}>
          <FormRow label="NAME">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Checking"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.nameInput}
              maxLength={40}
              returnKeyType="done"
            />
          </FormRow>

          <FormRow
            label="KIND"
            value={ACCOUNT_KIND_LABELS[kind]}
            chevron
            onPress={() => dismissFirst(() => setKindSheetOpen(true))}
          />

          {/* Signed, because a credit card is usually opened owing something. */}
          <AmountRow label="OPENING" value={opening} onChange={setOpening} allowNegative />
        </View>

        {/* Says what the number above will and will not do, since the balance on
            the Portfolio screen is computed and this is its only fixed part. */}
        <Text style={styles.note}>
          The opening balance is what was in the account before the first transaction. Everything
          recorded against it is added on top.
        </Text>
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
        visible={kindSheetOpen}
        title="KIND"
        options={KIND_OPTIONS}
        selectedId={kind}
        onSelect={(next) => setKind(next as AccountKind)}
        onClose={() => setKindSheetOpen(false)}
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
  note: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
    lineHeight: 19,
    paddingHorizontal: 20,
    paddingTop: 16,
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
