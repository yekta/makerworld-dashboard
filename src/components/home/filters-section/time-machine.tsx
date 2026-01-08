import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronDown, ChevronsLeft, HistoryIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

type TProps = {
  className?: string;
};

export function TimeMachineButton({ className }: TProps) {
  const { isOpen, setIsOpen, headCutoffTimestamp } = useTimeMachine();
  const isTravelledAndClosed = headCutoffTimestamp !== null && !isOpen;

  return (
    <div
      data-travelled-and-closed={isTravelledAndClosed ? true : undefined}
      className={cn("group", className)}
    >
      <Button
        data-open={isOpen ? true : undefined}
        className={cn(
          "bg-background relative select-none group px-3 font-medium hover:bg-border active:bg-border text-foreground border justify-start text-left",
          className
        )}
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="size-3.5 -ml-0.5 -mr-0.5 relative">
          <HistoryIcon className="size-full group-data-travelled-and-closed:text-warning" />
        </div>
        <p className="flex-1 select-none min-w-0 overflow-hidden overflow-ellipsis group-data-travelled-and-closed:text-warning">
          {isTravelledAndClosed
            ? format(new Date(headCutoffTimestamp!), "yyyy-MM-dd")
            : "Time Machine"}
        </p>
        <ChevronDown className="shrink-0 text-muted-more-foreground -mr-1 group-data-open:rotate-180 transition-transform group-data-travelled-and-closed:text-warning/50" />
      </Button>
    </div>
  );
}

const dayMs = 1000 * 60 * 60 * 24;

export function TimeMachineSlider({ className }: TProps) {
  const { isOpen, headCutoffTimestamp, setHeadCutoffTimestamp } =
    useTimeMachine();

  const min = 0;
  const max = 30;

  const [value, setValue] = useState([
    headCutoffTimestamp
      ? Math.max(
          Math.min(Math.round((Date.now() - headCutoffTimestamp) / dayMs), max),
          min
        )
      : min,
  ]);
  const debouncedSetHeadCutoffTimestamp = useDebounceCallback(
    setHeadCutoffTimestamp,
    500
  );
  const numberOfDaysAgo = value[0];
  const timeMachineDate = new Date(
    Date.now() - numberOfDaysAgo * 24 * 60 * 60 * 1000
  );

  if (!isOpen) return null;

  return (
    <div className={cn("w-full border rounded-lg px-4", className)}>
      <p className="w-full text-center pt-1.75 -mb-1.25 text-sm font-mono">
        {value[0] === min
          ? "Today"
          : `${numberOfDaysAgo} day${numberOfDaysAgo === 1 ? "" : "s"} ago`}
        <span className="text-muted-more-foreground px-[0.5ch]">|</span>
        <span className="text-muted-foreground">
          {format(timeMachineDate, "yyyy-MM-dd")}
        </span>
      </p>
      <Slider
        inverted
        defaultValue={[max]}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          debouncedSetHeadCutoffTimestamp(
            v[0] === min ? null : Date.now() - v[0] * 1000 * 60 * 60 * 24
          );
        }}
        min={min}
        max={max}
        step={1}
        className="w-full h-10"
        ThumbIcon={ChevronsLeft}
      />
    </div>
  );
}
