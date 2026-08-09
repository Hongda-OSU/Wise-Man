import { Alert } from "react-native";

import { countAccountTransactions } from "@/db/accounts";

interface ConfirmAccountDeleteOptions {
  id: string;
  name: string;
  onConfirm: () => void;
}

/**
 * The delete conversation for an account, shared by the list and the detail
 * screen so both refuse on the same terms.
 *
 * The repository refuses too, but only by throwing -- which lands in the store's
 * error state and stays on screen. Asking first turns "you cannot" into a dialog
 * the person dismisses, which is what a refusal should be.
 */
export async function confirmAccountDelete({
  id,
  name,
  onConfirm,
}: ConfirmAccountDeleteOptions): Promise<void> {
  const used = await countAccountTransactions(id);

  if (used > 0) {
    Alert.alert(
      "Account is in use",
      `${used} transaction${used === 1 ? "" : "s"} still use this account. Move or delete them first.`,
      [{ text: "OK" }],
    );
    return;
  }

  Alert.alert(`Delete ${name}?`, "The account's opening balance goes with it.", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
}
