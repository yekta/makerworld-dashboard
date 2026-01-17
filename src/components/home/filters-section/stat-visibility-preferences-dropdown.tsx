"use client";

import { showResetDebounceMs } from "@/components/home/filters-section/constants";
import { useModelStatVisibilityPreferences } from "@/components/home/filters-section/hooks";
import OptionDropdown from "@/components/home/filters-section/option-dropdown";
import {
  getModelStatVisibilityPreferencesEnumLabel,
  MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT,
  TModelStatVisibilityPreferencesEnum,
} from "@/lib/constants";
import { Rows3Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

type TProps = {
  className?: string;
};

const items = [
  ...TModelStatVisibilityPreferencesEnum.options.map((opt) => ({
    label: getModelStatVisibilityPreferencesEnumLabel(opt),
    value: [opt],
  })),
];

export default function StatVisibilityPreferencesDropdown({
  className,
}: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelStatVisibilityPreferences, setModelStatVisibilityPreferences] =
    useModelStatVisibilityPreferences();

  return (
    <OptionDropdown
      items={items}
      TriggerIcon={Rows3Icon}
      currentValue={modelStatVisibilityPreferences}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      arrayMode={true}
      triggerLabel="Stats"
      onSelect={(value) => {
        setModelStatVisibilityPreferences((prev) => {
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
              TModelStatVisibilityPreferencesEnum.options.indexOf(a) -
              TModelStatVisibilityPreferencesEnum.options.indexOf(b)
            );
          });
        });
      }}
      showReset={true}
      disableReset={
        JSON.stringify(modelStatVisibilityPreferences) ===
        JSON.stringify(MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT)
      }
      onReset={(e) => {
        e.preventDefault();
        setModelStatVisibilityPreferences(
          MODEL_STAT_VISIBLITY_PREFERENCES_DEFAULT,
        );
      }}
      className={className}
    />
  );
}
