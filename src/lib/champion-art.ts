const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";
const LEGACY_CHAMPION_PREFIX = "Jade_";

function standardChampionId(riotId: string) {
  return riotId.startsWith(LEGACY_CHAMPION_PREFIX)
    ? riotId.slice(LEGACY_CHAMPION_PREFIX.length)
    : riotId;
}

function standardChampionImageUrl(imageUrl: string) {
  return imageUrl.replaceAll(LEGACY_CHAMPION_PREFIX, "");
}

/** Prefer the versioned image URL returned by our champion catalog API. */
export function championSquareUrl(riotId: string, imageUrl?: string | null) {
  const normalizedRiotId = standardChampionId(riotId);
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
  return `${DATA_DRAGON_BASE_URL}/cdn/img/champion/splash/${encodeURIComponent(standardChampionId(riotId))}_0.jpg${cacheVersion}`;
}
