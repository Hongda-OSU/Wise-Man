import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// TODO: migrate to ReanimatedSwipeable — requires dev client (eas build)
// eslint-disable-next-line deprecation/deprecation
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Pencil, Trash2 } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import { getCategoryConfig } from '@/constants/categories';
import { formatCurrency } from '@/utils/formatCurrency';
import CategoryIcon from '@/components/atoms/CategoryIcon';
import type { Transaction } from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function EditAction({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.editAction} onPress={onPress} accessibilityRole="button" accessibilityLabel="Edit">
      <Pencil size={18} color={COLORS.white} />
      <Text style={{ fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.micro, color: COLORS.white, marginTop: 4 }}>Edit</Text>
    </TouchableOpacity>
  );
}

function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.deleteAction} onPress={onPress} accessibilityRole="button" accessibilityLabel="Delete">
      <Trash2 size={18} color={COLORS.white} />
      <Text style={{ fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.micro, color: COLORS.white, marginTop: 4 }}>Delete</Text>
    </TouchableOpacity>
  );
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const category = getCategoryConfig(transaction.categoryId, transaction.type);
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? COLORS.income : COLORS.textPrimary;
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <Swipeable
      renderLeftActions={() => <EditAction onPress={() => onEdit(transaction.id)} />}
      renderRightActions={() => <DeleteAction onPress={() => onDelete(transaction.id)} />}
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
  editAction: {
    backgroundColor: COLORS.forestGreen,
    borderRadius: 16,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteAction: {
    backgroundColor: COLORS.expense,
    borderRadius: 16,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
