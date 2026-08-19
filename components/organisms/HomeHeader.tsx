import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Search, ChevronDown } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatAmount, formatSignedAmount } from "@/utils/formatAmount";

interface HomeHeaderProps {
  month: string;
  netBalance: number;
  income: number;
  expense: number;
  onPressMonth: () => void;
  onPressSearch: () => void;
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

export default function HomeHeader({
  month,
  netBalance,
  income,
  expense,
  onPressMonth,
  onPressSearch,
}: HomeHeaderProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Image source={require("../../assets/mark-mono.png")} style={styles.logo} />
          <Text style={styles.wordmark}>Wise Man</Text>
        </View>

        {/* One glyph, so no capsule around it. The container existed to group two
            controls; the profile button went because there was nothing behind it
            -- no account, no theme, no language, nothing to put on a settings
            screen that would not have been invented for the occasion. */}
        <TouchableOpacity
          style={styles.action}
          onPress={onPressSearch}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Search size={19} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* A measured band of figures, divided by hairlines, in place of empty header space.
          The net figure takes the full width above so it reads as the headline; income and
          expense split the row beneath it. */}
      <View style={styles.band}>
        <View style={styles.netRow}>
          {/* Only the eyebrow is the control. Making the whole row tappable would
              put a button under the headline figure, which is not one. */}
          <TouchableOpacity
            style={styles.monthButton}
            onPress={onPressMonth}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Change month, currently ${month}`}
          >
            <Text style={styles.cellLabel}>{month.toUpperCase()}</Text>
            <ChevronDown size={13} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.netValue}>{formatSignedAmount(netBalance)}</Text>
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
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
