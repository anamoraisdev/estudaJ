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
  explanation: string;
}

const Tasks = () => {
  const { id, topic } = useLocalSearchParams();
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  const client = new OpenAI({ apiKey });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showTemplate, setShowTemplate] = useState(false);


  const getTasks = async () => {
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
      "template": "letra correta",
      "explanation": "explicação didática do porquê essa é a correta"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Gere 5 questões de múltipla escolha sobre o tema "${topic}", no padrão ENEM.`,
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

  const handleSelectOption = (questionId: number, letter: string) => {
    if (showTemplate) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: letter,
    }));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>
      <ScrollView >
        {questions && questions.map((question) => (
          <View style={styles.card} key={question.id}>
            <Text style={styles.questionText}>
              {question.id}. {question.statement}
            </Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option) => {
                const selected = selectedAnswers[question.id];
                const isSelected = selected === option.letter;
                const isCorrect = question.template === option.letter;

                let backgroundColor = "#fff";

                if (showTemplate) {
                  if (isCorrect) backgroundColor = "#c8f7c5";
                  else if (isSelected && !isCorrect) backgroundColor = "#f7c5c5";
                } else if (isSelected) {
                  backgroundColor = "#dbeafe";
                }

                return (
                  <Text
                    key={option.id}
                    onPress={() => handleSelectOption(question.id, option.letter)}
                    style={[styles.optionButton, { backgroundColor }]}
                  >
                    {option.letter} {option.text}
                  </Text>
                );
              })}
            </View>
            {showTemplate && (
              <View style={styles.explanationCard}>
                <Text style={styles.explanationTitle}>Explicação</Text>
                <Text style={styles.explanationText}>
                  {question.explanation}
                </Text>
              </View>
            )}
          </View>

        ))}



        <Text
          style={styles.templateButton}
          onPress={() => setShowTemplate(true)}
        >
          Ver gabarito
        </Text>
      </ScrollView>
    </View>
  )
}

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16
  },
 

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 16,
  },
  optionsContainer:{
    
  },
  card: {
    justifyContent: "flex-start",
    paddingBottom: 20
  },
  questionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111',
    marginBottom: 8,
  },

  optionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  optionButton: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  templateButton: {
    marginTop: 20,
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: 14,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  explanationCard: {
    backgroundColor: '#eef6ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bcdcff',
    
  },

  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    color: '#1e3a8a',
  },

  explanationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },


});