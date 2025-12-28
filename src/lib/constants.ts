import z from "zod";

export const appLocale = "en-US";
export const trpcPath = "/api/trpc";

export const MODEL_SORT_KEY = "sort";
export const MODEL_ORDER_KEY = "order";
export const MODEL_STAT_VISIBLITY_PREFERENCES_KEY = "stats";

export const TModelOrderEnum = z.enum(["desc", "asc"]);
export const TModelSortEnum = z.enum([
  "created_at",
  "prints_current",
  "prints_24h",
  "prints_1h",
  "boosts_current",
  "boosts_24h",
  "boosts_1h",
]);
export const TModelStatVisibilityPreferencesEnum = z.enum([
  "chart",
  "delta_0-1h",
  "delta_0-4h",
  "delta_0-12h",
  "delta_0-24h",
  "delta_0-168h",
  "delta_0-720h",
]);

export type TModelOrder = z.infer<typeof TModelOrderEnum>;
export type TModelSort = z.infer<typeof TModelSortEnum>;

export function getModelSortEnumLabel(sort: TModelSort) {
  switch (sort) {
    case "prints_current":
      return "Prints: Current";
    case "prints_24h":
      return "Prints: 24h";
    case "prints_1h":
      return "Prints: 1h";
    case "boosts_current":
      return "Boosts: Current";
    case "boosts_24h":
      return "Boosts: 24h";
    case "boosts_1h":
      return "Boosts: 1h";
    case "created_at":
      return "Creation Date";
    default:
      return sort;
  }
}

export function getModelOrderEnumLabel(order: TModelOrder) {
  switch (order) {
    case "desc":
      return "Desc";
    case "asc":
      return "Asc";
    default:
      return order;
  }
}

export function getModelStatVisibilityPreferencesEnumLabel(
  timeframe: z.infer<typeof TModelStatVisibilityPreferencesEnum>
) {
  switch (timeframe) {
    case "chart":
      return "Chart";
    case "delta_0-1h":
      return "1h";
    case "delta_0-4h":
      return "4h";
    case "delta_0-12h":
      return "12h";
    case "delta_0-24h":
      return "24h";
    case "delta_0-168h":
      return "7d";
    case "delta_0-720h":
      return "30d";
    default:
      return timeframe;
  }
}

export const MODEL_SORT_DEFAULT: z.infer<typeof TModelSortEnum> =
  "prints_current";
export const MODEL_ORDER_DEFAULT: z.infer<typeof TModelOrderEnum> = "desc";
export const CHART_VISIBILITY_DEFAULT = true;
export const MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT: z.infer<
  typeof TModelStatVisibilityPreferencesEnum
>[] = [
  "delta_0-1h",
  "delta_0-4h",
  "delta_0-12h",
  "delta_0-24h",
  "delta_0-168h",
  "delta_0-720h",
];
