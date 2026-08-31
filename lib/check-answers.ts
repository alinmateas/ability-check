import { Question } from "./quiz-types";

export function checkAnswer(question: Question, userAnswer: string): boolean {
  if (userAnswer.trim() === "") return false;

  switch (question.type) {
    case "multiple-choice":
      return userAnswer === question.answer;

    case "numeric-input": {
      const parsed = parseFloat(userAnswer);
      if (Number.isNaN(parsed)) return false;
      const tolerance = question.tolerance ?? 0;
      return Math.abs(parsed - question.answer) <= tolerance;
    }

    case "text-input":
      return (
        userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()
      );
  }
}

export function formatAnswer(question: Question): string {
  switch (question.type) {
    case "multiple-choice":
      return question.answer;
    case "numeric-input":
      return `${question.answer}${question.unit ? " " + question.unit : ""}`;
    case "text-input":
      return question.answer;
  }
}