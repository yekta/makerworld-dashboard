import { TModel } from "@/lib/types";
import { BoxIcon, DownloadIcon, RocketIcon, ThumbsUpIcon } from "lucide-react";
import { appLocale } from "@/lib/constants";

type TProps = {
  model: TModel;
};

export default function ModelCard({ model }: TProps) {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-1">
      <div className="px-4 pt-2.5 pb-3 border rounded-xl flex flex-col gap-2">
        <h2 className="text-xs text-muted-foreground w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
          {model.title}
        </h2>
        <div className="w-full flex gap-3">
          <Stat
            value={model.stats.current.prints}
            delta24h={model.stats.delta_24h.prints}
            delta1h={model.stats.delta_1h.prints}
            Icon={BoxIcon}
          />
          <Stat
            value={model.stats.current.downloads}
            delta24h={model.stats.delta_24h.downloads}
            delta1h={model.stats.delta_1h.downloads}
            Icon={DownloadIcon}
          />
          <Stat
            value={model.stats.current.boosts}
            delta24h={model.stats.delta_24h.boosts}
            delta1h={model.stats.delta_1h.boosts}
            Icon={RocketIcon}
          />
          <Stat
            value={model.stats.current.likes}
            delta24h={model.stats.delta_24h.likes}
            delta1h={model.stats.delta_1h.likes}
            Icon={ThumbsUpIcon}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  delta24h,
  delta1h,
  Icon,
}: {
  value: number;
  delta24h: number;
  delta1h: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex flex-col text-sm gap-0.5">
      <div className="flex items-center gap-1 font-semibold">
        <Icon className="size-3.5" />
        <span className="">{value.toLocaleString(appLocale)}</span>
      </div>
      <div className="w-full flex flex-col text-xs">
        <div
          data-positive={delta1h > 0 ? true : undefined}
          className="flex items-center gap-0.75 text-muted-foreground data-positive:text-success"
        >
          +{delta1h.toLocaleString(appLocale)}
        </div>
        <div
          data-positive={delta24h > 0 ? true : undefined}
          className="flex items-center gap-0.75 text-muted-foreground data-positive:text-success"
        >
          +{delta24h.toLocaleString(appLocale)}
        </div>
      </div>
    </div>
  );
}
