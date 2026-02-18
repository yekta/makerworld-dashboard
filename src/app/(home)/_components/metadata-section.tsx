"use client";

import { useNow } from "@/components/providers/now-provider";
import { useStats } from "@/components/providers/stats-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { Fragment, useMemo } from "react";

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

const keysToShow: Array<keyof AppRouterOutputs["stats"]["get"]["metadata"]> = [
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

  const timestamps = useMemo(() => {
    return keysToShow.map((key) => {
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
      return { keyValue, unit, timestamp };
    });
  }, [data, adjustedNow]);

  const rows = useMemo(
    () =>
      Array.from({ length: Math.ceil(timestamps.length / columns) }, (_, i) =>
        timestamps.slice(i * columns, (i + 1) * columns),
      ),
    [timestamps],
  );

  return (
    <div
      suppressHydrationWarning
      className="w-full flex flex-col gap-1.5 font-mono text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis"
    >
      {rows.map((row, i) => (
        <div key={i} className="w-full flex items-center justify-center">
          {row.map(({ keyValue, unit, timestamp }, index) => (
            <Fragment key={index}>
              <p
                suppressHydrationWarning
                data-only={row.length === 1 ? true : undefined}
                data-odd={index % 2 === 1 ? true : undefined}
                className="shrink leading-none min-w-0 data-odd:text-left text-right data-only:text-center data-only:data-odd:text-center group-data-placeholder:rounded-sm group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
              >
                △{keyValue.toString().padStart(2, "0")}
                {unit}:{timeAgo({ timestamp, now: adjustedNow })}
              </p>
              {row.length === 2 && index === 0 && (
                <span className="mx-[0.75ch] shrink-0 leading-none text-muted-most-foreground group-data-placeholder:rounded-sm group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
                  |
                </span>
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
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
      className="w-full flex items-center justify-center mt-3.5 text-xs group"
    >
      {children}
    </div>
  );
}
