import { appLocale } from "@/lib/constants";
import { TModel } from "@/lib/types";
import { BoxIcon, DownloadIcon, RocketIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TProps =
  | {
      model: TModel;
      isPlaceholder?: never;
    }
  | {
      model?: never;
      isPlaceholder: true;
    };

export default function ModelCard(props: TProps) {
  if (props.isPlaceholder) {
    return (
      <div
        data-placeholder={true}
        className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 p-1 group rounded-2xl group"
      >
        <ModelCardContent isPlaceholder={true} />
      </div>
    );
  }

  return (
    <Link
      href={getModelUrl(props.model.model_id)}
      target="_blank"
      className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 p-1 group rounded-2xl group"
    >
      <ModelCardContent {...props} />
    </Link>
  );
}

function ModelCardContent({ model, isPlaceholder }: TProps) {
  return (
    <div className="p-2 border group-active:bg-border group-hover:bg-border rounded-xl flex flex-col gap-2">
      <div className="w-full flex flex-row items-start justify-center gap-3">
        <div className="w-17 aspect-4/3 bg-border rounded-sm overflow-hidden group-data-placeholder:animate-pulse">
          {!isPlaceholder && (
            <Image
              src={model.image}
              alt={model.title}
              width={1916}
              height={1437}
              className="w-17 shrink-0 h-auto bg-border"
              sizes="68px"
            />
          )}
        </div>
        <div className="flex-1 shrink min-w-0 overflow-hidden -mt-1 flex gap-3 py-0.75">
          <Stat
            value={!isPlaceholder ? model.stats.current.prints : 100}
            delta24h={!isPlaceholder ? model.stats.delta_24h.prints : 0}
            delta1h={!isPlaceholder ? model.stats.delta_1h.prints : 0}
            showDelta={true}
            Icon={BoxIcon}
            isPlaceholder={isPlaceholder}
          />
          <Stat
            value={!isPlaceholder ? model.stats.current.downloads : 200}
            delta24h={!isPlaceholder ? model.stats.delta_24h.downloads : 0}
            delta1h={!isPlaceholder ? model.stats.delta_1h.downloads : 0}
            Icon={DownloadIcon}
            isPlaceholder={isPlaceholder}
          />
          <Stat
            value={!isPlaceholder ? model.stats.current.boosts : 10}
            delta24h={!isPlaceholder ? model.stats.delta_24h.boosts : 0}
            delta1h={!isPlaceholder ? model.stats.delta_1h.boosts : 0}
            Icon={RocketIcon}
            isPlaceholder={isPlaceholder}
          />
          <Stat
            value={!isPlaceholder ? model.stats.current.likes : 100}
            delta24h={!isPlaceholder ? model.stats.delta_24h.likes : 0}
            delta1h={!isPlaceholder ? model.stats.delta_1h.likes : 0}
            Icon={ThumbsUpIcon}
            isPlaceholder={isPlaceholder}
          />
        </div>
      </div>
      <div className="w-full overflow-hidden flex -mt-1.5">
        <h2 className="text-xs px-0.75 shrink min-w-0 text-muted-foreground whitespace-nowrap overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
          {!isPlaceholder ? model.title : "Loading This Model's Title"}
        </h2>
      </div>
    </div>
  );
}

function getModelUrl(id: number) {
  return `https://makerworld.com/en/models/${id}`;
}

function Stat({
  value,
  delta24h,
  delta1h,
  Icon,
  isPlaceholder,
}: {
  value: number;
  delta24h: number;
  delta1h: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPlaceholder?: boolean;
  showDelta?: boolean;
}) {
  return (
    <div
      data-placeholder={isPlaceholder ? true : undefined}
      className="flex shrink min-w-0 overflow-hidden flex-col text-sm gap-px group"
    >
      <div className="flex shrink min-w-0 overflow-hidden items-center gap-0.75 font-semibold py-px">
        <Icon className="size-3 shrink-0 group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent" />
        <p className="shrink min-w-0 overflow-hidden leading-tight overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-foreground group-data-placeholder:text-transparent">
          {value.toLocaleString(appLocale)}
        </p>
      </div>
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
