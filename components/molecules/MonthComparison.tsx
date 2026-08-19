import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatMonthLabel, formatMonthName } from "@/utils/dateUtils";
import { formatAmount } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";

interface MonthComparisonProps {
  /** YYYY-MM. */
  month: string;
  previousMonth: string;
  currentCents: number;
  previousCents: number;
  type: TransactionType;
  onPressMonth: () => void;
}

/**
 * The headline. Home already shows what this month cost, so repeating it here
 * would say nothing -- what no other screen knows is how it compares.
 */
export default function MonthComparison({
  month,
  previousMonth,
  currentCents,
  previousCents,
  type,
  onPressMonth,
}: MonthComparisonProps) {
  const deltaCents = currentCents - previousCents;
  const spentMore = deltaCents > 0;
  const previousName = formatMonthName(previousMonth);

  // With nothing last month there is no comparison to draw. Reporting "$2,053
  // more than July" against an empty July reads as overspending when it only
  // means the app was not being used, so this falls back to the plain total.
  const comparable = previousCents > 0;

  // Which direction is the bad one flips with the side of the ledger: spending
  // more is the expense direction, earning more is not.
  const isIncome = type === TRANSACTION_TYPES.income;
  const good = isIncome ? spentMore : !spentMore;

  return (
    <View style={styles.band}>
      {/* Only the eyebrow is the control, as on Home: the figure under it is not
          a button. */}
      <TouchableOpacity
        style={styles.monthButton}
        onPress={onPressMonth}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Change month, currently ${formatMonthLabel(month)}`}
      >
        <Text style={styles.eyebrow}>{formatMonthLabel(month).toUpperCase()}</Text>
        <ChevronDown size={13} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {!comparable ? (
        <>
          <Text style={styles.figure}>${formatAmount(currentCents)}</Text>
          <Text style={styles.caption}>spent · nothing recorded in {previousName}</Text>
        </>
      ) : deltaCents === 0 ? (
        <>
          <Text style={styles.figure}>${formatAmount(currentCents)}</Text>
          <Text style={styles.caption}>the same as {previousName}</Text>
        </>
      ) : (
        <>
          {/* The one place colour carries the message rather than the category:
              spending more is the expense direction. */}
          <Text style={[styles.figure, { color: good ? COLORS.income : COLORS.expense }]}>
            ${formatAmount(deltaCents)}
          </Text>
          <Text style={styles.caption}>
            {spentMore ? "more" : "less"} than {previousName}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 3,
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eyebrow: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  figure: {
    fontFamily: FONTS.displayExtraBold,
    fontSize: 30,
    color: COLORS.textPrimary,
    letterSpacing: -1.2,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
});
