"use client";

import { useRegion } from "@/app/(home)/_components/filters-section/hooks";
import PrintIcon from "@/components/icons/print-icon";
import { useStats } from "@/components/providers/stats-provider";
import Stat from "@/components/stat";
import { DownloadIcon, RocketIcon, UsersIcon } from "lucide-react";

export default function UserStatsSection() {
  const { data, isPending, isError } = useStats();
  const [region] = useRegion();

  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          {`Couldn't load user stats :(`}
        </p>
      </Wrapper>
    );
  }

  const selectedData =
    region === "china" ? data?.user.stats_cn : data?.user.stats;
  const selectedRecords =
    region === "china" ? data?.user.records_cn : data?.user.records;

  return (
    <Wrapper>
      <Stat
        statType="user"
        statKey="prints"
        {...(isPending || !selectedData || !selectedRecords
          ? { isPlaceholder: true }
          : { stats: selectedData, records: selectedRecords })}
        Icon={PrintIcon}
        showPrevDayStats={true}
        showTimeRange={true}
        isUnaffectedByFilters={true}
      />
      <Stat
        statType="user"
        statKey="downloads"
        {...(isPending || !selectedData || !selectedRecords
          ? { isPlaceholder: true }
          : { stats: selectedData, records: selectedRecords })}
        Icon={DownloadIcon}
        showPrevDayStats={true}
        isUnaffectedByFilters={true}
      />
      <Stat
        statType="user"
        statKey="boosts"
        {...(isPending || !selectedData || !selectedRecords
          ? { isPlaceholder: true }
          : { stats: selectedData, records: selectedRecords })}
        Icon={RocketIcon}
        showPrevDayStats={true}
        isUnaffectedByFilters={true}
      />
      <Stat
        statType="user"
        statKey="followers"
        {...(isPending || !selectedData || !selectedRecords
          ? { isPlaceholder: true }
          : { stats: selectedData, records: selectedRecords })}
        Icon={UsersIcon}
        showPrevDayStats={true}
        isUnaffectedByFilters={true}
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
