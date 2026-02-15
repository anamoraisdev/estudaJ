import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";

export default function EssayWrite() {
    const { topic } = useLocalSearchParams<{ topic: string }>();
    const [draft, setDraft] = useState("");
    const [essayTitle, setEssayTitle] = useState("");
    const MAX_OFFICIAL_LINES = 30;
    const VISUAL_LINE_HEIGHT = 28;
    const TOTAL_VISUAL_LINES = MAX_OFFICIAL_LINES * 2;
    const MAX_CHARACTERS = MAX_OFFICIAL_LINES * 75;
    const PADDING_TOP = 20;

    const handleChangeText = (text: string) => {
        if (text.length <= MAX_CHARACTERS) {
            setDraft(text);
        }
    };

    const officialLineCount =
        draft.length === 0
            ? 0
            : Math.min(
                MAX_OFFICIAL_LINES,
                Math.floor(draft.length / 75) + 1
            );

    const handleCorrectEssay = () => {
        alert("Redação enviada para correção!");
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Redação" }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}
>
                {/* Tema */}
                <Text style={styles.topicTitle}>
                    {topic ?? "Tema selecionado"}
                </Text>
                <Text
                    style={[
                        styles.counterTop,
                        officialLineCount > 25 && { color: "#DC2626" },
                    ]}
                >
                    {officialLineCount} / 30 linhas
                </Text>
                {/* Campo para título do aluno */}
                <TextInput
                    style={styles.essayTitleInput}
                    placeholder="Título (opcional)"
                    value={essayTitle}
                    onChangeText={setEssayTitle}
                    maxLength={80}
                />

                {/* Contador */}

                {/* Folha */}
                <View style={styles.paperWrapper}>

                    {/* Numeração lateral */}
                    <View style={styles.lineNumbers}>
                        {Array.from({ length: MAX_OFFICIAL_LINES }).map((_, i) => {
                            const isDangerZone = i + 1 > 25;

                            return (
                                <View
                                    key={i}
                                    style={{
                                        height: VISUAL_LINE_HEIGHT * 2,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.lineNumberText,
                                            isDangerZone && { color: "#DC2626" },
                                        ]}
                                    >
                                        {i + 1}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Área da folha */}
                    <View style={styles.paper}>

                        {/* Linhas horizontais absolutas */}
                        {Array.from({ length: TOTAL_VISUAL_LINES }).map((_, index) => {
                            const officialIndex = Math.floor(index / 2) + 1;
                            const isDangerZone = officialIndex > 25;

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.horizontalLine,
                                        {
                                            top: PADDING_TOP + index * VISUAL_LINE_HEIGHT,
                                            borderBottomColor: isDangerZone
                                                ? "#FECACA"
                                                : "#E5E7EB",
                                        },
                                    ]}
                                />
                            );
                        })}

                        <TextInput
                            style={[
                                styles.textInput,
                                {
                                    height:
                                        TOTAL_VISUAL_LINES * VISUAL_LINE_HEIGHT,
                                },
                            ]}
                            multiline
                            value={draft}
                            onChangeText={handleChangeText}
                            textAlignVertical="top"
                            placeholder="Escreva sua redação..."
                            maxLength={MAX_CHARACTERS}
                        />
                    </View>
                </View>

                {/* Botão */}
                <TouchableOpacity style={styles.button} onPress={handleCorrectEssay}>
                    <Text style={styles.buttonText}>Corrigir Redação</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FA",
        paddingHorizontal: 8,
    },

    topicTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 16,
        marginBottom: 6,
        color: "#1C1C1E",
    },
    essayTitleInput: {
        backgroundColor: "#fff",
        borderRadius: 8,
        borderColor: "#E5E7EB",
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        marginBottom: 16,
    },

    counterTop: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: "right",
        color: "#6B7280",
    },

    paperWrapper: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        overflow: "hidden",
        paddingBottom: 20,
    },

    lineNumbers: {
        width: 30,
        backgroundColor: "#FAFAFA",
    },

    lineNumberText: {
        fontSize: 11,
        color: "#9CA3AF",
        textAlign: "center",
    },

    paper: {
        flex: 1,
        position: "relative",
        paddingTop: 16,
        paddingHorizontal: 10,
    },

    horizontalLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 28,
        borderBottomWidth: 1,
    },

    textInput: {
        position: "absolute",
        left: 10,
        right: 10,
        top: 16,
        fontSize: 15,
        lineHeight: 28,
        color: "#111",
    },

    button: {
        marginTop: 20,
        backgroundColor: "#1E40AF",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});


