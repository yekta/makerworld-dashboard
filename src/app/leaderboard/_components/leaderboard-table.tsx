"use client";

import { useLeaderboard } from "@/components/providers/leaderboard-provider";
import { appLocale } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MoveDown,
  RocketIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { LEADERBOARD_TABLE_SORT_BY_DEFAULT } from "@/app/leaderboard/_components/constants";
import {
  useLeaderboardSortBy,
  useLeaderboardSortOrder,
} from "@/app/leaderboard/_components/hooks";
import PrintIcon from "@/components/icons/print-icon";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { TLeaderboardEntry } from "@/server/trpc/api/leaderboard/types";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Duration } from "luxon";

type TRow = TLeaderboardEntry & {
  rank: number;
  boost_rate: number;
  since_start: number;
  since_snapshotted_at: number;
};

const placeholderData: TRow[] = Array.from({ length: 100 }).map((_, index) => ({
  rank: index + 1,
  user_id: index,
  username: `username_${index}`,
  display_name: `Loading...`,
  avatar_url: "",
  prints: 10_000,
  prints_24h: 100,
  boosts: 1_000,
  boosts_24h: 100,
  metrics_24h_forecasted_based_on_ms: 1000 * 60 * 60 * 24,
  downloads: 10_000,
  downloads_api: 10_000,
  followers: 10_000,
  following: 1,
  likes: 10_000,
  level: 10,
  user_row_created_at: Date.now() - 1_000_000,
  snapshotted_at: Date.now() - 1000 * 60,
  since_snapshotted_at: 1000 * 60,
  first_model_created_at: Date.now() - 10_000_000,
  since_start: 10_000_000,
  model_count: 100,
  boost_rate: 0.1,
}));

const defaultCellSize = 110;
const smallerCellSize = 90;
const smallestCellSize = 70;
const rankCellSize = 70;
const ROW_HEIGHT = 48;
const isUsernameStickyNegativeMargin = 20;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    noFlex?: boolean;
  }
}

export default function LeaderboardTable() {
  const { data, isPending, error } = useLeaderboard();
  const [now, setNow] = useState(Date.now());

  const [sortBy, setSortBy] = useLeaderboardSortBy();
  const [sortOrder, setSortOrder] = useLeaderboardSortOrder();

  useEffect(() => {
    setNow(Date.now());
  }, [data]);

  const kmbtFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short", // uses K, M, B…
    maximumSignificantDigits: 3,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: sortBy, desc: sortOrder !== "asc" },
  ]);

  const hideRowNumber =
    (sorting && sorting.length === 0) ||
    (sorting &&
      sorting.length > 0 &&
      sorting[0]?.id === LEADERBOARD_TABLE_SORT_BY_DEFAULT);

  const columns: ColumnDef<TRow>[] = useMemo(() => {
    const cols: ColumnDef<TRow>[] = [
      {
        accessorKey: "rank",
        header: "Rank",
        size: rankCellSize,
        minSize: rankCellSize,
        enableSorting: false,
        meta: {
          noFlex: true,
        },
        cell: ({ row, table }) => {
          const rowIndex =
            table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1;
          if (isPending) {
            return (
              <div
                data-hide-row-number={hideRowNumber ? true : undefined}
                className="w-full flex flex-col pb-0.5 data-hide-row-number:pb-0"
              >
                <CellSpan
                  isPending={isPending}
                  muted={true}
                  className="pl-4 w-full"
                >
                  #{parseInt(row.getValue("rank")).toLocaleString(appLocale)}
                </CellSpan>
                {!hideRowNumber && (
                  <div className="pl-4 mt-px text-xs font-bold relative w-full flex">
                    <p className="shrink min-w-0 rounded-xs text-transparent bg-muted-most-foreground animate-pulse leading-none whitespace-normal overflow-hidden overflow-ellipsis">
                      {rowIndex.toLocaleString(appLocale)}
                    </p>
                  </div>
                )}
              </div>
            );
          }
          return (
            <CopyButton
              className="pl-4 w-full"
              textToCopy={row.original.user_id.toString()}
            >
              <div
                data-hide-row-number={hideRowNumber ? true : undefined}
                className="w-full flex flex-col items-start pb-0.5 data-hide-row-number:pb-0"
              >
                <CellSpan
                  isPending={isPending}
                  muted={true}
                  className="px-0 relative group-data-me:text-warning/75"
                >
                  #{parseInt(row.getValue("rank")).toLocaleString(appLocale)}
                </CellSpan>
                {!hideRowNumber && (
                  <div className="mt-px text-xs font-semibold relative w-full flex">
                    <p className="text-left shrink min-w-0 rounded-xs text-muted-most-foreground leading-none whitespace-normal overflow-hidden overflow-ellipsis">
                      {rowIndex.toLocaleString(appLocale)}
                    </p>
                  </div>
                )}
              </div>
            </CopyButton>
          );
        },
      },
      {
        accessorKey: "username",
        header: "Username",
        sortDescFirst: false,
        size: 150,
        minSize: 150,
        cell: ({ row }) => {
          const username = String(row.getValue("username") ?? "");
          const src = row.original.avatar_url;
          const rowIndex =
            table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1;

          if (isPending) {
            return (
              <div className="w-full group-data-username-sticky/container:border-border border-r border-transparent group/link min-w-0 px-3 gap-2 h-full flex items-center justify-start">
                <div className="size-5 shrink-0 relative transition-transform">
                  <div className="animate-pulse size-full bg-muted-more-foreground rounded-full border border-muted-more-foreground transition-transform" />
                </div>
                <div className="w-full flex flex-col group-data-username-sticky/container:-translate-y-0.5 translate-y-1.5 transition-transform overflow-hidden">
                  <CellSpan isPending={isPending} className="px-0">
                    {username}
                  </CellSpan>
                  <div className="w-full flex items-center min-w-0 overflow-hidden opacity-0 group-data-username-sticky/container:opacity-100">
                    <p className="text-xxs leading-tight mt-px text-left max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap transition-transform bg-muted-most-foreground rounded-sm text-transparent">
                      #{row.original.rank}
                    </p>
                    {!hideRowNumber && (
                      <div className="pl-1 mt-px text-xxs font-bold relative shrink min-w-0 flex items-center">
                        <p className="rounded-xs text-transparent bg-muted-most-foreground animate-pulse shrink min-w-0 leading-none whitespace-normal overflow-hidden overflow-ellipsis">
                          {rowIndex.toLocaleString(appLocale)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <Link
              target="_blank"
              className="w-full group-data-username-sticky/container:border-border border-r border-transparent group/link hover:bg-border active:bg-border min-w-0 px-3 gap-2 h-full flex items-center justify-start"
              href={`https://makerworld.com/@${username}`}
            >
              <div className="size-5 shrink-0 relative transition-transform">
                <Image
                  className="size-full group-data-me:border-warning bg-border rounded-full border border-muted-more-foreground group-hover/link:opacity-0 group-active/link:opacity-0 group-focus-visible/link:opacity-0 transition-transform group-hover/link:rotate-45 group-active/link:rotate-45 group-focus-visible/link:rotate-45"
                  width={20}
                  height={20}
                  src={src}
                  alt={`${username}'s avatar`}
                />
                <ExternalLinkIcon className="size-full scale-90 absolute left-0 top-0 -rotate-45 group-hover/link:rotate-0 group-active/link:rotate-0 group-focus-visible/link:rotate-0 opacity-0 group-hover/link:opacity-100 group-active/link:opacity-100 group-focus-visible/link:opacity-100 transition-transform" />
              </div>
              <div className="w-full flex flex-col group-data-username-sticky/container:-translate-y-0.5 translate-y-1.5 transition-transform overflow-hidden">
                <CellSpan isPending={isPending} className="px-0">
                  {username}
                </CellSpan>
                <div className="w-full flex items-center min-w-0 overflow-hidden opacity-0 group-data-username-sticky/container:opacity-100">
                  <p className="text-xxs leading-tight group-data-me:text-warning/75 mt-px text-left opacity-0 shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap transition-transform group-data-username-sticky/container:opacity-100 text-muted-foreground">
                    #{row.original.rank}
                  </p>
                  {!hideRowNumber && (
                    <div className="mt-px text-xxs font-bold relative shrink min-w-0 flex items-center">
                      {!isPending && (
                        <span className="text-muted-most-foreground px-[0.5ch]">
                          |
                        </span>
                      )}
                      <p className="shrink min-w-0 rounded-xs leading-none text-muted-most-foreground whitespace-normal overflow-hidden overflow-ellipsis">
                        {rowIndex.toLocaleString(appLocale)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "prints",
        header: "Prints",
        size: smallerCellSize,
        minSize: smallerCellSize,
        cell: ({ row }) => (
          <CellSpan Icon={PrintIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("prints")))}
          </CellSpan>
        ),
      },
      {
        accessorKey: "prints_24h",
        header: "24h",
        size: smallerCellSize,
        minSize: smallerCellSize,
        cell: ({ row }) => (
          <CellSpan Icon={PrintIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("prints_24h")))}
          </CellSpan>
        ),
        meta: {
          Icon: PrintIcon,
        },
      },
      {
        accessorKey: "downloads",
        header: "Downloads",
        size: defaultCellSize,
        minSize: defaultCellSize,
        cell: ({ row }) => (
          <CellSpan Icon={DownloadIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("downloads")))}
          </CellSpan>
        ),
      },
      {
        accessorKey: "boosts",
        header: "Boosts",
        size: smallerCellSize,
        minSize: smallerCellSize,
        cell: ({ row }) => (
          <CellSpan Icon={RocketIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("boosts")))}
          </CellSpan>
        ),
      },
      {
        accessorKey: "boosts_24h",
        header: "24h",
        size: smallerCellSize,
        minSize: smallerCellSize,
        meta: {
          Icon: RocketIcon,
          noFlex: true,
        },
        cell: ({ row }) => (
          <CellSpan Icon={RocketIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("boosts_24h")))}
          </CellSpan>
        ),
      },
      {
        accessorKey: "boost_rate",
        header: "%",
        size: smallerCellSize,
        minSize: smallerCellSize,
        meta: {
          noFlex: true,
          Icon: RocketIcon,
        },
        cell: ({ row }) => (
          <CellSpan isPending={isPending}>
            {(parseFloat(row.getValue("boost_rate")) * 100).toLocaleString(
              appLocale,
              {
                maximumSignificantDigits: 3,
              },
            )}
            %
          </CellSpan>
        ),
      },
      {
        accessorKey: "followers",
        header: "Followers",
        size: defaultCellSize,
        minSize: defaultCellSize,
        cell: ({ row }) => (
          <CellSpan Icon={UsersIcon} isPending={isPending}>
            {kmbtFormatter.format(parseInt(row.getValue("followers")))}
          </CellSpan>
        ),
      },
      {
        accessorKey: "model_count",
        header: "Models",
        size: smallerCellSize,
        minSize: smallerCellSize,
        cell: ({ row }) => {
          const val = parseInt(row.getValue("model_count"));
          return (
            <CellSpan
              className={val === 0 ? "text-muted-more-foreground" : ""}
              isPending={isPending}
            >
              {val === 0 ? "-----" : val.toLocaleString(appLocale)}
            </CellSpan>
          );
        },
      },
      {
        accessorKey: "since_start",
        header: "Start",
        size: smallerCellSize,
        minSize: smallerCellSize,
        sortDescFirst: false,
        cell: ({ row }) => {
          const val = parseInt(row.getValue("since_start"));
          return (
            <CellSpan
              className={val === 0 ? "text-muted-more-foreground" : ""}
              isPending={isPending}
            >
              {val === 0
                ? "-----"
                : Duration.fromMillis(val).shiftTo("year", "months").toHuman({
                    showZeros: false,
                    unitDisplay: "narrow",
                    maximumFractionDigits: 0,
                  })}
            </CellSpan>
          );
        },
      },
      {
        accessorKey: "since_snapshotted_at",
        header: "",
        size: smallestCellSize,
        minSize: smallestCellSize,
        sortDescFirst: false,
        meta: {
          noFlex: true,
          Icon: ClockIcon,
        },
        cell: ({ row }) => (
          <CellSpan
            className="group-data-me:text-warning/60"
            muted={true}
            isPending={isPending}
          >
            {Duration.fromMillis(parseInt(row.getValue("since_snapshotted_at")))
              .shiftTo("minutes")
              .toHuman({
                showZeros: false,
                unitDisplay: "narrow",
                maximumFractionDigits: 0,
              })}
          </CellSpan>
        ),
      },
    ];
    return cols;
  }, [now, isPending, data, sorting]);

  const tableData = useMemo(() => {
    if (!data) return placeholderData;
    const editedData: TRow[] = data.data.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      boost_rate: entry.boosts / (entry.prints || 1),
      since_start: now - entry.first_model_created_at,
      since_snapshotted_at: now - entry.snapshotted_at,
    }));
    return editedData;
  }, [data, now]);

  useEffect(() => {
    if (sorting.length === 0) {
      setSortBy(null);
      setSortOrder(null);
      return;
    }
    if (sorting[0]?.id) {
      setSortBy(sorting[0].id as any);
    }
    if (sorting[0]?.desc !== undefined) {
      setSortOrder(!sorting[0].desc ? "asc" : "desc");
    }
  }, [sorting]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const rows = table.getRowModel().rows;

  // Used to compute correct offsets when virtualizing against the window
  const listRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const scrollMargin = rowVirtualizer.options.scrollMargin ?? 0;
  const [isUsernameSticky, setIsUsernameSticky] = useState(false);

  if (error && !isPending && !data) {
    return (
      <div className="w-full text-sm font-mono pt-1 sm:pt-2">
        <div className="w-full border rounded-xl px-4 py-3 min-h-svh">
          <p className="w-full text-destructive">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-username-sticky={isUsernameSticky ? true : undefined}
      className="w-full text-sm font-mono group/container"
    >
      <div className="sticky pt-1 sm:pt-2 top-0 bg-background z-20 group">
        <div className="border rounded-t-xl bg-background w-full overflow-hidden">
          <div ref={stickyHeaderRef} className="overflow-auto scrollbar-hidden">
            <div className="min-w-max">
              {table.getHeaderGroups().map((hg) => (
                <div key={hg.id} className="flex w-full">
                  {hg.headers.map((header) => {
                    const Icon = header.column.columnDef.meta?.Icon;

                    return (
                      <Button
                        key={header.id}
                        data-username={
                          header.column.id === "username" ? true : undefined
                        }
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                        variant="ghost"
                        className="w-full data-username:z-10 disabled:opacity-100 bg-background rounded-none gap-0.75 font-semibold flex items-center justify-start data-username:group-data-username-sticky/container:border-border border-r border-transparent text-muted-foreground px-3 py-2 first:sm:pl-4 text-left shrink-0 data-username:sticky data-username:left-0"
                        style={{
                          width: header.getSize(),
                          flex:
                            header.column.columnDef.meta?.noFlex === true
                              ? undefined
                              : `1 0 ${header.getSize()}px`,
                        }}
                      >
                        {header.column.getCanSort() &&
                          header.column.getIsSorted() && (
                            <MoveDown
                              data-asc={
                                header.column.getIsSorted() === "asc"
                                  ? true
                                  : undefined
                              }
                              className="size-3.5 shrink-0 -ml-1.25 data-asc:rotate-180 transition-transform"
                            />
                          )}
                        {Icon && <Icon className="size-3.5 shrink-0" />}
                        <p className="shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </p>
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border border-t-0 rounded-b-xl overflow-hidden">
        <div
          onScroll={(e) => {
            stickyHeaderRef.current?.scrollTo(e.currentTarget.scrollLeft, 0);
            if (
              e.currentTarget.scrollLeft >
              rankCellSize - isUsernameStickyNegativeMargin
            ) {
              setIsUsernameSticky(true);
            } else {
              setIsUsernameSticky(false);
            }
          }}
          className={cn("w-full overflow-x-auto overflow-y-visible")}
        >
          <div className="min-w-max">
            {/* The virtualized "body" */}
            <div
              ref={listRef}
              className="relative"
              style={{ height: totalSize }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    key={row.id}
                    data-odd={virtualRow.index % 2 === 1 ? true : undefined}
                    data-me={
                      row.original.username === env.NEXT_PUBLIC_USERNAME
                        ? true
                        : undefined
                    }
                    className="flex min-w-full data-me:text-warning border-b last:border-b-0 border-border bg-background data-odd:bg-background-secondary group"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                      height: ROW_HEIGHT,
                      // reduces iOS paint jank during fast scroll
                      willChange: "transform",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        data-sticky={
                          cell.column.id === "username" ? true : undefined
                        }
                        className="items-center relative data-sticky:z-50 flex shrink-0 data-sticky:sticky bg-background group-data-odd:bg-background-secondary data-sticky:left-0"
                        style={{
                          width: cell.column.getSize(),
                          flex:
                            cell.column.columnDef.meta?.noFlex === true
                              ? undefined
                              : `1 0 ${cell.column.getSize()}px`,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CellSpan({
  children,
  className,
  Icon,
  isPending,
  muted,
}: {
  children: React.ReactNode;
  className?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPending: boolean;
  muted?: boolean;
}) {
  if (Icon) {
    return (
      <div
        data-pending={isPending ? true : undefined}
        data-muted={muted ? true : undefined}
        className={cn(
          "w-full flex group gap-1 items-center px-3 shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap",
          muted ? "text-muted-foreground" : undefined,
          className,
        )}
      >
        <Icon
          className={
            "size-3 shrink-0 group-data-pending:animate-pulse group-data-pending:text-transparent group-data-pending:bg-muted-more-foreground group-data-pending:group-data-muted:bg-muted-most-foreground group-data-pending:rounded-sm"
          }
        />
        <span className="group-data-pending:animate-pulse group-data-pending:text-transparent group-data-pending:group-data-muted:bg-muted-most-foreground group-data-pending:bg-muted-more-foreground group-data-pending:rounded-sm shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      data-pending={isPending ? true : undefined}
      data-muted={muted ? true : undefined}
      className={cn(
        "group px-3 shrink min-w-0 overflow-hidden flex",
        muted ? "text-muted-foreground" : undefined,
        className,
      )}
    >
      <span
        className={
          "group-data-pending:animate-pulse group-data-pending:text-transparent group-data-pending:bg-muted-more-foreground group-data-pending:group-data-muted:bg-muted-most-foreground group-data-pending:rounded-sm shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
        }
      >
        {children}
      </span>
    </div>
  );
}

function CopyButton({
  textToCopy,
  className,
  children,
}: {
  textToCopy: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { copyToClipboard, isRecentlyCopied } = useCopyToClipboard();
  return (
    <Button
      variant="ghost"
      data-recently-copied={isRecentlyCopied ? true : undefined}
      onClick={() => copyToClipboard(textToCopy)}
      className={cn(
        "h-full group/button font-normal text-muted-foreground relative data-recently-copied:bg-border group/button rounded-none hover:bg-border active:bg-border",
        className,
      )}
    >
      <div className="w-full flex justify-start group-hover/button:opacity-0 group-active/button:opacity-0 group-data-recently-copied/button:opacity-0">
        {children}
      </div>
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center opacity-0 group-hover/button:opacity-100 group-active/button:opacity-100 group-data-recently-copied/button:opacity-100">
        <CopyIcon className="size-3.5 group-data-recently-copied/button:opacity-0 group-data-recently-copied/button:rotate-45 transition-transform" />
        <CheckIcon className="size-4.5 text-success absolute left-1/2 top-1/2 -translate-1/2 opacity-0 group-data-recently-copied/button:opacity-100 -rotate-45 group-data-recently-copied/button:rotate-0 transition-transform" />
      </div>
    </Button>
  );
}
