import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import AccountForm from "@/components/organisms/AccountForm";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { getAccount } from "@/db/accounts";
import { useAccountStore } from "@/stores/accounts";
import { confirmAccountDelete } from "@/utils/confirmAccountDelete";
import type { Account, NewAccount } from "@/types/account";

export default function AccountDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const edit = useAccountStore((state) => state.edit);
  const remove = useAccountStore((state) => state.remove);

  // Read from the database, so the screen works on a cold start rather than only
  // when the list happens to be loaded behind it.
  const [account, setAccount] = useState<Account | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAccount(id).then((found) => {
      setAccount(found);
      setLoaded(true);
    });
  }, [id]);

  const handleSubmit = async (input: NewAccount) => {
    await edit(id, input);
    router.back();
  };

  const handleDelete = async () => {
    if (!account) return;

    await confirmAccountDelete({
      id,
      name: account.name,
      onConfirm: async () => {
        await remove(id);
        router.back();
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="Account" />

      {!loaded ? null : account ? (
        <AccountForm
          initial={account}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      ) : (
        <View style={styles.missing}>
          <Text style={styles.missingLabel}>NOT FOUND</Text>
          <Text style={styles.missingBody}>This account has been deleted.</Text>
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
