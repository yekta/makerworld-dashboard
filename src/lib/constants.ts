import z from "zod";

export const appLocale = "en-US";
export const trpcPath = "/api/trpc";

export const MODEL_SORT_KEY = "sort";
export const MODEL_ORDER_KEY = "order";

export const TModelOrderEnum = z.enum(["desc", "asc"]);
export const TModelSortEnum = z.enum([
  "print_current",
  "boost_current",
  "print_1h",
  "print_24h",
  "boost_1h",
  "boost_24h",
]);

export const MODEL_SORT_DEFAULT: (typeof TModelSortEnum.options)[number] =
  "print_current";
export const MODEL_ORDER_DEFAULT: (typeof TModelOrderEnum.options)[number] =
  "desc";
