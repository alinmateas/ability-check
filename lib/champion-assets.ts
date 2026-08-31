const DATA_DRAGON_NAME_OVERRIDES: Record<string, string> = {
  LeBlanc: "Leblanc",
  "Nunu & Willump": "Nunu",
  "Renata Glasc": "Renata",
  "Vel'Koz": "Velkoz",
  Wukong: "MonkeyKing",
};

export function getChampionDataDragonId(
  champion: string,
  championId?: string
) {
  if (championId) return championId;

  return (
    DATA_DRAGON_NAME_OVERRIDES[champion] ??
    champion.replace(/[^a-zA-Z0-9]/g, "")
  );
}
