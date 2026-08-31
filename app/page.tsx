"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { questionBank } from "@/data/questions";
import { QUESTION_CATEGORIES, Question } from "@/lib/quiz-types";
import { checkAnswer, formatAnswer } from "@/lib/check-answers";
import { QUESTIONS_PER_QUIZ, SECONDS_PER_QUESTION, SUBMIT_BUTTON_TEXTS } from "@/lib/quiz-config";
import {
  CATEGORY_DETAILS,
  DIFFICULTY_DETAILS,
  formatScore,
  QuizMode,
} from "@/lib/quiz-meta";
import QuestionRenderer from "@/components/QuestionRenderer";
import ChampionSplash from "@/components/ChampionSplash";
import AbilityIcon from "@/components/AbilityIcon";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleChoices(question: Question): Question {
  return question.type === "multiple-choice"
    ? { ...question, choices: shuffleArray(question.choices) }
    : question;
}

function buildShuffledQuiz(bank: Question[], mode: QuizMode): Question[] {
  if (mode !== "mixed") {
    return shuffleArray(bank.filter((question) => question.category === mode))
      .slice(0, QUESTIONS_PER_QUIZ)
      .map(shuffleChoices);
  }

  const queues = QUESTION_CATEGORIES.map((category) =>
    shuffleArray(bank.filter((question) => question.category === category))
  );
  const mixed: Question[] = [];

  while (mixed.length < QUESTIONS_PER_QUIZ && queues.some((queue) => queue.length)) {
    for (const queue of shuffleArray(queues)) {
      const question = queue.pop();
      if (question) mixed.push(question);
      if (mixed.length === QUESTIONS_PER_QUIZ) break;
    }
  }

  return mixed.map(shuffleChoices);
}

function getCategoryLabel(question: Question) {
  return CATEGORY_DETAILS[question.category].label;
}

const QUEUE_ARTWORK: Record<QuizMode, { champion: string; position: string }> = {
  mixed: { champion: "Leona", position: "center 28%" },
  abilities: { champion: "Zed", position: "center 25%" },
  passives: { champion: "Yasuo", position: "center 25%" },
  items: { champion: "Ornn", position: "center 30%" },
};

function buildInitialQuiz(bank: Question[]): Question[] {
  return shuffleArray(bank).map((q) =>
    q.type === "multiple-choice"
      ? { ...q, choices: shuffleArray(q.choices) }
      : q
  ).slice(0, QUESTIONS_PER_QUIZ);
}


export default function Home() {
  const [quiz, setQuiz] = useState<Question[]>(() => buildInitialQuiz(questionBank));
  const [quizMode, setQuizMode] = useState<QuizMode>("mixed");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitButtonText, setSubmitButtonText] = useState(
  () => SUBMIT_BUTTON_TEXTS[Math.floor(Math.random() * SUBMIT_BUTTON_TEXTS.length)]
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const question = quiz[currentIndex];
  const isLastQuestion = currentIndex === quiz.length - 1;
  const progress = ((currentIndex + (submitted ? 1 : 0)) / quiz.length) * 100;
  const isCorrect = submitted && checkAnswer(question, userAnswer);
  const totalAvailablePoints = quiz.reduce(
    (total, quizQuestion) =>
      total + DIFFICULTY_DETAILS[quizQuestion.difficulty].points,
    0
  );

  // Stop the timer while answer feedback is on screen.
  useEffect(() => {
    if (!started || finished || submitted || isExitDialogOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSubmitted(true); // auto-lock as time-out, counts as wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, finished, isExitDialogOpen, started, submitted]);

  function submitAnswer() {
    if (!userAnswer.trim() || submitted) return;
    setSubmitted(true);
    if (checkAnswer(question, userAnswer)) {
      setScore((s) => s + DIFFICULTY_DETAILS[question.difficulty].points);
    }
  }

  function nextQuestion() {
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserAnswer("");
    setSubmitted(false);
    setTimeLeft(SECONDS_PER_QUESTION);
    setSubmitButtonText(
      SUBMIT_BUTTON_TEXTS[Math.floor(Math.random() * SUBMIT_BUTTON_TEXTS.length)]
    );
  }

  function restart() {
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    setStarted(false);
    setTimeLeft(SECONDS_PER_QUESTION);
    setIsExitDialogOpen(false);
  }

  function startQuiz(mode: QuizMode) {
    setQuiz(buildShuffledQuiz(questionBank, mode));
    setQuizMode(mode);
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(SECONDS_PER_QUESTION);
    setStarted(true);
  }

  const timerPct = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const timerColor =
    timeLeft <= 5
      ? "from-rose-500 to-rose-600"
      : timeLeft <= 15
      ? "from-amber-400 to-orange-500"
      : "from-cyan-500 to-fuchsia-500";


  if (!started) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b0f] p-6 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(161,123,43,0.18),transparent_52%),linear-gradient(115deg,rgba(3,7,18,0.92),rgba(7,11,17,0.7))]" />
        <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(7rem,22vw,22rem)] font-extrabold uppercase tracking-tighter text-amber-100/[0.035] [writing-mode:vertical-rl]">
          Ability Check
        </div>
        <div className="relative w-full max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center border border-amber-300/70 bg-amber-300/10 font-display text-2xl font-extrabold tracking-tighter text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.18)] [clip-path:polygon(50%_0,100%_24%,100%_76%,50%_100%,0_76%,0_24%)]">
              AC
            </div>
            <h1 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-amber-100 drop-shadow-[0_0_14px_rgba(251,191,36,0.3)] sm:text-4xl">
              Ability Check
            </h1>
            <p className="mt-3 font-sans text-lg tracking-wide text-zinc-400">
              Pick a queue, flex that League brain, and try not to int.
            </p>
          </div>

          <div className="clip-corner border border-amber-400/30 bg-zinc-950/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur sm:p-6">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
              Pick your poison
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(Object.keys(CATEGORY_DETAILS) as QuizMode[]).map((mode) => {
                const details = CATEGORY_DETAILS[mode];
                const artwork = QUEUE_ARTWORK[mode];
                return (
                  <button
                    key={mode}
                    onClick={() => startQuiz(mode)}
                    className="clip-corner group relative min-h-40 overflow-hidden border border-amber-300/40 bg-zinc-900 text-left transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_0_30px_rgba(251,191,36,0.22)]"
                  >
                    <Image
                      src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${artwork.champion}_0.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
                      style={{ objectPosition: artwork.position }}
                    />
                    <span className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/80 to-[#07090d]/15" />
                    <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07090d] to-transparent" />
                    <span className="relative flex h-full flex-col justify-end p-5">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
                        {mode === "items" ? "The Armory" : mode === "passives" ? "Innate Power" : mode === "abilities" ? "Spellbook" : "Summoner's Trial"}
                      </span>
                      <span className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-amber-50">
                        {details.label}
                      </span>
                      <span className="mt-2 font-sans text-sm text-zinc-300">
                        {details.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="bg-grid min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center">
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wider text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
            GG, Knowledge Gap
          </h1>
          <p className="mt-6 font-display text-3xl font-bold text-white">
            {formatScore(score)} <span className="text-zinc-500">/</span>{" "}
            {formatScore(totalAvailablePoints)}{" "}
            <span className="text-zinc-500">brain points</span>
          </p>
          <button
            onClick={restart}
            className="clip-corner mt-10 w-full border border-cyan-500 bg-cyan-500/10 py-3 font-display font-bold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-500/20 hover:animate-glow"
          >
            Run It Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-grid min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <div className="min-w-0 text-left">
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Ability Check
            </h1>
            <p className="mt-2 font-sans text-zinc-500 tracking-wide">
              {CATEGORY_DETAILS[quizMode].label} · lock in, legend
            </p>
          </div>
        </div>

        <div className="clip-corner border border-cyan-900/60 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
          {/* Overall progress */}
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Per-question timer */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full bg-gradient-to-r ${timerColor} transition-all duration-1000 ease-linear`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <span
              className={`font-display w-10 text-right text-sm font-bold ${
                timeLeft <= 5 ? "text-rose-400" : "text-zinc-400"
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          {question.champion ? (
            <div className="clip-corner relative mb-6 h-36 overflow-hidden border border-cyan-900/60 bg-zinc-950 sm:h-44">
              <ChampionSplash
                key={question.id}
                champion={question.champion}
                championId={question.championId}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent" />
              <p className="absolute bottom-3 left-4 font-display text-lg font-bold uppercase tracking-wider text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:text-xl">
                {question.champion}
              </p>
            </div>
          ) : (
            <div className="clip-corner mb-6 border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-zinc-950 to-fuchsia-500/10 p-6">
              <p className="font-display text-xl font-bold uppercase tracking-wider text-amber-200">
                Shopkeeper&apos;s Pop Quiz
              </p>
              <p className="mt-2 font-sans text-zinc-400">
                The shopkeeper is judging your build path. No pressure.
              </p>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between gap-3 font-sans">
            <p className="text-sm font-bold uppercase tracking-wider text-fuchsia-400 sm:text-base">
              {getCategoryLabel(question)}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="clip-corner border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-right leading-none">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/70">
                  Round
                </span>
                <span className="font-display text-lg font-bold text-cyan-300 sm:text-xl">
                  {currentIndex + 1}
                  <span className="mx-1 text-sm text-zinc-500">/</span>
                  <span className="text-base text-zinc-300">{quiz.length}</span>
                </span>
              </div>
              <div className="clip-corner border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1.5 text-right leading-none">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-fuchsia-300/70">
                  Big Brain
                </span>
                <span className="font-display text-lg font-bold text-fuchsia-300 sm:text-xl">
                  {formatScore(score)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {question.champion && (
              <AbilityIcon
                key={`${question.id}-ability-icon`}
                champion={question.champion}
                championId={question.championId}
                ability={question.ability}
                abilitySlot={question.abilitySlot}
              />
            )}
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                {question.ability}
              </h2>
              <span
                className={`mt-2 inline-block border px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em] ${
                  DIFFICULTY_DETAILS[question.difficulty].className
                }`}
              >
                {DIFFICULTY_DETAILS[question.difficulty].label} · {DIFFICULTY_DETAILS[question.difficulty].points} pts
              </span>
            </div>
          </div>
          <p className="mt-4 font-sans text-lg text-zinc-200">
            {question.text}
          </p>

          <QuestionRenderer
            question={question}
            userAnswer={userAnswer}
            submitted={submitted}
            onChange={setUserAnswer}
          />

          {!submitted ? (
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim()}
              className="clip-corner mt-6 w-full border border-fuchsia-500 bg-fuchsia-500/10 py-3 font-display font-bold uppercase tracking-wide text-fuchsia-300 transition hover:bg-fuchsia-500/20"
            >
              {submitButtonText}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="clip-corner mt-6 w-full border border-cyan-500 bg-cyan-500/10 py-3 font-display font-bold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-500/20"
            >
              {isLastQuestion ? "Show Me the Damage" : "Next Fight"}
            </button>
          )}

          {submitted && (
            <div
              className={`mt-4 clip-corner p-4 font-sans font-medium ${
                isCorrect
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {timeLeft === 0 && !isCorrect && !userAnswer.trim()
                ? `Timer diff! The answer was ${formatAnswer(question)}.`
                : isCorrect
                ? "Clean play! ⚡"
                : `Oof. The answer was ${formatAnswer(question)}.`}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsExitDialogOpen(true)}
          className="mx-auto mt-6 block border-b border-zinc-700 px-2 pb-1 font-sans text-sm font-bold uppercase tracking-[0.16em] text-zinc-500 transition hover:border-rose-400 hover:text-rose-300"
        >
          Leave this match
        </button>
      </div>

      {isExitDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-match-title"
          onClick={() => setIsExitDialogOpen(false)}
        >
          <div
            className="clip-corner w-full max-w-md border border-amber-400/60 bg-[#0b1018] p-6 shadow-[0_0_55px_rgba(251,191,36,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Match in progress
            </p>
            <h2 id="leave-match-title" className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-amber-100">
              Your team needs you!
            </h2>
            <p className="mt-4 font-sans text-lg leading-relaxed text-zinc-300">
              Are you sure you want to leave? The minions believe in you, and
              the shopkeeper has already put your usual on the counter.
            </p>
            <p className="mt-3 font-sans text-sm text-zinc-500">
              Your glorious, extremely scientific score will be lost to the void.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsExitDialogOpen(false)}
                className="clip-corner border border-cyan-500 bg-cyan-500/10 py-3 font-display text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-500/20"
              >
                Stay &amp; Carry
              </button>
              <button
                onClick={restart}
                className="clip-corner border border-rose-500/70 bg-rose-500/10 py-3 font-display text-sm font-bold uppercase tracking-wide text-rose-300 transition hover:bg-rose-500/20"
              >
                Abandon Squad
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
