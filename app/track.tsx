import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import ToggleBar from "@/components/molecules/ToggleBar";
import AmountCard from "@/components/organisms/AmountCard";
import CategoryGrid from "@/components/organisms/CategoryGrid";
import DetailsSection from "@/components/organisms/DetailsSection";
import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";

export default function TrackScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;

  const handleTypeChange = (value: "expense" | "income") => {
    setType(value);
    setCategoryId(null);
  };

  return (
    <SafeAreaView
      className="flex-1 px-7"
      style={{ backgroundColor: COLORS.bgPrimary }}
      edges={["top", "bottom"]}
    >
      {/* Nav Bar */}
      <View className="flex-row items-center py-6">
        <TouchableOpacity
          className="flex-1"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {type === "expense" ? "Add Expense" : "Add Income"}
        </Text>
        <View className="flex-1" />
      </View>

      {/* Toggle */}
      <ToggleBar active={type} onChange={handleTypeChange} />

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ gap: 24, paddingTop: 24, paddingBottom: 24 }}
      >
        <AmountCard
          selectedCategory={selectedCategory}
          amount={amount}
          onAmountChange={setAmount}
        />
        <CategoryGrid
          categories={categories}
          selectedId={categoryId}
          onSelect={(id) => {
            setCategoryId((prev) => (prev === id ? null : id));
            Keyboard.dismiss();
          }}
        />
        <DetailsSection
          note={note}
          onChangeNote={setNote}
          onNoteFocus={() =>
            setTimeout(
              () => scrollViewRef.current?.scrollToEnd({ animated: true }),
              300,
            )
          }
        />

        {/* Confirm Button */}
        <TouchableOpacity
          className="items-center justify-center px-7 py-4 mt-3 mb-3 rounded-xl"
          style={styles.confirmBtn}
          accessibilityRole="button"
        >
          <Text style={styles.confirmText}>
            {type === "expense" ? "Add Expense" : "Add Income"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
  },
  confirmBtn: {
    backgroundColor: COLORS.forestGreen,
  },
  confirmText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
});
