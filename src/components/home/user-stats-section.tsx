"use client";

import { useStats } from "@/components/providers/stats-provider";
import { appLocale } from "@/lib/constants";
import {
  BoxIcon,
  DownloadIcon,
  RocketIcon,
  ThumbsUp,
  UsersIcon,
} from "lucide-react";

export default function UserStatsSection() {
  const { data, isPending, isError } = useStats();
  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          Couldn't load user stats :(
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Stat
        value={data?.user.stats.current.prints || 1000}
        delta1h={data?.user.stats.delta_1h.prints || 10}
        delta24h={data?.user.stats.delta_24h.prints || 10}
        Icon={BoxIcon}
        isPlaceholder={isPending}
      />
      <Stat
        value={data?.user.stats.current.downloads || 2000}
        delta1h={data?.user.stats.delta_1h.downloads || 10}
        delta24h={data?.user.stats.delta_24h.downloads || 10}
        Icon={DownloadIcon}
        isPlaceholder={isPending}
      />
      <Stat
        value={data?.user.stats.current.boosts || 100}
        delta1h={data?.user.stats.delta_1h.boosts || 1}
        delta24h={data?.user.stats.delta_24h.boosts || 10}
        Icon={RocketIcon}
        isPlaceholder={isPending}
      />
      <Stat
        value={data?.user.stats.current.likes || 1000}
        delta1h={data?.user.stats.delta_1h.likes || 10}
        delta24h={data?.user.stats.delta_24h.likes || 100}
        Icon={ThumbsUp}
        isPlaceholder={isPending}
      />
      <Stat
        value={data?.user.stats.current.followers || 500}
        delta1h={data?.user.stats.delta_1h.followers || 10}
        delta24h={data?.user.stats.delta_24h.followers || 10}
        Icon={UsersIcon}
        isPlaceholder={isPending}
      />
      {/* <Stat
        value={data?.user.stats.current.following}
        delta1h={data?.user.stats.delta_1h.following}
        delta24h={data?.user.stats.delta_24h.following}
        Icon={ContactIcon}
        isPlaceholder={isPending}
      /> */}
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-wrap flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4">
      {children}
    </div>
  );
}

function Stat({
  value,
  delta1h,
  delta24h,
  Icon,
  isPlaceholder,
}: {
  value: number;
  delta1h: number;
  delta24h: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPlaceholder?: boolean;
}) {
  return (
    <div
      data-placeholder={isPlaceholder ? true : undefined}
      className="flex shrink min-w-0 overflow-hidden flex-col px-2 md:px-3 group gap-0.5 font-mono"
    >
      <div className="flex items-center gap-0.75 font-semibold overflow-hidden overflow-ellipsis">
        <Icon className="size-3.5 shrink-0 group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent" />
        <p className="shrink leading-tight min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded-sm group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent">
          {value.toLocaleString(appLocale)}
        </p>
      </div>
      <div className="shrink min-w-0 overflow-hidden flex flex-col text-sm gap-px">
        <div
          data-positive={delta1h > 0 ? true : undefined}
          className="shrink min-w-0 overflow-hidden flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          {/* <div className="size-3.5 shrink-0" /> */}
          <p className="shrink min-w-0 leading-tight overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            +{delta1h.toLocaleString(appLocale)}
          </p>
        </div>
        <div
          data-positive={delta24h > 0 ? true : undefined}
          className="shrink min-w-0 overflow-hidden flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          {/* <div className="size-3.5 shrink-0" /> */}
          <p className="shrink min-w-0 leading-tight overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            +{delta24h.toLocaleString(appLocale)}
          </p>
        </div>
      </div>
    </div>
  );
}
