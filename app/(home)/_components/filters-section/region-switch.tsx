"use client";

import {
  getRegionEnumLabel,
  TRegionEnum,
} from "@/app/(home)/_components/constants";
import { useRegion } from "@/app/(home)/_components/filters-section/hooks";
import { useFlash } from "@/components/providers/flash-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftRightIcon, Globe2Icon } from "lucide-react";
import { useCallback, useMemo } from "react";

type TProps = {
  className?: string;
};

export default function RegionSwitch({ className }: TProps) {
  const [region, setRegion] = useRegion();
  const { disableFlash, enableFlashWithDelay } = useFlash();

  const index = TRegionEnum.options.indexOf(region);
  const nextIndex = useMemo(() => {
    const length = TRegionEnum.options.length;
    return (index + 1) % length;
  }, [index]);

  const onClick = useCallback(() => {
    disableFlash();
    setRegion(TRegionEnum.options[nextIndex]);
    enableFlashWithDelay();
  }, [setRegion, disableFlash, enableFlashWithDelay, nextIndex]);

  return (
    <Button
      variant="ghost"
      className={cn(
        "bg-background select-none group px-3 font-medium hover:bg-border active:bg-border text-foreground border justify-start text-left",
        className,
      )}
      onClick={onClick}
    >
      <Globe2Icon className="size-3.5 -ml-0.5 -mr-0.5 shrink-0" />
      <p className="flex-1 text-sm min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
        {getRegionEnumLabel(region)}
      </p>
      <div
        style={{
          rotate: `${index * 180}deg`,
        }}
        className="size-3.5 shrink-0 text-muted-more-foreground -mr-1 transition transform"
      >
        <ArrowLeftRightIcon className="size-3.5" />
      </div>
    </Button>
  );
}
