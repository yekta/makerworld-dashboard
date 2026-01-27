import { z } from "zod";

export const TLeaderboardEntrySchema = z.object({
  user_id: z.number(),
  username: z.string(),
  display_name: z.string(),
  avatar_url: z.string(),
  prints: z.number(),
  prints_last_24h: z.number(),
  downloads: z.number(),
  downloads_api: z.number(),
  boosts: z.number(),
  followers: z.number(),
  following: z.number(),
  likes: z.number(),
  level: z.number(),
  user_row_created_at: z.number(),
  snapshotted_at: z.number(),
  model_count: z.number(),
  first_model_created_at: z.number(),
});

export const TLeaderboardOrderByEnum = z.enum([
  "prints",
  "downloads",
  "downloads_api",
  "boosts",
  "followers",
  "following",
  "likes",
  "level",
]);

export const TLeaderboardResultSchema = z.object({
  data: z.array(TLeaderboardEntrySchema),
});

export type TLeaderboardEntry = z.infer<typeof TLeaderboardEntrySchema>;
