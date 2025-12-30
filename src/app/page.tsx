import MetadataSection from "@/components/home/metadata-section";
import ModelsSection from "@/components/home/models-section";
import UserSummarySection from "@/components/home/user-summary-section";
import RefetchIndicator from "@/components/home/refetch-indicator";
import UserStatsSection from "@/components/home/user-stats-section";
import StatsProvider from "@/components/providers/stats-provider";
import { apiServer } from "@/server/trpc/setup/server";
import { ResultAsync } from "neverthrow";
import FiltersSection from "@/components/home/filters-section/filters-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await ResultAsync.fromPromise(
    apiServer.stats.get({}),
    () => new Error("Failed to fetch stats")
  );

  return (
    <StatsProvider
      initialData={initialData.isOk() ? initialData.value : undefined}
    >
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
  );
}
