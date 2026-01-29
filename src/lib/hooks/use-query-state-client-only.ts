import { isServer } from "@/lib/constants";
import {
  GenericParser,
  Options,
  useQueryState,
  UseQueryStateOptions,
  UseQueryStateReturn,
} from "nuqs";
import { useEffect, useState } from "react";

// widen setter type so it can't conflict across nuqs overloads
const noopSetter: any = async () => new URLSearchParams();

function hasDefaultValue<T extends object>(
  obj: T,
): obj is T & { defaultValue: unknown } {
  return "defaultValue" in obj;
}

type WithIsReal<R extends readonly [unknown, unknown]> = readonly [
  ...R,
  boolean,
];

// Overload 1: Parser with defaultValue
export function useQueryStateClientOnly<T>(
  key: string,
  options: UseQueryStateOptions<T> & { defaultValue: T },
): WithIsReal<
  UseQueryStateReturn<
    NonNullable<ReturnType<(typeof options)["parse"]>>,
    (typeof options)["defaultValue"]
  >
>;

// Overload 2: Parser without defaultValue
export function useQueryStateClientOnly<T>(
  key: string,
  options: UseQueryStateOptions<T>,
): WithIsReal<
  UseQueryStateReturn<
    NonNullable<ReturnType<(typeof options)["parse"]>>,
    undefined
  >
>;

// Overload 3: String mode with defaultValue (no parser)
export function useQueryStateClientOnly(
  key: string,
  options: Options & { defaultValue: string } & {
    [K in keyof GenericParser<unknown>]?: never;
  },
): WithIsReal<UseQueryStateReturn<string, (typeof options)["defaultValue"]>>;

// Overload 4: String mode with options (no parser, no defaultValue)
export function useQueryStateClientOnly(
  key: string,
  options: Pick<UseQueryStateOptions<string>, keyof Options>,
): WithIsReal<UseQueryStateReturn<string, undefined>>;

// Overload 5: Just key (string mode)
export function useQueryStateClientOnly(
  key: string,
): WithIsReal<UseQueryStateReturn<string, undefined>>;

// ✅ Implementation: keep params broad AND return type broad
export function useQueryStateClientOnly(key: string, options?: unknown): any {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isServer) {
    const defaultValue =
      options !== undefined &&
      typeof options === "object" &&
      options !== null &&
      hasDefaultValue(options)
        ? (options as any).defaultValue
        : null;
    return [defaultValue, noopSetter, false] as const;
  }

  // Always call hook unconditionally
  const realValues =
    options !== undefined
      ? useQueryState(key, options as any)
      : useQueryState(key);

  if (!mounted) {
    const defaultValue =
      options !== undefined &&
      typeof options === "object" &&
      options !== null &&
      hasDefaultValue(options)
        ? (options as any).defaultValue
        : null;

    return [defaultValue, noopSetter, false] as const;
  }

  return [...realValues, true] as const;
}
