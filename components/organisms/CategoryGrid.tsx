import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import type { CategoryConfig } from "@/constants/categories";

interface CategoryGridProps {
  categories: CategoryConfig[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedId,
  onSelect,
}: CategoryGridProps) {
  return (
    <View className="px-1">
      <Text style={styles.sectionTitle}>CATEGORY</Text>
      <View className="flex-row flex-wrap">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedId;
          return (
            <TouchableOpacity
              key={cat.id}
              className="items-center mb-4"
              style={styles.cell}
              onPress={() => onSelect(cat.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View
                className="items-center justify-center mb-2"
                style={[
                  styles.icon,
                  { backgroundColor: isSelected ? COLORS.forestGreen : cat.bg },
                ]}
              >
                <cat.icon
                  size={26}
                  color={isSelected ? COLORS.white : cat.color}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  {
                    color: isSelected
                      ? COLORS.forestGreen
                      : COLORS.textSecondary,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Add button */}
        <TouchableOpacity className="items-center mb-4" style={styles.cell}>
          <View
            className="items-center justify-center mb-2"
            style={styles.addIcon}
          >
            <Plus size={22} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.label}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CELL_SIZE = 56;

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  cell: {
    width: "20%",
    alignItems: "center",
  },
  icon: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  addIcon: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
    borderStyle: "dashed",
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
  },
});
