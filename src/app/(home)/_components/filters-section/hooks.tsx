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
import { parseAsArrayOf, parseAsStringEnum, useQueryState } from "nuqs";

export function useModelStatVisibilityPreferences() {
  const res = useQueryState(
    MODEL_STAT_VISIBLITY_PREFERENCES_KEY,
    parseAsArrayOf(
      parseAsStringEnum(TModelStatVisibilityPreferencesEnum.options),
    ).withDefault(MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT),
  );
  return res;
}

export function useModelOrder() {
  const res = useQueryState(
    MODEL_ORDER_KEY,
    parseAsStringEnum(TModelOrderEnum.options).withDefault(MODEL_ORDER_DEFAULT),
  );
  return res;
}

export function useModelSort() {
  const res = useQueryState(
    MODEL_SORT_KEY,
    parseAsStringEnum(TModelSortByEnum.options).withDefault(MODEL_SORT_DEFAULT),
  );
  return res;
}
