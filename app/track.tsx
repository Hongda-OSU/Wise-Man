import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import ToggleBar from '@/components/molecules/ToggleBar';
import AmountCard from '@/components/organisms/AmountCard';
import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';

export default function TrackScreen() {
  const router = useRouter();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');

  return (
    <SafeAreaView className="flex-1 px-7" style={{ backgroundColor: COLORS.bgPrimary }} edges={['top', 'bottom']}>
      {/* Nav Bar */}
      <View className="flex-row items-center py-6">
        <TouchableOpacity
          className="flex-1"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{type === 'expense' ? 'Add Expense' : 'Add Income'}</Text>
        <View className="flex-1" />
      </View>

      {/* Content */}
      <View className="flex-1 pt-2 gap-6">
        <ToggleBar active={type} onChange={setType} />
        <AmountCard
          selectedCategory={null}
          amount={amount}
          onAmountChange={setAmount}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
  },
});
