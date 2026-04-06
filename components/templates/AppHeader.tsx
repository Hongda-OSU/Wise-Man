import { View, Text, TouchableOpacity } from 'react-native';
import { Search, User } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import AppIcon from '@/components/atoms/AppIcon';

export default function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-7 pt-4 pb-7">
      {/* Left: App icon + name */}
      <View className="flex-row items-center gap-3">
        <AppIcon />
        <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.textPrimary, fontSize: 18, letterSpacing: -0.9 }}>Wise Man</Text>
      </View>

      {/* Right: Search + Profile */}
      <View className="flex-row items-center gap-6">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Search">
          <Search size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Profile">
          <User size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
