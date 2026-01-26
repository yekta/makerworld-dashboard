"use client";

import { useStats } from "@/components/providers/stats-provider";

export default function RefetchIndicator() {
  const { isPending, isRefetching, isError } = useStats();
  return (
    <div
      data-error={!isPending && !isRefetching && isError ? true : undefined}
      data-fetching={isRefetching || isPending ? true : undefined}
      className="absolute left-2 top-2 size-1.5 rounded-full bg-success data-fetching:bg-pending data-fetching:animate-pulse data-error:bg-destructive"
    ></div>
  );
}
