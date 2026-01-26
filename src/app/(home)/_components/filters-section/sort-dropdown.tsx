"use client";

import { showResetDebounceMs } from "@/app/(home)/_components/filters-section/constants";
import { useModelSort } from "@/app/(home)/_components/filters-section/hooks";
import OptionDropdown from "@/app/(home)/_components/filters-section/option-dropdown";
import PrintIcon from "@/components/icons/print-icon";
import {
  getModelSortEnumLabel,
  MODEL_SORT_DEFAULT,
  TModelSort,
  TModelSortEnum,
} from "@/lib/constants";
import { CalendarIcon, RocketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

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
  const [debouncedShowReset, setDebouncedShowReset] = useDebounceValue(
    modelSort !== MODEL_SORT_DEFAULT,
    showResetDebounceMs,
  );

  useEffect(() => {
    setDebouncedShowReset(modelSort !== MODEL_SORT_DEFAULT);
  }, [modelSort]);

  return (
    <OptionDropdown
      items={items}
      TriggerIcon={getIconForSort(modelSort)}
      currentValue={modelSort}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerLabel={getModelSortEnumLabel(modelSort)}
      onSelect={setModelSort}
      showReset={debouncedShowReset}
      onReset={() => setModelSort(MODEL_SORT_DEFAULT)}
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
