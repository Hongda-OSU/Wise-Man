import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import AccountList from "@/components/organisms/AccountList";
import ErrorNotice from "@/components/molecules/ErrorNotice";
import NetWorthBand from "@/components/molecules/NetWorthBand";
import TabHeader from "@/components/molecules/TabHeader";
import { COLORS } from "@/constants/colors";
import { useAccountStore } from "@/stores/accounts";
import { confirmAccountDelete } from "@/utils/confirmAccountDelete";
import { groupByKind, netWorthCents } from "@/utils/groupAccounts";

export default function PortfolioScreen() {
  const router = useRouter();

  const items = useAccountStore((state) => state.items);
  const error = useAccountStore((state) => state.error);
  const load = useAccountStore((state) => state.load);
  const remove = useAccountStore((state) => state.remove);

  // On focus, not on mount: a tab stays mounted once opened, so a transaction
  // entered on Home would otherwise leave these balances as they were. It also
  // clears a stale error, since a successful read resets it.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sections = useMemo(() => groupByKind(items), [items]);
  const netWorth = useMemo(() => netWorthCents(items), [items]);

  const confirmDelete = (id: string) => {
    const found = items.find((item) => item.account.id === id);
    if (!found) return;

    confirmAccountDelete({ id, name: found.account.name, onConfirm: () => remove(id) });
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
