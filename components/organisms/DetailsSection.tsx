import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import { DETAIL_ACCOUNT, DETAIL_DATE } from "@/constants/details";
import DetailCard from "@/components/molecules/DetailCard";
import NoteCard from "@/components/molecules/NoteCard";

interface DetailsSectionProps {
  note: string;
  onChangeNote: (text: string) => void;
  onNoteFocus?: () => void;
}

export default function DetailsSection({
  note,
  onChangeNote,
  onNoteFocus,
}: DetailsSectionProps) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View className="gap-4 px-1">
      <Text style={styles.sectionTitle}>DETAILS</Text>
      <View className="flex-row gap-5">
        <DetailCard
          icon={DETAIL_ACCOUNT.icon}
          iconBg={DETAIL_ACCOUNT.iconBg}
          iconColor={DETAIL_ACCOUNT.iconColor}
          label={DETAIL_ACCOUNT.label}
          value="Cash"
        />
        <DetailCard
          icon={DETAIL_DATE.icon}
          iconBg={DETAIL_DATE.iconBg}
          iconColor={DETAIL_DATE.iconColor}
          label={DETAIL_DATE.label}
          value={`Today, ${today}`}
        />
      </View>
      <NoteCard note={note} onChangeNote={onChangeNote} onFocus={onNoteFocus} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
});
