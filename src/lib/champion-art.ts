import {
  NON_STANDARD_CHAMPION_PREFIXES,
  normalizeChampionRiotId,
} from "@/lib/champion-catalog";

const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";

function standardChampionImageUrl(imageUrl: string) {
  return NON_STANDARD_CHAMPION_PREFIXES.reduce(
    (current, prefix) => current.replaceAll(prefix, ""),
    imageUrl,
  );
}

/** Prefer the versioned image URL returned by our champion catalog API. */
export function championSquareUrl(riotId: string, imageUrl?: string | null) {
  const normalizedRiotId = normalizeChampionRiotId(riotId);
  if (imageUrl) {
    return normalizedRiotId === riotId
      ? imageUrl
      : standardChampionImageUrl(imageUrl);
  }
  return championSplashUrl(normalizedRiotId);
}

/** Use artwork rather than a square portrait for champion-select surfaces. */
export function championSplashUrl(riotId: string, ddragonVersion?: string) {
  const cacheVersion = ddragonVersion ? `?v=${encodeURIComponent(ddragonVersion)}` : "";
  return `${DATA_DRAGON_BASE_URL}/cdn/img/champion/splash/${encodeURIComponent(normalizeChampionRiotId(riotId))}_0.jpg${cacheVersion}`;
}
