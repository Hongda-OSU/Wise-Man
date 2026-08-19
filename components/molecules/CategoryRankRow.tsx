import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatAmount } from "@/utils/formatAmount";
import type { CategoryTotal } from "@/utils/groupTransactions";

interface CategoryRankRowProps {
  total: CategoryTotal;
}

export default function CategoryRankRow({ total }: CategoryRankRowProps) {
  const percent = Math.round(total.share * 100);

  return (
    <View style={styles.row}>
      <View style={styles.line}>
        <Text style={styles.label} numberOfLines={1}>
          {total.label}
        </Text>
        <Text style={styles.amount}>${formatAmount(total.amountCents)}</Text>
        {/* Fixed width so the percentages line up under each other however many
            digits they have. */}
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      {/* The share again, as a length. Two encodings of one number, because a
          column of percentages is read one at a time and a column of bars is
          read at a glance. */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(total.share * 100, 0.5)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  amount: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  percent: {
    width: 34,
    textAlign: "right",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    fontVariant: ["tabular-nums"],
  },
  // A rule that happens to be partly filled, at the same weight as every other
  // rule on the screen.
  track: {
    height: 2,
    backgroundColor: COLORS.overlaySoft,
  },
  fill: {
    height: 2,
    backgroundColor: COLORS.overlayStrong,
  },
});
