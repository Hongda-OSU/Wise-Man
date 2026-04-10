import { View, Text, StyleSheet } from 'react-native';
// TODO: migrate to ReanimatedSwipeable — requires dev client (eas build)
// eslint-disable-next-line deprecation/deprecation
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Pencil, Trash2 } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import { getCategoryConfig } from '@/constants/categories';
import { formatCurrency } from '@/utils/formatCurrency';
import CategoryIcon from '@/components/atoms/CategoryIcon';
import SwipeAction from '@/components/atoms/SwipeAction';
import type { Transaction } from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const category = getCategoryConfig(transaction.categoryId, transaction.type);
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? COLORS.income : COLORS.textPrimary;
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <Swipeable
      renderLeftActions={() => (
        <SwipeAction
          icon={Pencil}
          label="Edit"
          backgroundColor={COLORS.forestGreen}
          className="rounded-2xl mr-2"
          onPress={() => onEdit(transaction.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          backgroundColor={COLORS.expense}
          className="rounded-2xl ml-2"
          onPress={() => onDelete(transaction.id)}
        />
      )}
    >
      <View className="flex-row items-center bg-white rounded-2xl py-3 px-4 gap-3">
        <CategoryIcon category={category} size={44} borderRadius={13} />
        <View className="flex-1">
          <Text style={styles.name}>{transaction.note ?? category.label}</Text>
          <Text style={styles.category}>{category.label}</Text>
        </View>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}${formatCurrency(transaction.amount)}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  category: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontFamily: FONTS.moneyBold,
    fontSize: FONT_SIZES.body,
    letterSpacing: -0.5,
  },
});
