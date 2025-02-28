import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import contentsJson from "../../../constants/contents.json"

const ContentPage = () => {
  const { id } = useLocalSearchParams();
  const content = contentsJson.find((item) => item.id === Number(id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content?.name}</Text>
      <Text>{content?.description}</Text>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
export default ContentPage