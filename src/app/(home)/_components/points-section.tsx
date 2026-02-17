"use client";

import { useStats } from "@/components/providers/stats-provider";
import { appLocale } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function PointsSection() {
  const { data, isPending, isError } = useStats();
  return (
    <div
      data-pending={isPending ? true : undefined}
      data-error={!isPending && isError ? true : undefined}
      className="w-full flex items-center justify-center pt-2.5 overflow-hidden group"
    >
      <PointsColumn
        label="Exclusive"
        value={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "1,000"
              : data.points.exclusive_points.toLocaleString(appLocale)
        }
        className="items-end"
        classNameText="text-right"
      />
      <div className="w-full md:w-px py-2 md:py-px flex items-center justify-center md:self-stretch">
        <div className="w-1/2 md:w-full bg-border h-px md:h-full rounded-full" />
      </div>
      <PointsColumn
        label="Regular"
        value={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "1,000"
              : data.points.regular_points.toLocaleString(appLocale)
        }
        className="items-start"
        classNameText="text-left"
      />
    </div>
  );
}

function PointsColumn({
  label,
  value,
  className,
  classNameText,
}: {
  label: string;
  value: string;
  className?: string;
  classNameText?: string;
}) {
  return (
    <div
      className={cn(
        "w-1/2 flex flex-col items-center px-3 gap-0.75",
        className,
      )}
    >
      <p
        className={cn(
          "max-w-full group-data-pending:text-transparent group-data-pending:bg-muted-more-foreground group-data-pending:animate-pulse group-data-pending:rounded whitespace-nowrap min-w-0 overflow-ellipsis overflow-hidden text-xs text-muted-foreground",
          classNameText,
          "leading-tight",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "max-w-full group-data-pending:text-transparent group-data-pending:bg-muted-foreground group-data-pending:animate-pulse group-data-pending:rounded-md group-data-error:text-destructive whitespace-nowrap min-w-0 font-semibold overflow-hidden overflow-ellipsis font-mono text-sm",
          classNameText,
          "leading-tight",
        )}
      >
        {value}
      </p>
    </div>
  );
}
