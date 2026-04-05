import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { House, BriefcaseBusiness, DollarSign, CalendarDays, ChartPie } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import TabButton from '@/components/molecules/TabButton';

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
  const { width } = useWindowDimensions();

  const mid = width / 2;
  const notchHalf = 66;
  const path = `M 0 100 L 0 20 L ${mid - notchHalf} 20 C ${mid - notchHalf / 2} 20 ${mid - notchHalf / 2} 2 ${mid} 2 C ${mid + notchHalf / 2} 2 ${mid + notchHalf / 2} 20 ${mid + notchHalf} 20 L ${width} 20 L ${width} 100 Z`;

  return (
    <View className="h-[100px] bg-transparent">
      <Svg
        width={width}
        height={100}
        viewBox={`0 0 ${width} 100`}
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={path}
          fill="white"
          stroke="#E5E3DC"
          strokeWidth="0.5"
        />
      </Svg>

      <View className="flex-row items-center px-4 pb-3 pt-6 h-full">
        {TABS.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}

        <View className="flex-1 items-center justify-center gap-1">
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-[#1A2E28] items-center justify-center -mt-8"
            style={styles.trackShadow}
            onPress={() => router.push('/track')}
            accessibilityRole="button"
            accessibilityLabel="Track transaction"
          >
            <DollarSign size={26} color={COLORS.white} />
          </TouchableOpacity>
          <Text className="text-[11px] text-[#999]" style={{ fontFamily: FONTS.medium }}>Track</Text>
        </View>

        {TABS.slice(2).map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={pathname === tab.route}
            onPress={() => router.push(tab.route as any)}
          />
        ))}
      </View>
    </View>
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
