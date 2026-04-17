"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TFlashContext = {
  isFlashEnabled: boolean;
  enableFlash: () => void;
  disableFlash: () => void;
  enableFlashWithDelay: (delayMs?: number) => void;
};

const FlashContext = createContext<TFlashContext | null>(null);

const DEFAULT_DELAY_MS = 5000;

export const FlashProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isFlashEnabled, setIsFlashEnabled] = useState(true);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearDelay = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
  }, []);

  const enableFlash = useCallback(() => {
    clearDelay();
    setIsFlashEnabled(true);
  }, [clearDelay]);

  const disableFlash = useCallback(() => {
    clearDelay();
    setIsFlashEnabled(false);
  }, [clearDelay]);

  const enableFlashWithDelay = useCallback(
    (delayMs: number = DEFAULT_DELAY_MS) => {
      clearDelay();
      delayTimeoutRef.current = setTimeout(() => {
        setIsFlashEnabled(true);
        delayTimeoutRef.current = null;
      }, delayMs);
    },
    [clearDelay],
  );

  useEffect(() => {
    return () => {
      clearDelay();
    };
  }, [clearDelay]);

  const value = useMemo(
    () => ({
      isFlashEnabled,
      enableFlash,
      disableFlash,
      enableFlashWithDelay,
    }),
    [isFlashEnabled, enableFlash, disableFlash, enableFlashWithDelay],
  );

  return (
    <FlashContext.Provider value={value}>{children}</FlashContext.Provider>
  );
};

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
};

export default FlashProvider;
