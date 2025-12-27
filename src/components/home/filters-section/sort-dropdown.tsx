"use client";

import { useModelSort } from "@/components/home/filters-section/hooks";
import OptionDropdown from "@/components/home/filters-section/option-dropdown";
import PrintIcon from "@/components/icons/print-icon";
import {
  getModelSortEnumLabel,
  TModelSort,
  TModelSortEnum,
} from "@/lib/constants";
import { CalendarIcon, RocketIcon } from "lucide-react";
import { useState } from "react";

type TProps = {
  className?: string;
};

const items = TModelSortEnum.options.map((sort) => ({
  label: getModelSortEnumLabel(sort),
  value: sort,
  Icon: getIconForSort(sort),
}));

export default function SortDropdown({ className }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelSort, setModelSort] = useModelSort();
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
  if (sort === "created_at") {
    return CalendarIcon;
  }
  return undefined;
}
