import { useNow } from "@/components/providers/now-provider";
import Stat from "@/components/stat";
import { timeAgo } from "@/lib/helpers";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { BoxIcon, DownloadIcon, RocketIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TProps =
  | {
      model: AppRouterOutputs["stats"]["get"]["models"][number];
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

function ModelCardContent(props: TProps) {
  const { model, isPlaceholder } = props;
  return (
    <div className="p-2 border group-active:bg-border group-hover:bg-border rounded-xl flex flex-col gap-1 relative overflow-hidden">
      <div className="w-20 absolute -bottom-px -right-px aspect-4/3 bg-border border rounded-tl-xl overflow-hidden group-data-placeholder:animate-pulse">
        {!isPlaceholder && (
          <Image
            src={model.image}
            alt={model.title}
            width={1916}
            height={1437}
            className="w-full shrink-0 h-auto bg-border"
            sizes="80px"
          />
        )}
      </div>
      <div className="w-full flex items-center overflow-hidden gap-2 relative">
        <h2 className="text-xs font-light px-1 shrink min-w-0 text-muted-foreground whitespace-nowrap overflow-hidden overflow-ellipsis group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent">
          {!isPlaceholder ? model.title : "Loading This Model's Title"}
        </h2>
        {!isPlaceholder &&
          (model.stats.delta_0_25h.boosts > 0 ||
            model.stats.delta_0_25h.prints > 0 ||
            model.stats.delta_0_25h.downloads > 0) && (
            <p className="ml-auto flex shrink-0 max-w-1/2 min-w-0 overflow-hidden gap-px items-end text-xs text-success font-mono -mr-1">
              {model.stats.delta_0_25h.boosts > 0 && (
                <>
                  <RocketIcon className="size-2.75 shrink-0 inline-block mb-0.5" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right pr-1.75">
                    +{model.stats.delta_0_25h.boosts}
                  </span>
                </>
              )}
              {model.stats.delta_0_25h.prints > 0 && (
                <>
                  <BoxIcon className="size-2.75 shrink-0 inline-block mb-0.5" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right pr-1.75">
                    +{model.stats.delta_0_25h.prints}
                  </span>
                </>
              )}
              {model.stats.delta_0_25h.downloads > 0 && (
                <>
                  <DownloadIcon className="size-2.75 shrink-0 inline-block mb-0.5" />
                  <span className="shrink min-w-0 overflow-hidden overflow-ellipsis leading-tight text-right pr-1.75">
                    +{model.stats.delta_0_25h.downloads}
                  </span>
                </>
              )}
            </p>
          )}
      </div>
      <div className="w-full flex flex-row gap-5 px-1 relative">
        <Stat
          value={!isPlaceholder ? model.stats.current.prints : 100}
          delta1h={!isPlaceholder ? model.stats.delta_1h.prints : 0}
          delta4h={!isPlaceholder ? model.stats.delta_4h.prints : 0}
          delta12h={!isPlaceholder ? model.stats.delta_12h.prints : 0}
          delta24h={!isPlaceholder ? model.stats.delta_24h.prints : 0}
          Icon={BoxIcon}
          isPlaceholder={isPlaceholder}
        />
        <Stat
          value={!isPlaceholder ? model.stats.current.downloads : 200}
          delta1h={!isPlaceholder ? model.stats.delta_1h.downloads : 0}
          delta4h={!isPlaceholder ? model.stats.delta_4h.downloads : 0}
          delta12h={!isPlaceholder ? model.stats.delta_12h.downloads : 0}
          delta24h={!isPlaceholder ? model.stats.delta_24h.downloads : 0}
          Icon={DownloadIcon}
          isPlaceholder={isPlaceholder}
        />
        <Stat
          value={!isPlaceholder ? model.stats.current.boosts : 10}
          delta1h={!isPlaceholder ? model.stats.delta_1h.boosts : 0}
          delta4h={!isPlaceholder ? model.stats.delta_4h.boosts : 0}
          delta12h={!isPlaceholder ? model.stats.delta_12h.boosts : 0}
          delta24h={!isPlaceholder ? model.stats.delta_24h.boosts : 0}
          Icon={RocketIcon}
          isPlaceholder={isPlaceholder}
        />
        <Stat
          value={!isPlaceholder ? model.stats.current.likes : 100}
          delta1h={!isPlaceholder ? model.stats.delta_1h.likes : 0}
          delta4h={!isPlaceholder ? model.stats.delta_4h.likes : 0}
          delta12h={!isPlaceholder ? model.stats.delta_12h.likes : 0}
          delta24h={!isPlaceholder ? model.stats.delta_24h.likes : 0}
          Icon={ThumbsUpIcon}
          isPlaceholder={isPlaceholder}
          showDelta={true}
        />
      </div>
      <div className="w-full flex justify-start pb-px pt-[0.09375rem] relative">
        <CreatedAtParagraph {...props} />
      </div>
    </div>
  );
}

function getModelUrl(id: number) {
  return `https://makerworld.com/en/models/${id}`;
}

const placeholderTimestamp = Date.now();

function CreatedAtParagraph({ model, isPlaceholder }: TProps) {
  const now = useNow();
  return (
    <p
      suppressHydrationWarning
      className="shrink min-w-0 font-light overflow-hidden overflow-ellipsis text-xs px-1 text-muted-foreground group-data-placeholder:rounded group-data-placeholder:animate-pulse group-data-placeholder:bg-muted-more-foreground group-data-placeholder:text-transparent"
    >
      {timeAgo({
        timestamp: !isPlaceholder
          ? model.model_created_at
          : placeholderTimestamp,
        now,
        dontPad: true,
        fullUnitText: true,
      })}{" "}
      ago
    </p>
  );
}
