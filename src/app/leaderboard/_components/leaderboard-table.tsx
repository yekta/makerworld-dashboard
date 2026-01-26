"use client";

import { TLeaderboardEntry } from "@/server/trpc/api/leaderboard/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useLeaderboard } from "@/components/providers/leaderboard-provider";
import { appLocale } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ExternalLinkIcon } from "lucide-react";

type TRow = TLeaderboardEntry & {
  rank: number;
};

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

function CellSpan({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
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

const columns: ColumnDef<TRow>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    size: 60,
    minSize: 60,
    cell: ({ row }) => (
      <CellSpan className="text-muted-foreground sm:pl-4">
        #{parseInt(row.getValue("rank")).toLocaleString(appLocale)}
      </CellSpan>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    size: 130,
    minSize: 130,
    cell: ({ row }) => (
      <Link
        target="_blank"
        className="group hover:bg-border active:bg-border w-full px-3 gap-2.5 h-full flex items-center justify-start"
        href={`https://makerworld.com/@${row.getValue("username")}`}
      >
        <div className="size-5 shrink-0 relative">
          <Image
            className="size-full rounded-full border border-foreground group-hover:opacity-0 group-active:opacity-0 group-focus-visible:opacity-0 transition-transform group-hover:rotate-45 group-active:rotate-45 group-focus-visible:rotate-45"
            width={20}
            height={20}
            src={row.original.avatar_url}
            alt={`${row.getValue("username")}'s avatar`}
          />
          <ExternalLinkIcon className="size-full scale-90 absolute left-0 top-0 -rotate-45 group-hover:rotate-0 group-active:rotate-0 group-focus-visible:rotate-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100 transition-transform" />
        </div>
        <CellSpan className="px-0">{row.getValue("username")}</CellSpan>
      </Link>
    ),
  },
  {
    accessorKey: "prints",
    header: "Prints",
    size: defaultCellSize,
    minSize: defaultCellSizeMin,
    cell: ({ row }) => (
      <CellSpan>
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
      <CellSpan>
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
      <CellSpan>
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
      <CellSpan>
        {parseInt(row.getValue("followers")).toLocaleString(appLocale)}
      </CellSpan>
    ),
  },
];

import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";

export default function LeaderboardTable() {
  const { data } = useLeaderboard();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(() => {
    if (!data) return placeholderData;
    return data.data.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 44, // start closer to reality
    overscan: 30, // much saner on mobile
    // If row heights can vary, enable measuring:
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div
      ref={tableContainerRef}
      className="w-full border rounded-xl overflow-auto flex-1 min-h-0"
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="font-mono font-semibold text-muted-foreground px-3 py-2 first:sm:pl-4 text-left"
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
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody style={{ position: "relative", height: totalSize }}>
          {virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                ref={rowVirtualizer.measureElement} // important if measuring
                data-odd={virtualRow.index % 2 === 1 ? true : undefined}
                className="flex h-11 w-full border-b last:border-b-0 border-border data-odd:bg-border/50"
                style={{
                  position: "absolute",
                  top: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="font-mono items-center flex"
                    style={{
                      width: cell.column.getSize(),
                      flex: `1 0 ${cell.column.getSize()}px`,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
