"use client";

import { useNow } from "@/components/providers/now-provider";
import { useStats } from "@/components/providers/stats-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";

const placeholderTimestamp = new Date("2025-01-01T00:00:00Z").getTime();

export default function MetadataSection() {
  const { data, isPending, isError } = useStats();
  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          {`Couldn't load metadata :(`}
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
  const { headCutoffTimestamp } = useTimeMachine();
  const adjustedNow = headCutoffTimestamp
    ? Math.min(now, headCutoffTimestamp)
    : now;

  const columns = 2;
  const keysToShow: Array<keyof AppRouterOutputs["stats"]["get"]["metadata"]> =
    [
      "delta_0h_timestamp",
      "delta_0-1h_timestamp",
      "delta_0-4h_timestamp",
      "delta_0-12h_timestamp",
      "delta_0-24h_timestamp",
      "delta_0-168h_timestamp",
      "delta_0-720h_timestamp",
      "delta_24-25h_timestamp",
      "delta_24-28h_timestamp",
      "delta_24-36h_timestamp",
      "delta_24-48h_timestamp",
      "delta_168-336h_timestamp",
      "delta_720-1440h_timestamp",
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
        const keyNumber = Number(cleanedKey);
        const unit = keyNumber >= 168 ? "d" : "h";
        const keyValue = Math.round(unit === "d" ? keyNumber / 24 : keyNumber);
        const extraSeconds =
          data && adjustedNow - data.metadata[key] > 24 * 60 * 60 * 1000
            ? 75 * 1000
            : 0;
        const timestamp = data
          ? data.metadata[key] - extraSeconds
          : placeholderTimestamp;
        return (
          <span suppressHydrationWarning key={key}>
            △{keyValue.toString().padStart(2, "0")}
            {unit}:{timeAgo({ timestamp, now: adjustedNow })}
            {index === keysToShow.length - 1 ? null : index % columns ===
              columns - 1 ? (
              <br />
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
