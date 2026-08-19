import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatMonthAbbrev } from "@/utils/dateUtils";
import { formatAmount } from "@/utils/formatAmount";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { TransactionType } from "@/types/transaction";
import type { MonthlyTotal } from "@/db/transactions";

interface MonthlyChartProps {
  /** Oldest first. The last entry is the month being viewed. */
  months: MonthlyTotal[];
  type: TransactionType;
}

const PLOT_HEIGHT = 96;
const MIN_BAR_HEIGHT = 2;
// Three lines is enough to read a height against without becoming a grid.
const GRID_LINES = 3;

/**
 * Income or expense per month. One series, so it needs no palette.
 *
 * The axis is the point: bars without one have a shape but no magnitude, which
 * makes the tallest of them an unreadable block. Values are rounded to whole
 * dollars -- cents on an axis label are noise.
 *
 * Bars start at zero. Cropping the axis would make a steady run of months look
 * dramatic, which is the one thing a chart about money must not do.
 */
export default function MonthlyChart({ months, type }: MonthlyChartProps) {
  const peak = Math.max(...months.map((m) => m.amountCents), 0);
  const current = months.length - 1;
  const isIncome = type === TRANSACTION_TYPES.income;

  // Ticks from the top down, so they can be laid out in reading order.
  const ticks = Array.from({ length: GRID_LINES }, (_, index) => {
    const fraction = 1 - index / (GRID_LINES - 1);
    return { fraction, value: Math.round((peak * fraction) / 100) };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{isIncome ? "EARNED PER MONTH" : "SPENT PER MONTH"}</Text>

      <View style={styles.chart}>
        {/* The axis labels and their rules are one layer; the bars sit on top, so
            a bar crossing a rule reads as a measurement against it. */}
        <View style={styles.grid}>
          {ticks.map(({ fraction, value }) => (
            <View key={fraction} style={styles.gridRow}>
              {/* Whole dollars: cents on an axis label are noise. */}
              <Text style={styles.tick}>${value.toLocaleString("en-US")}</Text>
              <View style={styles.gridLine} />
            </View>
          ))}
        </View>

        <View style={styles.bars}>
          {months.map(({ month, amountCents }, index) => {
            const height =
              peak > 0 && amountCents > 0
                ? Math.max((amountCents / peak) * PLOT_HEIGHT, MIN_BAR_HEIGHT)
                : 0;

            return (
              <View key={month} style={styles.column}>
                <View
                  style={[
                    styles.bar,
                    index === current && (isIncome ? styles.barIncome : styles.barCurrent),
                    { height },
                  ]}
                  accessible
                  accessibilityLabel={`${formatMonthAbbrev(month)}: ${formatAmount(amountCents)}`}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.axis}>
        {months.map(({ month }, index) => (
          <Text
            key={month}
            style={[styles.monthLabel, index === current && styles.monthLabelCurrent]}
          >
            {formatMonthAbbrev(month)}
          </Text>
        ))}
      </View>
    </View>
  );
}

// Room for the widest tick label, so the bars start on the same line whatever the
// figures are.
const TICK_WIDTH = 58;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  eyebrow: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  chart: {
    height: PLOT_HEIGHT,
  },
  grid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    // Half the label's line height, so the rule meets the text's centre.
    marginBottom: -6,
  },
  tick: {
    width: TICK_WIDTH,
    textAlign: "right",
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.fine,
    color: COLORS.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  gridLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: PLOT_HEIGHT,
    paddingLeft: TICK_WIDTH + 8,
    gap: 8,
  },
  column: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    backgroundColor: COLORS.overlayMuted,
  },
  barCurrent: {
    backgroundColor: COLORS.expense,
  },
  barIncome: {
    backgroundColor: COLORS.income,
  },
  axis: {
    flexDirection: "row",
    paddingLeft: TICK_WIDTH + 8,
    paddingTop: 7,
    gap: 8,
  },
  monthLabel: {
    flex: 1,
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.fine,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  monthLabelCurrent: {
    color: COLORS.textPrimary,
  },
});
