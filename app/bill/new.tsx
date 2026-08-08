import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import BillForm from "@/components/organisms/BillForm";
import { COLORS } from "@/constants/colors";
import { useBillStore } from "@/stores/bills";
import type { NewBill } from "@/types/bill";

export default function NewBillScreen() {
  const router = useRouter();
  const add = useBillStore((state) => state.add);

  const handleSubmit = async (input: NewBill) => {
    await add(input);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="New Bill" />
      <BillForm submitLabel="Save" onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
