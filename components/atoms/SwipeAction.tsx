import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

interface SwipeActionProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  backgroundColor: string;
  style?: object;
  onPress: () => void;
}

export default function SwipeAction({ icon: Icon, label, backgroundColor, style, onPress }: SwipeActionProps) {
  return (
    <TouchableOpacity
      style={[styles.action, { backgroundColor }, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon size={18} color={COLORS.white} />
      <Text style={{ fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.micro, color: COLORS.white, marginTop: 4 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
