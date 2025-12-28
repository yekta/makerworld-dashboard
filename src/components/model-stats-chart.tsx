import { useModelStatVisibilityPreferences } from "@/components/home/filters-section/hooks";
import { useNow } from "@/components/providers/now-provider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { appLocale } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type TProps =
  | {
      model: AppRouterOutputs["stats"]["get"]["models"][number];
      isPlaceholder?: never;
      className?: string;
    }
  | {
      model?: never;
      isPlaceholder: true;
      className?: string;
    };

const chartConfig = {
  prints: {
    label: "Prints",
    color: "var(--success)",
  },
} satisfies ChartConfig;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const placeholderData = Array.from({ length: 7 }).map((_, index) => ({
  prints: Math.floor(Math.random() * 100),
  day: days[index],
}));

export default function ModelStatsChart({
  model,
  isPlaceholder,
  className,
}: TProps) {
  const now = useNow();
  const dayOfWeek = new Date(now).getDay();
  const chartData = useMemo(() => {
    if (isPlaceholder || !model) {
      return placeholderData;
    }
    const data: { prints: number; day: string }[] = [
      {
        prints: model.stats["delta_168-192h"].prints,
        day: days[(dayOfWeek - 7 + 7) % 7],
      },
      {
        prints: model.stats["delta_144-168h"].prints,
        day: days[(dayOfWeek - 6 + 7) % 7],
      },
      {
        prints: model.stats["delta_120-144h"].prints,
        day: days[(dayOfWeek - 5 + 7) % 7],
      },
      {
        prints: model.stats["delta_96-120h"].prints,
        day: days[(dayOfWeek - 4 + 7) % 7],
      },
      {
        prints: model.stats["delta_72-96h"].prints,
        day: days[(dayOfWeek - 3 + 7) % 7],
      },

      {
        prints: model.stats["delta_48-72h"].prints,
        day: days[(dayOfWeek - 2 + 7) % 7],
      },
      {
        prints: model.stats["delta_24-48h"].prints,
        day: days[(dayOfWeek - 1 + 7) % 7],
      },
      { prints: model.stats["delta_0-24h"].prints, day: days[dayOfWeek] },
    ];
    return data;
  }, [model, isPlaceholder, dayOfWeek]);

  const [modelStatVisibilityPreferences] = useModelStatVisibilityPreferences();

  if (!modelStatVisibilityPreferences.includes("chart")) {
    return null;
  }

  return (
    <div className={cn("w-full h-24", className)}>
      <ChartContainer config={chartConfig} className={"h-full w-full"}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 4,
            right: 4,
            top: 8,
            bottom: 2,
          }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            hide
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillPrints" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-prints)"
                stopOpacity={0.08}
              />
              <stop
                offset="95%"
                stopColor="var(--color-prints)"
                stopOpacity={0.08}
              />
            </linearGradient>
          </defs>
          <Area
            animationDuration={500}
            type="bump"
            dataKey="prints"
            fill="url(#fillPrints)"
            fillOpacity={1}
            stroke="var(--color-prints)"
            strokeOpacity={0.32}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
