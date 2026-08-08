import { FlatList, StyleSheet } from "react-native";

import BillItem from "@/components/molecules/BillItem";
import BillsEmptyState from "@/components/molecules/BillsEmptyState";
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
      ListEmptyComponent={<BillsEmptyState onAdd={onAdd} />}
      renderItem={({ item }) => <BillItem due={item} onEdit={onEdit} onDelete={onDelete} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
});
