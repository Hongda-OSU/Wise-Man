import { SectionList, View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import AccountItem from "@/components/molecules/AccountItem";
import EmptyState from "@/components/molecules/EmptyState";
import type { AccountSection } from "@/utils/groupAccounts";

interface AccountListProps {
  sections: AccountSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function AccountList({ sections, onEdit, onDelete, onAdd }: AccountListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.account.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={
        <EmptyState
          label="NO ACCOUNTS"
          body="Cash, a bank account, a credit card — wherever the money sits."
          actionLabel="Add an account"
          onAction={onAdd}
        />
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item }) => <AccountItem item={item} onEdit={onEdit} onDelete={onDelete} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  // The same ruled section head the ledger uses, so every table reads as one system.
  sectionHeader: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
});
