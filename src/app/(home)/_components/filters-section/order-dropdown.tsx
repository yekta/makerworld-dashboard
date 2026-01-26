"use client";

import { showResetDebounceMs } from "@/app/(home)/_components/filters-section/constants";
import { useModelOrder } from "@/app/(home)/_components/filters-section/hooks";
import OptionDropdown from "@/app/(home)/_components/filters-section/option-dropdown";
import {
  getModelOrderEnumLabel,
  MODEL_ORDER_DEFAULT,
  TModelOrderEnum,
} from "@/lib/constants";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

type TProps = {
  className?: string;
};

const items = TModelOrderEnum.options.map((order) => ({
  label: getModelOrderEnumLabel(order),
  value: order,
  Icon:
    order === "asc" ? MoveUpIcon : order === "desc" ? MoveDownIcon : undefined,
}));

export default function OrderDropdown({ className }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelOrder, setModelOrder] = useModelOrder();
  const [debouncedShowReset, setDebouncedShowReset] = useDebounceValue(
    modelOrder !== MODEL_ORDER_DEFAULT,
    showResetDebounceMs,
  );

  useEffect(() => {
    setDebouncedShowReset(modelOrder !== MODEL_ORDER_DEFAULT);
  }, [modelOrder]);

  return (
    <OptionDropdown
      items={items}
      TriggerIcon={modelOrder === "asc" ? MoveUpIcon : MoveDownIcon}
      currentValue={modelOrder}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerLabel={getModelOrderEnumLabel(modelOrder)}
      onSelect={setModelOrder}
      showReset={debouncedShowReset}
      onReset={() => setModelOrder(MODEL_ORDER_DEFAULT)}
      className={className}
    />
  );
}
