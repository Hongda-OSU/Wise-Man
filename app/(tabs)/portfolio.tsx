import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <Text>Portfolio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
});
