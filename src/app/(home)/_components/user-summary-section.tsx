"use client";

import PointsRow from "@/app/(home)/_components/points-row";
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

const placeholderTimestamp = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

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

function Section({
  data,
}: {
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"];
}) {
  const { projectedMonthlyUSDRevenue, realMonthlyUSDRevenue } = useMemo(() => {
    if (!data)
      return {
        projectedMonthlyUSDRevenue: 1000,
        realMonthlyUSDRevenue: 1000,
      };
    const lastWeekUsd = getEarnings(1000 * 60 * 60 * 24 * 7, data);
    const lastMonthUsd = getEarnings(1000 * 60 * 60 * 24 * 30, data);

    return {
      projectedMonthlyUSDRevenue:
        lastWeekUsd === null ? null : (lastWeekUsd / 7) * 30,
      realMonthlyUSDRevenue: lastMonthUsd,
    };
  }, [data]);

  const veryFirstModelCreationTimestamp = useMemo(() => {
    if (!data) return placeholderTimestamp;
    const modelCreationTimestamps = data.models.map(
      (model) => model.model_created_at,
    );
    return Math.min(...modelCreationTimestamps);
  }, [data]);

  const printsPerDayBasedOnLastWeek = useMemo(() => {
    if (!data) return 1000;
    const lastWeekPrints = data.user.stats["delta_0-168h"].prints;
    const avgDailyPrints = lastWeekPrints / 7;
    return avgDailyPrints;
  }, [data]);

  const boostsPerDayBasedOnLastWeek = useMemo(() => {
    if (!data) return 10;
    const lastWeekBoosts = data.user.stats["delta_0-168h"].boosts;
    const avgDailyBoosts = lastWeekBoosts / 7;
    return avgDailyBoosts;
  }, [data]);

  const boostRatePercentage = !data
    ? 5
    : (data.user.stats.current.boosts / (data.user.stats.current.prints || 1)) *
      100;

  return (
    <div className="w-full flex flex-col">
      <PointsRow />
      <div className="w-full py-2 md:py-1.5 flex items-center justify-center md:self-stretch">
        <div className="w-1/2 bg-border h-px rounded-full md:hidden" />
      </div>
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Column / Top Row */}
        <div className="w-full flex flex-col items-center gap-0.5 md:w-1/2 md:items-end">
          <div className="w-full flex items-center justify-center md:justify-end px-3">
            <p
              suppressHydrationWarning
              className="shrink font-light whitespace-nowrap leading-normal text-center md:text-right text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground group-data-placeholder:text-transparent"
            >
              <span className="text-foreground font-medium group-data-placeholder:text-transparent">
                $
                {projectedMonthlyUSDRevenue === null
                  ? "N/A"
                  : projectedMonthlyUSDRevenue.toLocaleString(appLocale, {
                      maximumFractionDigits: 0,
                    })}
              </span>
              {"/mo forecast"}
              <span className="text-muted-most-foreground px-[0.75ch] group-data-placeholder:text-transparent">
                {"|"}
              </span>
              <span className="text-foreground font-medium group-data-placeholder:text-transparent">
                $
                {realMonthlyUSDRevenue === null
                  ? "N/A"
                  : realMonthlyUSDRevenue.toLocaleString(appLocale, {
                      maximumFractionDigits: 0,
                    })}
              </span>
              {"/mo earned"}
            </p>
          </div>
          <div className="w-full flex items-center justify-center md:justify-end px-3">
            <p
              suppressHydrationWarning
              className="shrink font-light whitespace-nowrap leading-normal text-center md:text-right text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground group-data-placeholder:text-transparent"
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
              className="shrink font-light whitespace-nowrap leading-normal text-center md:text-left text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground group-data-placeholder:text-transparent"
            >
              <span className="font-medium">
                <PrintIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
                {printsPerDayBasedOnLastWeek.toLocaleString(appLocale, {
                  maximumFractionDigits: 1,
                })}
              </span>
              {" daily"}
              <span className="text-muted-most-foreground px-[0.75ch] group-data-placeholder:text-transparent">
                {"|"}
              </span>
              <span className="font-medium">
                <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
                {boostsPerDayBasedOnLastWeek.toLocaleString(appLocale, {
                  maximumFractionDigits: 1,
                })}
              </span>
              {" daily"}
              <span className="text-muted-most-foreground px-[0.75ch] group-data-placeholder:text-transparent">
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
            <p className="shrink font-light whitespace-nowrap leading-normal text-center md:text-left text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground group-data-placeholder:text-transparent">
              <DatesSpan
                isPlaceholder={!data}
                timestamp={veryFirstModelCreationTimestamp}
              />
              <span className="text-muted-most-foreground px-[0.75ch] group-data-placeholder:text-transparent">
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
        "yyyy-MM-dd",
      ),
    }),
    [isPlaceholder, timestamp, adjustedNow],
  );

  return (
    <span suppressHydrationWarning>
      {timeAgoString}
      <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch]">
        {"|"}
      </span>
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

const currency = "USD";

function getEarnings(
  timeframeMs: number,
  data: NonNullable<
    AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"]
  >,
) {
  const buffer = 12 * 60 * 60 * 1000;
  let total = 0;
  const now = new Date().getTime();

  const filteredRedemptions = data.redemptions.filter(
    (redemption) =>
      redemption.redeemed_at >= now - timeframeMs + buffer &&
      redemption.redeem_cash_amount > 0 &&
      redemption.redeem_cash_currency === currency,
  );

  if (filteredRedemptions.length === 0) {
    return null;
  }

  const latestRedemptionTime = filteredRedemptions[0];
  const lastIndex = filteredRedemptions.length - 1;
  const startingRedemption = data.redemptions[lastIndex + 1];

  if (!startingRedemption) {
    return null;
  }

  for (const redemption of filteredRedemptions) {
    total += redemption.redeem_cash_amount;
  }

  const timeDiff =
    latestRedemptionTime.redeemed_at - startingRedemption.redeemed_at;

  const perTimeframe = (total / timeDiff) * timeframeMs;

  return perTimeframe;
}
