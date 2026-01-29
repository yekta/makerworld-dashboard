import FiltersSection from "@/app/(home)/_components/filters-section/filters-section";
import MetadataSection from "@/app/(home)/_components/metadata-section";
import ModelsSection from "@/app/(home)/_components/models-section";
import RefetchIndicator from "@/app/(home)/_components/refetch-indicator";
import UserStatsSection from "@/app/(home)/_components/user-stats-section";
import UserSummarySection from "@/app/(home)/_components/user-summary-section";
import StatsProvider from "@/components/providers/stats-provider";
import TimeMachineProvider from "@/components/providers/time-machine-provider";

export default function Home() {
  return (
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
  );
}
