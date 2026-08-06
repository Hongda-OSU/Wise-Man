import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Search, User } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatAmount } from "@/utils/formatAmount";

interface HomeHeaderProps {
  month: string;
  netBalance: number;
  income: number;
  expense: number;
}

interface CellProps {
  label: string;
  value: string;
  color?: string;
}

function Cell({ label, value, color = COLORS.textPrimary }: CellProps) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={[styles.cellValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function HomeHeader({ month, netBalance, income, expense }: HomeHeaderProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Image source={require("../../assets/mark-mono.png")} style={styles.logo} />
          <Text style={styles.wordmark}>Wise Man</Text>
        </View>

        {/* Grouped, the way the reference groups its controls, rather than two loose glyphs. */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Search size={19} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <User size={19} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* A measured band of figures, divided by hairlines, in place of empty header space. */}
      <View style={styles.band}>
        <Cell label={month.toUpperCase()} value={`$${formatAmount(netBalance)}`} />
        <View style={styles.divider} />
        <Cell label="INCOME" value={`$${formatAmount(income)}`} color={COLORS.income} />
        <View style={styles.divider} />
        <Cell label="EXPENSE" value={`$${formatAmount(expense)}`} color={COLORS.expense} />
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
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  wordmark: {
    fontFamily: FONTS.displayBold,
    fontSize: 19,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
  },
  action: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  band: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
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
