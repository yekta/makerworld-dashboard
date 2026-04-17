"use client";

import { useIsCN } from "@/app/(home)/_components/filters-section/hooks";
import { useFlash } from "@/components/providers/flash-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Globe2Icon } from "lucide-react";

type TProps = {
  className?: string;
};

export default function CnSwitch({ className }: TProps) {
  const [isCN, setIsCN] = useIsCN();
  const { disableFlash, enableFlashWithDelay } = useFlash();
  const onCheckChange = (checked: boolean) => {
    disableFlash();
    setIsCN(checked);
    enableFlashWithDelay();
  };
  return (
    <Label
      htmlFor="is_cn"
      className={cn(
        "bg-background rounded-md select-none group px-3 py-2 font-medium hover:bg-border active:bg-border text-foreground border justify-start text-left",
        className,
      )}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <Globe2Icon className="size-3.5 -ml-0.5 -mr-0.5 shrink-0" />
        <p className="flex-1 text-sm min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
          CN
        </p>
      </div>
      <Switch
        className="-mr-0.5"
        id="is_cn"
        checked={isCN}
        onCheckedChange={onCheckChange}
      />
    </Label>
  );
}
