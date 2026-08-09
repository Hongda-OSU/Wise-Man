import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import AccountForm from "@/components/organisms/AccountForm";
import { COLORS } from "@/constants/colors";
import { useAccountStore } from "@/stores/accounts";
import type { NewAccount } from "@/types/account";

export default function NewAccountScreen() {
  const router = useRouter();
  const add = useAccountStore((state) => state.add);

  const handleSubmit = async (input: NewAccount) => {
    await add(input);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="New Account" />
      <AccountForm submitLabel="Save" onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
