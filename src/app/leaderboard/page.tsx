import LeaderboardTable from "@/app/leaderboard/_components/leaderboard-table";
import LeaderboardProvider from "@/components/providers/leaderboard-provider";
import { apiServer, HydrateClient } from "@/server/trpc/setup/server";

type TProps = {};

export default async function Page({}: TProps) {
  await apiServer.leaderboard.get.prefetch({ orderBy: "prints" });

  return (
    <HydrateClient>
      <LeaderboardProvider>
        <div className="w-full flex flex-col items-center relative">
          <div className="w-full relative max-w-7xl px-1 pb-4 sm:px-3 sm:pb-6 md:px-5 md:pb-10">
            <LeaderboardTable />
          </div>
        </div>
      </LeaderboardProvider>
    </HydrateClient>
  );
}
