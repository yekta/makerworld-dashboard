import { appLocale } from "@/lib/constants";
import useFlashOnChange from "@/lib/hooks/use-flash-on-change";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function Stat({
  value,
  delta24h,
  delta8h,
  delta1h,
  Icon,
  isPlaceholder,
  className,
}: {
  value: number;
  delta24h: number;
  delta8h: number;
  delta1h: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPlaceholder?: boolean;
  showDelta?: boolean;
  className?: string;
}) {
  return (
    <div
      data-placeholder={isPlaceholder ? true : undefined}
      className={cn(
        "flex shrink min-w-0 flex-col text-sm gap-px group font-mono",
        className
      )}
    >
      <MainStat value={value} Icon={Icon} isPlaceholder={isPlaceholder} />
      <div className="shrink min-w-0 overflow-hidden flex flex-col text-xs mt-px gap-px">
        <div
          data-positive={delta1h > 0 ? true : undefined}
          className="flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          <p className="shrink leading-tight min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            +{delta1h.toLocaleString(appLocale)}
          </p>
        </div>
        <div
          data-positive={delta8h > 0 ? true : undefined}
          className="flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          <p className="shrink leading-tight min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            +{delta8h.toLocaleString(appLocale)}
          </p>
        </div>
        <div
          data-positive={delta24h > 0 ? true : undefined}
          className="flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          <p className="shrink leading-tight min-w-0 overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
            +{delta24h.toLocaleString(appLocale)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MainStat({
  value,
  Icon,
  isPlaceholder,
}: {
  value: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPlaceholder?: boolean;
}) {
  const shouldFlash = useFlashOnChange(value, { enabled: !isPlaceholder });
  const [canFlash, setCanFlash] = useState(false);
  const canFlashTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaceholder) {
      canFlashTimeoutRef.current = window.setTimeout(() => {
        setCanFlash(true);
        canFlashTimeoutRef.current = null;
      }, 500);
    }
    return () => {
      if (canFlashTimeoutRef.current !== null) {
        clearTimeout(canFlashTimeoutRef.current);
        canFlashTimeoutRef.current = null;
      }
    };
  }, [isPlaceholder]);

  return (
    <div
      data-can-flash={canFlash ? true : undefined}
      data-flash={shouldFlash ? true : undefined}
      className="flex shrink min-w-0 items-center gap-0.75 font-semibold py-px group/main relative"
    >
      <div className="absolute -left-1 top-0 w-[calc(100%+0.55rem)] h-full rounded-sm bg-success-highlight/0 group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 group-data-flash/main:bg-success-highlight/20" />
      <Icon className="group-data-flash/main:text-success-highlight text-foreground group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 size-3 shrink-0 group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent" />
      <p className="group-data-flash/main:text-success-highlight text-foreground group-data-can-flash/main:transition-colors group-data-can-flash/main:duration-400 shrink min-w-0 overflow-hidden leading-tight overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent">
        {value.toLocaleString(appLocale)}
      </p>
    </div>
  );
}
