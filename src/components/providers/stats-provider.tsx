"use client";

import { AppRouterOutputs, AppRouterQueryResult } from "@/server/trpc/api/root";
import { api } from "@/server/trpc/setup/client";
import { createContext, ReactNode, useContext } from "react";

type TStatsContext = AppRouterQueryResult<AppRouterOutputs["stats"]["get"]>;

const StatsContext = createContext<TStatsContext | null>(null);

export const StatsProvider: React.FC<{
  initialData?: AppRouterOutputs["stats"]["get"];
  children: ReactNode;
}> = ({ initialData, children }) => {
  const query = api.stats.get.useQuery(
    {},
    { initialData, refetchInterval: 7500 }
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
