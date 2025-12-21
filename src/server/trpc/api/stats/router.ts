import { env } from "@/lib/env";
import { TStatResponseSchema } from "@/server/trpc/api/stats/types";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/setup/trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

export const statsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ dayStart: z.string().default("01:30").nullable() }))
    .query(async ({ input: { dayStart } }) => {
      const url = new URL(env.API_URL + "/v1/stats");
      if (dayStart !== null) {
        url.searchParams.append("day_start", dayStart);
      }
      const res = await fetch(url.toString());
      const data = await res.json();
      const result = TStatResponseSchema.safeParse(data);
      if (!result.success) {
        console.log("Stats response validation error:", result.error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to type check stats response",
        });
      }
      return result.data;
    }),
});
