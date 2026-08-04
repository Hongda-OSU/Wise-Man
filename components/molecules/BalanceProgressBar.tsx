import { View, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";

interface BalanceProgressBarProps {
  income: number;
  netBalance: number;
  expense: number;
}

export default function BalanceProgressBar({
  income,
  netBalance,
  expense,
}: BalanceProgressBarProps) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.bar,
          {
            width: `${(netBalance / income) * 100}%`,
            backgroundColor: COLORS.income,
            borderTopLeftRadius: 999,
            borderBottomLeftRadius: 999,
          },
        ]}
      />
      <View
        style={[
          styles.bar,
          {
            width: `${(expense / income) * 100}%`,
            backgroundColor: COLORS.expense,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "COLORS.overlayMuted",
  },
  bar: {
    height: "100%",
  },
});
