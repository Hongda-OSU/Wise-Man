import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

interface SwipeActionProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  backgroundColor: string;
  className?: string;
  onPress: () => void;
}

export default function SwipeAction({ icon: Icon, label, backgroundColor, className, onPress }: SwipeActionProps) {
  return (
    <TouchableOpacity
      className={`items-center justify-center ${className ?? ''}`}
      style={{ backgroundColor, width: 72 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon size={18} color={COLORS.white} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.white,
    marginTop: 4,
  },
});
