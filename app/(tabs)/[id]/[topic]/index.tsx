
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import OpenAI from "openai";
import Constants from "expo-constants";
import Markdown from "react-native-markdown-display";



const TopicPage = () => {
    const { id, topic } = useLocalSearchParams();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
    const client = new OpenAI({ apiKey });

    const getExplanation = async () => {
        setLoading(true);

        try {
            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `Você é um professor especialista em explicar conteúdos para alunos do ensino médio brasileiro.
                        Siga estas regras:
                        - Linguagem simples e didática
                        - Organize com títulos e subtítulos
                        - Comece explicando o que é o tema
                        - Depois explique os conceitos principais
                        - Use exemplos do cotidiano
                        - Não inclua atividades nem perguntas
                        - Escreva em português do Brasil`,
                    },
                    {
                        role: "user",
                        content: `Explique detalhadamente o tema "${topic}".`,
                    },
                ],
            });

            setContent(completion.choices[0].message.content || "");
        } catch (error) {
            console.error("Erro ao gerar explicação:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExplanation();
    }, []);

    return (
        <ScrollView style={styles.container}>

            {loading ? (
                <Text>Carregando conteúdo...</Text>
            ) : (
                <Markdown style={markdownStyles}>
                    {content}
                </Markdown>
            )}
        </ScrollView>
    );
};

export default TopicPage;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 100
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        color: "#333",
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        fontSize: 26,
        fontWeight: "bold",
        marginVertical: 10,
    },
    heading2: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 8,
    },
    heading3: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 6,
    },
    bullet_list: {
        marginVertical: 6,
    },
    list_item: {
        marginVertical: 4,
    },
});

