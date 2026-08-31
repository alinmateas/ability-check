"use client";
import { Question } from "@/lib/quiz-types";

type Props = {
  question: Question;
  userAnswer: string;
  submitted: boolean;
  onChange: (value: string) => void;
};

export default function QuestionRenderer({
  question,
  userAnswer,
  submitted,
  onChange,
}: Props) {
  if (question.type === "multiple-choice") {
    return (
      <div className="mt-6">
        <p className="mb-3 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
          <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          Pick your best guess
        </p>
        <div className="space-y-3" role="radiogroup" aria-label="Answer choices">
        {question.choices.map((choice, index) => {
          const isSelected = userAnswer === choice;
          const isCorrectChoice = choice === question.answer;

          let stateClasses =
            "border-zinc-700 bg-zinc-800/60 hover:border-cyan-500 hover:bg-cyan-500/5";

          if (submitted) {
            if (isCorrectChoice) {
              stateClasses = "border-emerald-500 bg-emerald-500/10 text-emerald-300";
            } else if (isSelected) {
              stateClasses = "border-rose-500 bg-rose-500/10 text-rose-300";
            } else {
              stateClasses = "border-zinc-800 bg-zinc-900/40 text-zinc-600";
            }
          } else if (isSelected) {
            stateClasses = "border-cyan-400 bg-cyan-500/10 animate-glow";
          }

          return (
            <button
              key={choice}
              onClick={() => !submitted && onChange(choice)}
              disabled={submitted}
              role="radio"
              aria-checked={isSelected}
              className={`clip-corner group flex w-full items-center gap-3 border p-3 text-left font-sans font-medium tracking-wide transition duration-200 sm:p-4 ${stateClasses} ${
                !submitted
                  ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                  : "disabled:cursor-default"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition sm:size-8 ${
                  submitted
                    ? "border-current bg-current/15"
                    : isSelected
                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-300"
                    : "border-zinc-600 text-zinc-500 group-hover:border-cyan-300 group-hover:text-cyan-300"
                }`}
              >
                <span className={isSelected ? "size-2 rounded-full bg-current" : ""} />
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center border border-current/25 bg-black/10 font-display text-xs font-bold text-cyan-200/80 sm:size-8">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{choice}</span>
              {!submitted && (
                <span className="hidden text-[10px] font-bold uppercase tracking-wider text-cyan-300/0 transition group-hover:text-cyan-300/70 sm:block">
                  Send it
                </span>
              )}
            </button>
          );
        })}
        </div>
      </div>
    );
  }

  if (question.type === "numeric-input") {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={userAnswer}
            disabled={submitted}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Drop a number"
            className="clip-corner w-full border border-zinc-700 bg-zinc-800/60 p-4 font-sans font-medium tracking-wide text-white outline-none focus:border-cyan-400 disabled:opacity-60"
          />
          {question.unit && (
            <span className="font-sans text-zinc-400">{question.unit}</span>
          )}
        </div>
      </div>
    );
  }

  // text-input
  return (
    <div className="mt-6">
      <input
        type="text"
        value={userAnswer}
        disabled={submitted}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your wisdom here"
        className="clip-corner w-full border border-zinc-700 bg-zinc-800/60 p-4 font-sans font-medium tracking-wide text-white outline-none focus:border-cyan-400 disabled:opacity-60"
      />
    </div>
  );
}
