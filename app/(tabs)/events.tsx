import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants/colors";

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text>Events</Text>
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
