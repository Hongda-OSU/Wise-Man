import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Trash2 } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { getCategoryConfig } from "@/constants/categories";
import SwipeAction from "@/components/atoms/SwipeAction";
import { describeDue } from "@/utils/billSchedule";
import { formatShortDate } from "@/utils/dateUtils";
import { formatAmount } from "@/utils/formatAmount";
import { CADENCE_LABELS } from "@/types/bill";
import type { BillDue } from "@/types/bill";
import { TRANSACTION_TYPES } from "@/types/transaction";

interface BillItemProps {
  due: BillDue;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/** "AUG 1" -- the eyebrow form of a due date. The year is never the question here. */
function shortDueDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return formatShortDate(new Date(year, month - 1, day)).toUpperCase();
}

export default function BillItem({ due, onEdit, onDelete }: BillItemProps) {
  const { bill, dueDate, daysUntil } = due;
  const category = getCategoryConfig(bill.categoryId, bill.type);
  const isIncome = bill.type === TRANSACTION_TYPES.income;

  return (
    <ReanimatedSwipeable
      renderLeftActions={() => (
        <SwipeAction
          icon={Pencil}
          label="Edit"
          contentColor={COLORS.textPrimary}
          side="left"
          onPress={() => onEdit(bill.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          contentColor={COLORS.expense}
          side="right"
          onPress={() => onDelete(bill.id)}
        />
      )}
    >
      <View style={styles.row}>
        <View style={styles.iconColumn}>
          <category.icon size={18} color={COLORS.textSecondary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {bill.name}
          </Text>
          <Text style={styles.meta}>
            {CADENCE_LABELS[bill.cadence].toUpperCase()} · {shortDueDate(dueDate)}
          </Text>
        </View>

        {/* No action here. An occurrence posts itself when its date arrives, so
            the row reports rather than asks. */}
        <View style={styles.figures}>
          <Text style={[styles.amount, isIncome && styles.amountIncome]}>
            {isIncome ? "+" : "-"}${formatAmount(bill.amountCents)}
          </Text>
          <Text style={styles.status}>{describeDue(daysUntil)}</Text>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  // Same table row as a transaction: opaque over the swipe actions, one hairline
  // between it and the next.
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
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
  meta: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginTop: 3,
  },
  figures: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  amountIncome: {
    color: COLORS.income,
  },
  status: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: -0.1,
    marginTop: 3,
  },
});
