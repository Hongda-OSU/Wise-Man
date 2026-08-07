import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import TransactionForm from "@/components/organisms/TransactionForm";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { getTransaction } from "@/db/transactions";
import { useTransactionStore } from "@/stores/transactions";
import { toMonthKey } from "@/utils/dateUtils";
import type { NewTransaction, Transaction } from "@/types/transaction";

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const edit = useTransactionStore((state) => state.edit);
  const remove = useTransactionStore((state) => state.remove);
  const setMonth = useTransactionStore((state) => state.setMonth);

  // Read from the database rather than the store: the row may belong to a month
  // the store is not currently holding.
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getTransaction(id).then((found) => {
      setTransaction(found);
      setLoaded(true);
    });
  }, [id]);

  const handleSubmit = async (input: NewTransaction) => {
    await edit(id, input);
    await setMonth(toMonthKey(new Date(`${input.date}T00:00:00`)));
    router.back();
  };

  const handleDelete = async () => {
    await remove(id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="Transaction" />

      {!loaded ? null : transaction ? (
        <TransactionForm
          initial={transaction}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      ) : (
        <View style={styles.missing}>
          <Text style={styles.missingLabel}>NOT FOUND</Text>
          <Text style={styles.missingBody}>This transaction has been deleted.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  missing: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  missingLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  missingBody: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
});
