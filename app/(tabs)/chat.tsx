import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Constants from "expo-constants";
import Markdown from 'react-native-markdown-display';
import OpenAI from "openai";

interface ChatMessage {
    text: string;
    sender: 'user' | 'gpt';
  }


const Chat = () => {
  const { topico } = useLocalSearchParams();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [firstMessageSent, setFirstMessageSent] = useState(false);

  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  const client = new OpenAI({
    apiKey: apiKey,
  });

  const sendMessage = async () => {
    const prompt =
      userInput ||
      `Explique detalhadamente o tema "${topico}" para um aluno do ensino médio, seguindo exatamente as instruções fornecidas.`;

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              `Você é um professor especialista em explicar conteúdos para alunos do ensino médio brasileiro.
                Sua função é produzir textos didáticos, claros, organizados e fáceis de entender.
                Sempre siga estas regras ao responder:

                - Explique como se estivesse ensinando um aluno que nunca viu o assunto antes
                - Use linguagem simples, objetiva e sem termos técnicos desnecessários
                - Organize a resposta com títulos e subtítulos
                - Comece com uma definição clara do tema
                - Depois explique os conceitos principais em ordem lógica
                - Use exemplos práticos do cotidiano quando possível
                - Evite qualquer tipo de atividade, exercício, dica de estudo ou pergunta ao aluno
                - Produza apenas conteúdo explicativo
                - O texto deve estar pronto para ser exibido diretamente em um aplicativo educacional
                - Escreva em português do Brasil
                        
                Estruture obrigatoriamente a resposta assim:
                Título do tema
                        
                O que é
                (definição clara)
                        
                Conceitos principais
                (explicação organizada)
                        
                Exemplos práticos
                (exemplos do dia a dia)
                        
                ## Resumo final
                (recapitulação simples)
                `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const response = completion.choices[0].message.content || "";

      if (!firstMessageSent) {
        setChatMessages([{ text: response, sender: "gpt" }]);
        setFirstMessageSent(true);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { text: userInput, sender: "user" },
          { text: response, sender: "gpt" },
        ]);
      }

      setUserInput("");
    } catch (error) {
      console.error("Erro ao obter resposta do GPT:", error);
    }
  };

  useEffect(() => {
    sendMessage();
  }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{topico} </Text>
            <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
                {chatMessages.map((message, index) => (
                    <View key={index} style={message.sender === 'user' ? styles.userMessage : styles.geminiMessage}>
                        <Markdown>{message.text}</Markdown>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={userInput}
                    onChangeText={setUserInput}
                    placeholder="Digite sua mensagem..."
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
    padding: 12,
    gap: 20,
    marginBottom: 20,
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    title:{
        fontSize:20,
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
    geminiMessage: {
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
});

export default Chat;