"use client";

import { useModelOrder } from "@/components/home/filters-section/hooks";
import OptionDropdown from "@/components/home/filters-section/option-dropdown";
import { getModelOrderEnumLabel, TModelOrderEnum } from "@/lib/constants";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";
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
  const [modelOrder, setModelOrder] = useModelOrder();
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
