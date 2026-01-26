"use client";

import { useLeaderboard } from "@/components/providers/leaderboard-provider";
import { appLocale } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ClockIcon,
  DownloadIcon,
  ExternalLinkIcon,
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
  useReactTable,
} from "@tanstack/react-table";

import PrintIcon from "@/components/icons/print-icon";
import { TLeaderboardEntry } from "@/server/trpc/api/leaderboard/types";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

type TRow = TLeaderboardEntry & { rank: number };

const placeholderData: TRow[] = Array.from({ length: 10 }).map((_, index) => ({
  rank: index + 1,
  user_id: index,
  username: `username_${index}`,
  avatar_url: "",
  boosts: 0,
  display_name: `Loading...`,
  downloads: 0,
  prints: 0,
  downloads_api: 0,
  followers: 0,
  following: 0,
  level: 0,
  snapshotted_at: 0,
  user_row_created_at: 0,
  likes: 0,
}));

const defaultCellSize = 110;
const defaultCellSizeMin = 110;
const ROW_HEIGHT = 44; // keep fixed to avoid iOS measure jitter

function CellSpan({
  children,
  className,
  Icon,
}: {
  children: React.ReactNode;
  className?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  if (Icon) {
    return (
      <div
        className={cn(
          "w-full flex gap-1 items-center px-3 shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap",
          className,
        )}
      >
        <Icon className="size-3 shrink-0" />
        <span className="shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {children}
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "px-3 shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default function LeaderboardTable() {
  const { data } = useLeaderboard();

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());
  }, [data]);

  const columns: ColumnDef<TRow>[] = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        size: 65,
        minSize: 65,
        cell: ({ row }) => (
          <CellSpan className="text-muted-foreground sm:pl-4">
            #{parseInt(row.getValue("rank")).toLocaleString(appLocale)}
          </CellSpan>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        size: 150,
        minSize: 150,
        cell: ({ row }) => {
          const username = String(row.getValue("username") ?? "");
          const src = row.original.avatar_url || "/favicon.ico"; // safe fallback (empty src breaks on iOS)
          return (
            <Link
              target="_blank"
              className="group/link hover:bg-border active:bg-border w-full px-3 gap-2.5 h-full flex items-center justify-start"
              href={`https://makerworld.com/@${username}`}
            >
              <div className="size-5 shrink-0 relative">
                <Image
                  className="size-full bg-border rounded-full border border-foreground group-hover/link:opacity-0 group-active/link:opacity-0 group-focus-visible/link:opacity-0 transition-transform group-hover/link:rotate-45 group-active/link:rotate-45 group-focus-visible/link:rotate-45"
                  width={20}
                  height={20}
                  src={src}
                  alt={`${username}'s avatar`}
                />
                <ExternalLinkIcon className="size-full scale-90 absolute left-0 top-0 -rotate-45 group-hover/link:rotate-0 group-active/link:rotate-0 group-focus-visible/link:rotate-0 opacity-0 group-hover/link:opacity-100 group-active/link:opacity-100 group-focus-visible/link:opacity-100 transition-transform" />
              </div>
              <CellSpan className="px-0">{username}</CellSpan>
            </Link>
          );
        },
      },
      {
        accessorKey: "prints",
        header: "Prints",
        size: defaultCellSize,
        minSize: defaultCellSizeMin,
        cell: ({ row }) => (
          <CellSpan Icon={PrintIcon}>
            {parseInt(row.getValue("prints")).toLocaleString(appLocale)}
          </CellSpan>
        ),
      },
      {
        accessorKey: "downloads",
        header: "Downloads",
        size: defaultCellSize,
        minSize: defaultCellSizeMin,
        cell: ({ row }) => (
          <CellSpan Icon={DownloadIcon}>
            {parseInt(row.getValue("downloads")).toLocaleString(appLocale)}
          </CellSpan>
        ),
      },
      {
        accessorKey: "boosts",
        header: "Boosts",
        size: defaultCellSize,
        minSize: defaultCellSizeMin,
        cell: ({ row }) => (
          <CellSpan Icon={RocketIcon}>
            {parseInt(row.getValue("boosts")).toLocaleString(appLocale)}
          </CellSpan>
        ),
      },
      {
        accessorKey: "followers",
        header: "Followers",
        size: defaultCellSize,
        minSize: defaultCellSizeMin,
        cell: ({ row }) => (
          <CellSpan Icon={UsersIcon}>
            {parseInt(row.getValue("followers")).toLocaleString(appLocale)}
          </CellSpan>
        ),
      },
      {
        accessorKey: "snapshotted_at",
        header: "Snapshot",
        size: 140,
        minSize: 140,
        cell: ({ row }) => (
          <CellSpan Icon={ClockIcon} className="text-muted-foreground">
            {new Intl.RelativeTimeFormat(appLocale, {
              style: "short",
            }).format(
              Math.round(
                (parseInt(row.getValue("snapshotted_at")) - now) / 1000 / 60,
              ),
              "minutes",
            )}
          </CellSpan>
        ),
      },
    ],
    [now],
  );

  const tableData = useMemo(() => {
    if (!data) return placeholderData;
    return data.data.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
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

  return (
    <div className="w-full text-sm font-mono">
      <div className="sticky pt-1 sm:pt-2 top-0 bg-background z-20">
        <div className="border rounded-t-xl bg-background w-full overflow-hidden">
          <div ref={stickyHeaderRef} className="overflow-auto scrollbar-hidden">
            <div className="min-w-max">
              {table.getHeaderGroups().map((hg) => (
                <div key={hg.id} className="flex w-full">
                  {hg.headers.map((header) => (
                    <div
                      key={header.id}
                      data-sticky={
                        header.column.id === "username" ? true : undefined
                      }
                      className="font-semibold text-muted-foreground px-3 py-2 first:sm:pl-4 text-left shrink-0 data-sticky:sticky data-sticky:bg-background data-sticky:left-0"
                      style={{
                        width: header.getSize(),
                        flex: `1 0 ${header.getSize()}px`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  ))}
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
                    className="flex min-w-full border-b last:border-b-0 border-border data-odd:bg-background-secondary group"
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
                        className="items-center flex shrink-0 data-sticky:sticky data-sticky:bg-background data-sticky:left-0 group-data-odd:data-sticky:bg-background-secondary"
                        style={{
                          width: cell.column.getSize(),
                          flex: `1 0 ${cell.column.getSize()}px`,
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
