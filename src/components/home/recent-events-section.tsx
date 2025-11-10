"use client";

import { useStats } from "@/components/providers/stats-provider";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { BoxIcon, DownloadIcon, RocketIcon, UsersIcon } from "lucide-react";

export default function RecentEventsSection() {
  const { data, isPending, isError } = useStats();
  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          Couldn't load metadata :(
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper isPending={isPending}>
      <Section data={data} />
    </Wrapper>
  );
}

function Section({
  data,
}: {
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"];
}) {
  const text = getRecentEventsText(data);
  return (
    <p
      suppressHydrationWarning
      className="shrink whitespace-nowrap leading-normal text-center px-3 text-muted-foreground min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
    >
      {text}
    </p>
  );
}

function Wrapper({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) {
  return (
    <div
      data-placeholder={isPending ? true : undefined}
      className="w-full py-2.5 md:py-3 flex items-center justify-center text-xs group"
    >
      {children}
    </div>
  );
}

function getRecentEventsText(
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"]
) {
  const noEventsText = "No events in the last 15 minutes.";
  if (!data) return noEventsText;

  const boostsInLast15Min = data.user.stats.delta_0_25h.boosts;
  const printsInLast15Min = data.user.stats.delta_0_25h.prints;
  const downloadsInLast15Min = data.user.stats.delta_0_25h.downloads;
  const followersInLast15Min = data.user.stats.delta_0_25h.followers;

  let stats: { value: number; Icon: React.ElementType; label: string }[] = [];

  if (boostsInLast15Min > 0) {
    stats.push({
      value: boostsInLast15Min,
      Icon: RocketIcon,
      label: "boost",
    });
  }

  if (printsInLast15Min > 0) {
    stats.push({
      value: printsInLast15Min,
      Icon: BoxIcon,
      label: "print",
    });
  }

  if (downloadsInLast15Min > 0) {
    stats.push({
      value: downloadsInLast15Min,
      Icon: DownloadIcon,
      label: "download",
    });
  }

  if (followersInLast15Min > 0) {
    stats.push({
      value: followersInLast15Min,
      Icon: UsersIcon,
      label: "follower",
    });
  }

  if (stats.length > 0) {
    const spans = stats.map((item, index) => (
      <span key={index}>
        {index > 0 && stats.length === 2
          ? " and "
          : index > 0 && index === stats.length - 1
          ? ", and "
          : index > 0
          ? ", "
          : ""}
        <span className="text-foreground">
          <item.Icon className="inline-block size-2.75 mb-px mr-[0.2ch]" />
          {item.value} {item.label}
          {item.value > 1 ? "s" : ""}
        </span>
      </span>
    ));
    return (
      <span>
        {...spans}
        <span>{" in the last 15 minutes."}</span>
      </span>
    );
  }

  return noEventsText;
}
