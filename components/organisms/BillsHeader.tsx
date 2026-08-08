import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatAmount, formatSignedAmount } from "@/utils/formatAmount";

interface BillsHeaderProps {
  /** Monthly equivalents, in cents. */
  income: number;
  expense: number;
  net: number;
  onAdd: () => void;
}

interface CellProps {
  label: string;
  value: string;
  color: string;
}

function Cell({ label, value, color }: CellProps) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={[styles.cellValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function BillsHeader({ income, expense, net, onAdd }: BillsHeaderProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.title}>Events</Text>

        <TouchableOpacity
          style={styles.action}
          onPress={onAdd}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add recurring bill"
        >
          <Plus size={19} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* The same band as Home, reading the same way: the headline figure over a
          hairline-split pair. Here it answers "what is already committed", which
          is what a list of recurring bills is for. */}
      <View style={styles.band}>
        <View style={styles.netRow}>
          <Text style={styles.cellLabel}>PER MONTH</Text>
          <Text style={styles.netValue}>{formatSignedAmount(net)}</Text>
        </View>

        <View style={styles.splitRow}>
          <Cell label="INCOME" value={`$${formatAmount(income)}`} color={COLORS.income} />
          <View style={styles.divider} />
          <Cell label="EXPENSE" value={`$${formatAmount(expense)}`} color={COLORS.expense} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 19,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  // Matches the capsule buttons on Home, minus the capsule: there is one action
  // here, and a container around a single glyph is furniture.
  action: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  band: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  netRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 3,
    alignItems: "flex-start",
  },
  netValue: {
    fontFamily: FONTS.displayExtraBold,
    fontSize: 30,
    color: COLORS.textPrimary,
    letterSpacing: -1.2,
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 3,
  },
  cellLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  cellValue: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    letterSpacing: -0.3,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
});
