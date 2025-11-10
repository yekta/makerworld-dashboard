"use client";

import { useStats } from "@/components/providers/stats-provider";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";

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
      className="w-full flex items-center justify-center mt-2 md:mt-3 text-xs group"
    >
      {children}
    </div>
  );
}

function getRecentEventsText(
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"]
) {
  if (!data) return "No recent events.";

  const printsInLast10Min = data.user.stats.delta_0_25h.prints;
  const downloadsInLast10Min = data.user.stats.delta_0_25h.downloads;

  if (printsInLast10Min > 0 && downloadsInLast10Min > 0) {
    return (
      <span>
        <span className="text-foreground">
          {`${printsInLast10Min} print${printsInLast10Min > 1 ? "s" : ""}`}
        </span>
        {" & "}
        <span className="text-foreground">
          {`${downloadsInLast10Min} download${
            downloadsInLast10Min > 1 ? "s" : ""
          }`}
        </span>
        {` in the last 10 minutes.`}
      </span>
    );
  }

  if (printsInLast10Min > 0) {
    return (
      <span>
        <span className="text-foreground">
          {`${printsInLast10Min} print${printsInLast10Min > 1 ? "s" : ""}`}
        </span>
        {` in the last 10 minutes.`}
      </span>
    );
  }

  if (downloadsInLast10Min > 0) {
    return (
      <span>
        <span className="text-foreground">
          {`${downloadsInLast10Min} download${
            downloadsInLast10Min > 1 ? "s" : ""
          }`}
        </span>
        {` in the last 10 minutes.`}
      </span>
    );
  }

  return "No recent events.";
}
