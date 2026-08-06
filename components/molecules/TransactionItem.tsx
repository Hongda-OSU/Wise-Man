import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Trash2 } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { getCategoryConfig } from "@/constants/categories";
import { formatAmount } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import SwipeAction from "@/components/atoms/SwipeAction";
import type { Transaction } from "@/types/transaction";

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
      renderLeftActions={() => (
        <SwipeAction
          icon={Pencil}
          label="Edit"
          backgroundColor={COLORS.accent}
          contentColor={COLORS.onAccent}
          onPress={() => onEdit(transaction.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          backgroundColor={COLORS.expense}
          contentColor={COLORS.textPrimary}
          onPress={() => onDelete(transaction.id)}
        />
      )}
    >
      {/* A table row, not a card: opaque so it covers the swipe actions, and ruled
          off from the next row by a single hairline. */}
      <View style={styles.row}>
        {/* Monochrome on purpose: income green and expense red are the only colour
            this interface spends, and a column of category hues dilutes them. */}
        <View style={styles.iconColumn}>
          <category.icon size={18} color={COLORS.textSecondary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {transaction.note ?? category.label}
          </Text>
          <Text style={styles.category}>{category.label.toUpperCase()}</Text>
        </View>

        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}${formatAmount(transaction.amount)}
        </Text>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  // Fixed width so every name in the list starts on the same vertical line.
  iconColumn: {
    width: 22,
    alignItems: "center",
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
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginTop: 3,
  },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    letterSpacing: -0.5,
    // Digits share one advance width, so the column reads straight down.
    fontVariant: ["tabular-nums"],
  },
});
