import NowProvider from "@/components/providers/now-provider";
import { TRPCReactProvider } from "@/server/trpc/setup/client";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NowProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </NowProvider>
    </TRPCReactProvider>
  );
}
