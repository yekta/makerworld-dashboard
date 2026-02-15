"use client";

import { useStats } from "@/components/providers/stats-provider";
import RefetchIndicator from "@/components/refetch-indicator";

export default function HomeRefetchIndicator() {
  const { isPending, isRefetching, isError } = useStats();

  return (
    <RefetchIndicator
      className="absolute left-1.5 top-1.5"
      isPending={isPending}
      isRefetching={isRefetching}
      isError={isError}
    />
  );
}
