export const QUESTION_CATEGORIES = ["abilities", "passives", "items"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

export type BaseQuestion = {
  id: string;
  champion?: string;
  /**
   * Optional Riot Data Dragon champion ID for names that do not match the
   * display name (for example, Wukong uses "MonkeyKing").
   */
  championId?: string;
  /** Optional override when the ability title does not include (Q), (W), etc. */
  abilitySlot?: "Q" | "W" | "E" | "R" | "Passive";
  category: QuestionCategory;
  difficulty: Difficulty;
  ability: string;
  text: string;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  choices: string[];
  answer: string;
};

export type NumericInputQuestion = BaseQuestion & {
  type: "numeric-input";
  answer: number;
  unit?: string;
  tolerance?: number; // allowed +/- margin, defaults to 0
};

export type TextInputQuestion = BaseQuestion & {
  type: "text-input";
  answer: string; // matched case-insensitively, trimmed
};

export type Question =
  | MultipleChoiceQuestion
  | NumericInputQuestion
  | TextInputQuestion;
