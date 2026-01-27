import AsyncPushProvider from "@/components/providers/async-push-provider";
import NowProvider from "@/components/providers/now-provider";
import { TRPCReactProvider } from "@/server/trpc/setup/client";
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
