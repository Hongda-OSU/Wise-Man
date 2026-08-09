import { useEffect, useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AccountList from "@/components/organisms/AccountList";
import ErrorNotice from "@/components/molecules/ErrorNotice";
import NetWorthBand from "@/components/molecules/NetWorthBand";
import TabHeader from "@/components/molecules/TabHeader";
import { COLORS } from "@/constants/colors";
import { useAccountStore } from "@/stores/accounts";
import { groupByKind, netWorthCents } from "@/utils/groupAccounts";

export default function PortfolioScreen() {
  const router = useRouter();

  const items = useAccountStore((state) => state.items);
  const error = useAccountStore((state) => state.error);
  const load = useAccountStore((state) => state.load);
  const remove = useAccountStore((state) => state.remove);

  // Balances come from the ledger, so this has to re-read whenever the screen is
  // shown -- a transaction entered on Home changes the figures here.
  useEffect(() => {
    load();
  }, [load]);

  const sections = useMemo(() => groupByKind(items), [items]);
  const netWorth = useMemo(() => netWorthCents(items), [items]);

  // The store refuses when transactions still cite the account, and reports why
  // through `error`; this only guards the case where deleting is allowed.
  const confirmDelete = (id: string) => {
    const found = items.find((item) => item.account.id === id);
    if (!found) return;

    Alert.alert(`Delete ${found.account.name}?`, "The account's opening balance goes with it.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => remove(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* The band below supplies the rule, so the header does not draw its own. */}
      <TabHeader title="Portfolio" ruled={false} onAdd={() => router.push("/account/new")} />

      <NetWorthBand netWorthCents={netWorth} />

      {error ? <ErrorNotice message={error} /> : null}

      <AccountList
        sections={sections}
        onEdit={(id) => router.push(`/account/${id}`)}
        onDelete={confirmDelete}
        onAdd={() => router.push("/account/new")}
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
