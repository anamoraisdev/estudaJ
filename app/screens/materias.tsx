import { View, Text, StyleSheet } from "react-native";

export default function MateriasPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matérias</Text>
      <Text style={styles.subtitle}>Aqui você pode estudar diversas matérias.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
});
