import OrderDropdown from "@/components/home/sort-and-order-section/order-dropdown";
import SortDropdown from "@/components/home/sort-and-order-section/sort-dropdown";
import { cn } from "@/lib/utils";

type TProps = {
  className?: string;
};

export default function SortAndOrderSection({ className }: TProps) {
  return (
    <div
      className={cn(
        "w-full flex justify-end items-center px-1 pt-1.5 gap-2 md:pt-0.5 pb-1",
        className
      )}
    >
      <div className="flex flex-1 justify-end items-center">
        <SortDropdown className="flex-1 sm:flex-none sm:w-48 rounded-r-none" />
        <OrderDropdown className="w-26 rounded-l-none -ml-px" />
      </div>
    </div>
  );
}
