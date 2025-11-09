"use client";

import { useNow } from "@/components/providers/now-provider";
import { useStats } from "@/components/providers/stats-provider";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";

const placeholderTimestamp = Date.now() - 1000 * 60 * 60; // 1 hour ago

export default function MetadataSection() {
  const { data, isPending, isError } = useStats();
  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          Couldn't load metadata :(
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper isPending={isPending}>
      <Metadata data={data} />
    </Wrapper>
  );
}

function Metadata({
  data,
}: {
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"];
}) {
  const now = useNow();
  return (
    <p
      suppressHydrationWarning
      className="shrink font-mono leading-normal text-center px-3 text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
    >
      △00h:{" "}
      {timeAgo(
        data ? data.metadata.delta_0h_timestamp : placeholderTimestamp,
        now
      )}
      <span>{" | "}</span>
      △01h:{" "}
      {timeAgo(
        data ? data.metadata.delta_1h_timestamp : placeholderTimestamp,
        now
      )}
      <br />
      △08h:{" "}
      {timeAgo(
        data ? data.metadata.delta_8h_timestamp : placeholderTimestamp,
        now
      )}
      <span>{" | "}</span>
      △24h:{" "}
      {timeAgo(
        data ? data.metadata.delta_24h_timestamp : placeholderTimestamp,
        now
      )}
    </p>
  );
}

function Wrapper({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) {
  return (
    <div
      data-placeholder={isPending ? true : undefined}
      className="w-full flex items-center justify-center mt-2 md:mt-3 text-xs group"
    >
      {children}
    </div>
  );
}
