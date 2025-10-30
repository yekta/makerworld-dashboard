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

export default async function Home() {
  const res = await fetch(env.API_URL + "/v1/stats");
  const { models, user }: TStatResponse = await res.json();
  return (
    <div className="w-full flex justify-center items-start px-2 py-4 md:px-8 md:py-8">
      <div className="w-full max-w-6xl flex flex-col">
        <div className="w-full flex-wrap flex items-center justify-center gap-3 px-2 md:gap-4 md:px-4">
          <Stat value={user.prints} Icon={BoxIcon} />
          <Stat value={user.downloads} Icon={DownloadIcon} />
          <Stat value={user.boosts} Icon={RocketIcon} />
          <Stat value={user.likes} Icon={ThumbsUp} />
          <Stat value={user.followers} Icon={UsersIcon} />
          <Stat value={user.following} Icon={ContactIcon} />
        </div>
        <div className="w-full flex flex-wrap mt-4">
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
  Icon,
}: {
  value: number;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 font-semibold">
        {Icon && <Icon className="size-4" />}
        <span className="">{value.toLocaleString(appLocale)}</span>
      </div>
    </div>
  );
}
