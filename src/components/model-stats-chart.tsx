import { useModelStatVisibilityPreferences } from "@/components/home/filters-section/hooks";
import { useNow } from "@/components/providers/now-provider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { format } from "date-fns";
import { useMemo } from "react";
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

const chartConfig = {
  prints: {
    label: "Prints",
    color: "var(--success)",
  },
} satisfies ChartConfig;

const placeholderData = Array.from({ length: 7 }).map((_, index) => ({
  prints: Math.floor(Math.random() * 100),
  timestamp: new Date().getTime() - (6 - index) * 24 * 60 * 60 * 1000,
}));

export default function ModelStatsChart({
  model,
  metadata,
  isPlaceholder,
  className,
}: TProps) {
  const now = useNow();
  const dayOfWeek = new Date(now).getDay();
  const chartData = useMemo(() => {
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
    ];
    const timeframeTimestamps: (keyof typeof metadata)[] = timeframes.map(
      (timeframe) => (timeframe + "_timestamp") as keyof typeof metadata
    );
    const data: { prints: number; timestamp: number }[] = timeframes
      .map((timeframe, index) => ({
        prints: model.stats[timeframe].prints,
        timestamp: metadata[timeframeTimestamps[index]] + 24 * 60 * 60 * 1000,
      }))
      .reverse();
    return data;
  }, [model, isPlaceholder, dayOfWeek]);

  const [modelStatVisibilityPreferences] = useModelStatVisibilityPreferences();

  if (!modelStatVisibilityPreferences.includes("chart")) {
    return null;
  }

  return (
    <div className={cn("w-full h-24 -mb-0.5 pt-1 relative z-10", className)}>
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
