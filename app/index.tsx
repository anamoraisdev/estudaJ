import ButtonBasic from "@/components/buttonBasic";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
      <Text style={styles.title}>ESTUDA ENEM</Text>
      <Text style={styles.subtitle}>Estude, pratique e tire duvidas</Text>
      </View>
      <ButtonBasic></ButtonBasic>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 30
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
  },
  title: {
    fontSize: 90,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#38434D",
  },

});
