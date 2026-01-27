import { env } from "@/lib/env";
import {
  TLeaderboardOrderByEnum,
  TLeaderboardResultSchema,
} from "@/server/trpc/api/leaderboard/types";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/setup/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const leaderboardRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        orderBy: TLeaderboardOrderByEnum,
        limit: z.number().min(1).max(500).default(500),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input: { orderBy, limit, offset } }) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const url = new URL(env.API_URL + "/v1/leaderboard");
      url.searchParams.append("order_by", orderBy);
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());

      const res = await fetch(url.toString());
      const data = await res.json();

      const result = TLeaderboardResultSchema.safeParse(data);
      if (!result.success) {
        console.log("Leaderboard response validation error:", result.error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to type check leaderboard response",
        });
      }

      return result.data;
    }),
});
