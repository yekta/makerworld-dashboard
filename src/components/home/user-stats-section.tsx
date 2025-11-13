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
        statType="user"
        statKey="prints"
        {...(isPending ? { isPlaceholder: true } : { stats: data.user.stats })}
        Icon={BoxIcon}
        showPrevDayStats={true}
        showTimeRange={true}
      />
      <Stat
        statType="user"
        statKey="downloads"
        {...(isPending ? { isPlaceholder: true } : { stats: data.user.stats })}
        Icon={DownloadIcon}
        showPrevDayStats={true}
      />
      <Stat
        statType="user"
        statKey="boosts"
        {...(isPending ? { isPlaceholder: true } : { stats: data.user.stats })}
        Icon={RocketIcon}
        showPrevDayStats={true}
      />
      <Stat
        statType="user"
        statKey="likes"
        {...(isPending ? { isPlaceholder: true } : { stats: data.user.stats })}
        Icon={ThumbsUp}
        showPrevDayStats={true}
      />
      <Stat
        statType="user"
        statKey="followers"
        {...(isPending ? { isPlaceholder: true } : { stats: data.user.stats })}
        Icon={UsersIcon}
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
