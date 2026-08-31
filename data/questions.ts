import { Difficulty, Question } from "@/lib/quiz-types";
import { generatedAbilityQuestions } from "./questions.generated";
import { stunRootQuestions } from "./stunrootquestions.generated";

type AbilityQuestion =
  | (Omit<Extract<Question, { type: "multiple-choice" }>, "category" | "difficulty"> & { difficulty?: Difficulty })
  | (Omit<Extract<Question, { type: "numeric-input" }>, "category" | "difficulty"> & { difficulty?: Difficulty })
  | (Omit<Extract<Question, { type: "text-input" }>, "category" | "difficulty"> & { difficulty?: Difficulty });

const abilityQuestions: AbilityQuestion[] = [

  {
    id: "aatrox-r-move-speed",
    type: "multiple-choice",
    champion: "Aatrox",
    ability: "World Ender (R)",
    text: "What is World Ender's bonus movemenet speed at rank 3?",
    choices: ["50%", "100%", "20%", "80%"],
    answer: "100%",
  },
    {
    id: "amumu-r-stun-duration",
    type: "multiple-choice",
    champion: "Amumu",
    ability: "Curse of the Sad Mummy (R)",
    text: "What is Curse of the Sad Mummy's stun duration?",
    choices: ["1.25s", "1.5s", "2s", "1s"],
    answer: "1.5s",
  },
    {
    id: "bard-q-stun-duration",
    type: "multiple-choice",
    champion: "Bard",
    ability: "Cosmic Binding (R)",
    text: "What is Cosmic Binding's stun duration at rank 5?",
    choices: ["1.8s", "1.6s", "2s", "1.5s"],
    answer: "1.8s",
  },
    {
    id: "brand-q-stun-duration",
    type: "multiple-choice",
    champion: "Brand",
    ability: "Sear (Q)",
    text: "What is Sear's stun duration?",
    choices: ["1.75s", "1.5s", "2s", "1.25s"],
    answer: "1.75s",
  },
  
    {
    id: "braum-p-stun-duration",
    type: "multiple-choice",
    champion: "Braum",
    ability: "Concussive Blows (Passive)",
    text: "What is Concussive Blows's stun duration until level 7?",
    choices: ["1.75s", "1.5s", "1s", "1.25s"],
    answer: "1.25s",
  },
  
    {
    id: "mel-w-stun-duration",
    type: "multiple-choice",
    champion: "Mel",
    ability: "Solar Snare (W)",
    text: "What is Solar Snare's stun duration?",
    choices: ["1.75s", "1.5s", "2s", "1.25s"],
    answer: "1.5s",
  },
    {
    id: "jhin-w-root-duration",
    type: "multiple-choice",
    champion: "Brand",
    ability: "Deadly Flourish (W)",
    text: "What is Deadly Flourish's root duration at max rank?",
    choices: ["2.75s", "1.5s", "2s", "2.25s"],
    answer: "2.25s",
  },
  
    {
    id: "morgana-q-root-duration",
    type: "multiple-choice",
    champion: "Brand",
    ability: "Dark Binding (R)",
    text: "What isDark Binding's root duration at max rank?",
    choices: ["2.75s", "3.5s", "3s", "2.25s"],
    answer: "3s",
  },
  
    {
    id: "elise-e-stun-duration",
    type: "multiple-choice",
    champion: "Elise",
    ability: "Cocoon (E)",
    text: "What is Cocoon's stun duration at rank 1?",
    choices: ["1.75s", "1.5s", "2s", "1.6s"],
    answer: "1.6s",
  },
  
  
  {
    id: "alistar-e-stun-duration",
    type: "multiple-choice",
    champion: "Alistar",
    ability: "Trample (E)",
    text: "What is Trample's stun duration?",
    choices: ["0.75s", "2s", "1.5s", "1s"],
    answer: "1s"
  },
  {
   id: "ahri-e-charm-duration",
    type: "multiple-choice",
    champion: "Ahri",
    ability: "Charm (E)",
    text: "What is Ahri E's charm duration at rank 1?",
    choices: ["1.2s", "2s", "1.5s", "1s"],
    answer: "1.2s"
  },
  {
   id: "evelynn-e-charm-duration",
    type: "multiple-choice",
    champion: "Evelynn",
    ability: "Allure (E)",
    text: "What is Allure's charm duration at rank 1?",
    choices: ["1.25s", "2s", "1.5s", "1s"],
    answer: "1.25s"
  },
  {
   id: "annie-p-stun-duration",
    type: "multiple-choice",
    champion: "Annie",
    ability: "Pyromania (Passive)",
    text: "What is Annie Pyromania's stun duration?",
    choices: ["1.2s", "2s", "1.5s", "1s"],
    answer: "1s"
  },
  {
   id: "anivia-q-stun-duration",
    type: "multiple-choice",
    champion: "Anivia",
    ability: "Flash Frost (Q)",
    text: "What is Flash Frost's stun duration at rank 1?",
    choices: ["1.2s", "1s", "1.1s", "0.75s"],
    answer: "1.1s"
  },
  {
   id: "ashe-r-charm-duration",
    type: "multiple-choice",
    champion: "Ashe",
    ability: "Enchanted Crystal Arrow (R)",
    text: "What is Enchanted Crystal Arrow's max stun duration?",
    choices: ["2.5s", "4s", "3.5s", "3s"],
    answer: "3.5s"
  },
{
    id: "anivia-p-cooldown",
    type: "multiple-choice",
    champion: "Anivia",
    ability: "Rebirth (Passive)",
    text: "What is Rebirth's cooldown?",
    choices: ["300s", "240s", "200s", "180s"],
    answer: "240s",
  },

{
    id: "zac-p-cooldown",
    type: "multiple-choice",
    champion: "Zac",
    ability: "Cell Division (Passive)",
    text: "What is Cell Division's cooldown?",
    choices: ["300s", "240s", "200s", "180s"],
    answer: "300s",
  },

{
    id: "malzahar-p-cooldown",
    type: "multiple-choice",
    champion: "Malzahar",
    ability: "Void Shift (Passive)",
    text: "What is Void Shift's cooldown? at level 1?",
    choices: ["30s", "15s", "25s", "20s"],
    answer: "30s",
  },

{
    id: "galio-p-cooldown",
    type: "multiple-choice",
    champion: "Galio",
    ability: "Runic Shield (Passive)",
    text: "What is Runic Shield's cooldown?",
    choices: ["12s", "15s", "10s", "8s"],
    answer: "12s",
  },

{
    id: "poppy-p-cooldown",
    type: "multiple-choice",
    champion: "Poppy",
    ability: "Iron Ambassador (Passive)",
    text: "What is Iron Ambassador's cooldown at level 1?",
    choices: ["18s", "16s", "12s", "24s"],
    answer: "18s",
  }
];

const abilityDifficulties: Difficulty[] = [
  "easy", "medium", "easy", "medium", "medium", "hard", "medium",
  "medium", "easy", "easy", "medium", "medium", "hard", "hard",
  "medium", "hard", "medium", "hard", "medium", "easy", "medium",
];

const passiveQuestions: Question[] = [
  { id: "annie-passive", type: "multiple-choice", champion: "Annie", ability: "Pyromania (Passive)", category: "passives", difficulty: "easy", text: "What crowd control effect does Annie's fully stacked passive empower her next damaging ability with?", choices: ["Stun", "Silence", "Root", "Knockback"], answer: "Stun" },
  { id: "blitz-passive", type: "multiple-choice", champion: "Blitzcrank", ability: "Mana Barrier (Passive)", category: "passives", difficulty: "easy", text: "What resource does Blitzcrank's Mana Barrier use to create its shield?", choices: ["Mana", "Health", "Energy", "Gold"], answer: "Mana" },
  { id: "darius-passive", type: "multiple-choice", champion: "Darius", ability: "Hemorrhage (Passive)", category: "passives", difficulty: "medium", text: "What does Darius apply to enemies with his damaging attacks and abilities?", choices: ["Bleed stacks", "Poison stacks", "A slow", "A shield break"], answer: "Bleed stacks" },
  { id: "jhin-passive", type: "multiple-choice", champion: "Jhin", ability: "Whisper (Passive)", category: "passives", difficulty: "medium", text: "How many shots are in Jhin's basic-attack magazine?", choices: ["4", "5", "6", "8"], answer: "4" },
  { id: "katarina-passive", type: "multiple-choice", champion: "Katarina", ability: "Voracity (Passive)", category: "passives", difficulty: "medium", text: "What does Katarina pick up to reduce her basic ability cooldowns?", choices: ["Daggers", "Shadows", "Feathers", "Stars"], answer: "Daggers" },
  { id: "leona-passive", type: "multiple-choice", champion: "Leona", ability: "Sunlight (Passive)", category: "passives", difficulty: "easy", text: "Who consumes the extra damage mark applied by Leona's passive?", choices: ["An allied champion", "Leona herself", "A minion", "A turret"], answer: "An allied champion" },
  { id: "mordekaiser-passive", type: "multiple-choice", champion: "Mordekaiser", ability: "Darkness Rise (Passive)", category: "passives", difficulty: "hard", text: "What must Mordekaiser do to activate the damaging aura from Darkness Rise?", choices: ["Hit champions three times with attacks or abilities", "Take damage below half health", "Kill a minion", "Use his ultimate"], answer: "Hit champions three times with attacks or abilities" },
  { id: "sion-passive", type: "multiple-choice", champion: "Sion", ability: "Glory in Death (Passive)", category: "passives", difficulty: "hard", text: "What happens to Sion immediately after he is killed?", choices: ["He reanimates briefly and can still move and attack", "He becomes invisible", "He teleports to base", "He grants allies a shield"], answer: "He reanimates briefly and can still move and attack" },
  { id: "vayne-passive", type: "multiple-choice", champion: "Vayne", ability: "Night Hunter (Passive)", category: "passives", difficulty: "medium", text: "What does Vayne gain while moving toward a nearby enemy champion?", choices: ["Bonus movement speed", "Bonus armor", "A shield", "Attack range"], answer: "Bonus movement speed" },
];

const itemQuestions: Question[] = [
  { id: "item-dorans-ring", type: "multiple-choice", ability: "Doran's Ring", category: "items", difficulty: "easy", text: "Which class of champions most commonly starts with Doran's Ring?", choices: ["Ability power casters", "Marksmen", "Tanks only", "Junglers only"], answer: "Ability power casters" },
  { id: "item-dorans-blade", type: "multiple-choice", ability: "Doran's Blade", category: "items", difficulty: "easy", text: "Which stat does Doran's Blade traditionally support most directly?", choices: ["Attack damage", "Ability power", "Armor", "Ability haste"], answer: "Attack damage" },
  { id: "item-tear", type: "multiple-choice", ability: "Tear of the Goddess", category: "items", difficulty: "easy", text: "Which resource does Tear of the Goddess help a champion build over time?", choices: ["Mana", "Rage", "Energy", "Health"], answer: "Mana" },
  { id: "item-control-ward", type: "multiple-choice", ability: "Control Ward", category: "items", difficulty: "medium", text: "What is a key purpose of placing a Control Ward?", choices: ["Revealing and disabling nearby enemy wards", "Restoring mana", "Increasing movement speed", "Reducing ability cooldowns"], answer: "Revealing and disabling nearby enemy wards" },
  { id: "item-stopwatch", type: "multiple-choice", ability: "Stopwatch", category: "items", difficulty: "medium", text: "What does Stopwatch's active effect do?", choices: ["Makes the user invulnerable but unable to act briefly", "Teleports the user home", "Heals the user over time", "Reveals all enemies"], answer: "Makes the user invulnerable but unable to act briefly" },
  { id: "item-void-staff", type: "multiple-choice", ability: "Void Staff", category: "items", difficulty: "medium", text: "Which defensive stat does Void Staff primarily counter?", choices: ["Magic resistance", "Armor", "Critical strike chance", "Attack speed"], answer: "Magic resistance" },
  { id: "item-last-whisper", type: "multiple-choice", ability: "Last Whisper", category: "items", difficulty: "medium", text: "Which defensive stat does Last Whisper primarily counter?", choices: ["Armor", "Magic resistance", "Health regeneration", "Tenacity"], answer: "Armor" },
  { id: "item-zhonyas", type: "multiple-choice", ability: "Zhonya's Hourglass", category: "items", difficulty: "hard", text: "Which component item provides the active effect later used by Zhonya's Hourglass?", choices: ["Stopwatch", "Control Ward", "Tear of the Goddess", "Cull"], answer: "Stopwatch" },
  { id: "item-guardian-angel", type: "multiple-choice", ability: "Guardian Angel", category: "items", difficulty: "hard", text: "What happens after Guardian Angel's revive passive triggers?", choices: ["The champion returns to life after a delay", "The champion is teleported to base", "All nearby enemies are stunned", "The champion gains permanent attack damage"], answer: "The champion returns to life after a delay" },
  { id: "item-elixir", type: "multiple-choice", ability: "Elixir of Wrath", category: "items", difficulty: "hard", text: "When can an Elixir such as Elixir of Wrath generally be purchased?", choices: ["After reaching level 9", "Only at level 18", "At any level", "Only after destroying an inhibitor"], answer: "After reaching level 9" },
];

export const questionBank: Question[] = [
  ...abilityQuestions.map((question, index) => ({
    ...question,
    category: question.ability.includes("(Passive)") ? "passives" : "abilities",
    difficulty: question.difficulty ?? abilityDifficulties[index],
  }) as Question),
  // ...passiveQuestions,
  // ...itemQuestions,
];
