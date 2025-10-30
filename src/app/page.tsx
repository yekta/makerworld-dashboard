import ModelCard from "@/components/model-card";
import { appLocale } from "@/lib/constants";
import { env } from "@/lib/env";
import { TStatResponse } from "@/lib/types";
import {
  BoxIcon,
  ContactIcon,
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
    <div className="w-full flex justify-center items-start px-2 py-4 md:px-8 md:py-8">
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
          <Stat
            value={user.stats.current.following}
            delta1h={user.stats.delta_1h.following}
            delta24h={user.stats.delta_24h.following}
            Icon={ContactIcon}
          />
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
    <div className="flex flex-col px-2 md:px-3">
      <div className="flex items-center gap-1 font-semibold">
        <Icon className="size-3.5" />
        <span className="">{value.toLocaleString(appLocale)}</span>
      </div>
      <div className="w-full flex flex-col text-sm">
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
