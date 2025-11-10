import { useEffect, useRef, useState } from "react";

export default function useFlashOnChange<T>(
  value: T,
  {
    duration = 5000,
    enabled = true,
  }: { duration?: number; enabled?: boolean } = {}
) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  const timeoutRef = useRef<number | null>(null);
  const didMount = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      prev.current = value;
      setFlash(false);
      return;
    }

    if (didMount.current && prev.current !== value) {
      setFlash(true);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setFlash(false);
        timeoutRef.current = null;
      }, duration);
    }

    didMount.current = true;
    prev.current = value;
  }, [value, duration, enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return flash;
}
