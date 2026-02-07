import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import OpenAI from "openai";

interface Option {
  id: number;
  letter: string;
  text: string;
}

interface Question {
  id: number;
  statement: string;
  options: Option[];
  template: string;
}

const QuestionsPage = () => {
  const { topico } = useLocalSearchParams();
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  const client = new OpenAI({ apiKey });

  const [questions, setQuestions] = useState<Question[]>([]);

  const getQuestions = async () => {
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Você é um especialista em criar questões no estilo ENEM.

Gere apenas JSON válido.

As questões devem:
- Ter contexto interpretativo como nas provas do ENEM
- Exigir raciocínio, não memorização
- Ter alternativas plausíveis
- Apenas UMA alternativa correta

Formato obrigatório:
{
  "questions": [
    {
      "id": number,
      "statement": string,
      "options": [
        { "id": number, "letter": "A", "text": string }
      ],
      "template": "letra correta"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Gere 5 questões de múltipla escolha sobre o tema "${topico}", no padrão ENEM.`,
          },
        ],
      });

      const json = JSON.parse(
        completion.choices[0].message.content || "{}"
      );

      setQuestions(json.questions);
    } catch (error) {
      console.error("Erro ao obter questões:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Atividades</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {questions && questions.map((question) => (
                    <View style={styles.card} key={question.id}>
                        <Text style={styles.questionText}>
                            {question.id}. {question.statement}
                        </Text>
                        <View style={styles.optionsContainer}>
                            {question.options.map((option) => (
                                <Text style={styles.optionText} key={option.id}>
                                    {option.letter}) {option.text}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default QuestionsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
    },
    optionsContainer: {
        paddingLeft: 8,
    },
    optionText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
});