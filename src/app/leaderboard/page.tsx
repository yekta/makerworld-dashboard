import LeaderboardTable from "@/app/leaderboard/_components/leaderboard-table";
import LeaderboardProvider from "@/components/providers/leaderboard-provider";
import { apiServer, HydrateClient } from "@/server/trpc/setup/server";

type TProps = {};

export default async function Page({}: TProps) {
  await apiServer.leaderboard.get.prefetch({ orderBy: "prints" });

  return (
    <HydrateClient>
      <LeaderboardProvider>
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-7xl flex flex-col items-center px-2 py-2 sm:px-3 sm:py-3 md:px-5 md:py-5">
            <LeaderboardTable />
          </div>
        </div>
      </LeaderboardProvider>
    </HydrateClient>
  );
}
