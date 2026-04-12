import { View, Text, StyleSheet } from "react-native";
import { CreditCard, CalendarDays } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import DetailCard from "@/components/molecules/DetailCard";
import NoteCard from "@/components/molecules/NoteCard";

interface DetailsSectionProps {
  note: string;
  onChangeNote: (text: string) => void;
}

export default function DetailsSection({
  note,
  onChangeNote,
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
          icon={CreditCard}
          iconBg="#E8F0FF"
          iconColor="#4A6AE8"
          label="ACCOUNT"
          value="Cash"
        />
        <DetailCard
          icon={CalendarDays}
          iconBg="#FFF3DC"
          iconColor="#C8922A"
          label="DATE"
          value={`Today, ${today}`}
        />
      </View>
      <NoteCard note={note} onChangeNote={onChangeNote} />
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
