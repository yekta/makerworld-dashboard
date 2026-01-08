"use client";

import OrderDropdown from "@/components/home/filters-section/order-dropdown";
import SortDropdown from "@/components/home/filters-section/sort-dropdown";
import StatVisiblityPreferencesDropdown from "@/components/home/filters-section/stat-visibility-preferences-dropdown";
import {
  TimeMachineButton,
  TimeMachineSlider,
} from "@/components/home/filters-section/time-machine";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string;
};

export default function FiltersSection({ className }: TProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-wrap justify-end items-center px-1 pt-1.5 gap-2 md:pt-1 pb-1",
        className
      )}
    >
      <TimeMachineButton className="w-full sm:w-40" />
      <TimeMachineSlider className="sm:order-last" />
      <div className="w-full sm:w-auto flex shrink justify-end items-center">
        <SortDropdown className="flex-1 sm:flex-none sm:w-48 rounded-r-none" />
        <OrderDropdown className="w-26 rounded-l-none -ml-px" />
      </div>
      <StatVisiblityPreferencesDropdown className="w-full sm:w-26" />
    </div>
  );
}
