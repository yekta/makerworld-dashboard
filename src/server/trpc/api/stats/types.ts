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
  model_created_at: z.number(),
  stats: z.object({
    current: TModelStatSchema,
    "delta_0-0.25h": TModelStatSchema,
    "delta_0-1h": TModelStatSchema,
    "delta_0-4h": TModelStatSchema,
    "delta_0-8h": TModelStatSchema,
    "delta_0-12h": TModelStatSchema,
    "delta_0-24h": TModelStatSchema,
    "delta_24-25h": TModelStatSchema,
    "delta_24-28h": TModelStatSchema,
    "delta_24-32h": TModelStatSchema,
    "delta_24-36h": TModelStatSchema,
    "delta_24-48h": TModelStatSchema,
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
    "delta_0-0.25h": TUserStatSchema,
    "delta_0-1h": TUserStatSchema,
    "delta_0-4h": TUserStatSchema,
    "delta_0-8h": TUserStatSchema,
    "delta_0-12h": TUserStatSchema,
    "delta_0-24h": TUserStatSchema,
    "delta_24-25h": TUserStatSchema,
    "delta_24-28h": TUserStatSchema,
    "delta_24-32h": TUserStatSchema,
    "delta_24-36h": TUserStatSchema,
    "delta_24-48h": TUserStatSchema,
  }),
});

export const TStatResponseSchema = z.object({
  user: TUserSchema,
  models: z.array(TModelSchema),
  latest_batch: z.number(),
  metadata: z.object({
    delta_0h_timestamp: z.number(),
    "delta_0-0.25h_timestamp": z.number(),
    "delta_0-1h_timestamp": z.number(),
    "delta_0-4h_timestamp": z.number(),
    "delta_0-8h_timestamp": z.number(),
    "delta_0-12h_timestamp": z.number(),
    "delta_0-24h_timestamp": z.number(),
    "delta_24-25h_timestamp": z.number(),
    "delta_24-28h_timestamp": z.number(),
    "delta_24-32h_timestamp": z.number(),
    "delta_24-36h_timestamp": z.number(),
    "delta_24-48h_timestamp": z.number(),
  }),
});

// Inferred types (optional)
export type TStatResponse = z.infer<typeof TStatResponseSchema>;
export type TUser = z.infer<typeof TUserSchema>;
export type TUserStat = z.infer<typeof TUserStatSchema>;
export type TModel = z.infer<typeof TModelSchema>;
export type TModelStat = z.infer<typeof TModelStatSchema>;
