"use client";

import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { api } from "@/server/trpc/setup/client";
import { createContext, ReactNode, useContext } from "react";

type TLeaderboardContext = AppRouterQueryResult<
  AppRouterOutputs["leaderboard"]["get"]
>;

const LeaderboardContext = createContext<TLeaderboardContext | null>(null);

export const LeaderboardProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const query = api.leaderboard.get.useQuery({
    orderBy: "prints",
  });
  return (
    <LeaderboardContext.Provider value={query}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error(
      "useLeaderboard must be used within an LeaderboardProvider",
    );
  }
  return context;
};

export default LeaderboardProvider;
