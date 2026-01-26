"use client";

import { TLeaderboardEntry } from "@/server/trpc/api/leaderboard/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import { useLeaderboard } from "@/components/providers/leaderboard-provider";
import { appLocale } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      <CellSpan className="text-muted-foreground">
        {parseInt(row.getValue("rank")).toLocaleString(appLocale)}
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
        className="hover:underline w-full px-3 gap-2.5 active:underline h-full flex items-center justify-start"
        href={`https://makerworld.com/@${row.getValue("username")}`}
      >
        <Image
          className="size-5 shrink-0 rounded-full border border-foreground"
          width={20}
          height={20}
          src={row.original.avatar_url}
          alt={`${row.getValue("username")}'s avatar`}
        />
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

export default function LeaderboardTable() {
  const { data } = useLeaderboard();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: !data
      ? placeholderData
      : data.data.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 40,
    overscan: 40,
    scrollMargin: tableContainerRef.current?.offsetTop ?? 0,
  });

  return (
    <div
      ref={tableContainerRef}
      className="w-full border rounded-xl overflow-hidden"
    >
      <table
        className="w-full relative overflow-x-auto text-sm"
        style={{ display: "grid" }}
      >
        <thead
          style={{
            display: "grid",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
          className="bg-background rounded-t-xl border-b"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="w-full"
              key={headerGroup.id}
              style={{ display: "flex", width: "100%" }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    display: "flex",
                    width: header.getSize(),
                    flex: `1 0 ${header.getSize()}px`,
                  }}
                  className="font-mono font-semibold text-muted-foreground px-3 py-2 text-left"
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
        <tbody
          style={{
            display: "grid",
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                data-odd={virtualRow.index % 2 === 1 ? true : undefined}
                style={{
                  display: "flex",
                  position: "absolute",
                  transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                }}
                className="border-b last:border-b-0 border-border data-odd:bg-border/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      display: "flex",
                      width: cell.column.getSize(),
                      flex: `1 0 ${cell.column.getSize()}px`,
                    }}
                    className="font-mono items-center"
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
