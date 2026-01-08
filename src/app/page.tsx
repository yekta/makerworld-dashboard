import FiltersSection from "@/components/home/filters-section/filters-section";
import MetadataSection from "@/components/home/metadata-section";
import ModelsSection from "@/components/home/models-section";
import RefetchIndicator from "@/components/home/refetch-indicator";
import UserStatsSection from "@/components/home/user-stats-section";
import UserSummarySection from "@/components/home/user-summary-section";
import StatsProvider from "@/components/providers/stats-provider";
import TimeMachineProvider from "@/components/providers/time-machine-provider";
import { cachedHomePageSearchParams } from "@/lib/constants";
import { apiServer, HydrateClient } from "@/server/trpc/setup/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: Props) {
  console.log(await searchParams);
  const { head_cutoff_timestamp } = await cachedHomePageSearchParams.parse(
    searchParams
  );
  console.log("Home head_cutoff_timestamp:", head_cutoff_timestamp);
  await apiServer.stats.get.prefetch({
    headCutoffTimestamp: head_cutoff_timestamp,
  });

  return (
    <HydrateClient>
      <TimeMachineProvider>
        <StatsProvider>
          <div className="w-full flex justify-center items-start px-1 py-4 md:px-5 md:py-5">
            <RefetchIndicator />
            <div className="w-full max-w-6xl flex flex-col">
              <UserStatsSection />
              <UserSummarySection />
              <FiltersSection />
              <ModelsSection />
              <MetadataSection />
            </div>
          </div>
        </StatsProvider>
      </TimeMachineProvider>
    </HydrateClient>
  );
}
