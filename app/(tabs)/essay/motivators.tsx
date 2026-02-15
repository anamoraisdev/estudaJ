import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import OpenAI from "openai";

export type TitleMotivator = {
  title: string;
  content: string;
};

export type Data = {
  description: string;
  value: string;
  source: string;
  year: string;
};

export type MotivatorsResponse = {
  texts: TitleMotivator[];
  data: Data[];
};

export default function Motivators() {
const { theme } = useLocalSearchParams<{ theme: string }>();
  const topic = Array.isArray(theme) ? theme[0] : theme;
  const [loading, setLoading] = useState(false);

  const [motivators, setMotivators] = useState<MotivatorsResponse>({
    texts: [],
    data: []
  });

  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
  const client = new OpenAI({ apiKey });

  const generateMotivators = async () => {
    try {
      setLoading(true);

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Você é especialista em ENEM e redação. Sempre responda JSON válido."
          },
          {
            role: "user",
            content: `
            Gere 2 textos dissertativos e 1 tabela de dados com no minimo 3 dados estatísticos no estilo ENEM sobre:
            "${topic}"

            Retorne **apenas JSON** no formato:

            {
              "textos": [
                { "title": "Título do texto 1", "content": "..." },
                { "title": "Título do texto 2", "content": "..." }
              ],
              "data": [
                { "description": "...", "value": "...", "source": "...", "year": "..." },
                { "description": "...", "value": "...", "source": "...", "year": "..." }
              ]
            }
          `
          }
        ],
        temperature: 0.7
      });


      const rawContent = completion.choices[0].message.content ?? "{}";


      let json;
      try {
        json = JSON.parse(rawContent);
      } catch {
        console.warn("GPT returned invalid JSON, using empty default");
        json = { textos: [], data: [] };
      }

      setMotivators({
        texts: json.textos ?? [],
        data: json.data ?? []
      });

    } catch (err) {
      console.error("Erro ao gerar temas:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    generateMotivators();
  }, [topic]);

  return (

    <View style={styles.container}>
      <Stack.Screen options={{ title: "Motivating Texts" }} />

      <Text style={styles.pageTitle}>Textos motivacionais </Text>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 40 }} />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {motivators && motivators?.texts.map((textItem, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.cardTitle}>{textItem.title}</Text>
            {textItem.content
              .split("\n")
              .filter((p) => p.trim() !== "")
              .map((paragraph, i) => (
                <Text key={i} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
          </View>
        ))}

        {motivators && motivators?.data.map((dataItem, idx) => (
          <View key={idx} style={styles.dataCard}>
            <Text style={styles.dataValue}>{dataItem.value}</Text>
            <Text style={styles.dataDescription}>{dataItem.description}</Text>
            <Text style={styles.dataSource}>
              {dataItem.source} • {dataItem.year}
            </Text>
          </View>
        ))}

         <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/essay/write?topic=${encodeURIComponent(topic)}`)}
        >
          <Text style={styles.buttonText}>Escrever redação</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#1C1C1E",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    marginBottom: 12,
  },
  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  graphImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  dataValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  dataDescription: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  dataSource: {
    fontSize: 13,
    color: "#888",
  },
  button: { 
    backgroundColor: "#1E40AF",
    padding: 16,
    borderRadius: 12, 
    alignItems: "center",
    marginBottom: 20 
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});