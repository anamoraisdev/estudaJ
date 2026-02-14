import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function MotivatorsIndex() {
    return(
        <View>
            <Stack.Screen options={{ title: "Textos motivadores" }} />
        <Text>
            text motivator
        </Text>
        </View>
    )
}
