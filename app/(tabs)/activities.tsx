import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native"
import Constants from "expo-constants";

interface Option {
    id: number,
    letter: string,
    text: string
}
interface Guestion {
    id: number,
    statement: string,
    options: Option[]
    template: string
}

const GuestionsPage = () => {
    const { topico } = useLocalSearchParams();
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const apiKey = Constants.expoConfig?.extra?.apiKey;


   const getGuestions = async() => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Gere uma lista de atividades multiplescolha em formato JSON sobre o tema ${topico}, com base em provas antigas do ENEM. Cada questao deve ter id, statement, options e template(gabarito). As alternativas devem ter id, letter e text`;
    
    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text())
    } catch (error) {
        
        console.log(error)
    }
    }

    useEffect(() => {
        getGuestions()
    },[])
    return(
        <View>
            <Text>Atividades</Text>
        </View>
    )
}

export default GuestionsPage;