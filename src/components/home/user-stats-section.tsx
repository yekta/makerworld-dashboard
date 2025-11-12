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
        delta1h={data ? data.user.stats.delta_1h.prints : 10}
        delta4h={data ? data.user.stats.delta_4h.prints : 10}
        delta12h={data ? data.user.stats.delta_12h.prints : 10}
        delta24h={data ? data.user.stats.delta_24h.prints : 10}
        delta48h={data ? data.user.stats.delta_48h.prints : 10}
        Icon={BoxIcon}
        isPlaceholder={isPending}
        show48hDelta={true}
      />
      <Stat
        value={data ? data.user.stats.current.downloads : 2000}
        delta1h={data ? data.user.stats.delta_1h.downloads : 10}
        delta4h={data ? data.user.stats.delta_4h.downloads : 10}
        delta12h={data ? data.user.stats.delta_12h.downloads : 10}
        delta24h={data ? data.user.stats.delta_24h.downloads : 10}
        delta48h={data ? data.user.stats.delta_48h.downloads : 10}
        Icon={DownloadIcon}
        isPlaceholder={isPending}
      />
      <Stat
        value={data ? data.user.stats.current.boosts : 100}
        delta1h={data ? data.user.stats.delta_1h.boosts : 1}
        delta4h={data ? data.user.stats.delta_4h.boosts : 1}
        delta12h={data ? data.user.stats.delta_12h.boosts : 1}
        delta24h={data ? data.user.stats.delta_24h.boosts : 10}
        delta48h={data ? data.user.stats.delta_48h.boosts : 10}
        Icon={RocketIcon}
        isPlaceholder={isPending}
      />
      <Stat
        value={data ? data.user.stats.current.likes : 1000}
        delta1h={data ? data.user.stats.delta_1h.likes : 10}
        delta4h={data ? data.user.stats.delta_4h.likes : 10}
        delta12h={data ? data.user.stats.delta_12h.likes : 10}
        delta24h={data ? data.user.stats.delta_24h.likes : 100}
        delta48h={data ? data.user.stats.delta_48h.likes : 100}
        Icon={ThumbsUp}
        isPlaceholder={isPending}
      />
      <Stat
        value={data ? data.user.stats.current.followers : 500}
        delta1h={data ? data.user.stats.delta_1h.followers : 10}
        delta4h={data ? data.user.stats.delta_4h.followers : 10}
        delta12h={data ? data.user.stats.delta_12h.followers : 10}
        delta24h={data ? data.user.stats.delta_24h.followers : 10}
        delta48h={data ? data.user.stats.delta_48h.followers : 10}
        Icon={UsersIcon}
        isPlaceholder={isPending}
      />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-wrap flex items-center justify-center gap-4 md:gap-8 px-2 md:px-4">
      {children}
    </div>
  );
}
