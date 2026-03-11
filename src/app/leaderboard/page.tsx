import { cachedLeaderboardPageSearchParams } from "@/app/leaderboard/_components/constants";
import LeaderboardTable from "@/app/leaderboard/_components/leaderboard-table";
import LeaderboardProvider from "@/components/providers/leaderboard-provider";
import { apiServer } from "@/server/trpc/setup/server";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  await cachedLeaderboardPageSearchParams.parse(searchParams);
  const { users } = await apiServer.myUsers.list();

  return (
    <LeaderboardProvider>
      <div className="w-full flex flex-col items-center relative">
        <div className="w-full relative max-w-7xl px-1 pb-4 sm:px-3 sm:pb-6 md:px-5 md:pb-10">
          <LeaderboardTable users={users} />
        </div>
      </div>
    </LeaderboardProvider>
  );
}
