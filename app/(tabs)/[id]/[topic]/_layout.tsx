import { Tabs } from "expo-router";

export default function TopicTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
