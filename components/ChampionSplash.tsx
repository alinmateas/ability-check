"use client";

import Image from "next/image";
import { useState } from "react";
import { getChampionDataDragonId } from "@/lib/champion-assets";

type Props = {
  champion: string;
  championId?: string;
};

export default function ChampionSplash({ champion, championId }: Props) {
  const [hasImageError, setHasImageError] = useState(false);
  const dataDragonId = getChampionDataDragonId(champion, championId);
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${dataDragonId}_0.jpg`;

  if (hasImageError) {
    return (
      <div
        aria-hidden="true"
        className="h-36 bg-gradient-to-br from-cyan-500/20 via-zinc-900 to-fuchsia-500/20 sm:h-44"
      />
    );
  }

  return (
    <Image
      src={splashUrl}
      alt={`${champion} splash art`}
      fill
      sizes="(max-width: 640px) 100vw, 576px"
      onError={() => setHasImageError(true)}
      className="object-cover object-center opacity-75 transition duration-500"
    />
  );
}
