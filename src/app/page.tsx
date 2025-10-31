import ModelCard from "@/components/model-card";
import { appLocale } from "@/lib/constants";
import { env } from "@/lib/env";
import { TStatResponse } from "@/lib/types";
import {
  BoxIcon,
  DownloadIcon,
  RocketIcon,
  ThumbsUp,
  UsersIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetch(env.API_URL + "/v1/stats");
  const { models, user }: TStatResponse = await res.json();
  return (
    <div className="w-full flex justify-center items-start px-2 pt-4 pb-12 md:px-5 md:pt-5 md:pb-10 lg:px-6 lg:pt-6 lg:pb-12">
      <div className="w-full max-w-6xl flex flex-col">
        <div className="w-full flex-wrap flex items-center justify-center gap-2 px-2 md:px-4">
          <Stat
            value={user.stats.current.prints}
            delta1h={user.stats.delta_1h.prints}
            delta24h={user.stats.delta_24h.prints}
            Icon={BoxIcon}
          />
          <Stat
            value={user.stats.current.downloads}
            delta1h={user.stats.delta_1h.downloads}
            delta24h={user.stats.delta_24h.downloads}
            Icon={DownloadIcon}
          />
          <Stat
            value={user.stats.current.boosts}
            delta1h={user.stats.delta_1h.boosts}
            delta24h={user.stats.delta_24h.boosts}
            Icon={RocketIcon}
          />
          <Stat
            value={user.stats.current.likes}
            delta1h={user.stats.delta_1h.likes}
            delta24h={user.stats.delta_24h.likes}
            Icon={ThumbsUp}
          />
          <Stat
            value={user.stats.current.followers}
            delta1h={user.stats.delta_1h.followers}
            delta24h={user.stats.delta_24h.followers}
            Icon={UsersIcon}
          />
          {/* <Stat
            value={user.stats.current.following}
            delta1h={user.stats.delta_1h.following}
            delta24h={user.stats.delta_24h.following}
            Icon={ContactIcon}
          /> */}
        </div>
        <div className="w-full flex flex-wrap mt-4 md:mt-6">
          {models.map((model) => (
            <ModelCard key={model.modelId} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  delta1h,
  delta24h,
  Icon,
}: {
  value: number;
  delta1h: number;
  delta24h: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex shrink min-w-0 overflow-hidden flex-col px-2 md:px-3">
      <div className="flex items-center gap-1 font-semibold overflow-hidden overflow-ellipsis">
        <Icon className="size-3.5 shrink-0" />
        <p className="shrink min-w-0 overflow-hidden overflow-ellipsis">
          {value.toLocaleString(appLocale)}
        </p>
      </div>
      <div className="shrink min-w-0 overflow-hidden flex flex-col text-sm mt-0.5">
        <div
          data-positive={delta1h > 0 ? true : undefined}
          className="shrink min-w-0 overflow-hidden flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          {/* <div className="size-3.5 shrink-0" /> */}
          <p className="shrink min-w-0 leading-tight overflow-hidden overflow-ellipsis">
            +{delta1h.toLocaleString(appLocale)}
          </p>
        </div>
        <div
          data-positive={delta24h > 0 ? true : undefined}
          className="shrink min-w-0 overflow-hidden flex items-center gap-1 text-muted-foreground data-positive:text-success"
        >
          {/* <div className="size-3.5 shrink-0" /> */}
          <p className="shrink min-w-0 leading-tight overflow-hidden overflow-ellipsis">
            +{delta24h.toLocaleString(appLocale)}
          </p>
        </div>
      </div>
    </div>
  );
}
