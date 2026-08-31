import { Difficulty, QuestionCategory } from "./quiz-types";

export type QuizMode = "mixed" | QuestionCategory;

export const CATEGORY_DETAILS: Record<
  QuizMode,
  { label: string; description: string; accent: string }
> = {
  mixed: {
    label: "Mixed Draft",
    description: "A rotating mix of abilities, passives, and items.",
    accent: "border-cyan-400 bg-cyan-500/10 text-cyan-200",
  },
  abilities: {
    label: "Champion Abilities",
    description: "Questions about Q, W, E, and R spells.",
    accent: "border-fuchsia-400 bg-fuchsia-500/10 text-fuchsia-200",
  },
  passives: {
    label: "Passives",
    description: "Master champions' always-on mechanics.",
    accent: "border-emerald-400 bg-emerald-500/10 text-emerald-200",
  },
  items: {
    label: "Items",
    description: "Know the shop, builds, and item effects.",
    accent: "border-amber-400 bg-amber-500/10 text-amber-200",
  },
};

export const DIFFICULTY_DETAILS: Record<
  Difficulty,
  { label: string; points: number; className: string }
> = {
  easy: {
    label: "Easy",
    points: 0.5,
    className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  },
  medium: {
    label: "Medium",
    points: 1,
    className: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  },
  hard: {
    label: "Hard",
    points: 2,
    className: "border-rose-500/50 bg-rose-500/10 text-rose-300",
  },
};

export function formatScore(score: number) {
  return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}
