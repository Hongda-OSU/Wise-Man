import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";

interface FormRowProps {
  label: string;
  /** Right-hand text. Ignored when `children` is given. */
  value?: string;
  /** Renders `value` in the placeholder tone when nothing has been chosen yet. */
  muted?: boolean;
  chevron?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}

export default function FormRow({
  label,
  value,
  muted = false,
  chevron = false,
  onPress,
  children,
}: FormRowProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.row}
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? `${label}: ${value ?? ""}` : undefined}
    >
      <Text style={styles.label}>{label}</Text>

      <View style={styles.right}>
        {children ?? <Text style={[styles.value, muted && styles.valueMuted]}>{value}</Text>}
      </View>

      {chevron ? <ChevronRight size={15} color={COLORS.textSecondary} /> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  value: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    textAlign: "right",
  },
  valueMuted: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});
