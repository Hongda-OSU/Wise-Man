import { TouchableOpacity, Text } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

interface TabButtonProps {
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  active: boolean;
  onPress: () => void;
}

export default function TabButton({ label, icon: Icon, active, onPress }: TabButtonProps) {
  const color = active ? COLORS.forestGreen : '#999';
  return (
    <TouchableOpacity className="flex-1 items-center justify-center gap-1" onPress={onPress} accessibilityRole="button">
      <Icon size={22} color={color} />
      <Text style={{ color, fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.micro }}>{label}</Text>
    </TouchableOpacity>
  );
}
