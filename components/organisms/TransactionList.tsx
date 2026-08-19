import { SectionList, StyleSheet } from "react-native";

import SectionHeading from "@/components/molecules/SectionHeading";
import TransactionItem from "@/components/molecules/TransactionItem";
import EmptyState from "@/components/molecules/EmptyState";
import type { TransactionSection } from "@/types/transaction";

interface TransactionListProps {
  sections: TransactionSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function TransactionList({
  sections,
  onEdit,
  onDelete,
  onAdd,
}: TransactionListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={
        <EmptyState
          label="NO TRANSACTIONS"
          body="Nothing recorded for this month yet."
          actionLabel="Add transaction"
          onAction={onAdd}
        />
      }
      // Each date is a ruled section head, in the same eyebrow the header band uses.
      renderSectionHeader={({ section }) => <SectionHeading title={section.title.toUpperCase()} />}
      renderItem={({ item }) => (
        <TransactionItem transaction={item} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
});
