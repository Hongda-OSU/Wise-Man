import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Trash2 } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { getCategoryConfig } from "@/constants/categories";
import { formatAmount } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import CategoryIcon from "@/components/atoms/CategoryIcon";
import SwipeAction from "@/components/atoms/SwipeAction";
import type { Transaction } from "@/types/transaction";

// ReanimatedSwipeable defaults to damping 1000 against a critical value of ~75, which is
// heavily overdamped and crawls back into place. This is critically damped instead: no
// overshoot, but it settles at roughly the speed the old Swipeable did.
const SWIPE_SPRING = {
  mass: 1,
  damping: 40,
  stiffness: 400,
  overshootClamping: true,
};

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const category = getCategoryConfig(transaction.categoryId, transaction.type);
  const isIncome = transaction.type === TRANSACTION_TYPES.income;
  const amountColor = isIncome ? COLORS.income : COLORS.textPrimary;
  const amountPrefix = isIncome ? "+" : "-";

  return (
    <ReanimatedSwipeable
      animationOptions={SWIPE_SPRING}
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
      <View style={styles.row}>
        <CategoryIcon category={category} size={44} borderRadius={13} />
        <View style={styles.info}>
          <Text style={styles.name}>{transaction.note ?? category.label}</Text>
          <Text style={styles.category}>{category.label}</Text>
        </View>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}${formatAmount(transaction.amount)}
        </Text>
      </View>
    </ReanimatedSwipeable>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
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
    fontSize: FONT_SIZES.subBody,
    letterSpacing: -0.5,
  },
});
