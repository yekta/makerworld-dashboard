import { useTimeMachine } from "@/components/providers/time-machine-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  HistoryIcon,
  TimerResetIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

type TProps = {
  className?: string;
};

export function TimeMachineButton({ className }: TProps) {
  const { isOpen, setIsOpen, headCutoffTimestamp } = useTimeMachine();
  const isTravelledAndClosed = headCutoffTimestamp !== null && !isOpen;

  return (
    <Button
      data-travelled-and-closed={isTravelledAndClosed ? true : undefined}
      data-open={isOpen ? true : undefined}
      className={cn(
        "bg-background data-open:-mb-1.5 sm:data-open:mb-0 group active:before:bg-border hover:before:bg-border before:pointer-events-none data-open:before:pointer-events-auto before:opacity-0 data-open:before:opacity-100 before:w-[calc(100%+2px)] before:h-2.5 before:absolute before:-left-px before:bottom-0 before:translate-y-full before:bg-background before:border-l before:border-r before:border-border data-open:rounded-b-none  data-open:border-b-background z-0 relative select-none group px-3 font-medium hover:bg-border active:bg-border text-foreground border justify-start text-left",
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
  );
}

const dayMs = 1000 * 60 * 60 * 24;

export function TimeMachineSlider({ className }: TProps) {
  const { isOpen, headCutoffTimestamp, setHeadCutoffTimestamp } =
    useTimeMachine();
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

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
  const numberOfDaysAgo = headCutoffTimestamp
    ? Math.floor((Date.now() - headCutoffTimestamp) / dayMs)
    : value[0];
  const timeMachineDate = new Date(
    Date.now() - numberOfDaysAgo * 24 * 60 * 60 * 1000
  );

  useEffect(() => {
    if (headCutoffTimestamp === null) {
      setValue([min]);
      setTime(format(new Date(), "HH:mm"));
    } else {
      const daysAgo = Math.max(
        Math.min(Math.round((Date.now() - headCutoffTimestamp) / dayMs), max),
        min
      );
      setValue([daysAgo]);
      const date = new Date(headCutoffTimestamp);
      setTime(format(date, "HH:mm"));
    }
  }, [headCutoffTimestamp]);

  const goToPrevDay = useCallback(() => {
    const newValue = Math.min(value[0] + 1, max);
    setValue([newValue]);
    const updatedDate = new Date(Date.now());
    const [hours, minutes] = time.split(":").map((val) => parseInt(val, 10));
    updatedDate.setHours(hours, minutes, 0, 0);
    debouncedSetHeadCutoffTimestamp(
      newValue === min ? null : updatedDate.getTime() - newValue * dayMs
    );
    if (newValue === min) {
      setTime(format(new Date(), "HH:mm"));
    }
  }, [value, max, time, debouncedSetHeadCutoffTimestamp]);

  const goToNextDay = useCallback(() => {
    const newValue = Math.max(value[0] - 1, min);
    setValue([newValue]);
    const updatedDate = new Date(Date.now());
    const [hours, minutes] = time.split(":").map((val) => parseInt(val, 10));
    updatedDate.setHours(hours, minutes, 0, 0);
    debouncedSetHeadCutoffTimestamp(
      newValue === min ? null : updatedDate.getTime() - newValue * dayMs
    );
    if (newValue === min) {
      setTime(format(new Date(), "HH:mm"));
    }
  }, [value, min, time, debouncedSetHeadCutoffTimestamp]);

  if (!isOpen) return null;

  return (
    <div className={cn("w-full border rounded-lg px-3", className)}>
      <div className="w-full flex flex-wrap items-center justify-end pt-3 -mb-0.5 gap-3">
        <div className="min-h-8 shrink min-w-0 flex items-center justify-end">
          <p className="shrink text-right min-w-0 text-sm font-mono">
            {value[0] === min ? "Today" : `${numberOfDaysAgo}d ago`}
            <span className="text-muted-more-foreground px-[0.5ch]">|</span>
            <span className="text-muted-foreground">
              {format(timeMachineDate, "yyyy-MM-dd")}
            </span>
            <span className="text-muted-more-foreground px-[0.5ch]">|</span>
            <span className="text-muted-foreground">
              {format(timeMachineDate, "EEE")}
            </span>
          </p>
        </div>
        {value[0] !== min && (
          <Input
            type="time"
            id="time-picker"
            step="60"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              const [hours, minutes] = e.target.value
                .split(":")
                .map((v) => parseInt(v, 10));
              const updatedDate = new Date(timeMachineDate);
              updatedDate.setHours(hours, minutes, 0, 0);
              debouncedSetHeadCutoffTimestamp(
                value[0] === min ? null : updatedDate.getTime()
              );
            }}
            className="w-auto shrink-0 font-mono h-8 px-2.5 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        )}
        {value[0] !== min && (
          <Button
            className="h-8 px-3 gap-1 font-mono font-bold shrink-0"
            onClick={() => {
              setValue([min]);
              setTime(format(new Date(), "HH:mm"));
              debouncedSetHeadCutoffTimestamp(null);
            }}
          >
            <TimerResetIcon className="size-4.5 -ml-1 shrink-0" />
            <span className="shrink min-w-0 overflow-hidden overflow-ellipsis">
              Reset
            </span>
          </Button>
        )}
      </div>
      <Slider
        inverted
        defaultValue={[max]}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          const updatedDate = new Date(Date.now());
          const [hours, minutes] = time
            .split(":")
            .map((val) => parseInt(val, 10));
          updatedDate.setHours(hours, minutes, 0, 0);
          debouncedSetHeadCutoffTimestamp(
            v[0] === min ? null : updatedDate.getTime() - v[0] * dayMs
          );
          if (v[0] === min) {
            setTime(format(new Date(), "HH:mm"));
          }
        }}
        min={min}
        max={max}
        step={1}
        className="w-full h-10"
        ThumbIcon={ChevronsLeft}
      />
      <div className="w-[calc(100%+1rem)] -ml-2 -mt-0.5 flex items-center justify-between pb-3">
        <div className="max-w-1/2 px-2 m">
          <Button
            variant="outline"
            className="max-w-full h-8 gap-1 px-3 font-mono"
            onClick={goToPrevDay}
            disabled={value[0] === max}
          >
            <ChevronLeft className="size-4.5 -ml-1.5 shrink-0" />
            <span className="shrink min-w-0 overflow-hidden overflow-ellipsis">
              Prev Day
            </span>
          </Button>
        </div>
        <div className="max-w-1/2 flex px-2">
          <Button
            variant="outline"
            className="max-w-full gap-1 px-3 h-8 font-mono"
            onClick={goToNextDay}
            disabled={value[0] === min}
          >
            <span className="shrink min-w-0 overflow-hidden overflow-ellipsis">
              Next Day
            </span>
            <ChevronRight className="size-4.5 -mr-1.5 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
