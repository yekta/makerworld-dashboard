import { useEffect, useRef, useState } from "react";

export default function useFlashOnChange<T>(
  value: T,
  {
    duration = 4000,
    enabled = true,
  }: { duration?: number; enabled?: boolean } = {}
) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);
  const timeoutRef = useRef<number | null>(null);
  const didMount = useRef(false);

  useEffect(() => {
    if (!enabled) {
      prev.current = value;
      setFlash(false);
      return;
    }

    if (didMount.current && prev.current !== value) {
      setFlash(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setFlash(false), duration);
    }

    didMount.current = true;
    prev.current = value;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, duration, enabled]);

  return flash;
}
