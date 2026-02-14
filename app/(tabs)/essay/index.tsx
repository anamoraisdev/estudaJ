import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import OpenAI from "openai";

export default function EssayIndex() {
  const router = useRouter();
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
  const client = new OpenAI({ apiKey });

  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getThemes = async () => {
    setLoading(true);

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Você é especialista em ENEM e redação."
          },
          {
            role: "user",
            content: `
Gere 6 possíveis temas de redação para o próximo ENEM.

Regras:
- Temas sociais, ambientais, tecnológicos ou educacionais atuais
- Escritos exatamente como o ENEM formula
- Sem explicações

Responda apenas em JSON assim:
{"themes": ["tema 1", "tema 2", "tema 3"]}
`
          }
        ],
      });

      const content = completion.choices[0].message.content ?? "{}";
      const json = JSON.parse(content);

      setThemes(json.themes || []);
    } catch (err) {
      console.error("Erro ao gerar temas:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o tema da redação</Text>

      {loading && (
        <Text style={styles.loadingText}>Gerando temas prováveis...</Text>
      )}

      <ScrollView>
        {themes.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/essay/motivators",
                params: { theme: title },
              })
            }
          >
            <Text style={styles.cardText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardText: {
    fontSize: 16,
    color: "#1f2937",
    lineHeight: 22,
  },
});

