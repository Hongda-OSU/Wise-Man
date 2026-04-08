import { View } from 'react-native';

import type { CategoryConfig } from '@/constants/categories';

interface CategoryIconProps {
  category: CategoryConfig;
  size?: number;
  borderRadius?: number;
}

export default function CategoryIcon({ category, size = 44, borderRadius = 13 }: CategoryIconProps) {
  const iconSize = Math.round(size * 0.45);

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius, backgroundColor: category.bg }}
    >
      <category.icon size={iconSize} color={category.color} />
    </View>
  );
}
