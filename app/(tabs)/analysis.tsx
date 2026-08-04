import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";

export default function AnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text>Analysis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
