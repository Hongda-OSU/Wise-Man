import { SectionList, View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import TransactionItem from "@/components/molecules/TransactionItem";
import TransactionsEmptyState from "@/components/molecules/TransactionsEmptyState";
import type { TransactionSection } from "@/types/transaction";

interface TransactionListProps {
  sections: TransactionSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ sections, onEdit, onDelete }: TransactionListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={<TransactionsEmptyState />}
      // Each date is a ruled section head, in the same eyebrow the header band uses.
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
        </View>
      )}
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
