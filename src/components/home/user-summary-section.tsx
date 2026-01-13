"use client";

import PrintIcon from "@/components/icons/print-icon";
import { useNow } from "@/components/providers/now-provider";
import { useStats } from "@/components/providers/stats-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { appLocale } from "@/lib/constants";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { format } from "date-fns";
import { BoxIcon, DownloadIcon, RocketIcon, UsersIcon } from "lucide-react";
import { useMemo } from "react";

const printToPointRatioRaw = 2.2;
const printToPointRatioSafetyMargin = 0.1;
const pointToUsdRatio = 0.066;

export default function UserSummarySection() {
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
      <Section data={data} />
    </Wrapper>
  );
}

const placeholderTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
const printToPointRatio =
  printToPointRatioRaw * (1 - printToPointRatioSafetyMargin);

function Section({
  data,
}: {
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"];
}) {
  const projectedMonthlyUSDRevenue = useMemo(() => {
    if (!data) return 100;
    const lastWeekPrints = data.user.stats["delta_0-168h"].prints;
    const avgDailyPrints = lastWeekPrints / 7;
    const projectedMonthlyPrints = avgDailyPrints * 30;
    const projectedMonthlyPoints = projectedMonthlyPrints * printToPointRatio;
    const projectedMonthlyUsd = projectedMonthlyPoints * pointToUsdRatio;
    return projectedMonthlyUsd;
  }, [data]);

  const veryFirstModelCreationTimestamp = useMemo(() => {
    if (!data) return placeholderTimestamp;
    const modelCreationTimestamps = data.models.map(
      (model) => model.model_created_at
    );
    return Math.min(...modelCreationTimestamps);
  }, [data]);

  const printsPerDayBasedOnLastWeek = useMemo(() => {
    if (!data) return 100;
    const lastWeekPrints = data.user.stats["delta_0-168h"].prints;
    const avgDailyPrints = lastWeekPrints / 7;
    return avgDailyPrints;
  }, [data]);

  const boostsPerDayBasedOnLastWeek = useMemo(() => {
    if (!data) return 0;
    const lastWeekBoosts = data.user.stats["delta_0-168h"].boosts;
    const avgDailyBoosts = lastWeekBoosts / 7;
    return avgDailyBoosts;
  }, [data]);

  const boostRatePercentage = !data
    ? 5
    : (data.user.stats.current.boosts / (data.user.stats.current.prints || 1)) *
      100;

  return (
    <div className="w-full flex flex-col md:flex-row">
      {/* Left Column / Top Row */}
      <div className="w-full flex flex-col items-center gap-0.5 md:w-1/2 md:items-end">
        <div className="w-full flex items-center justify-center md:justify-end px-3">
          <p
            suppressHydrationWarning
            className="shrink font-light whitespace-nowrap leading-normal text-center md:text-right text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
          >
            <span className="text-foreground font-medium group-data-placeholder:text-transparent">
              $
              {projectedMonthlyUSDRevenue.toLocaleString(appLocale, {
                maximumFractionDigits: 0,
              })}
            </span>
            {"/mo forecast based on last week"}
          </p>
        </div>
        <div className="w-full flex items-center justify-center md:justify-end px-3">
          <p
            suppressHydrationWarning
            className="shrink font-light whitespace-nowrap leading-normal text-center md:text-right text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
          >
            <RecentEventsText data={data} />
          </p>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full md:w-px py-2 md:py-px flex items-center justify-center md:self-stretch">
        <div className="w-1/2 md:w-full bg-border h-px md:h-full rounded-full" />
      </div>
      {/* Right Column / Bottom Row */}
      <div className="w-full flex flex-col items-center gap-0.5 md:w-1/2 md:items-start">
        <div className="w-full flex items-center justify-center md:justify-start px-3">
          <p
            suppressHydrationWarning
            className="shrink font-light whitespace-nowrap leading-normal text-center md:text-left text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
          >
            <span className="font-medium">
              <PrintIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {printsPerDayBasedOnLastWeek.toLocaleString(appLocale, {
                maximumFractionDigits: 1,
              })}
            </span>
            {" daily"}
            <span className="text-muted-more-foreground px-[0.75ch]">
              {"|"}
            </span>
            <span className="font-medium">
              <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {boostsPerDayBasedOnLastWeek.toLocaleString(appLocale, {
                maximumFractionDigits: 1,
              })}
            </span>
            {" daily"}
            <span className="text-muted-more-foreground px-[0.75ch]">
              {"|"}
            </span>
            <span className="font-medium">
              <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {boostRatePercentage.toLocaleString(appLocale, {
                maximumFractionDigits: 1,
              })}
              {"%"}
            </span>
          </p>
        </div>
        <div className="w-full flex items-center justify-center md:justify-start px-3">
          <p className="shrink font-light whitespace-nowrap leading-normal text-center md:text-left text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            <DatesSpan
              isPlaceholder={!data}
              timestamp={veryFirstModelCreationTimestamp}
            />
            <span className="text-muted-more-foreground px-[0.75ch]">
              {"|"}
            </span>
            <span>
              <BoxIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {data?.models.length ?? 0}
            </span>
          </p>
        </div>
      </div>
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
      className="w-full py-3 flex items-center justify-center text-xs group"
    >
      {children}
    </div>
  );
}

function DatesSpan({
  timestamp,
  isPlaceholder,
}: {
  timestamp: number;
  isPlaceholder?: boolean;
}) {
  const { headCutoffTimestamp } = useTimeMachine();
  const now = useNow();
  const adjustedNow = headCutoffTimestamp
    ? Math.min(now, headCutoffTimestamp)
    : now;
  const { timeAgoString, releaseDate } = useMemo(
    () => ({
      timeAgoString: timeAgo({
        timestamp: !isPlaceholder ? timestamp : placeholderTimestamp,
        now: adjustedNow,
        dontPad: true,
        fullUnitText: true,
      }),
      releaseDate: format(
        new Date(!isPlaceholder ? timestamp : placeholderTimestamp),
        "yyyy-MM-dd"
      ),
    }),
    [isPlaceholder, timestamp, adjustedNow]
  );

  return (
    <span>
      {timeAgoString}
      <span className="text-muted-more-foreground px-[0.75ch]">{"|"}</span>
      {releaseDate}
    </span>
  );
}

function RecentEventsText({
  data,
}: {
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"];
}) {
  const noEventsText = "No events in the last 15 min";
  if (!data) return noEventsText;

  const boostsInLast15Min = data.user.stats["delta_0-0.25h"].boosts;
  const printsInLast15Min = data.user.stats["delta_0-0.25h"].prints;
  const downloadsInLast15Min = data.user.stats["delta_0-0.25h"].downloads;
  const followersInLast15Min = data.user.stats["delta_0-0.25h"].followers;

  const stats: { value: number; Icon: React.ElementType; label: string }[] = [];

  if (boostsInLast15Min > 0) {
    stats.push({
      value: boostsInLast15Min,
      Icon: RocketIcon,
      label: "boost",
    });
  }

  if (printsInLast15Min > 0) {
    stats.push({
      value: printsInLast15Min,
      Icon: PrintIcon,
      label: "print",
    });
  }

  if (downloadsInLast15Min > 0) {
    stats.push({
      value: downloadsInLast15Min,
      Icon: DownloadIcon,
      label: "download",
    });
  }

  if (followersInLast15Min > 0) {
    stats.push({
      value: followersInLast15Min,
      Icon: UsersIcon,
      label: "follower",
    });
  }

  if (stats.length > 0) {
    const spans = stats.map((item, index) => (
      <span key={index}>
        {index > 0 && stats.length === 2
          ? " and "
          : index > 0 && index === stats.length - 1
          ? ", and "
          : index > 0
          ? ", "
          : ""}
        <span className="text-foreground font-medium">
          <item.Icon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
          {item.value}
        </span>
      </span>
    ));

    return (
      <span>
        {...spans}
        <span>{" in the last 15 min"}</span>
      </span>
    );
  }

  return noEventsText;
}
