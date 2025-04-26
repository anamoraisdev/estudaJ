import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import contentsJson from "../../../constants/contents.json"
import { useEffect, useState } from "react";
import Constants from 'expo-constants';

interface Topico {
  id: number,
  name: string,
}
const ContentPage = () => {
  const { id } = useLocalSearchParams();
  const content = contentsJson.find((item) => item.id === Number(id));
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const [topics, setTopics] = useState<Topico[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<"conteudo" | "atividades">("conteudo")
  const apiKey = Constants.expoConfig?.extra?.apiKey;

  const getResponse = async () => {
    setLoading(true)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Gere uma lista de topicos para o enem 2025 sobre a materia ${content?.name} em formato JSON com id e name. Não me envie nenhum outro dado além do JSON.`;

    try {
      const result = await model.generateContent(prompt);
      let topicsJsonString = result.response.text();

      topicsJsonString = topicsJsonString.replace(/`(json)?\n/g, "").replace(/`/g, "");


      const inicioJson = topicsJsonString.indexOf("[");
      if (inicioJson !== -1) {

        const jsonString = topicsJsonString.substring(inicioJson);
        console.log("json *", jsonString)

        const topicsArray = JSON.parse(jsonString);
        setTopics(topicsArray);
      } else {
        console.error("JSON não encontrado na resposta.");
      }
    } catch (error) {
      console.error("Erro ao obter ou analisar os tópicos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResponse()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content?.name}</Text>
      <Text>{content?.description}</Text>
      <View style={styles.containerButtons}>
        <TouchableOpacity
          style={[styles.button, selected === "conteudo" && styles.selected]}
          onPress={() => setSelected("conteudo")}
        >
          <Text style={[styles.text, selected === "conteudo" && styles.textSelected]}>Conteúdo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selected === "atividades" && styles.selected]}
          onPress={() => setSelected("atividades")}
        >
          <Text style={[styles.text, selected === "atividades" && styles.textSelected]}>Atividades</Text>
        </TouchableOpacity>
      </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!loading ? topics?.map((item) =>
            <Link href={{ pathname:`${selected == "conteudo" ? "/chat" : "/activities"}`, params: { topico: item.name } }} style={styles.containerTopic} key={item.id}>
              <Text>{item.name}</Text>
            </Link>
          ) : <Text> carregando...</Text>}
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
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  containerTopic: {
    padding: 15,
    borderWidth: 0.2,
    borderRadius: 30,
    margin: 6,
    maxWidth: 350
  },
  containerButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#ddd",
  },
  selected: {
    backgroundColor: "#007bff",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  textSelected: {
    color: "#fff",
  },
});
export default ContentPage