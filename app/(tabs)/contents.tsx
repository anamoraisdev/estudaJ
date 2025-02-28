import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import contentsJson from "../../constants/contents.json"
import { Link} from "expo-router";

export default function ContentsPage() {
  const contents = contentsJson
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matérias</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {contents.map((content) =>
          <Link key={content.id} href={{ pathname: '/[id]', params: { id: content.id } }}  asChild>
            <TouchableOpacity style={styles.containerContent}>
              <Text style={styles.titleContent}>{content.name}</Text>
              <Text>{content.description}</Text>
            </TouchableOpacity>
          </Link>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    gap: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
  titleContent: {
    fontSize: 20,
    fontWeight: "bold",
  },
  containerContent: {
    padding: 15,
    borderWidth: 0.2,
    borderRadius: 30,
    margin: 6,
    maxWidth: 350
  }
});
