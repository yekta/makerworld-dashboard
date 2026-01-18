"use client";

import {
  useModelOrder,
  useModelSort,
  useModelStatVisibilityPreferences,
} from "@/components/home/filters-section/hooks";
import PrintIcon from "@/components/icons/print-icon";
import ModelStatsChart from "@/components/model-stats-chart";
import { useNow } from "@/components/providers/now-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import Stat from "@/components/stat";
import { appLocale } from "@/lib/constants";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { format } from "date-fns";
import {
  DownloadIcon,
  ExternalLink,
  RocketIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type TProps =
  | {
      model: AppRouterOutputs["stats"]["get"]["models"][number];
      metadata: AppRouterOutputs["stats"]["get"]["metadata"];
      isPlaceholder?: never;
    }
  | {
      model?: never;
      metadata?: never;
      isPlaceholder: true;
    };

export default function ModelCard(props: TProps) {
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

function ModelCardContent(props: TProps) {
  const { model, isPlaceholder } = props;
  const [statVisibilityPreferences] = useModelStatVisibilityPreferences();
  const isChartActive = statVisibilityPreferences.includes("chart");
  const { isTravelled } = useTimeMachine();
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
      className="p-2 min-h-20 rounded-[14px] group/content flex flex-col gap-1 relative overflow-hidden"
    >
      {/* Flare effect */}
      <div className="w-full h-full absolute right-0 top-0 p-px transition bg-linear-to-bl via-15% from-border via-border to-border group-data-highlighted/content:from-success/40 group-data-highlighted/content:group-data-travelled/content:from-warning/40 group-data-highlighted/content:via-border group-data-highlighted/content:to-border rounded-[14px]">
        <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] absolute right-px top-px bg-background rounded-[13px]" />
      </div>
      <div className="opacity-0 transition-opacity duration-300 group-data-highlighted/content:opacity-100 absolute h-1/6 data-has-chart:h-1/8 aspect-5/1 translate-x-full -translate-y-full group-data-highlighted/content:translate-x-1/2 group-data-highlighted/content:-translate-y-1/2 top-0 right-0 bg-success/15 group-data-travelled/content:bg-warning/15 blur-xl" />
      <div className="opacity-0 transition-opacity duration-300 group-data-highlighted/content:opacity-100 absolute h-1/4 data-has-chart:h-1/6 aspect-5/1 translate-x-full -translate-y-full group-data-highlighted/content:translate-x-1/2 group-data-highlighted/content:-translate-y-1/2 top-0 right-0 bg-success/30 group-data-travelled/content:bg-warning/30 blur-2xl" />
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
        <Link
          href={isPlaceholder ? "" : getModelUrl(model)}
          target="_blank"
          className="active:underline hover:underline group/link decoration-foreground flex min-w-0 overflow-hidden"
        >
          <h2 className="text-xs font-light shrink min-w-0 text-muted-foreground group-active/link:text-foreground group-hover/link:text-foreground whitespace-nowrap overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            {!isPlaceholder ? model.title : "Loading This Model's Title"}
          </h2>
        </Link>
        {!isPlaceholder &&
          (model.stats["delta_0-0.25h"].boosts > 0 ||
            model.stats["delta_0-0.25h"].prints > 0 ||
            model.stats["delta_0-0.25h"].downloads > 0) && (
            <p className="ml-auto flex shrink-0 max-w-1/2 min-w-0 overflow-hidden gap-2 items-end text-xs text-success group-data-travelled/content:text-warning font-mono font-medium">
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
      <div className="w-full z-0 mt-auto flex justify-start pt-[0.09375rem] relative">
        <Footer {...props} />
      </div>
    </div>
  );
}

function getModelUrl(
  model: AppRouterOutputs["stats"]["get"]["models"][number],
) {
  return `https://makerworld.com/en/models/${model.model_id}-${model.slug}`;
}

const placeholderTimestamp = new Date("2025-01-01T00:00:00Z").getTime();

function Footer({ model, metadata, isPlaceholder }: TProps) {
  const { headCutoffTimestamp } = useTimeMachine();
  const now = useNow();
  const adjustedNow = headCutoffTimestamp
    ? Math.min(now, headCutoffTimestamp)
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

  const { timeAgoString, releaseDate } = useMemo(
    () => ({
      timeAgoString: timeAgo({
        timestamp: !isPlaceholder
          ? model.model_created_at
          : placeholderTimestamp,
        now: adjustedNow,
        dontPad: true,
        fullUnitText: true,
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

  return (
    <div className="w-full flex justify-center items-end gap-2">
      <div className="flex-1 min-w-0 flex flex-col items-start pb-px">
        <div className="w-full px-1 flex justify-start flex-wrap">
          <p className="shrink min-w-0 font-light overflow-hidden overflow-ellipsis text-xs text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            <span className="font-medium">
              <PrintIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {printsPerDay.toLocaleString(appLocale, {
                maximumFractionDigits: 1,
              })}
            </span>
            {" daily"}
            <span className="text-muted-more-foreground px-[0.75ch]">
              {"|"}
            </span>
            <span className="font-medium">
              <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
              {boostsPerDay.toLocaleString(appLocale, {
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
        <DateTime
          releaseDate={releaseDate}
          timeAgoString={timeAgoString}
          modelReleaseTimestamp={
            !isPlaceholder ? model.model_created_at : placeholderTimestamp
          }
        />
      </div>
      <ImageSection
        {...(isPlaceholder ? { isPlaceholder: true } : { model, metadata })}
      />
    </div>
  );
}

const fiveMinMs = 5 * 60 * 1000;

function DateTime({
  releaseDate,
  modelReleaseTimestamp,
  timeAgoString,
}: {
  releaseDate: string;
  modelReleaseTimestamp: number;
  timeAgoString: string;
}) {
  const { isOpen, setHeadCutoffTimestamp } = useTimeMachine();
  const [, setModelSort] = useModelSort();
  const [, setModelOrder] = useModelOrder();

  if (isOpen) {
    return (
      <button
        onClick={() => {
          setHeadCutoffTimestamp(modelReleaseTimestamp + fiveMinMs);
          setModelSort("created_at");
          setModelOrder("desc");
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="shrink px-1 text-left group-data-placeholder:hover:text-transparent group-data-placeholder:active:text-transparent hover:text-foreground active:text-foreground rounded bg-border mt-0.5 min-w-0 font-light overflow-hidden overflow-ellipsis text-xs text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
      >
        {timeAgoString}
        <span className="text-muted-more-foreground px-[0.75ch] font-light text-xs">
          {"|"}
        </span>
        {releaseDate}
      </button>
    );
  }

  return (
    <p className="shrink px-1 mt-0.5 min-w-0 font-light overflow-hidden overflow-ellipsis text-xs text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
      {timeAgoString}
      <span className="text-muted-more-foreground px-[0.75ch] font-light text-xs">
        {"|"}
      </span>
      {releaseDate}
    </p>
  );
}

function ImageSection({ model, isPlaceholder }: TProps) {
  if (isPlaceholder) {
    return (
      <div className="w-14 group/link aspect-4/3 border border-border rounded-br-[0.9rem] -mr-2 relative outline-0 transition duration-150 active:ring-[1.5px] hover:ring-[1.5px] ring-0 focus-visible:ring-[1.5px] ring-foreground/50 -mb-2 bg-border rounded-tl-lg overflow-hidden group-data-placeholder:animate-pulse" />
    );
  }

  return (
    <Link
      href={getModelUrl(model)}
      target="_blank"
      className="w-14 group/link aspect-4/3 border border-border rounded-br-[0.9rem] -mr-2 relative outline-0 transition duration-150 active:ring-[1.5px] hover:ring-[1.5px] ring-0 focus-visible:ring-[1.5px] ring-foreground/50 -mb-2 bg-border rounded-tl-lg overflow-hidden group-data-placeholder:animate-pulse"
    >
      <Image
        src={model.image}
        alt={model.title}
        width={1916}
        height={1437}
        className="w-full shrink-0 h-auto bg-border relative z-0"
        sizes="56px"
      />
      <div className="w-full group/link z-10 overflow-hidden opacity-0 group-focus-visible/link:opacity-100 group-active/link:opacity-100 group-hover/link:opacity-100 duration-150 flex items-center justify-center h-full absolute left-0 top-0 bg-background/75">
        <ExternalLink className="size-5 translate-y-3 group-active/link:opacity-100 group-active/link:translate-y-0 group-focus-visible/link:opacity-100 group-focus-visible/link:translate-y-0 group opacity-0 group-hover/link:opacity-100 duration-150 group-hover/link:translate-y-0 transition" />
      </div>
    </Link>
  );
}
