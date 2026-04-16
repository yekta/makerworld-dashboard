"use client";

import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { api } from "@/server/trpc/setup/client";
import { createContext, ReactNode, useContext } from "react";

type TStatsContext = AppRouterQueryResult<
  AppRouterOutputs["myUsers"]["getStats"]
>;

const StatsContext = createContext<TStatsContext | null>(null);

export const StatsProvider: React.FC<{
  username: string;
  children: ReactNode;
}> = ({ username, children }) => {
  const { timeMachineTimestamp } = useTimeMachine();
  const query = api.myUsers.getStats.useQuery(
    {
      username,
      timeMachineTimestamp: timeMachineTimestamp ?? null,
    },
    { refetchInterval: 10 * 1000 },
  );
  return (
    <StatsContext.Provider value={query}>{children}</StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within an StatsProvider");
  }
  return context;
};

export default StatsProvider;
