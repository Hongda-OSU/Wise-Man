import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import TransactionForm from "@/components/organisms/TransactionForm";
import { COLORS } from "@/constants/colors";
import { useTransactionStore } from "@/stores/transactions";
import { toMonthKey } from "@/utils/dateUtils";
import type { NewTransaction } from "@/types/transaction";

export default function TrackScreen() {
  const router = useRouter();
  const add = useTransactionStore((state) => state.add);
  const setMonth = useTransactionStore((state) => state.setMonth);

  const handleSubmit = async (input: NewTransaction) => {
    await add(input);
    // Land on the month the transaction belongs to, not whichever one was open,
    // so entering an older date does not look like the write failed.
    await setMonth(toMonthKey(new Date(`${input.date}T00:00:00`)));
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="New Transaction" />
      <TransactionForm submitLabel="Save" onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
