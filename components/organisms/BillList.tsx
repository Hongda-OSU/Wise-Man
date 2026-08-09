import { FlatList, StyleSheet } from "react-native";

import BillItem from "@/components/molecules/BillItem";
import EmptyState from "@/components/molecules/EmptyState";
import type { BillDue } from "@/types/bill";

interface BillListProps {
  /** Soonest first. Every date is ahead of today -- see utils/billSchedule. */
  items: BillDue[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function BillList({ items, onEdit, onDelete, onAdd }: BillListProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.bill.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <EmptyState
          label="NOTHING RECURRING"
          body="Rent, a subscription, a paycheque — anything that repeats."
          actionLabel="Add a recurring bill"
          onAction={onAdd}
        />
      }
      renderItem={({ item }) => <BillItem due={item} onEdit={onEdit} onDelete={onDelete} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
});
