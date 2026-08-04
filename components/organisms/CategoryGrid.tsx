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

export default function CategoryGrid({ categories, selectedId, onSelect }: CategoryGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>CATEGORY</Text>
      <View style={styles.grid}>
        {categories.map((cat) => {
          const isSelected = cat.id === selectedId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.cell}
              onPress={() => onSelect(cat.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={[styles.icon, { backgroundColor: isSelected ? COLORS.accent : cat.bg }]}>
                <cat.icon size={26} color={isSelected ? COLORS.onAccent : cat.color} />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: isSelected ? COLORS.textPrimary : COLORS.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Add button */}
        <TouchableOpacity style={styles.cell}>
          <View style={styles.addIcon}>
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
  container: {
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
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
    borderColor: "COLORS.overlayMuted",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addIcon: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.micro,
    color: COLORS.textSecondary,
  },
});
