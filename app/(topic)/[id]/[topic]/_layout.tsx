import { router, Tabs, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function TopicTabsLayout() {
  const { id, topic } = useLocalSearchParams();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.push("/(tabs)/materials")}>
            <Text style={{ marginLeft: 12, fontSize: 16 }}>
              ←
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Conteúdo" }}
        initialParams={{ id, topic }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Dúvida" }}
        initialParams={{ id, topic }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: "Praticar" }}
        initialParams={{ id, topic }}
      />
    </Tabs>
  );
}

