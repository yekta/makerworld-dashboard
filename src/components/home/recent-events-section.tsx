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
      className="w-full py-2.5 md:py-3 flex items-center justify-center text-xs group"
    >
      {children}
    </div>
  );
}

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-foreground">{children}</span>
);

function getRecentEventsText(
  data: AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>["data"]
) {
  if (!data) return "No events in the last 15 minutes.";

  const boostsInLast15Min = data.user.stats.delta_0_25h.boosts;
  const printsInLast15Min = data.user.stats.delta_0_25h.prints;
  const downloadsInLast15Min = data.user.stats.delta_0_25h.downloads;
  const followersInLast15Min = data.user.stats.delta_0_25h.followers;

  let text: string[] = [];

  if (boostsInLast15Min > 0) {
    text.push(`${boostsInLast15Min} boost${boostsInLast15Min > 1 ? "s" : ""}`);
  }

  if (printsInLast15Min > 0) {
    text.push(`${printsInLast15Min} print${printsInLast15Min > 1 ? "s" : ""}`);
  }

  if (downloadsInLast15Min > 0) {
    text.push(
      `${downloadsInLast15Min} download${downloadsInLast15Min > 1 ? "s" : ""}`
    );
  }

  if (followersInLast15Min > 0) {
    text.push(
      `${followersInLast15Min} follower${followersInLast15Min > 1 ? "s" : ""}`
    );
  }

  if (text.length > 0) {
    const spans = text.map((item, index) => (
      <>
        {index > 0 && text.length === 2
          ? " and "
          : index > 0 && index === text.length - 1
          ? ", and "
          : index > 0
          ? ", "
          : ""}
        <Highlight key={index}>{item}</Highlight>
      </>
    ));
    return (
      <span>
        {...spans}
        <span>{" in the last 15 minutes."}</span>
      </span>
    );
  }

  return "No events in the last 15 minutes.";
}
