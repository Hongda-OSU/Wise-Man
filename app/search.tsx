import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SectionList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";

import SectionHeading from "@/components/molecules/SectionHeading";
import TransactionItem from "@/components/molecules/TransactionItem";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { searchTransactions } from "@/db/transactions";
import { useTransactionStore } from "@/stores/transactions";
import { groupByDay } from "@/utils/groupTransactions";
import type { Transaction } from "@/types/transaction";

export default function SearchScreen() {
  const router = useRouter();
  const remove = useTransactionStore((state) => state.remove);
  const reload = useTransactionStore((state) => state.load);

  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Transaction[]>([]);

  // The term the last dispatched query was for. A query typed quickly fires
  // several times, and without this a slow early one can land after a fast later
  // one and overwrite it with results for a term that is no longer on screen.
  const latest = useRef("");

  useEffect(() => {
    latest.current = term;

    searchTransactions(term).then((found) => {
      if (latest.current === term) setResults(found);
    });
  }, [term]);

  const handleDelete = async (id: string) => {
    await remove(id);
    // The store reload keeps Home right; this list has to be told separately.
    setResults((current) => current.filter((item) => item.id !== id));
  };

  // Grouped by day, as on Home. Results span months, so without the date heading
  // two rows for the same shop are indistinguishable.
  const sections = useMemo(() => groupByDay(results), [results]);

  const searching = term.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Its own header rather than ScreenHeader: the title is the field. */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Home reads the store, and a delete from here changed it.
            reload();
            router.back();
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TextInput
          value={term}
          onChangeText={setTerm}
          placeholder="Search notes and categories"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
        />

        {searching ? (
          <TouchableOpacity
            onPress={() => setTerm("")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <X size={17} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        // Two different nothings: an untouched field has not failed to find
        // anything, so it must not say so.
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyLabel}>{searching ? "NO MATCHES" : "SEARCH"}</Text>
            <Text style={styles.emptyBody}>
              {searching
                ? `Nothing matches “${term.trim()}”.`
                : "Type to look through every month at once."}
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <SectionHeading title={section.title.toUpperCase()} />
        )}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onEdit={(id) => router.push(`/transaction/${id}`)}
            onDelete={handleDelete}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    padding: 0,
  },
  content: {
    paddingBottom: 32,
  },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  emptyLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  emptyBody: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
});
