import { router, Tabs } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function TopicTabsLayout() {
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
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Dúvida" }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: "Praticar" }}
      />
    </Tabs>
  );
}

