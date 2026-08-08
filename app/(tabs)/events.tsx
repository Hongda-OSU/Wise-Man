import { useEffect, useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BillList from "@/components/organisms/BillList";
import BillsHeader from "@/components/molecules/BillsHeader";
import ErrorNotice from "@/components/molecules/ErrorNotice";
import ListEyebrow from "@/components/molecules/ListEyebrow";
import { COLORS } from "@/constants/colors";
import { useBillStore } from "@/stores/bills";
import { toDueList } from "@/utils/billSchedule";

export default function EventsScreen() {
  const router = useRouter();

  const items = useBillStore((state) => state.items);
  const error = useBillStore((state) => state.error);
  const load = useBillStore((state) => state.load);
  const remove = useBillStore((state) => state.remove);

  // Also posts anything that has come due since the last look -- see stores/bills.
  useEffect(() => {
    load();
  }, [load]);

  const dueList = useMemo(() => toDueList(items), [items]);

  // Confirmed because there is no undo, and unlike a transaction a bill is the
  // rule behind every future one.
  const confirmDelete = (id: string) => {
    const bill = items.find((item) => item.id === id);
    if (!bill) return;

    Alert.alert(`Delete ${bill.name}?`, "Transactions it already posted are kept.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => remove(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BillsHeader onAdd={() => router.push("/bill/new")} />

      {error ? <ErrorNotice message={error} /> : null}

      {/* Outside the scroll container, as on Home: the label stays put while the
          rows move under it. */}
      <ListEyebrow title="UPCOMING" />

      <BillList
        items={dueList}
        onEdit={(id) => router.push(`/bill/${id}`)}
        onDelete={confirmDelete}
        onAdd={() => router.push("/bill/new")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
