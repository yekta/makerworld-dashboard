"use client";

import OptionDropdown from "@/components/home/sort-and-order-section/option-dropdown";
import {
  getModelOrderEnumLabel,
  MODEL_ORDER_DEFAULT,
  MODEL_ORDER_KEY,
  TModelOrderEnum,
} from "@/lib/constants";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useState } from "react";

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
  const [modelOrder, setModelOrder] = useQueryState(
    MODEL_ORDER_KEY,
    parseAsStringEnum(TModelOrderEnum.options).withDefault(MODEL_ORDER_DEFAULT)
  );
  return (
    <OptionDropdown
      items={items}
      TriggerIcon={modelOrder === "asc" ? MoveUpIcon : MoveDownIcon}
      currentValue={modelOrder}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerLabel={getModelOrderEnumLabel(modelOrder)}
      onSelect={setModelOrder}
      className={className}
    />
  );
}
