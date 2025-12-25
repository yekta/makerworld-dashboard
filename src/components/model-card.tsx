import PrintIcon from "@/components/icons/print-icon";
import { useNow } from "@/components/providers/now-provider";
import Stat from "@/components/stat";
import { appLocale } from "@/lib/constants";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { format } from "date-fns";
import { DownloadIcon, RocketIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type TProps =
  | {
      model: AppRouterOutputs["stats"]["get"]["models"][number];
      isPlaceholder?: never;
    }
  | {
      model?: never;
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
    <Link
      href={getModelUrl(props.model)}
      target="_blank"
      className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 p-1 group rounded-2xl group"
    >
      <ModelCardContent {...props} />
    </Link>
  );
}

function ModelCardContent(props: TProps) {
  const { model, isPlaceholder } = props;
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
      className="p-2 min-h-20 rounded-[14px] group/content flex flex-col gap-1 relative overflow-hidden"
    >
      {/* Flare effect */}
      <div className="w-full h-full absolute right-0 top-0 p-px transition bg-linear-to-bl via-15% from-border via-border to-border group-data-highlighted/content:from-success/40 group-data-highlighted/content:via-border group-highlighted/content:to-border rounded-[14px]">
        <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] absolute right-px top-px bg-background rounded-[13px]" />
        <div className="w-full h-full rounded-[13px] group-active:bg-border group-hover:bg-border relative" />
      </div>
      <div className="opacity-0 transition-opacity duration-300 group-data-highlighted/content:opacity-100 absolute h-1/6 aspect-5/1 translate-x-full -translate-y-full group-data-highlighted/content:translate-x-1/2 group-data-highlighted/content:-translate-y-1/2 top-0 right-0 bg-success/15 blur-xl" />
      <div className="opacity-0 transition-opacity duration-300 group-data-highlighted/content:opacity-100 absolute h-1/4 aspect-5/1 translate-x-full -translate-y-full group-data-highlighted/content:translate-x-1/2 group-data-highlighted/content:-translate-y-1/2 top-0 right-0 bg-success/30 blur-2xl" />
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
      <div className="w-full flex items-center overflow-hidden gap-3 relative px-1">
        <h2 className="text-xs font-light shrink min-w-0 text-muted-foreground whitespace-nowrap overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
          {!isPlaceholder ? model.title : "Loading This Model's Title"}
        </h2>
        {!isPlaceholder &&
          (model.stats["delta_0-0.25h"].boosts > 0 ||
            model.stats["delta_0-0.25h"].prints > 0 ||
            model.stats["delta_0-0.25h"].downloads > 0) && (
            <p className="ml-auto flex shrink-0 max-w-1/2 min-w-0 overflow-hidden gap-2 items-end text-xs text-success font-mono font-medium">
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
      <div className="w-full mt-auto flex justify-start pt-[0.09375rem] relative">
        <Footer {...props} />
      </div>
    </div>
  );
}

function getModelUrl(
  model: AppRouterOutputs["stats"]["get"]["models"][number]
) {
  return `https://makerworld.com/en/models/${model.model_id}-${model.slug}`;
}

const placeholderTimestamp = new Date("2025-01-01T00:00:00Z").getTime();

function Footer({ model, isPlaceholder }: TProps) {
  const now = useNow();
  const sinceCreation = !isPlaceholder
    ? now - model.model_created_at
    : 24 * 60 * 60 * 1000;
  const printsPerDay = !isPlaceholder
    ? model.stats.current.prints / (sinceCreation / (1000 * 60 * 60 * 24))
    : 10;
  const boostRate = !isPlaceholder
    ? (model.stats.current.boosts / (model.stats.current.prints || 1)) * 100
    : 5;

  const { timeAgoString, releaseDate } = useMemo(
    () => ({
      timeAgoString: timeAgo({
        timestamp: !isPlaceholder
          ? model.model_created_at
          : placeholderTimestamp,
        now,
        dontPad: true,
        fullUnitText: true,
      }),
      releaseDate: format(
        new Date(
          !isPlaceholder ? model.model_created_at : placeholderTimestamp
        ),
        "EEE, HH:mm - yyyy-MM-dd"
      ),
    }),
    [isPlaceholder, model, now]
  );

  return (
    <div className="w-full flex justify-center items-end gap-2">
      <div className="flex-1 min-w-0 flex flex-col pb-px">
        <p className="shrink min-w-0 font-light overflow-hidden overflow-ellipsis text-xs px-1 text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
          <span className="font-medium">
            <PrintIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
            {printsPerDay.toLocaleString(appLocale, {
              maximumFractionDigits: 1,
            })}
          </span>
          {" daily"}
          <span className="text-muted-more-foreground px-[0.75ch]">{"|"}</span>
          <span className="font-medium">
            <RocketIcon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
            {boostRate.toLocaleString(appLocale, { maximumFractionDigits: 1 })}
            {"%"}
          </span>
        </p>
        <p
          suppressHydrationWarning
          className="shrink mt-0.5 min-w-0 font-light overflow-hidden overflow-ellipsis text-xs px-1 text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
        >
          {timeAgoString}
          <span className="text-muted-more-foreground px-[0.75ch]">{"|"}</span>
          {releaseDate}
        </p>
      </div>
      <ImageSection model={model} isPlaceholder={isPlaceholder} />
    </div>
  );
}

function ImageSection({
  model,
  isPlaceholder,
}: Pick<TProps, "model" | "isPlaceholder">) {
  return (
    <div className="w-14 aspect-4/3 -mr-2.25 -mb-2.25 bg-border border rounded-tl-lg overflow-hidden group-data-placeholder:animate-pulse">
      {!isPlaceholder && model && (
        <Image
          src={model.image}
          alt={model.title}
          width={1916}
          height={1437}
          className="w-full shrink-0 h-auto bg-border"
          sizes="56px"
        />
      )}
    </div>
  );
}
