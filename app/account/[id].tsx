import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import AccountForm from "@/components/organisms/AccountForm";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { countAccountTransactions, getAccount } from "@/db/accounts";
import { useAccountStore } from "@/stores/accounts";
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

  // Checked here as well as in the repository, so the refusal is a sentence in a
  // dialog rather than an error banner on the screen behind this one.
  const handleDelete = async () => {
    const used = await countAccountTransactions(id);

    if (used > 0) {
      Alert.alert(
        "Account is in use",
        `${used} transaction${used === 1 ? "" : "s"} still use this account. Move or delete them first.`,
        [{ text: "OK" }],
      );
      return;
    }

    Alert.alert(
      `Delete ${account?.name ?? "this account"}?`,
      "The account's opening balance goes with it.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await remove(id);
            router.back();
          },
        },
      ],
    );
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
