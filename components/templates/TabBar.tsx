import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { House, BriefcaseBusiness, DollarSign, CalendarDays, ChartPie } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS } from '@/constants/colors';

interface TabItem {
  name: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  route: string;
}

const TABS: TabItem[] = [
  { name: 'index', label: 'Home', icon: House, route: '/' },
  { name: 'portfolio', label: 'Portfolio', icon: BriefcaseBusiness, route: '/portfolio' },
  { name: 'events', label: 'Events', icon: CalendarDays, route: '/events' },
  { name: 'analysis', label: 'Analysis', icon: ChartPie, route: '/analysis' },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="h-[90px] bg-transparent">
      <Svg
        width="100%"
        height={90}
        viewBox="0 0 393 90"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d="M 0 90 L 0 20 L 130.5 20 C 163.5 20 163.5 2 196.5 2 C 229.5 2 229.5 20 262.5 20 L 393 20 L 393 90 Z"
          fill="white"
          stroke="#E5E3DC"
          strokeWidth="0.5"
        />
      </Svg>

      <View className="flex-row items-center px-4 pb-3 pt-6 h-full">
        {TABS.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.name}
            tab={tab}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}

        <View className="flex-1 items-center justify-center gap-1">
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-[#1A2E28] items-center justify-center -mt-7"
            style={styles.trackShadow}
            onPress={() => router.push('/track')}
            accessibilityRole="button"
            accessibilityLabel="Track transaction"
          >
            <DollarSign size={26} color={COLORS.white} />
          </TouchableOpacity>
          <Text className="text-[11px] font-medium text-[#999]">Track</Text>
        </View>

        {TABS.slice(2).map((tab) => (
          <TabButton
            key={tab.name}
            tab={tab}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}
      </View>
    </View>
  );
}

function TabButton({ tab, active, onPress }: { tab: TabItem; active: boolean; onPress: () => void }) {
  const color = active ? COLORS.forestGreen : '#999';
  return (
    <TouchableOpacity className="flex-1 items-center justify-center gap-1" onPress={onPress} accessibilityRole="button">
      <tab.icon size={22} color={color} />
      <Text className="text-[11px] font-medium" style={{ color }}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trackShadow: {
    shadowColor: COLORS.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
