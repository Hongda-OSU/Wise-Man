import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Repeat, Trash2 } from "lucide-react-native";

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
  const isRecurring = transaction.billId !== undefined;

  return (
    <ReanimatedSwipeable
      renderLeftActions={() => (
        <SwipeAction
          icon={Pencil}
          label="Edit"
          contentColor={COLORS.textPrimary}
          side="left"
          onPress={() => onEdit(transaction.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          contentColor={COLORS.expense}
          side="right"
          onPress={() => onDelete(transaction.id)}
        />
      )}
    >
      {/* A table row, not a card: opaque so it covers the swipe actions, and ruled
          off from the next row by a single hairline. */}
      <View style={styles.row}>
        {/* No category glyph. The category is already written below, or is the
            title itself, so the icon was the same fact a third time -- and a
            column of grey shapes made the one glyph that carries meaning look
            like more of the same. */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {transaction.note ?? category.label}
            </Text>

            {/* On the title line, not the one below: the second line only exists
                when there is a note, and a lone glyph hanging under the name with
                nothing beside it read as a mistake. */}
            {isRecurring ? (
              <View accessible accessibilityLabel="Recurring">
                <Repeat size={12} color={COLORS.textSecondary} />
              </View>
            ) : null}
          </View>

          {/* With no note the category is the whole story, so it is the title and
              there is no second line. Repeating it under itself said nothing. */}
          {transaction.note ? (
            <Text style={styles.category}>{category.label.toUpperCase()}</Text>
          ) : null}
        </View>

        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}${formatAmount(transaction.amountCents)}
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
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    // Shrinks rather than pushing the recurring mark off the row.
    flexShrink: 1,
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
