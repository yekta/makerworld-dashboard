"use client";

import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import { createContext, ReactNode, useContext, useMemo } from "react";

type TTimeMachineContext = {
  setHeadCutoffTimestamp: (timestamp: number | null) => void;
  headCutoffTimestamp: number | null;
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void;
};

const TimeMachineContext = createContext<TTimeMachineContext | null>(null);

export const TimeMachineProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useQueryState(
    "time_machine",
    parseAsBoolean.withDefault(false)
  );
  const [headCutoffTimestamp, setHeadCutoffTimestamp] = useQueryState(
    "head_cutoff_timestamp",
    parseAsInteger
  );
  const value = useMemo(
    () => ({ headCutoffTimestamp, setHeadCutoffTimestamp, isOpen, setIsOpen }),
    [headCutoffTimestamp, setHeadCutoffTimestamp, isOpen, setIsOpen]
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
