import {
  MODEL_DELTA_STAT_ROWS_KEY,
  MODEL_DELTA_STAT_ROWS_TO_SHOW_DEFAULT,
  MODEL_ORDER_DEFAULT,
  MODEL_ORDER_KEY,
  MODEL_SORT_DEFAULT,
  MODEL_SORT_KEY,
  TModelDeltaStatRowsEnum,
  TModelOrderEnum,
  TModelSortEnum,
} from "@/lib/constants";
import { parseAsArrayOf, parseAsStringEnum, useQueryState } from "nuqs";

export function useModelDataStatRows() {
  const res = useQueryState(
    MODEL_DELTA_STAT_ROWS_KEY,
    parseAsArrayOf(
      parseAsStringEnum(TModelDeltaStatRowsEnum.options)
    ).withDefault(MODEL_DELTA_STAT_ROWS_TO_SHOW_DEFAULT)
  );
  return res;
}

export function useModelOrder() {
  const res = useQueryState(
    MODEL_ORDER_KEY,
    parseAsStringEnum(TModelOrderEnum.options).withDefault(MODEL_ORDER_DEFAULT)
  );
  return res;
}

export function useModelSort() {
  const res = useQueryState(
    MODEL_SORT_KEY,
    parseAsStringEnum(TModelSortEnum.options).withDefault(MODEL_SORT_DEFAULT)
  );
  return res;
}
