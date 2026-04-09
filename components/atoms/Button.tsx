import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

interface ButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  accessibilityLabel?: string;
}

export default function Button({ label, onPress, backgroundColor = COLORS.forestGreen, accessibilityLabel }: ButtonProps) {
  return (
    <TouchableOpacity
      className="items-center py-4 px-12"
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.white,
  },
});
