import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Constants from "expo-constants";
import Markdown from 'react-native-markdown-display';
import OpenAI from "openai";

interface ChatMessage {
  text: string;
  sender: 'user' | 'gpt';
}

const Chat = () => {
  const {topic } = useLocalSearchParams();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");

  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  const client = new OpenAI({
    apiKey: apiKey,
  });

  useEffect(() => {
    if (!topic) return;
    const introMessage = `👋 Vi que você está estudando **${topic}**.
    Se surgir qualquer dúvida sobre esse conteúdo, pode me perguntar que eu te explico de um jeito simples 😊`;
    setChatMessages([{ text: introMessage, sender: "gpt" }]);
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;

    setChatMessages((prev) => [
      ...prev,
      { text: userMessage, sender: "user" },
    ]);

    setUserInput("");

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
            Você é um professor especialista em explicar conteúdos para alunos do ensino médio brasileiro.
              
            - Responda de forma simples e didática
            - Use exemplos do cotidiano
            - Explique apenas a dúvida perguntada
            - Escreva em português do Brasil
            `,
          },
          {
            role: "user",
            content: `O aluno está estudando o tema "${topic}". Dúvida: ${userMessage}`,
          },
        ],
      });

      const response = completion.choices[0].message.content || "";

      setChatMessages((prev) => [
        ...prev,
        { text: response, sender: "gpt" },
      ]);
    } catch (error) {
      console.error("Erro ao obter resposta do GPT:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topic}</Text>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {chatMessages.map((message, index) => (
          <View
            key={index}
            style={message.sender === 'user' ? styles.userMessage : styles.gptMessage}
          >
            <Markdown>{message.text}</Markdown>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Digite sua dúvida..."
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  userMessage: {
    backgroundColor: '#839deb',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginVertical: 5,
    borderTopRightRadius: 0,
  },
  gptMessage: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginVertical: 5,
    borderTopLeftRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  button:{
    flex: 1,
    alignItems: "flex-start"
  }
});

export default Chat;