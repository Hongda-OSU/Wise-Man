import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Trash2 } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import SwipeAction from "@/components/atoms/SwipeAction";
import { formatSignedAmount } from "@/utils/formatAmount";
import type { AccountBalance } from "@/types/account";

interface AccountItemProps {
  item: AccountBalance;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AccountItem({ item, onEdit, onDelete }: AccountItemProps) {
  const { account, balanceCents } = item;

  return (
    <ReanimatedSwipeable
      renderLeftActions={() => (
        <SwipeAction
          icon={Pencil}
          label="Edit"
          contentColor={COLORS.textPrimary}
          side="left"
          onPress={() => onEdit(account.id)}
        />
      )}
      renderRightActions={() => (
        <SwipeAction
          icon={Trash2}
          label="Delete"
          contentColor={COLORS.expense}
          side="right"
          onPress={() => onDelete(account.id)}
        />
      )}
    >
      {/* One line. The section heading already says what kind of account this is,
          and a balance needs no caption. */}
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {account.name}
        </Text>

        <Text style={[styles.balance, balanceCents < 0 && styles.owed]}>
          {formatSignedAmount(balanceCents)}
        </Text>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  name: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  balance: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    // Digits share one advance width, so the column reads straight down.
    fontVariant: ["tabular-nums"],
  },
  // Money owed, not money spent -- the same red the ledger uses for an expense.
  owed: {
    color: COLORS.expense,
  },
});
