import { appLocale } from "@/lib/constants";
import useFlashOnChange from "@/lib/hooks/use-flash-on-change";
import { cn } from "@/lib/utils";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { useEffect, useRef, useState } from "react";

type TUserOrModelStat =
  | {
      stats: AppRouterOutputs["stats"]["get"]["models"][number]["stats"];
      statKey: keyof AppRouterOutputs["stats"]["get"]["models"][number]["stats"]["current"];
      statType: "model";
      isPlaceholder?: never;
    }
  | {
      stats: AppRouterOutputs["stats"]["get"]["user"]["stats"];
      statKey: keyof AppRouterOutputs["stats"]["get"]["user"]["stats"]["current"];
      statType: "user";
      isPlaceholder?: never;
    }
  | {
      stats?: never;
      statKey:
        | keyof AppRouterOutputs["stats"]["get"]["models"][number]["stats"]["current"]
        | keyof AppRouterOutputs["stats"]["get"]["user"]["stats"]["current"];
      statType: "model" | "user";
      isPlaceholder: true;
    };

export default function Stat({
  stats,
  statKey,
  statType,
  isPlaceholder,
  showPrevDayStats = false,
  showTimeRange = false,
  Icon,
  className,
}: TUserOrModelStat & {
  showPrevDayStats?: boolean;
  showTimeRange?: boolean;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}) {
  return (
    <div
      data-placeholder={isPlaceholder ? true : undefined}
      className={cn(
        "flex shrink min-w-0 flex-col text-sm gap-px group font-mono",
        className
      )}
    >
      <MainStat
        value={
          isPlaceholder
            ? 100
            : statType === "model"
            ? stats.current[statKey]
            : stats.current[statKey]
        }
        Icon={Icon}
        isPlaceholder={isPlaceholder}
      />
      <div className="shrink min-w-0 overflow-hidden flex flex-col text-xs mt-px gap-px">
        <StatDelta
          value={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_0-1h"][statKey]
              : stats["delta_0-1h"][statKey]
          }
          prevDayValue={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_24-25h"][statKey]
              : stats["delta_24-25h"][statKey]
          }
          showPrevDayStats={showPrevDayStats}
          timeRangeLabel={showTimeRange ? "01H" : undefined}
        />
        <StatDelta
          value={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_0-4h"][statKey]
              : stats["delta_0-4h"][statKey]
          }
          prevDayValue={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_24-28h"][statKey]
              : stats["delta_24-28h"][statKey]
          }
          showPrevDayStats={showPrevDayStats}
          timeRangeLabel={showTimeRange ? "04H" : undefined}
        />
        <StatDelta
          value={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_0-12h"][statKey]
              : stats["delta_0-12h"][statKey]
          }
          prevDayValue={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_24-36h"][statKey]
              : stats["delta_24-36h"][statKey]
          }
          showPrevDayStats={showPrevDayStats}
          timeRangeLabel={showTimeRange ? "12H" : undefined}
        />
        <StatDelta
          value={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_0-24h"][statKey]
              : stats["delta_0-24h"][statKey]
          }
          prevDayValue={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_24-48h"][statKey]
              : stats["delta_24-48h"][statKey]
          }
          showPrevDayStats={showPrevDayStats}
          timeRangeLabel={showTimeRange ? "24H" : undefined}
          highlight={true}
        />
        <StatDelta
          value={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_0-168h"][statKey]
              : stats["delta_0-168h"][statKey]
          }
          prevDayValue={
            isPlaceholder
              ? 100
              : statType === "model"
              ? stats["delta_168-336h"][statKey]
              : stats["delta_168-336h"][statKey]
          }
          showPrevDayStats={showPrevDayStats}
          timeRangeLabel={showTimeRange ? "07D" : undefined}
        />
      </div>
    </div>
  );
}

function StatDelta({
  value,
  prevDayValue,
  showPrevDayStats = false,
  timeRangeLabel,
  highlight = false,
}: {
  value: number;
  prevDayValue: number;
  showPrevDayStats?: boolean;
  timeRangeLabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      data-positive={value > 0 ? true : undefined}
      data-highlight={highlight ? true : undefined}
      className="flex items-center gap-1 text-muted-foreground data-positive:text-success group/delta"
    >
      <p className="shrink leading-tight min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
        {timeRangeLabel !== undefined && (
          <span className="text-muted-more-foreground relative group/span group-data-placeholder:text-transparent text-xxs leading-tight mr-[0.25ch]">
            {timeRangeLabel}:
          </span>
        )}
        +{value.toLocaleString(appLocale)}
        {showPrevDayStats && (
          <span className="text-muted-foreground text-xxs leading-tight group-data-placeholder:text-transparent">
            <span className="px-[0.35ch] text-muted-more-foreground">|</span>
            {prevDayValue.toLocaleString(appLocale)}
          </span>
        )}
      </p>
    </div>
  );
}

function MainStat({
  value,
  Icon,
  isPlaceholder,
}: {
  value: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPlaceholder?: boolean;
}) {
  const shouldFlash = useFlashOnChange(value, {
    enabled: !isPlaceholder,
    duration: 8000,
  });
  const [canFlash, setCanFlash] = useState(false);
  const canFlashTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaceholder) {
      canFlashTimeoutRef.current = window.setTimeout(() => {
        setCanFlash(true);
        canFlashTimeoutRef.current = null;
      }, 500);
    }
    return () => {
      if (canFlashTimeoutRef.current !== null) {
        clearTimeout(canFlashTimeoutRef.current);
        canFlashTimeoutRef.current = null;
      }
    };
  }, [isPlaceholder]);

  return (
    <div
      data-can-flash={canFlash ? true : undefined}
      data-flash={shouldFlash ? true : undefined}
      className="flex shrink mr-auto min-w-0 items-center gap-0.75 font-semibold py-px group/main relative"
    >
      <div className="absolute -left-1 top-0 w-[calc(100%+0.55rem)] h-full rounded-sm bg-success-highlight/0 group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 group-data-flash/main:bg-success-highlight/20" />
      <Icon className="group-data-flash/main:text-success-highlight text-foreground group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 size-3 shrink-0 group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent" />
      <p className="group-data-flash/main:text-success-highlight text-foreground group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 shrink min-w-0 overflow-hidden leading-tight overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent">
        {value.toLocaleString(appLocale)}
      </p>
    </div>
  );
}
