import { z } from "zod";

export const TModelStatSchema = z.object({
  prints: z.number(),
  downloads: z.number(),
  boosts: z.number(),
  likes: z.number(),
  comments: z.number(),
});

export const TModelSchema = z.object({
  model_id: z.number(),
  title: z.string(),
  image: z.string(),
  stats: z.object({
    current: TModelStatSchema,
    delta_1h: TModelStatSchema,
    delta_24h: TModelStatSchema,
  }),
});

export const TUserStatSchema = z.object({
  prints: z.number(),
  downloads: z.number(),
  boosts: z.number(),
  followers: z.number(),
  following: z.number(),
  likes: z.number(),
  level: z.number(),
});

export const TUserSchema = z.object({
  stats: z.object({
    current: TUserStatSchema,
    delta_1h: TUserStatSchema,
    delta_24h: TUserStatSchema,
  }),
});

export const TStatResponseSchema = z.object({
  user: TUserSchema,
  models: z.array(TModelSchema),
  latest_batch: z.number(),
  metadata: z.object({
    delta_1h_timestamp: z.number(),
    delta_24h_timestamp: z.number(),
  }),
});

// Inferred types (optional)
export type TStatResponse = z.infer<typeof TStatResponseSchema>;
export type TUser = z.infer<typeof TUserSchema>;
export type TUserStat = z.infer<typeof TUserStatSchema>;
export type TModel = z.infer<typeof TModelSchema>;
export type TModelStat = z.infer<typeof TModelStatSchema>;
