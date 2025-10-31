import MetadataSection from "@/components/home/metadata-section";
import ModelsSection from "@/components/home/models-section";
import RefetchIndicator from "@/components/home/refetch-indicator";
import UserStatsSection from "@/components/home/user-stats-section";
import StatsProvider from "@/components/providers/stats-provider";
import { apiServer } from "@/server/trpc/setup/server";
import { ResultAsync } from "neverthrow";

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
      <div className="w-full flex justify-center items-start px-2 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
        <RefetchIndicator />
        <div className="w-full max-w-6xl flex flex-col">
          <UserStatsSection />
          <ModelsSection />
          <MetadataSection />
        </div>
      </div>
    </StatsProvider>
  );
}
