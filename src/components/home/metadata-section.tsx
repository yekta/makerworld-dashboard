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
  const columns = 2;
  const keysToShow: Array<keyof AppRouterOutputs["stats"]["get"]["metadata"]> =
    [
      "delta_0h_timestamp",
      "delta_0-4h_timestamp",
      "delta_0-12h_timestamp",
      "delta_0-24h_timestamp",
      "delta_24-25h_timestamp",
      "delta_24-28h_timestamp",
      "delta_24-36h_timestamp",
      "delta_24-48h_timestamp",
    ];

  return (
    <p
      suppressHydrationWarning
      className="shrink font-mono leading-normal text-center px-3 text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
    >
      {keysToShow.map((key, index) => {
        const cleanedKeyStr = key
          .replace("delta_", "")
          .replace("_timestamp", "")
          .replace("h", "")
          .split("-");
        const cleanedKey =
          cleanedKeyStr.length === 1
            ? cleanedKeyStr[0]
            : cleanedKeyStr.length === 2
            ? cleanedKeyStr[1]
            : key;
        return (
          <span key={key}>
            △{cleanedKey.padStart(2, "0")}h:{" "}
            {timeAgo({
              timestamp: data ? data.metadata[key] : placeholderTimestamp,
              now,
            })}
            {index % columns === columns - 1 ? (
              index === keysToShow.length - 1 ? null : (
                <br />
              )
            ) : (
              " | "
            )}
          </span>
        );
      })}
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
