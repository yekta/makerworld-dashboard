"use client";

import { useLeaderboard } from "@/components/providers/leaderboard-provider";
import RefetchIndicator from "@/components/refetch-indicator";

export default function LeaderboardTableRefetchIndicator() {
  const { isPending, isRefetching, isError } = useLeaderboard();

  return (
    <RefetchIndicator
      className="absolute left-1.5 top-1.5 z-20"
      isPending={isPending}
      isRefetching={isRefetching}
      isError={isError}
    />
  );
}
