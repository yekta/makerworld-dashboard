import { env } from "@/lib/env";
import { TStatResponseSchema } from "@/server/trpc/api/stats/types";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/setup/trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

export const statsRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({})).query(async ({}) => {
    const res = await fetch(env.API_URL + "/v1/stats");
    const data = await res.json();
    const result = TStatResponseSchema.safeParse(data);
    if (!result.success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Failed to type check stats response",
      });
    }
    return result.data;
  }),
});
