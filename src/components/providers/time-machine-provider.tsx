"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { createContext, ReactNode, useContext, useMemo } from "react";

type TTimeMachineContext = {
  setHeadCutoffTimestamp: (timestamp: number | null) => void;
  headCutoffTimestamp: number | null;
};

const TimeMachineContext = createContext<TTimeMachineContext | null>(null);

export const TimeMachineProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [headCutoffTimestamp, setHeadCutoffTimestamp] = useQueryState(
    "head_cutoff_timestamp",
    parseAsInteger
  );
  const value = useMemo(
    () => ({ headCutoffTimestamp, setHeadCutoffTimestamp }),
    [headCutoffTimestamp, setHeadCutoffTimestamp]
  );

  return (
    <TimeMachineContext.Provider value={value}>
      {children}
    </TimeMachineContext.Provider>
  );
};

export const useTimeMachine = () => {
  const context = useContext(TimeMachineContext);
  if (!context) {
    throw new Error(
      "useTimeMachine must be used within an TimeMachineProvider"
    );
  }
  return context;
};

export default TimeMachineProvider;
