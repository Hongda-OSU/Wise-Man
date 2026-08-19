import { SectionList, StyleSheet } from "react-native";

import SectionHeading from "@/components/molecules/SectionHeading";
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
      renderSectionHeader={({ section }) => <SectionHeading title={section.title} />}
      renderItem={({ item }) => <AccountItem item={item} onEdit={onEdit} onDelete={onDelete} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
});
