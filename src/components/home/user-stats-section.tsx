"use client";

import { useStats } from "@/components/providers/stats-provider";
import Stat from "@/components/stat";
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
        value={data ? data.user.stats.current.prints : 1000}
        delta1h={data ? data.user.stats["delta_0-1h"].prints : 10}
        delta4h={data ? data.user.stats["delta_0-4h"].prints : 10}
        delta12h={data ? data.user.stats["delta_0-12h"].prints : 10}
        delta24h={data ? data.user.stats["delta_0-24h"].prints : 10}
        delta24to25h={data ? data.user.stats["delta_24-25h"].prints : 10}
        delta24to28h={data ? data.user.stats["delta_24-28h"].prints : 10}
        delta24to36h={data ? data.user.stats["delta_24-36h"].prints : 10}
        delta24to48h={data ? data.user.stats["delta_24-48h"].prints : 10}
        Icon={BoxIcon}
        isPlaceholder={isPending}
        showPrevDayStats={true}
        showTimeRange={true}
      />
      <Stat
        value={data ? data.user.stats.current.downloads : 2000}
        delta1h={data ? data.user.stats["delta_0-1h"].downloads : 10}
        delta4h={data ? data.user.stats["delta_0-4h"].downloads : 10}
        delta12h={data ? data.user.stats["delta_0-12h"].downloads : 10}
        delta24h={data ? data.user.stats["delta_0-24h"].downloads : 10}
        delta24to25h={data ? data.user.stats["delta_24-25h"].downloads : 10}
        delta24to28h={data ? data.user.stats["delta_24-28h"].downloads : 10}
        delta24to36h={data ? data.user.stats["delta_24-36h"].downloads : 10}
        delta24to48h={data ? data.user.stats["delta_24-48h"].downloads : 10}
        Icon={DownloadIcon}
        isPlaceholder={isPending}
        showPrevDayStats={true}
      />
      <Stat
        value={data ? data.user.stats.current.boosts : 100}
        delta1h={data ? data.user.stats["delta_0-1h"].boosts : 10}
        delta4h={data ? data.user.stats["delta_0-4h"].boosts : 10}
        delta12h={data ? data.user.stats["delta_0-12h"].boosts : 10}
        delta24h={data ? data.user.stats["delta_0-24h"].boosts : 10}
        delta24to25h={data ? data.user.stats["delta_24-25h"].boosts : 10}
        delta24to28h={data ? data.user.stats["delta_24-28h"].boosts : 10}
        delta24to36h={data ? data.user.stats["delta_24-36h"].boosts : 10}
        delta24to48h={data ? data.user.stats["delta_24-48h"].boosts : 10}
        Icon={RocketIcon}
        isPlaceholder={isPending}
        showPrevDayStats={true}
      />
      <Stat
        value={data ? data.user.stats.current.likes : 1000}
        delta1h={data ? data.user.stats["delta_0-1h"].likes : 10}
        delta4h={data ? data.user.stats["delta_0-4h"].likes : 10}
        delta12h={data ? data.user.stats["delta_0-12h"].likes : 10}
        delta24h={data ? data.user.stats["delta_0-24h"].likes : 10}
        delta24to25h={data ? data.user.stats["delta_24-25h"].likes : 10}
        delta24to28h={data ? data.user.stats["delta_24-28h"].likes : 10}
        delta24to36h={data ? data.user.stats["delta_24-36h"].likes : 10}
        delta24to48h={data ? data.user.stats["delta_24-48h"].likes : 10}
        Icon={ThumbsUp}
        isPlaceholder={isPending}
        showPrevDayStats={true}
      />
      <Stat
        value={data ? data.user.stats.current.followers : 500}
        delta1h={data ? data.user.stats["delta_0-1h"].followers : 10}
        delta4h={data ? data.user.stats["delta_0-4h"].followers : 10}
        delta12h={data ? data.user.stats["delta_0-12h"].followers : 10}
        delta24h={data ? data.user.stats["delta_0-24h"].followers : 10}
        delta24to25h={data ? data.user.stats["delta_24-25h"].followers : 10}
        delta24to28h={data ? data.user.stats["delta_24-28h"].followers : 10}
        delta24to36h={data ? data.user.stats["delta_24-36h"].followers : 10}
        delta24to48h={data ? data.user.stats["delta_24-48h"].followers : 10}
        Icon={UsersIcon}
        isPlaceholder={isPending}
        showPrevDayStats={true}
      />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-wrap flex items-center justify-center gap-4 md:gap-6 px-2 md:px-4">
      {children}
    </div>
  );
}
