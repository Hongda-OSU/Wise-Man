import { View, TouchableOpacity } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Segment {
  key: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

interface SegmentedControlProps {
  segments: Segment[];
  activeKey: string;
  onPress: (key: string) => void;
}

export default function SegmentedControl({ segments, activeKey, onPress }: SegmentedControlProps) {
  return (
    <View className="flex-row items-center rounded-xl p-1" style={{ backgroundColor: COLORS.toggleBg }}>
      {segments.map(({ key, icon: Icon }) => (
        <TouchableOpacity
          key={key}
          className="rounded-lg w-12 h-8 items-center justify-center"
          style={{ backgroundColor: activeKey === key ? COLORS.white : 'transparent' }}
          onPress={() => onPress(key)}
          accessibilityRole="button"
        >
          <Icon size={18} color={activeKey === key ? COLORS.textPrimary : COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
