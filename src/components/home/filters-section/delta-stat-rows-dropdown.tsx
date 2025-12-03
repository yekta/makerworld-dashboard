"use client";

import { useModelDataStatRows } from "@/components/home/filters-section/hooks";
import OptionDropdown from "@/components/home/filters-section/option-dropdown";
import {
  getModelDeltaStatRowsEnumLabel,
  TModelDeltaStatRowsEnum,
} from "@/lib/constants";
import { Rows3Icon } from "lucide-react";
import { useState } from "react";

type TProps = {
  className?: string;
};

const items = TModelDeltaStatRowsEnum.options.map((timeframe) => ({
  label: getModelDeltaStatRowsEnumLabel(timeframe),
  value: [timeframe],
}));

export default function DeltaStatRowsDropdown({ className }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelDeltaStatRows, setModelDeltaStatRows] = useModelDataStatRows();
  return (
    <OptionDropdown
      items={items}
      TriggerIcon={Rows3Icon}
      currentValue={modelDeltaStatRows}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      arrayMode={true}
      triggerLabel="Stats"
      onSelect={(value) => {
        setModelDeltaStatRows((prev) => {
          let newArr = [...prev];
          for (const v of value) {
            if (newArr.includes(v)) {
              newArr = newArr.filter((item) => item !== v);
            } else {
              newArr.push(v);
            }
          }
          return newArr.sort((a, b) => {
            return (
              TModelDeltaStatRowsEnum.options.indexOf(a) -
              TModelDeltaStatRowsEnum.options.indexOf(b)
            );
          });
        });
      }}
      className={className}
    />
  );
}
