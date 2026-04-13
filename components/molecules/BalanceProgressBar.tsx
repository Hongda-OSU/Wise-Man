import { View } from "react-native";

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
    <View
      className="h-2 rounded-full mb-4 overflow-hidden flex-row"
      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
    >
      <View
        className="h-full"
        style={{
          width: `${(netBalance / income) * 100}%`,
          backgroundColor: COLORS.income,
          borderTopLeftRadius: 999,
          borderBottomLeftRadius: 999,
        }}
      />
      <View
        className="h-full"
        style={{
          width: `${(expense / income) * 100}%`,
          backgroundColor: COLORS.expense,
          borderTopRightRadius: 999,
          borderBottomRightRadius: 999,
        }}
      />
    </View>
  );
}
