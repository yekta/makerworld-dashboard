import { useModelStatVisibilityPreferences } from "@/app/(home)/_components/filters-section/hooks";
import { useNow } from "@/components/providers/now-provider";
import { useTimeMachine } from "@/components/providers/time-machine-provider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type TProps =
  | {
      model: AppRouterOutputs["stats"]["get"]["models"][number];
      metadata: AppRouterOutputs["stats"]["get"]["metadata"];
      isPlaceholder?: never;
      className?: string;
    }
  | {
      model?: never;
      metadata?: never;
      isPlaceholder: true;
      className?: string;
    };

type TChartData = {
  prints: number;
  timestamp: number;
}[];

const placeholderData: TChartData = Array.from({ length: 32 }).map(
  (_, index) => ({
    prints: Math.floor(Math.random() * 75) + 25,
    timestamp: new Date().getTime() - (31 - index) * 24 * 60 * 60 * 1000,
  }),
);

export default function ModelStatsChart({
  model,
  metadata,
  isPlaceholder,
  className,
}: TProps) {
  const { isTravelled } = useTimeMachine();

  const chartConfig = useMemo(
    () => ({
      prints: {
        label: "Prints",
        color: isTravelled ? "var(--warning)" : "var(--success)",
      },
    }),
    [isTravelled],
  ) satisfies ChartConfig;

  const randomNum = useMemo(() => Math.random(), []);

  const now = useNow();
  const dayOfWeek = new Date(now).getDay();

  const prevData = useRef<TChartData | null>(null);

  const chartData: TChartData = useMemo(() => {
    if (isPlaceholder && prevData.current) {
      return prevData.current;
    }
    if (isPlaceholder || !model) {
      return placeholderData;
    }
    const timeframes: (keyof typeof model.stats)[] = [
      "delta_0-24h",
      "delta_24-48h",
      "delta_48-72h",
      "delta_72-96h",
      "delta_96-120h",
      "delta_120-144h",
      "delta_144-168h",
      "delta_168-192h",
      "delta_192-216h",
      "delta_216-240h",
      "delta_240-264h",
      "delta_264-288h",
      "delta_288-312h",
      "delta_312-336h",
      "delta_336-360h",
      "delta_360-384h",
      "delta_384-408h",
      "delta_408-432h",
      "delta_432-456h",
      "delta_456-480h",
      "delta_480-504h",
      "delta_504-528h",
      "delta_528-552h",
      "delta_552-576h",
      "delta_576-600h",
      "delta_600-624h",
      "delta_624-648h",
      "delta_648-672h",
      "delta_672-696h",
      "delta_696-720h",
      "delta_720-744h",
      "delta_744-768h",
    ];
    const timeframeTimestamps: (keyof typeof metadata)[] = timeframes.map(
      (timeframe) => (timeframe + "_timestamp") as keyof typeof metadata,
    );
    const data: TChartData = timeframes
      .map((timeframe, index) => ({
        prints: model.stats[timeframe].prints,
        timestamp: metadata[timeframeTimestamps[index]] + 24 * 60 * 60 * 1000,
      }))
      .reverse();
    return data;
  }, [model, metadata, isPlaceholder, dayOfWeek]);

  const [modelStatVisibilityPreferences] = useModelStatVisibilityPreferences();

  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const isAnimationActiveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaceholder) return;
    prevData.current = chartData;
  }, [isPlaceholder, chartData]);

  useEffect(() => {
    if (isPlaceholder) {
      setIsAnimationActive(false);
      return;
    }

    if (isAnimationActiveTimeout.current) {
      clearTimeout(isAnimationActiveTimeout.current);
    }
    isAnimationActiveTimeout.current = setTimeout(() => {
      setIsAnimationActive(true);
    }, 500);

    return () => {
      if (isAnimationActiveTimeout.current) {
        clearTimeout(isAnimationActiveTimeout.current);
      }
    };
  }, [isPlaceholder]);

  if (!modelStatVisibilityPreferences.includes("chart")) {
    return null;
  }

  return (
    <div
      data-placeholder={isPlaceholder ? true : undefined}
      className={cn("w-full h-24 pt-1 relative z-10 group", className)}
    >
      <ChartContainer config={chartConfig} className="w-full h-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          width="100%"
          height="100%"
          margin={{
            left: 4,
            right: 4,
            top: 4,
            bottom: 4,
          }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            hide
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: number) => format(new Date(value), "EEE")}
          />
          {!isPlaceholder && (
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(_value, payload) => {
                    const ts = payload?.[0]?.payload?.timestamp as
                      | number
                      | undefined;
                    if (!ts) return null;
                    const date = new Date(ts);
                    const nowDate = new Date(now);
                    if (date.getFullYear() !== nowDate.getFullYear()) {
                      return format(date, "EEEE, do (MMM. yyyy)");
                    }
                    if (date.getMonth() !== nowDate.getMonth()) {
                      return format(date, "EEEE, do (MMM)");
                    }

                    return format(date, "EEEE, do");
                  }}
                />
              }
            />
          )}
          <defs>
            <linearGradient id="fillPrints" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={
                  isPlaceholder
                    ? "var(--muted-foreground)"
                    : "var(--color-prints)"
                }
                stopOpacity={0.08}
              />
              <stop
                offset="95%"
                stopColor={
                  isPlaceholder
                    ? "var(--muted-foreground)"
                    : "var(--color-prints)"
                }
                stopOpacity={0.08}
              />
            </linearGradient>
          </defs>
          <Area
            animationDuration={isPlaceholder ? 0 : 500}
            isAnimationActive={isAnimationActive}
            type="bump"
            dataKey="prints"
            fill="url(#fillPrints)"
            fillOpacity={1}
            stroke={
              isPlaceholder ? "var(--muted-foreground)" : "var(--color-prints)"
            }
            strokeOpacity={0.32}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
