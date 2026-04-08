import { SectionList, View, Text } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import TransactionItem from '@/components/molecules/TransactionItem';
import type { TransactionSection } from '@/types/transaction';

interface TransactionListProps {
  sections: TransactionSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  listHeader?: React.ReactNode;
}

export default function TransactionList({ sections, onEdit, onDelete, listHeader }: TransactionListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={listHeader ? <>{listHeader}</> : undefined}
      renderSectionHeader={({ section }) => (
        <Text style={{
          fontFamily: FONTS.medium,
          fontSize: FONT_SIZES.caption,
          color: COLORS.textSecondary,
          letterSpacing: -0.65,
          marginTop: 16,
          marginBottom: 8,
          paddingHorizontal: 24,
        }}>
          {section.title}
        </Text>
      )}
      renderItem={({ item, index, section }) => (
        <View style={{
          marginBottom: index === section.data.length - 1 ? 0 : 8,
          paddingHorizontal: 24,
        }}>
          <TransactionItem
            transaction={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </View>
      )}
    />
  );
}
