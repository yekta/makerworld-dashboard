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

export const MODEL_SORT_DEFAULT: (typeof TModelSortEnum.options)[number] =
  "prints_current";
export const MODEL_ORDER_DEFAULT: (typeof TModelOrderEnum.options)[number] =
  "desc";
