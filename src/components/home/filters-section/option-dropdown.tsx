import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";

type TProps<T> = {
  triggerLabel: string;
  TriggerIcon?: React.ElementType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: {
    label: string;
    value: T;
    Icon?: React.ElementType;
  }[];
  arrayMode?: boolean;
  onSelect: (value: T) => void;
  currentValue: T;
  className?: string;
};

export default function OptionDropdown<T>({
  isOpen,
  setIsOpen,
  TriggerIcon,
  triggerLabel,
  arrayMode,
  items,
  onSelect,
  currentValue,
  className,
}: TProps<T>) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          data-open={isOpen ? true : undefined}
          className={cn(
            "bg-background select-none group px-3 font-medium hover:bg-border active:bg-border text-foreground border justify-start text-left",
            className
          )}
        >
          {TriggerIcon && <TriggerIcon className="size-3.5 -ml-0.5 -mr-0.5" />}
          <p className="flex-1 select-none min-w-0 overflow-hidden overflow-ellipsis">
            {triggerLabel}
          </p>
          <ChevronDown className="shrink-0 text-muted-more-foreground -mr-1 group-data-open:rotate-180 transition" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-50 w-(--radix-dropdown-menu-trigger-width)"
        align="end"
        forceMount={true}
      >
        <ScrollArea>
          <DropdownMenuGroup>
            {items.map((item) => (
              <DropdownMenuItem
                data-selected={
                  item.value === currentValue ||
                  (arrayMode &&
                    Array.isArray(item.value) &&
                    (item.value as unknown as T[]).every((i) => {
                      return (currentValue as unknown as T[]).includes(i);
                    }))
                    ? true
                    : undefined
                }
                className="font-medium px-2 overflow-hidden text-sm group/item text-muted-foreground data-selected:text-foreground"
                key={String(item.value)}
                onSelect={(e) => {
                  if (arrayMode) {
                    e.preventDefault();
                  }
                  onSelect(item.value);
                }}
              >
                <div className="w-full gap-2 justify-between items-center flex">
                  <div className="shrink min-w-0 flex gap-2 items-center">
                    {item.Icon && (
                      <item.Icon className="size-3.5 -ml-0.5 -mr-0.5" />
                    )}
                    <p className="min-w-0 shrink leading-tight text-left">
                      {item.label}
                    </p>
                  </div>
                  <CheckIcon className="size-4 shrink-0 group-data-selected/item:opacity-100 opacity-0" />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
