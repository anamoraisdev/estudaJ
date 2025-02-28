import {useRouter } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonBasic() {
    const router = useRouter()
    return (
        <TouchableOpacity style={styles.button} onPress={() => router.push("../contents")}>
            <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        borderWidth: 1,
        width: 200,
        height: 30,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});