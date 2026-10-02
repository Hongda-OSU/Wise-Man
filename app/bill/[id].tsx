import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenHeader from "@/components/molecules/ScreenHeader";
import BillForm from "@/components/organisms/BillForm";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { SPACING } from "@/constants/spacing";
import { useBillStore } from "@/stores/bills";
import type { Bill, NewBill } from "@/types/bill";

export default function BillDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const edit = useBillStore((state) => state.edit);
  const remove = useBillStore((state) => state.remove);
  const find = useBillStore((state) => state.find);

  // Looked up by id rather than taken from `items`, so the screen works on a cold
  // start rather than only when the list happens to be loaded behind it.
  const [bill, setBill] = useState<Bill | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    find(id).then((found) => {
      setBill(found);
      setLoaded(true);
    });
  }, [find, id]);

  const handleSubmit = async (input: NewBill) => {
    await edit(id, input);
    router.back();
  };

  // Confirmed for the same reason as in the list: there is no undo.
  const handleDelete = async () => {
    Alert.alert(
      `Delete ${bill?.name ?? "this bill"}?`,
      "Transactions it already recorded are kept.",
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
      <ScreenHeader title="Bill" />

      {!loaded ? null : bill ? (
        <BillForm
          initial={bill}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      ) : (
        <View style={styles.missing}>
          <Text style={styles.missingLabel}>NOT FOUND</Text>
          <Text style={styles.missingBody}>This bill has been deleted.</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.xxs,
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
