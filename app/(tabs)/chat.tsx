import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Constants from "expo-constants";
import Markdown from 'react-native-markdown-display';

const { GoogleGenerativeAI } = require("@google/generative-ai");
interface ChatMessage {
    text: string;
    sender: 'user' | 'gemini';
  }
const Chat = () => {
    const { topico } = useLocalSearchParams();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState("");
    const [firstMessageSent, setFirstMessageSent] = useState(false);
    const apiKey = Constants.expoConfig?.extra?.apiKey;

    const sendMessage = async () => {
        const genAI = new GoogleGenerativeAI(
            apiKey
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = userInput || `Por favor, forneça um conteúdo didático detalhado sobre ${topico} para o nível de ensino médio. O conteúdo deve incluir uma explicação clara e objetiva sobre o tema, abordando conceitos principais. Não quero nesse texto atividades, nem dicas de estudo, pois, terei um espaço especifico no app para isso.`;


        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();
           

            console.log(response)

            if (!firstMessageSent) {
                setChatMessages([{ text: response, sender: 'gemini' }]);
                setFirstMessageSent(true);
            } else {
                setChatMessages((prevMessages) => [...prevMessages, { text: userInput, sender: 'user' }, { text: response, sender: 'gemini' }]);
            }
            setUserInput("");
        } catch (error) {
            console.error("Erro ao obter resposta do Gemini:", error);
            if (error instanceof Error) {
                console.error("Mensagem de erro detalhada:", error.message);
                console.error("Pilha de erros:", error.stack);
            }
        }
    };

    useEffect(() => {
        sendMessage();
    }, [])

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