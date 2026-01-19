"use client";

import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TTimeMachineContext = {
  setHeadCutoffTimestamp: (timestamp: number | null) => void;
  headCutoffTimestamp: number | null;
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prevOpen: boolean) => boolean)) => void;
  isTravelled: boolean;
  isTravelledAndClosed: boolean;
  travelledRecently: boolean;
};

const TimeMachineContext = createContext<TTimeMachineContext | null>(null);

export const TimeMachineProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useQueryState(
    "time_machine",
    parseAsBoolean.withDefault(false),
  );
  const [headCutoffTimestamp, setHeadCutoffTimestamp] = useQueryState(
    "head_cutoff_timestamp",
    parseAsInteger,
  );
  const isTravelled = headCutoffTimestamp !== null;
  const isTravelledAndClosed = isTravelled && !isOpen;
  const [travelledRecently, setTravelledRecently] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTravelledRecently(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTravelledRecently(false);
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [headCutoffTimestamp]);

  const value = useMemo(
    () => ({
      headCutoffTimestamp,
      setHeadCutoffTimestamp,
      isOpen,
      setIsOpen,
      isTravelled,
      isTravelledAndClosed,
      travelledRecently,
    }),
    [
      headCutoffTimestamp,
      setHeadCutoffTimestamp,
      isOpen,
      setIsOpen,
      isTravelled,
      isTravelledAndClosed,
      travelledRecently,
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
