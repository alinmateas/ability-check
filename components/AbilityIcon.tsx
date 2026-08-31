"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getChampionDataDragonId } from "@/lib/champion-assets";

type AbilitySlot = "Q" | "W" | "E" | "R" | "Passive";

type Props = {
  champion: string;
  championId?: string;
  ability: string;
  abilitySlot?: AbilitySlot;
};

type ChampionData = {
  data: Record<
    string,
    {
      passive: { image: { full: string } };
      spells: Array<{ image: { full: string } }>;
    }
  >;
};

const iconCache = new Map<string, string | null>();
let versionPromise: Promise<string> | undefined;

function getAbilitySlot(ability: string, abilitySlot?: AbilitySlot) {
  if (abilitySlot) return abilitySlot;

  const slot = ability.match(/\((Q|W|E|R|Passive)\)/i)?.[1];
  if (!slot) return undefined;

  return slot.toLowerCase() === "passive"
    ? "Passive"
    : (slot.toUpperCase() as Exclude<AbilitySlot, "Passive">);
}

function getCurrentVersion() {
  versionPromise ??= fetch("https://ddragon.leagueoflegends.com/api/versions.json")
    .then((response) => {
      if (!response.ok) throw new Error("Unable to load Data Dragon versions");
      return response.json() as Promise<string[]>;
    })
    .then(([version]) => version);

  return versionPromise;
}

async function getAbilityIconUrl(
  champion: string,
  championId: string | undefined,
  slot: AbilitySlot
) {
  const dataDragonId = getChampionDataDragonId(champion, championId);
  const cacheKey = `${dataDragonId}:${slot}`;

  if (iconCache.has(cacheKey)) return iconCache.get(cacheKey) ?? null;

  const version = await getCurrentVersion();
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${dataDragonId}.json`
  );
  if (!response.ok) throw new Error("Unable to load champion ability data");

  const championData = (await response.json()) as ChampionData;
  const data = championData.data[dataDragonId];
  const filename =
    slot === "Passive"
      ? data?.passive.image.full
      : data?.spells["QWER".indexOf(slot)]?.image.full;
  const iconUrl = filename
    ? `https://ddragon.leagueoflegends.com/cdn/${version}/img/${
        slot === "Passive" ? "passive" : "spell"
      }/${filename}`
    : null;

  iconCache.set(cacheKey, iconUrl);
  return iconUrl;
}

export default function AbilityIcon({
  champion,
  championId,
  ability,
  abilitySlot,
}: Props) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [hasImageError, setHasImageError] = useState(false);
  const slot = getAbilitySlot(ability, abilitySlot);

  useEffect(() => {
    if (!slot) return;

    let isCurrent = true;
    getAbilityIconUrl(champion, championId, slot)
      .then((url) => {
        if (isCurrent) setIconUrl(url);
      })
      .catch(() => {
        if (isCurrent) setIconUrl(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [champion, championId, slot]);

  if (!iconUrl || hasImageError) return null;

  return (
    <div className="clip-corner relative size-12 shrink-0 overflow-hidden border border-cyan-400/70 bg-cyan-500/10 shadow-[0_0_16px_rgba(34,211,238,0.2)] sm:size-14">
      <Image
        src={iconUrl}
        alt={`${ability} ability icon`}
        fill
        sizes="56px"
        onError={() => setHasImageError(true)}
        className="object-cover"
      />
    </div>
  );
}
