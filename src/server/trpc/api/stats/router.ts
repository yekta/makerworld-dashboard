import { env } from "@/lib/env";
import { usernames } from "@/server/trpc/api/stats/constants";
import { TStatResponseSchema } from "@/server/trpc/api/stats/types";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/setup/trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";

const TWeekDayEnum = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
const DEFAULT_DAY_START = "22:25";
const DEFAULT_WEEK_START: z.infer<typeof TWeekDayEnum> = "sunday";
const DEFAULT_MONTH_START = 1;

export const statsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        username: z.string().default(usernames[0]),
        dayStart: z.string().default(DEFAULT_DAY_START).nullable(),
        weekStart: TWeekDayEnum.default(DEFAULT_WEEK_START).nullable(),
        monthStart: z.number().default(DEFAULT_MONTH_START).nullable(),
        timeMachineTimestamp: z.number().nullable(),
      }),
    )
    .query(
      async ({
        input: {
          username,
          dayStart,
          weekStart,
          monthStart,
          timeMachineTimestamp,
        },
      }) => {
        const url = new URL(env.API_URL + "/v1/my-stats/" + username);
        if (dayStart !== null) {
          url.searchParams.append("day_start", dayStart);
        }
        if (weekStart !== null) {
          url.searchParams.append("week_start", weekStart);
        }
        if (monthStart !== null) {
          url.searchParams.append("month_start", monthStart.toString());
        }
        if (
          timeMachineTimestamp !== undefined &&
          timeMachineTimestamp !== null
        ) {
          url.searchParams.append(
            "time_machine_timestamp",
            timeMachineTimestamp.toString(),
          );
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
      },
    ),
});
