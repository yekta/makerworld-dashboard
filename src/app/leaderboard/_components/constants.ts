import { parseAsStringEnum as parseAsStringEnumClient } from "nuqs";
import { parseAsStringEnum as parseAsStringEnumServer } from "nuqs/server";
import { createSearchParamsCache } from "nuqs/server";
import z from "zod";

export const LEADERBOARD_TABLE_SORT_BY_KEY = "sort_by";
export const LEADERBOARD_TABLE_SORT_ORDER_KEY = "sort_order";

export const LEADERBOARD_TABLE_SORT_BY_DEFAULT: z.infer<
  typeof TLeaderboardTableSortByEnum
> = "prints";
export const LEADERBOARD_TABLE_SORT_ORDER_DEFAULT: z.infer<
  typeof TLeaderboardTableSortOrderEnum
> = "desc";

export const TLeaderboardTableSortOrderEnum = z.enum(["desc", "asc"]);

export const TLeaderboardTableSortByEnum = z.enum([
  "username",
  "downloads",
  "prints",
  "prints_last_24h",
  "boosts",
  "followers",
  "boost_rate",
  "model_count",
  "first_model_created_at",
  "snapshotted_at",
  "since_start",
  "since_snapshotted_at",
]);

const isServer = typeof window === "undefined";

export const parseAsStringEnum = isServer
  ? parseAsStringEnumServer
  : parseAsStringEnumClient;

export const leaderboardPageParamParsers = {
  sort: parseAsStringEnum(TLeaderboardTableSortByEnum.options),
  order: parseAsStringEnum(TLeaderboardTableSortOrderEnum.options),
} as const;

export const cachedLeaderboardPageSearchParams = createSearchParamsCache(
  leaderboardPageParamParsers,
);
