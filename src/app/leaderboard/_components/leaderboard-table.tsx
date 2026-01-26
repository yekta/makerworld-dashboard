"use client";

import { TLeaderboardEntry } from "@/server/trpc/api/leaderboard/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeaderboard } from "@/components/providers/leaderboard-provider";

const placeholderData: TLeaderboardEntry[] = Array.from({ length: 10 }).map(
  (_, index) => ({
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
  }),
);

const columns: ColumnDef<TLeaderboardEntry>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "prints",
    header: "Prints",
  },
  {
    accessorKey: "downloads",
    header: "Downloads",
  },
  {
    accessorKey: "boosts",
    header: "Boosts",
  },
  {
    accessorKey: "followers",
    header: "Followers",
  },
];

export default function LeaderboardTable() {
  const { data } = useLeaderboard();
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

  return (
    <div className="w-full flex flex-col border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-mono font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="font-mono">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
