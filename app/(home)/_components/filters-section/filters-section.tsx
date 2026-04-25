"use client";

import RegionSwitch from "@/app/(home)/_components/filters-section/region-switch";
import OrderDropdown from "@/app/(home)/_components/filters-section/order-dropdown";
import SortDropdown from "@/app/(home)/_components/filters-section/sort-dropdown";
import StatVisiblityPreferencesDropdown from "@/app/(home)/_components/filters-section/stat-visibility-preferences-dropdown";
import {
  TimeMachineButton,
  TimeMachineSlider,
} from "@/app/(home)/_components/filters-section/time-machine";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string;
};

export default function FiltersSection({ className }: TProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-wrap justify-end items-center px-1 pt-1.5 gap-2 md:pt-1 pb-1",
        className,
      )}
    >
      <TimeMachineButton className="w-full md:w-40" />
      <TimeMachineSlider className="md:order-last" />
      <div className="w-full md:w-auto flex shrink justify-end items-center">
        <SortDropdown className="flex-1 md:flex-none md:w-44 rounded-r-none" />
        <OrderDropdown className="w-28 rounded-l-none -ml-px" />
      </div>
      <div className="w-full md:w-auto flex shrink justify-end items-center">
        <StatVisiblityPreferencesDropdown className="flex-1 md:w-28 md:flex-none rounded-r-none" />
        <RegionSwitch className="w-28 rounded-l-none -ml-px" />
      </div>
    </div>
  );
}
