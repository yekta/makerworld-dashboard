import { isServer } from "@/lib/constants";
import { useQueryState } from "nuqs";

type TUseQueryState = typeof useQueryState;

const noopSetter = async () => new URLSearchParams();

function getDefaultValueFromArg(arg: unknown) {
  if (arg && typeof arg === "object" && "defaultValue" in arg) {
    // defaultValue might legitimately be "" / 0 / false
    return (arg as any).defaultValue;
  }
  return undefined;
}

export const useQueryStateClientOnly: TUseQueryState = ((...args: any[]) => {
  if (isServer) {
    const defaultValue = getDefaultValueFromArg(args[1]);
    // nuqs returns null when there's no default; mirror that.
    const value = defaultValue !== undefined ? defaultValue : null;
    return [value, noopSetter];
  }

  return (useQueryState as any)(...args);
}) as TUseQueryState;
