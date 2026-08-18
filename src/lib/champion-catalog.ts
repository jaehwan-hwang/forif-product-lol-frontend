import type { Champion } from "@/types";

const NON_STANDARD_CHAMPION_PREFIXES = ["Jade_"] as const;

/** Excludes alternate-mode catalog records that duplicate standard champions. */
export function isStandardChampion(champion: Pick<Champion, "riotId">) {
  return !NON_STANDARD_CHAMPION_PREFIXES.some((prefix) => champion.riotId.startsWith(prefix));
}
