import { router, Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function EssayFlowLayout() {
  return (
    <Stack
       screenOptions={{
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={{ marginLeft: 12, fontSize: 16 }}>
                    ←
                  </Text>
                </TouchableOpacity>
              ),
            }}
    />
  );
}
