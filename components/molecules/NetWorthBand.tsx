import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { formatSignedAmount } from "@/utils/formatAmount";

interface NetWorthBandProps {
  netWorthCents: number;
}

/**
 * The one figure on this screen that deserves the size. Unlike a monthly average
 * it is a measurement: every account's opening balance plus every transaction
 * ever recorded against it.
 */
export default function NetWorthBand({ netWorthCents }: NetWorthBandProps) {
  return (
    <View style={styles.band}>
      <Text style={styles.label}>NET WORTH</Text>
      <Text style={styles.value}>{formatSignedAmount(netWorthCents)}</Text>
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  value: {
    fontFamily: FONTS.displayExtraBold,
    fontSize: 30,
    color: COLORS.textPrimary,
    letterSpacing: -1.2,
  },
});
