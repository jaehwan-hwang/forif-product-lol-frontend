import { apiFetch } from "@/lib/api/client";
import type { ChampionAnalyticsResponse } from "@/types";

export function fetchGlobalChampionAnalytics(): Promise<ChampionAnalyticsResponse> {
  return apiFetch<ChampionAnalyticsResponse>("/api/champions/analytics");
}
