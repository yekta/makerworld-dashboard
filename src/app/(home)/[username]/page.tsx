import { cachedHomePageSearchParams } from "@/src/app/(home)/_components/constants";
import FiltersSection from "@/src/app/(home)/_components/filters-section/filters-section";
import HomeRefetchIndicator from "@/src/app/(home)/_components/home-refetch-indicator";
import MetadataSection from "@/src/app/(home)/_components/metadata-section";
import ModelsSection from "@/src/app/(home)/_components/models-section";
import UserStatsSection from "@/src/app/(home)/_components/user-stats-section";
import UserSummarySection from "@/src/app/(home)/_components/user-summary-section";
import StatsProvider from "@/src/components/providers/stats-provider";
import TimeMachineProvider from "@/src/components/providers/time-machine-provider";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      username: string;
    }
  >;
};

export default async function Home({ params, searchParams }: Props) {
  const { username } = await params;
  await cachedHomePageSearchParams.parse(searchParams);

  return (
    <TimeMachineProvider>
      <StatsProvider username={username}>
        <div className="w-full flex justify-center items-start px-1 py-4 md:px-5 md:py-5">
          <HomeRefetchIndicator />
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
