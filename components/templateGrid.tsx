import { View, Text, StyleSheet } from "react-native";

type Question = {
  id: number;
  template: string;
};

type Props = {
  questions: Question[];
  selectedAnswers: { [key: number]: string };
  showTemplate: boolean;
};

export function GabaritoGrid({
  questions,
  selectedAnswers,
  showTemplate,
}: Props) {
  if (!showTemplate) return null;

  return (
    <View style={styles.container}>
      {questions.map((q, index) => {
        const selected = selectedAnswers[q.id];
        const isCorrect = selected === q.template;
        const isEmpty = !selected;

        let backgroundColor = "#e5e5e5";

        if (!isEmpty) {
          backgroundColor = isCorrect ? "#4CAF50" : "#F44336";
        }

        return (
          <View key={q.id} style={[styles.box, { backgroundColor }]}>
            <Text style={styles.text}>{index + 1}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  box: {
    width: 45,
    height: 45,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

