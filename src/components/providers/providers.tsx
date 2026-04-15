import AsyncPushProvider from "@/src/components/providers/async-push-provider";
import NowProvider from "@/src/components/providers/now-provider";
import { TRPCReactProvider } from "@/src/server/trpc/setup/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NowProvider>
        <NuqsAdapter>
          <AsyncPushProvider>{children}</AsyncPushProvider>
        </NuqsAdapter>
      </NowProvider>
    </TRPCReactProvider>
  );
}
