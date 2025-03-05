import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
    const sendMessage = async () => {
        const genAI = new GoogleGenerativeAI(
            "APIKEY"
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = userInput || `Me responda em portugues. Sou estudante do ENEM 2025,me ensine detalhadamente e de forma didatica sobre " ${topico} " levando em consideracao as ultimas provas do ENEM. `;


        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();

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
                        <Text>{message.text}</Text>
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
        backgroundColor: '#DCF8C6',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginVertical: 5,
    },
    geminiMessage: {
        backgroundColor: '#E8E8E8',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginVertical: 5,
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