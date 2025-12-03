import z from "zod";

export const appLocale = "en-US";
export const trpcPath = "/api/trpc";

export const MODEL_SORT_KEY = "sort";
export const MODEL_ORDER_KEY = "order";

export const TModelOrderEnum = z.enum(["desc", "asc"]);
export const TModelSortEnum = z.enum([
  "prints_current",
  "prints_24h",
  "prints_1h",
  "boosts_current",
  "boosts_24h",
  "boosts_1h",
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

export const MODEL_SORT_DEFAULT: (typeof TModelSortEnum.options)[number] =
  "prints_current";
export const MODEL_ORDER_DEFAULT: (typeof TModelOrderEnum.options)[number] =
  "desc";
