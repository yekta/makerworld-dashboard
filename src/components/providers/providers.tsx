import NowProvider from "@/components/providers/now-provider";
import { TRPCReactProvider } from "@/server/trpc/setup/client";
import React from "react";

export default async function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <NowProvider>{children}</NowProvider>
    </TRPCReactProvider>
  );
}
