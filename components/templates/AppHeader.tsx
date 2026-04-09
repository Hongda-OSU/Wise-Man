import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, User } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import AppIcon from '@/components/atoms/AppIcon';

export default function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-7 pt-4 pb-4">
      {/* Left: App icon + name */}
      <View className="flex-row items-center gap-3">
        <AppIcon />
        <Text style={styles.appName}>Wise Man</Text>
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

const styles = StyleSheet.create({
  appName: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.textPrimary,
    textShadowColor: COLORS.textPrimary,
    textShadowOffset: { width: 0.4, height: 0.4 },
    textShadowRadius: 0.1,
  },
});
