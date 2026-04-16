import {
  LEADERBOARD_TABLE_SORT_BY_DEFAULT,
  LEADERBOARD_TABLE_SORT_BY_KEY,
  LEADERBOARD_TABLE_SORT_ORDER_DEFAULT,
  LEADERBOARD_TABLE_SORT_ORDER_KEY,
  TLeaderboardTableSortByEnum,
  TLeaderboardTableSortOrderEnum,
} from "@/app/leaderboard/_components/constants";
import { parseAsStringEnum, useQueryState } from "nuqs";

export function useLeaderboardSortBy() {
  const res = useQueryState(
    LEADERBOARD_TABLE_SORT_BY_KEY,
    parseAsStringEnum(TLeaderboardTableSortByEnum.options).withDefault(
      LEADERBOARD_TABLE_SORT_BY_DEFAULT,
    ),
  );
  return res;
}

export function useLeaderboardSortOrder() {
  const res = useQueryState(
    LEADERBOARD_TABLE_SORT_ORDER_KEY,
    parseAsStringEnum(TLeaderboardTableSortOrderEnum.options).withDefault(
      LEADERBOARD_TABLE_SORT_ORDER_DEFAULT,
    ),
  );
  return res;
}
