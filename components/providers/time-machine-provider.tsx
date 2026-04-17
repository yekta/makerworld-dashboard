"use client";

import { useFlash } from "@/components/providers/flash-provider";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import { createContext, ReactNode, useContext, useMemo } from "react";

type TTimeMachineContext = {
  setTimeMachineTimestamp: (timestamp: number | null) => void;
  timeMachineTimestamp: number | null;
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void;
  isTravelled: boolean;
  isTravelledAndClosed: boolean;
};

const TimeMachineContext = createContext<TTimeMachineContext | null>(null);

export const TimeMachineProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { disableFlash, enableFlashWithDelay } = useFlash();
  const [isOpen, setIsOpen] = useQueryState(
    "time_machine",
    parseAsBoolean.withDefault(false),
  );
  const [timeMachineTimestamp, _setTimeMachineTimestamp] = useQueryState(
    "now_timestamp",
    parseAsInteger,
  );
  const isTravelled = timeMachineTimestamp !== null;
  const isTravelledAndClosed = isTravelled && !isOpen;
  const setTimeMachineTimestamp: typeof _setTimeMachineTimestamp = (
    value,
    options,
  ) => {
    disableFlash();
    const result = _setTimeMachineTimestamp(value, options);
    enableFlashWithDelay();
    return result;
  };

  const value = useMemo(
    () => ({
      timeMachineTimestamp,
      setTimeMachineTimestamp,
      isOpen,
      setIsOpen,
      isTravelled,
      isTravelledAndClosed,
    }),
    [
      timeMachineTimestamp,
      setTimeMachineTimestamp,
      isOpen,
      setIsOpen,
      isTravelled,
      isTravelledAndClosed,
    ],
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
      "useTimeMachine must be used within an TimeMachineProvider",
    );
  }
  return context;
};

export default TimeMachineProvider;
