import { View, Text, StyleSheet } from 'react-native';
import { List, CalendarDays } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import SegmentedControl from '@/components/atoms/SegmentedControl';

interface TransactionHeaderProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

const VIEW_SEGMENTS = [
  { key: 'list', icon: List },
  { key: 'calendar', icon: CalendarDays },
];

export default function TransactionHeader({ view, onViewChange }: TransactionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-8 mt-7 mb-3">
      <Text style={styles.title}>TRANSACTIONS</Text>
      <SegmentedControl
        segments={VIEW_SEGMENTS}
        activeKey={view}
        onPress={(key) => onViewChange(key as 'list' | 'calendar')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
});
