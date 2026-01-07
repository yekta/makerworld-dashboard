import NowProvider from "@/components/providers/now-provider";
import { TRPCReactProvider } from "@/server/trpc/setup/client";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import TimeMachineProvider from "@/components/providers/time-machine-provider";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NowProvider>
        <NuqsAdapter>
          <TimeMachineProvider>{children}</TimeMachineProvider>
        </NuqsAdapter>
      </NowProvider>
    </TRPCReactProvider>
  );
}
