import type { Champion } from "@/types";

export const NON_STANDARD_CHAMPION_PREFIXES = ["Jade_"] as const;

export function normalizeChampionRiotId(riotId: string) {
  const prefix = NON_STANDARD_CHAMPION_PREFIXES.find((candidate) =>
    riotId.startsWith(candidate),
  );
  return prefix ? riotId.slice(prefix.length) : riotId;
}

/** Excludes alternate-mode catalog records that duplicate standard champions. */
export function isStandardChampion(champion: Pick<Champion, "riotId">) {
  return !NON_STANDARD_CHAMPION_PREFIXES.some((prefix) => champion.riotId.startsWith(prefix));
}
