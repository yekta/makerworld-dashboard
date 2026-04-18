"use client";

import { TRegion } from "@/app/(home)/_components/constants";
import {
  useRegion,
  useModelOrder,
  useModelSort,
  useModelStatVisibilityPreferences,
} from "@/app/(home)/_components/filters-section/hooks";
import ModelStatsChart from "@/app/(home)/_components/model-stats-chart";
import PrintIcon from "@/components/icons/print-icon";
import LinkOrDiv from "@/components/link-or-div";
import { useNow } from "@/components/providers/now-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import Stat from "@/components/stat";
import { exclusivePointsToUsd } from "@/lib/calculate-points";
import { appLocale } from "@/lib/constants";
import { trimDuration } from "@/lib/helpers";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { format } from "date-fns";
import {
  DownloadIcon,
  ExternalLink,
  RocketIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Duration } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export type TModelCardProps =
  | {
      model: AppRouterOutputs["myUsers"]["getStats"]["models"][number];
      metadata: AppRouterOutputs["myUsers"]["getStats"]["metadata"];
      isPlaceholder?: never;
    }
  | {
      model?: never;
      metadata?: never;
      isPlaceholder: true;
    };

export default function ModelCard(props: TModelCardProps) {
  if (props.isPlaceholder) {
    return (
      <div
        data-placeholder={true}
        className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 p-1 group rounded-2xl group"
      >
        <ModelCardContent isPlaceholder={true} />
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 p-1 group rounded-2xl group">
      <ModelCardContent {...props} />
    </div>
  );
}

function ModelCardContent(props: TModelCardProps) {
  const { model, isPlaceholder } = props;
  const [statVisibilityPreferences] = useModelStatVisibilityPreferences();
  const isChartActive = statVisibilityPreferences.includes("chart");
  const { isTravelled } = useTimeMachine();
  const [region] = useRegion();
  return (
    <div
      data-highlighted={
        !isPlaceholder &&
        (model.stats["delta_0-0.25h"].boosts > 0 ||
          model.stats["delta_0-0.25h"].prints > 0 ||
          model.stats["delta_0-0.25h"].downloads > 0)
          ? true
          : undefined
      }
      data-chart-active={isChartActive ? true : undefined}
      data-travelled={isTravelled ? true : undefined}
      className="p-2 min-h-20 rounded-[14px] group flex flex-col gap-1 relative overflow-hidden z-0 transform translate-z-0"
    >
      {/* Flare effect */}
      <div className="w-full h-full absolute right-0 top-0 p-px transition bg-linear-to-bl via-15% from-border via-border to-border group-data-highlighted:from-success/40 group-data-highlighted:group-data-travelled:from-warning/40 group-data-highlighted:via-border group-data-highlighted:to-border rounded-[14px]">
        <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] absolute right-px top-px bg-background rounded-[13px]" />
      </div>
      <div className="opacity-0 z-0 transform translate-z-0 translate-x-20 -translate-y-4 transition-opacity duration-300 group-data-highlighted:opacity-100 absolute h-10 w-50 top-0 right-0 bg-success/16 group-data-travelled:bg-warning/16 blur-xl" />
      <div className="opacity-0 z-0 transform translate-z-0 translate-x-55 -translate-y-8 transition-opacity duration-300 group-data-highlighted:opacity-100 absolute h-20 w-100 top-0 right-0 bg-success/8 group-data-travelled:bg-warning/8 blur-2xl" />
      {/* <div className="w-full h-full absolute right-0 top-0 rounded-[18px] overflow-hidden p-px group-hover:opacity-0 group-active:opacity-0">
        <div
          style={{
            backgroundColor: "transparent",
            background:
              "repeating-linear-gradient(-45deg, var(--background), var(--background) 1px, transparent 1px, transparent 3px)",
          }}
          className="w-full h-full"
        />
      </div> */}
      {/* Flare effect end */}
      <div className="w-full flex items-center overflow-hidden gap-4 relative px-1">
        <LinkOrDiv
          data-link={!isPlaceholder ? true : undefined}
          href={isPlaceholder ? undefined : getModelUrl({ model, region })}
          target="_blank"
          className="data-link:active:underline data-link:hover:underline group/link decoration-foreground flex min-w-0 overflow-hidden"
        >
          <h2 className="text-xs font-light shrink min-w-0 text-muted-foreground group-active/link:text-foreground group-hover/link:text-foreground whitespace-nowrap overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            {!isPlaceholder ? model.title : "Loading This Model's Title"}
          </h2>
        </LinkOrDiv>
        {!isPlaceholder &&
          (model.stats["delta_0-0.25h"].boosts > 0 ||
            model.stats["delta_0-0.25h"].prints > 0 ||
            model.stats["delta_0-0.25h"].downloads > 0) && (
            <p className="ml-auto flex shrink-0 max-w-1/2 min-w-0 overflow-hidden gap-2 items-end text-xs text-success group-data-travelled:text-warning font-mono font-medium">
              {model.stats["delta_0-0.25h"].boosts > 0 && (
                <span>
                  <RocketIcon className="size-2.75 shrink-0 inline-block mb-0.5 mr-[0.2ch]" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right">
                    {model.stats["delta_0-0.25h"].boosts}
                  </span>
                </span>
              )}
              {model.stats["delta_0-0.25h"].prints > 0 && (
                <span>
                  <PrintIcon className="size-2.75 shrink-0 inline-block mb-0.5 mr-[0.2ch]" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right">
                    {model.stats["delta_0-0.25h"].prints}
                  </span>
                </span>
              )}
              {model.stats["delta_0-0.25h"].downloads > 0 && (
                <span>
                  <DownloadIcon className="size-2.75 shrink-0 inline-block mb-0.5 mr-[0.2ch]" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right">
                    {model.stats["delta_0-0.25h"].downloads}
                  </span>
                </span>
              )}
            </p>
          )}
      </div>
      <div className="w-full flex flex-row gap-5 px-1 relative">
        <Stat
          statType="model"
          statKey="prints"
          {...(isPlaceholder
            ? { isPlaceholder: true }
            : { stats: model.stats })}
          Icon={PrintIcon}
          showPrevDayStats={true}
          showTimeRange={true}
        />
        <Stat
          statType="model"
          statKey="downloads"
          {...(isPlaceholder
            ? { isPlaceholder: true }
            : { stats: model.stats })}
          Icon={DownloadIcon}
        />
        <Stat
          statType="model"
          statKey="boosts"
          {...(isPlaceholder
            ? { isPlaceholder: true }
            : { stats: model.stats })}
          Icon={RocketIcon}
        />
        <Stat
          statType="model"
          statKey="likes"
          {...(isPlaceholder
            ? { isPlaceholder: true }
            : { stats: model.stats })}
          Icon={ThumbsUpIcon}
        />
      </div>
      <ModelStatsChart className="h-16" {...props} />
      <div className="w-full z-0 mt-auto flex justify-start relative">
        <Footer {...props} />
      </div>
    </div>
  );
}

function getModelUrl({
  model,
  region,
}: {
  model: AppRouterOutputs["myUsers"]["getStats"]["models"][number];
  region: TRegion;
}) {
  if (region === "china") {
    return `https://makerworld.com.cn/zh/models/${model.model_id}-${model.slug}`;
  }
  return `https://makerworld.com/en/models/${model.model_id}-${model.slug}`;
}

const placeholderTimestamp = new Date("2025-01-01T00:00:00Z").getTime();

function Footer({ model, metadata, isPlaceholder }: TModelCardProps) {
  return (
    <div className="w-full flex justify-start items-center gap-2.5 pl-0.5 pr-2 pb-px">
      <ImageSection
        {...(isPlaceholder ? { isPlaceholder: true } : { model, metadata })}
      />
      <BottomInfoRow
        {...(isPlaceholder ? { isPlaceholder: true } : { model, metadata })}
      />
    </div>
  );
}

function BottomInfoRow({ model, metadata, isPlaceholder }: TModelCardProps) {
  const { timeMachineTimestamp } = useTimeMachine();
  const now = useNow();
  const adjustedNow = timeMachineTimestamp
    ? Math.min(now, timeMachineTimestamp)
    : now;
  const sinceCreation = !isPlaceholder
    ? adjustedNow - model.model_created_at
    : 24 * 60 * 60 * 1000;

  const printsPerDay = !isPlaceholder
    ? model.stats.current.prints / (sinceCreation / (1000 * 60 * 60 * 24))
    : 10;
  const boostsPerDay = !isPlaceholder
    ? model.stats.current.boosts / (sinceCreation / (1000 * 60 * 60 * 24))
    : 0;
  const boostRatePercentage = !isPlaceholder
    ? (model.stats.current.boosts / (model.stats.current.prints || 1)) * 100
    : 5;

  const kmbtFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short", // uses K, M, B…
    maximumSignificantDigits: 3,
  });

  const { timeAgoString, releaseDate } = useMemo(
    () => ({
      timeAgoString: trimDuration({
        duration: Duration.fromMillis(
          adjustedNow -
            (!isPlaceholder ? model.model_created_at : placeholderTimestamp),
        ).shiftTo("years", "months", "days", "hours", "minutes", "seconds"),
        precision: 2,
      }).toHuman({
        showZeros: false,
        unitDisplay: "narrow",
        maximumFractionDigits: 0,
      }),
      releaseDate: format(
        new Date(
          !isPlaceholder ? model.model_created_at : placeholderTimestamp,
        ),
        "EEE, HH:mm - yyyy-MM-dd",
      ),
    }),
    [isPlaceholder, model, adjustedNow],
  );

  const modelIncomePerMonth = useMemo(() => {
    if (isPlaceholder) return "300";
    if (
      model.stats.current.points_exclusive_default === null ||
      model.stats.current.points_exclusive_cn === null ||
      model.stats.current.prints === 0
    ) {
      return "N/A";
    }

    const modelPoints =
      model.stats.current.points_exclusive_default +
      model.stats.current.points_exclusive_cn;
    const adjustedNow = timeMachineTimestamp
      ? Math.min(now, timeMachineTimestamp)
      : now;
    const sinceCreationMs = adjustedNow - model.model_created_at;

    const monthDurationMs = 30 * 24 * 60 * 60 * 1000;
    let printsDuringInterval = model.stats["delta_0-168h"].prints;
    let intervalDurationMs = 7 * 24 * 60 * 60 * 1000;
    const isModelAtLeastIntervalOld = sinceCreationMs >= intervalDurationMs;

    if (!isModelAtLeastIntervalOld) {
      printsDuringInterval = model.stats.current.prints;
      intervalDurationMs = sinceCreationMs;
    }

    const printRatioOfDuringInterval =
      printsDuringInterval / model.stats.current.prints;
    const pointIncomeForecastPerMonth =
      printRatioOfDuringInterval *
      modelPoints *
      (monthDurationMs / intervalDurationMs);

    return kmbtFormatter.format(
      exclusivePointsToUsd(pointIncomeForecastPerMonth),
    );
  }, [model]);

  return (
    <div className="flex-1 min-w-0 flex flex-col items-start">
      <div className="w-full flex justify-start flex-wrap">
        <p className="shrink px-0.5 -ml-0.5 min-w-0 font-light overflow-hidden overflow-ellipsis text-xs text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground group-data-placeholder:text-transparent">
          <span className="font-medium">
            <PrintIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
            {printsPerDay.toLocaleString(appLocale, {
              maximumFractionDigits: 1,
            })}
          </span>
          {" daily"}
          <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch]">
            {"|"}
          </span>
          <span className="font-medium">
            <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
            {boostsPerDay.toLocaleString(appLocale, {
              maximumFractionDigits: 1,
            })}
          </span>
          {" daily"}
          <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch]">
            {"|"}
          </span>
          <span className="font-medium">
            <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
            {boostRatePercentage.toLocaleString(appLocale, {
              maximumFractionDigits: 1,
            })}
            {"%"}
          </span>
          <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch]">
            {"|"}
          </span>
          <span>
            <span className="font-medium">${modelIncomePerMonth}</span>
            /mo
          </span>
        </p>
      </div>
      <DateTime
        {...(isPlaceholder ? { isPlaceholder: true } : { model, metadata })}
        releaseDate={releaseDate}
        timeAgoString={timeAgoString}
        modelReleaseTimestamp={
          !isPlaceholder ? model.model_created_at : placeholderTimestamp
        }
      />
    </div>
  );
}

const dayPlusFiveMinMs = 1000 * 60 * 60 * 24 + 1000 * 60 * 5;

function DateTime({
  isPlaceholder,
  model,
  releaseDate,
  modelReleaseTimestamp,
  timeAgoString,
}: {
  releaseDate: string;
  modelReleaseTimestamp: number;
  timeAgoString: string;
} & TModelCardProps) {
  const { isOpen, setTimeMachineTimestamp } = useTimeMachine();
  const [, setModelSort] = useModelSort();
  const [, setModelOrder] = useModelOrder();

  const kmbtFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short", // uses K, M, B…
    maximumSignificantDigits: 3,
  });

  const El = isOpen ? "button" : "p";

  return (
    <El
      {...(isOpen && {
        onClick: () => {
          setTimeMachineTimestamp(
            Math.min(Date.now(), modelReleaseTimestamp + dayPlusFiveMinMs),
          );
          setModelSort("created_at");
          setModelOrder("desc");
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        },
      })}
      data-open={isOpen ? true : undefined}
      className="shrink px-0.5 -ml-0.5 data-open:ring data-open:ring-foreground/15 data-open:hover:ring-warning/25 data-open:active:ring-warning/25 text-left group-data-placeholder:hover:text-transparent data-open:group-data-placeholder:hover:text-transparent group-data-placeholder:ring-0 data-open:group-data-placeholder:ring-0 group-data-placeholder:hover:ring-0 data-open:group-data-placeholder:hover:ring-0 group-data-placeholder:active:ring-0 data-open:group-data-placeholder:active:ring-0 group-data-placeholder:active:text-transparent data-open:group-data-placeholder:active:text-transparent data-open:hover:text-warning data-open:hover:bg-warning/15 data-open:active:text-warning data-open:active:bg-warning/15 rounded data-open:bg-border mt-0.5 min-w-0 font-light overflow-hidden overflow-ellipsis text-xs text-muted-foreground group-data-placeholder:rounded data-open:group-data-placeholder:rounded group-data-placeholder:animate-pulse data-open:group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-most-foreground data-open:group-data-placeholder:bg-muted-most-foreground group-data-placeholder:active:bg-muted-most-foreground data-open:group-data-placeholder:active:bg-muted-most-foreground data-open:group-data-placeholder:hover:bg-muted-most-foreground group-data-placeholder:hover:bg-muted-most-foreground data-open:group-data-placeholder:text-transparent group-data-placeholder:text-transparent"
    >
      {timeAgoString}
      <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch] font-light text-xs">
        {"|"}
      </span>
      {releaseDate}
      <span className="text-muted-most-foreground group-data-placeholder:text-transparent px-[0.75ch]">
        {"|"}
      </span>
      <span>
        $
        {isPlaceholder
          ? "300"
          : model.stats.current.points_exclusive_default !== null &&
              model.stats.current.points_exclusive_cn !== null
            ? kmbtFormatter.format(
                exclusivePointsToUsd(
                  model.stats.current.points_exclusive_default +
                    model.stats.current.points_exclusive_cn,
                ),
              )
            : "N/A"}
      </span>
    </El>
  );
}

function ImageSection({ model, isPlaceholder }: TModelCardProps) {
  const [region] = useRegion();
  if (isPlaceholder) {
    return (
      <div className="border border-border group/link relative outline-0 transition duration-150 active:ring-[1.5px] hover:ring-[1.5px] ring-0 focus-visible:ring-[1.5px] ring-foreground/50 bg-border rounded-[5px] overflow-hidden group-data-placeholder:animate-pulse">
        <div className="h-8.5 w-auto shrink-0 aspect-4/3 bg-border relative z-0" />
      </div>
    );
  }

  return (
    <Link
      href={getModelUrl({ model, region })}
      target="_blank"
      className="border border-border group/link relative outline-0 transition duration-150 active:ring-[1.5px] hover:ring-[1.5px] ring-0 focus-visible:ring-[1.5px] ring-foreground/50 bg-border rounded-[5px] overflow-hidden group-data-placeholder:animate-pulse"
    >
      <Image
        src={model.image}
        alt={model.title}
        width={1916}
        height={1437}
        className="h-8.5 w-auto shrink-0 aspect-4/3 bg-border relative z-0"
      />
      <div className="w-full group/link z-10 overflow-hidden opacity-0 group-focus-visible/link:opacity-100 group-active/link:opacity-100 group-hover/link:opacity-100 duration-150 flex items-center justify-center h-full absolute left-0 top-0 bg-background/75">
        <ExternalLink className="size-5 translate-y-3 group-active/link:opacity-100 group-active/link:translate-y-0 group-focus-visible/link:opacity-100 group-focus-visible/link:translate-y-0 group opacity-0 group-hover/link:opacity-100 duration-150 group-hover/link:translate-y-0 transition" />
      </div>
    </Link>
  );
}
