import {
  MODEL_ORDER_DEFAULT,
  MODEL_ORDER_KEY,
  MODEL_SORT_DEFAULT,
  MODEL_SORT_KEY,
  MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT,
  MODEL_STAT_VISIBLITY_PREFERENCES_KEY,
  TModelOrderEnum,
  TModelSortByEnum,
  TModelStatVisibilityPreferencesEnum,
} from "@/app/(home)/_components/constants";
import { useQueryStateClientOnly } from "@/lib/hooks/use-query-state-client-only";
import { parseAsArrayOf, parseAsStringEnum } from "nuqs";

export function useModelStatVisibilityPreferences() {
  const res = useQueryStateClientOnly(
    MODEL_STAT_VISIBLITY_PREFERENCES_KEY,
    parseAsArrayOf(
      parseAsStringEnum(TModelStatVisibilityPreferencesEnum.options),
    ).withDefault(MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT),
  );
  return res;
}

export function useModelOrder() {
  const res = useQueryStateClientOnly(
    MODEL_ORDER_KEY,
    parseAsStringEnum(TModelOrderEnum.options).withDefault(MODEL_ORDER_DEFAULT),
  );
  return res;
}

export function useModelSort() {
  const res = useQueryStateClientOnly(
    MODEL_SORT_KEY,
    parseAsStringEnum(TModelSortByEnum.options).withDefault(MODEL_SORT_DEFAULT),
  );
  return res;
}
