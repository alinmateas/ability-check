#!/usr/bin/env node
/**
 * Generates quiz questions about ability stun/root durations by scanning
 * Meraki Analytics' champion data (a community-maintained, human-readable
 * parse of Riot's raw game files — see cdn.merakianalytics.com).
 *
 * We only keep durations that are the SAME at every rank. Riot's own
 * tooltip generator only breaks a value out into a separate per-rank
 * "leveling" array when it actually scales by rank; flat values like most
 * stun/root durations stay embedded as plain text in the ability's
 * description, e.g. "...and stun the target for 1 second." That's what we
 * regex out below. If a description instead reads like
 * "...stunned for 1 / 1.25 / 1.5 seconds" (rank-scaling written inline),
 * we deliberately skip it — you asked for rankless durations only.
 *
 * Usage:
 *   node scripts/generate-stun-root-questions.mjs
 *
 * Requires Node 18+ (built-in fetch). Writes data/stunrootquestions.generated.ts.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

const DDRAGON_PATCH = "16.17.1";
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_PATCH}/data/en_US`;
const MERAKI_BASE = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions";
const OUTPUT_PATH = path.resolve("data/stunrootquestions.generated.ts");

const SLOT_LABELS = { P: "Passive", Q: "Q", W: "W", E: "E", R: "R" };

// Common League CC duration values, used to build plausible wrong answers.
const DURATION_CANDIDATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];

// "stunning them for 1 second" / "stun the target for 0.75 seconds" — captures
// the number, rejecting slash-separated rank lists like "1 / 1.5 seconds".
const CC_PATTERNS = [
  { key: "stun", regex: /stun(?:s|ning|ned)?\b[^.]*?\bfor\s+([\d.]+(?:\s*\/\s*[\d.]+)*)\s+seconds?/i },
  { key: "root", regex: /root(?:s|ing|ed)?\b[^.]*?\bfor\s+([\d.]+(?:\s*\/\s*[\d.]+)*)\s+seconds?/i },
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res.json();
}

function formatDuration(value) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}s`;
}

function buildDistractors(correct) {
  const pool = DURATION_CANDIDATES.filter((value) => value !== correct)
    .sort((a, b) => Math.abs(a - correct) - Math.abs(b - correct))
    .slice(0, 3);

  // Extremely rare fallback if `correct` isn't near enough candidates.
  let offset = 0.5;
  while (pool.length < 3) {
    const candidate = correct + offset;
    if (!pool.includes(candidate) && candidate !== correct) pool.push(candidate);
    offset += 0.5;
  }

  return pool;
}

/** Extracts rankless stun/root questions for a single ability's effects. */
function questionsForAbility(champion, championId, abilityName, slot, effects, usedIds) {
  const questions = [];

  for (const effect of effects) {
    const description = effect.description ?? "";

    for (const { key, regex } of CC_PATTERNS) {
      const match = description.match(regex);
      if (!match) continue;

      const rawValue = match[1];
      // Multiple slash-separated numbers means this scales by rank — skip it.
      if (rawValue.includes("/")) continue;

      const correct = parseFloat(rawValue);
      if (Number.isNaN(correct) || correct <= 0 || correct >= 4) continue;

      let id = `${championId.toLowerCase()}-${slot.toLowerCase()}-${key}-duration`;
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${championId.toLowerCase()}-${slot.toLowerCase()}-${key}-duration-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);

      const distractors = buildDistractors(correct);
      const choices = [correct, ...distractors]
        .sort((a, b) => a - b)
        .map(formatDuration);

      questions.push({
        id,
        type: "multiple-choice",
        champion,
        championId,
        category: "abilities",
        difficulty: "medium",
        ability: `${abilityName} (${SLOT_LABELS[slot]})`,
        text: `What is ${abilityName}'s ${key} duration?`,
        choices,
        answer: formatDuration(correct),
      });
    }
  }

  return questions;
}

async function main() {
  console.log(`Fetching champion list for patch ${DDRAGON_PATCH}...`);
  const championList = await fetchJson(`${DDRAGON_BASE}/champion.json`);
  const championIds = Object.values(championList.data)
    .map((c) => c.id)
    .sort();

  console.log(`Found ${championIds.length} champions.`);

  const CONCURRENCY = 10;
  const allQuestions = [];
  let completed = 0;

  async function processChampion(championId) {
    let data;
    try {
      data = await fetchJson(`${MERAKI_BASE}/${championId}.json`);
    } catch (err) {
      console.warn(`  Skipping ${championId}: ${err.message}`);
      return [];
    }

    const champion = data.name;
    const usedIds = new Set();
    const questions = [];

    for (const slot of Object.keys(SLOT_LABELS)) {
      const abilityEntries = data.abilities?.[slot];
      if (!abilityEntries || abilityEntries.length === 0) continue;

      const ability = abilityEntries[0];
      questions.push(
        ...questionsForAbility(champion, championId, ability.name, slot, ability.effects ?? [], usedIds)
      );
    }

    completed += 1;
    console.log(`(${completed}/${championIds.length}) ${championId} — ${questions.length} questions`);
    return questions;
  }

  const queue = [...championIds];
  async function worker() {
    while (queue.length > 0) {
      const championId = queue.shift();
      const questions = await processChampion(championId);
      allQuestions.push(...questions);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const fileContents = `// AUTO-GENERATED by scripts/generate-stun-root-questions.mjs — do not edit by hand.
// Source: Meraki Analytics champion data (cdn.merakianalytics.com), cross-referenced
// against Data Dragon patch ${DDRAGON_PATCH} for the champion roster.
// Only includes stun/root durations that are constant across every rank.
// Re-run the script to regenerate after a balance patch.
import { Question } from "@/lib/quiz-types";

export const stunRootQuestions: Question[] = ${JSON.stringify(allQuestions, null, 2)};
`;

  await writeFile(OUTPUT_PATH, fileContents, "utf8");
  console.log(`\nWrote ${allQuestions.length} questions to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
