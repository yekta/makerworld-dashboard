import z from "zod";

export const appLocale = "en-US";
export const trpcPath = "/api/trpc";

export const MODEL_SORT_KEY = "sort";
export const MODEL_ORDER_KEY = "order";

export const TModelOrderEnum = z.enum(["desc", "asc"]);
export const TModelSortEnum = z.enum([
  "print_current",
  "print_24h",
  "print_1h",
  "boost_current",
  "boost_24h",
  "boost_1h",
]);

export type TModelOrder = z.infer<typeof TModelOrderEnum>;
export type TModelSort = z.infer<typeof TModelSortEnum>;

export const MODEL_SORT_DEFAULT: (typeof TModelSortEnum.options)[number] =
  "print_current";
export const MODEL_ORDER_DEFAULT: (typeof TModelOrderEnum.options)[number] =
  "desc";
