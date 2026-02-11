import { Tabs } from "expo-router";

export default function AppTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="materials/index" options={{ title: "Conteúdos" }} />
      <Tabs.Screen name="essay/index" options={{ title: "Redação" }} />
      <Tabs.Screen name="exams/index" options={{ title: "Simulados" }} />
      <Tabs.Screen name="materials/[id]" options={{ href: null }} />
    </Tabs>
  );
}
