"use client";

import OptionDropdown from "@/components/home/sort-and-order-section/option-dropdown";
import PrintIcon from "@/components/icons/print-icon";
import {
  getModelSortEnumLabel,
  MODEL_SORT_DEFAULT,
  MODEL_SORT_KEY,
  TModelSort,
  TModelSortEnum,
} from "@/lib/constants";
import { ArrowDownWideNarrow, RocketIcon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useState } from "react";

type TProps = {
  className?: string;
};

const items = TModelSortEnum.options.map((sort) => ({
  label: getModelSortEnumLabel(sort),
  value: sort,
  Icon: sort.startsWith("prints")
    ? PrintIcon
    : sort.startsWith("boosts")
    ? RocketIcon
    : undefined,
}));

export default function SortDropdown({ className }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelSort, setModelSort] = useQueryState(
    MODEL_SORT_KEY,
    parseAsStringEnum(TModelSortEnum.options).withDefault(MODEL_SORT_DEFAULT)
  );
  return (
    <OptionDropdown
      items={items}
      TriggerIcon={getIconForSort(modelSort)}
      currentValue={modelSort}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerLabel={getModelSortEnumLabel(modelSort)}
      onSelect={setModelSort}
      className={className}
    />
  );
}

function getIconForSort(sort: TModelSort) {
  if (
    sort === "prints_1h" ||
    sort === "prints_24h" ||
    sort === "prints_current"
  ) {
    return PrintIcon;
  }
  if (
    sort === "boosts_1h" ||
    sort === "boosts_24h" ||
    sort === "boosts_current"
  ) {
    return RocketIcon;
  }
  return undefined;
}
