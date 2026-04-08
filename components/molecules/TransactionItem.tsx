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
          style={styles.editAction}
          onPress={() => onEdit(transaction.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          backgroundColor={COLORS.expense}
          style={styles.deleteAction}
          onPress={() => onDelete(transaction.id)}
        />
      )}
    >
      <View style={styles.item}>
        <CategoryIcon category={category} size={44} borderRadius={13} />
        <View style={styles.info}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.body, color: COLORS.textPrimary, letterSpacing: -0.3 }}>
            {transaction.note ?? category.label}
          </Text>
          <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.caption, color: COLORS.textSecondary, marginTop: 2 }}>
            {category.label}
          </Text>
        </View>
        <Text style={{ fontFamily: FONTS.moneyBold, fontSize: FONT_SIZES.body, color: amountColor, letterSpacing: -0.5 }}>
          {amountPrefix}${formatCurrency(transaction.amount)}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  editAction: {
    borderRadius: 16,
    marginRight: 8,
  },
  deleteAction: {
    borderRadius: 16,
    marginLeft: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  info: {
    flex: 1,
  },
});
