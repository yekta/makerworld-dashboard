import { cn } from "@/lib/utils";

export default function RefetchIndicator({
  isPending,
  isRefetching,
  isError,
  className,
}: {
  isPending: boolean;
  isRefetching: boolean;
  isError: boolean;
  className?: string;
}) {
  return (
    <div
      data-error={!isPending && !isRefetching && isError ? true : undefined}
      data-fetching={isRefetching || isPending ? true : undefined}
      className={cn(
        "size-1 rounded-full bg-success data-fetching:bg-pending data-fetching:animate-pulse data-error:bg-destructive",
        className,
      )}
    ></div>
  );
}
